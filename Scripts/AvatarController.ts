namespace basketBallBattleRoyale {
    import fCore = FudgeCore;

    //Event Systems------------------------------------------------------------
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("pointerlockchange", pointerLockChange);
    document.addEventListener("keypress", handler_Key_Pressed);
    document.addEventListener("keyup", handler_Key_Released);
    window.addEventListener("mousemove", onMouseMove);
    let rIsPressed: boolean;
    let rIsReleased: boolean;
    function handler_Key_Pressed(_event: KeyboardEvent): void {
        if (_event.code == FudgeCore.KEYBOARD_CODE.R) {
            rIsPressed = true;
            rIsReleased = false;
        }
    }

    function handler_Key_Released(_event: KeyboardEvent): void {
        if (_event.code == FudgeCore.KEYBOARD_CODE.R) {
            rIsPressed = false;
            rIsReleased = true;
        }

    }
    let isPointerInGame: boolean;
    function onPointerDown(_event: MouseEvent): void {
        if (!isPointerInGame)
            canvas.requestPointerLock();
    }

    function pointerLockChange(_event: Event): void {
        if (!document.pointerLockElement)
            isPointerInGame = false;
        else
            isPointerInGame = true;
    }

    function onMouseMove(_event: MouseEvent): void {
        if (isPointerInGame) {

            let rotFriction: number = 10;
            avatarNode.mtxLocal.rotateY(-_event.movementX / rotFriction);
            avatarNode.getComponent(fCore.ComponentRigidbody).rotateBody(fCore.Vector3.Y(-_event.movementX / rotFriction));


            if (checkIfMouseMoveIsStillValid(_event.movementY))
                cmpCamera.mtxPivot.rotateX(_event.movementY / rotFriction);
        }
    }
    function checkIfMouseMoveIsStillValid(_movementY: number): boolean {
        let topRotLock: number = -10;
        let botRotLock: number = 15;
        if (_movementY < 0) {
            if (cmpCamera.mtxPivot.rotation.x <= topRotLock)
                return false;
            else return true;
        }
        else {
            if (cmpCamera.mtxPivot.rotation.x >= botRotLock)
                return false;
            else
                return true;
        }
    }
    //Event Systems------------------------------------------------------------
    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);

    export class AvatarController {
        private forwardMovement: number = 0;
        private backwardMovement: number = 0;
        private movementspeed: number = 5;
        private frictionFactor: number = 8;
        private throwStrength: number = 510;
        private nearestDistance: number;
        private actualTarget: fCore.ComponentMesh;
        private actualChosenBall: fCore.Node;
        private cmpAvatar: fCore.ComponentRigidbody;
        private childAvatarNode: fCore.Node;
        private playersContainer: fCore.Node;
        private players: fCore.Node[];
        private collMeshesOfBasketTrigger: fCore.ComponentMesh[];
        private oldRayHit: ƒ.RayHitInfo;
        private targetPlayersName: string;
        private isGrabbed: boolean;
        private timer: number;
        private hasShot: boolean;
        private power: number = 0;
        constructor(_playersContainer: fCore.Node, _collMeshesOfBasketTrigger: fCore.ComponentMesh[], _players: fCore.Node[]) {
            this.playersContainer = _playersContainer;
            this.collMeshesOfBasketTrigger = _collMeshesOfBasketTrigger;
            this.players = _players;

        }

        public start(): void {
            this.createAvatar();
            console.log("Avatar is initialized!");
            fCore.Loop.addEventListener(fCore.EVENT.LOOP_FRAME, this.update);
            fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
        }

        private createAvatar(): void {
            this.cmpAvatar = new fCore.ComponentRigidbody(
                75,
                fCore.PHYSICS_TYPE.DYNAMIC,
                fCore.COLLIDER_TYPE.CYLINDER,
                fCore.PHYSICS_GROUP.DEFAULT
            );
            this.cmpAvatar.restitution = 0.1;
            this.cmpAvatar.rotationInfluenceFactor = fCore.Vector3.ZERO();
            this.cmpAvatar.friction = 100;

            avatarNode = new fCore.Node("AvatarNode");
            avatarNode.addComponent(
                new fCore.ComponentTransform(
                    fCore.Matrix4x4.TRANSLATION(fCore.Vector3.Y(1))
                )
            );
            this.childAvatarNode = new fCore.Node("childAvatarNode");
            this.childAvatarNode.addComponent(new fCore.ComponentTransform());
            this.childAvatarNode.mtxLocal.translate(new fCore.Vector3(0, 1, 4.75));

            avatarNode.appendChild(this.childAvatarNode);
            avatarNode.addComponent(cmpCamera);
            avatarNode.addComponent(this.cmpAvatar);


            this.players[0].appendChild(avatarNode);
        }

        private update = (): void => {
            if (this.hasShot) {
                this.timer -= fCore.Loop.timeFrameReal / 1000;
                if (this.timer <= 0) {
                    this.hasShot = false;
                    if (this.actualChosenBall) {
                        this.actualChosenBall.getComponent(BasketBallsController).isInPlayersUse = false;
                        this.actualChosenBall = undefined;
                    }

                }
            }
            this.avatarMovement(fCore.Loop.timeFrameReal / 1000);
            this.handleInputAvatar(fCore.Loop.timeFrameReal / 1000);
            this.isGrabbingBasket();
            //sub functionality of isGrabbingObjects();
            if (this.actualChosenBall)
                if (this.isGrabbed && this.actualChosenBall) {
                    this.targetPlayersName = this.whichTargetToChooseAvatar();
                    this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setVelocity(fCore.Vector3.ZERO());
                    this.actualChosenBall.mtxWorld.translate(this.childAvatarNode.mtxWorld.translation);
                    this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setPosition(this.childAvatarNode.mtxWorld.translation);
                }
        }

        private handleInputAvatar(_deltaTime: number): void {
            if (
                fCore.Keyboard.isPressedOne([
                    fCore.KEYBOARD_CODE.W,
                    fCore.KEYBOARD_CODE.ARROW_UP
                ])
            )
                this.forwardMovement = this.movementspeed;
            else if (this.forwardMovement >= 0) this.forwardMovement -= _deltaTime * this.frictionFactor;

            if (
                fCore.Keyboard.isPressedOne([
                    fCore.KEYBOARD_CODE.S,
                    fCore.KEYBOARD_CODE.ARROW_DOWN
                ])
            )
                this.backwardMovement = - this.movementspeed;
            else if (this.backwardMovement <= 0) this.backwardMovement += _deltaTime * this.frictionFactor;
        }

        private avatarMovement(_deltaTime: number): void {
            let playerForward: fCore.Vector3;
            playerForward = fCore.Vector3.Z();
            playerForward.transform(avatarNode.mtxWorld, false);

            let movementVelocity: fCore.Vector3 = new fCore.Vector3();
            movementVelocity.x =
                playerForward.x * (this.forwardMovement + this.backwardMovement) * this.movementspeed;
            movementVelocity.y = this.cmpAvatar.getVelocity().y;
            movementVelocity.z =
                playerForward.z * (this.forwardMovement + this.backwardMovement) * this.movementspeed;
            this.cmpAvatar.setVelocity(movementVelocity);
        }

        //avatars functionality for grabbing basketballs
        private isGrabbingBasket(): void {
            let throwThreshold: number = 6;
            let throwMinDistance: number = 6;

            if (basketBalls != undefined) {
                if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.E])) {
                    basketBalls.forEach(basketBall => {
                        if (this.nearestDistance == undefined || this.nearestDistance > fCore.Vector3.DIFFERENCE(basketBall.mtxWorld.translation, avatarNode.mtxWorld.translation).magnitude) {
                            this.nearestDistance = fCore.Vector3.DIFFERENCE(basketBall.mtxWorld.translation, avatarNode.mtxWorld.translation).magnitude;
                            this.actualChosenBall = basketBall;
                        }
                    });
                    if (!this.actualChosenBall) return;
                    if (this.nearestDistance > throwThreshold)
                        return;
                    this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setVelocity(fCore.Vector3.ZERO());
                    this.actualChosenBall.getComponent(BasketBallsController).isInPlayersUse = true;
                    this.isGrabbed = true;

                }
                // which target was chosen from raycast-info
                if (rIsPressed && this.isGrabbed == true) {
                    if (gameState.shootBar <= 450)
                        gameState.shootBar += 6;

                }
                if (rIsReleased && this.isGrabbed == true) {
                    this.power = gameState.shootBar;
                    gameState.shootBar = 0;
                    this.playersContainer.getChildren().forEach(player => {
                        if (player.getChild(0))
                            if (player.getChild(0).name == this.targetPlayersName)
                                this.collMeshesOfBasketTrigger.forEach(trigger => {
                                    if (player.getChild(0).getChild(1) == trigger.getContainer())
                                        this.actualTarget = trigger;
                                }); else return;
                    });
                    //check distance to basket
                    if (!this.actualTarget) return;
                    let distance: fCore.Vector3 = fCore.Vector3.DIFFERENCE(this.actualChosenBall.mtxWorld.translation, this.actualTarget.mtxWorld.translation);
                    let distanceMag: number = distance.magnitude;
                    if (distanceMag < throwMinDistance) return;
                    rIsPressed = false;
                    rIsReleased = false;
                    this.shootCalculation(distanceMag);
                }
            }
        }

        //which target functionality for avatar
        private whichTargetToChooseAvatar(): string {
            let mtxAvatar: ƒ.Matrix4x4 = this.cmpAvatar.getContainer().mtxWorld;
            let rayHit: ƒ.RayHitInfo = ƒ.Physics.raycast(ƒ.Vector3.DIFFERENCE(this.cmpAvatar.getPosition(), ƒ.Vector3.Y(-5.7)), mtxAvatar.getZ(), 80);
            if (rayHit.rigidbodyComponent)
                if (rayHit.rigidbodyComponent.physicsType != fCore.PHYSICS_TYPE.DYNAMIC) {
                    if (rayHit.rigidbodyComponent.getContainer().name != "Brett") return "Wrong Target";

                    let meshContainer: fCore.Node = rayHit.rigidbodyComponent.getContainer().getParent();
                    meshContainer.getComponent(fCore.ComponentMaterial).clrPrimary.a = 1.5;
                    meshContainer.getChildren().forEach(childMesh => {
                        childMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 1.5;
                    });
                    if (this.oldRayHit && this.oldRayHit.rigidbodyComponent.getContainer())
                        if (this.oldRayHit.rigidbodyComponent != rayHit.rigidbodyComponent) {
                            let oldMesh: fCore.Node = this.oldRayHit.rigidbodyComponent.getContainer().getParent();
                            oldMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 0.5;
                            oldMesh.getChildren().forEach(childMesh => {
                                childMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 0.5;
                            });
                        }
                    this.oldRayHit = rayHit;
                    if (rayHit.rigidbodyComponent.getContainer().getParent().getParent().getParent())
                        return rayHit.rigidbodyComponent.getContainer().getParent().getParent().getParent().name;
                    else return "No Target in focus";
                }
                else return "No Target in focus";
            else
                return "RayHit ist no Rigidbody";

        }

        private shootCalculation(_distanceMag: number): void {
            let targetOfMesh: fCore.Node = this.oldRayHit.rigidbodyComponent.getContainer().getParent();
            targetOfMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 0.5;
            targetOfMesh.getChildren().forEach(childMesh => {
                childMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 0.5;
            });
            let playerForward: fCore.Vector3;
            playerForward = fCore.Vector3.Z();
            playerForward.transform(avatarNode.mtxWorld, false);

            //diffrent powers for diffrent distances
            console.log(this.power);
            console.log(_distanceMag);
            this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
                new fCore.Vector3(playerForward.x * this.throwStrength, this.power, playerForward.z * this.throwStrength),
                avatarNode.mtxWorld.translation);
            // if (_distanceMag > 40)
            //     this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
            //         new fCore.Vector3(playerForward.x * this.throwStrength, _distanceMag * this.power / 2.5, playerForward.z * this.throwStrength),
            //         avatarNode.mtxWorld.translation);
            // else if (_distanceMag > 30 && _distanceMag < 40)
            //     this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
            //         new fCore.Vector3(playerForward.x * this.throwStrength * 0.825, _distanceMag * this.power / 2.25, playerForward.z * this.throwStrength * 0.825),
            //         avatarNode.mtxWorld.translation);
            // else if (_distanceMag > 20 && _distanceMag < 30)
            //     this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
            //         new fCore.Vector3(playerForward.x * this.throwStrength * 0.70, _distanceMag * this.power / 2, playerForward.z * this.throwStrength * 0.70),
            //         avatarNode.mtxWorld.translation);
            // else if (_distanceMag >= 12 && _distanceMag < 20)
            //     this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
            //         new fCore.Vector3(playerForward.x * this.throwStrength * 0.625, _distanceMag * this.power / 1.5, playerForward.z * this.throwStrength * 0.625),
            //         avatarNode.mtxWorld.translation);
            // switch (Math.floor(_distanceMag)) {
            //     case 11:
            //         this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
            //             new fCore.Vector3(playerForward.x * this.throwStrength * 0.575, _distanceMag * this.power * 2, playerForward.z * this.throwStrength * 0.575),
            //             avatarNode.mtxWorld.translation);
            //         break;
            //     case 10:
            //         this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
            //             new fCore.Vector3(playerForward.x * this.throwStrength * 0.55, _distanceMag * this.power * 3, playerForward.z * this.throwStrength * 0.55),
            //             avatarNode.mtxWorld.translation);
            //         break;
            //     case 9:
            //         this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
            //             new fCore.Vector3(playerForward.x * this.throwStrength * 0.50, _distanceMag * this.power * 4, playerForward.z * this.throwStrength * 0.50),
            //             avatarNode.mtxWorld.translation);
            //         break;
            //     case 8:
            //         this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
            //             new fCore.Vector3(playerForward.x * this.throwStrength * 0.475, _distanceMag * this.power * 5, playerForward.z * this.throwStrength * 0.475),
            //             avatarNode.mtxWorld.translation);
            //         break;
            //     case 7:
            //         this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
            //             new fCore.Vector3(playerForward.x * this.throwStrength * 0.425, _distanceMag * this.power * 8, playerForward.z * this.throwStrength * 0.425),
            //             avatarNode.mtxWorld.translation);
            //         break;
            //     case 6:
            //         this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
            //             new fCore.Vector3(playerForward.x * this.throwStrength * 0.4, _distanceMag * this.power * 10, playerForward.z * this.throwStrength * 0.4),
            //             avatarNode.mtxWorld.translation);
            //         break;
            // }
            this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setRotation(fCore.Vector3.ZERO());
            this.isGrabbed = false;
            this.nearestDistance = undefined;
            this.hasShot = true;
            this.timer = 2;
        }
    }
}
