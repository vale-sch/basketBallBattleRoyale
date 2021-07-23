namespace basketBallBattleRoyale {
    import fCore = FudgeCore;
    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);
    //Event Systems------------------------------------------------------------
    let rIsPressed: boolean;
    let rIsReleased: boolean;
    function handler_Key_Pressed(_event: KeyboardEvent): void {
        if (_event.code == FudgeCore.KEYBOARD_CODE.SPACE) {
            rIsPressed = true;
            rIsReleased = false;
        }
    }

    function handler_Key_Released(_event: KeyboardEvent): void {
        if (_event.code == FudgeCore.KEYBOARD_CODE.SPACE) {
            rIsReleased = true;
            rIsPressed = false;
        }

    }

    let isPointerInGame: boolean;
    function onPointerDown(_event: MouseEvent): void {
        if (!isInMenu)
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

    export class AvatarController {
        private forwardMovement: number = 0;
        private backwardMovement: number = 0;
        private movementspeed: number = 5;
        private frictionFactor: number = 8;
        private throwStrength: number = 450;
        private nearestDistance: number = 6;
        private timer: number;
        private power: number = 0;

        private actualChosenBall: fCore.Node;
        private childAvatarNode: fCore.Node;
        private players: fCore.Node[];
        private cmpAvatar: fCore.ComponentRigidbody;
        private oldRayHit: fCore.RayHitInfo;
        private isGrabbed: boolean;

        private hasShot: boolean;
        private progressBar: HTMLDivElement = document.querySelector("#shootBar");

        constructor(_players: fCore.Node[]) {
            this.players = _players;
            document.addEventListener("mousedown", onPointerDown);
            document.addEventListener("pointerlockchange", pointerLockChange);
            document.addEventListener("keypress", handler_Key_Pressed);
            document.addEventListener("keyup", handler_Key_Released);
            window.addEventListener("mousemove", onMouseMove);
            this.start();
        }

        public async start(): Promise<void> {
            this.createAvatar();
            console.log("avatar is initialized!");

            if (localStorage.getItem("harderVersion"))
                this.movementspeed = this.movementspeed - 1;
            fCore.Loop.addEventListener(fCore.EVENT.LOOP_FRAME, this.update);
            fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
        }

        private update = (): void => {
            if (this.hasShot && this.actualChosenBall) {
                this.timer -= fCore.Loop.timeFrameReal / 1000;
                if (this.timer <= 0) {
                    this.hasShot = false;
                    if (this.actualChosenBall) {
                        this.actualChosenBall.getComponent(BasketBallsController).isInPlayersUse = false;
                        this.actualChosenBall = null;
                    }

                }
            }
            this.avatarMovement(fCore.Loop.timeFrameReal / 1000);
            this.handleInputAvatar(fCore.Loop.timeFrameReal / 1000);
            if (!this.actualChosenBall)
                this.isGrabbingBasket(fCore.Loop.timeFrameReal / 100);
            //sub functionality of isGrabbingObjects();

            if (this.isGrabbed && this.actualChosenBall) {
                this.highlightTargetedBasket();
                if (!this.actualChosenBall.getComponent(fCore.ComponentRigidbody)) {
                    this.actualChosenBall = null;
                    return;
                }
                this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setVelocity(fCore.Vector3.ZERO());
                this.actualChosenBall.mtxWorld.translate(this.childAvatarNode.mtxWorld.translation);
                this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setPosition(this.childAvatarNode.mtxWorld.translation);
                // which target was chosen from raycast-info
                if (rIsPressed)
                    if (gameState.shootBar <= 12)
                        if (!localStorage.getItem("harderVersion"))
                            gameState.shootBar += fCore.Loop.timeFrameReal / 100;
                        else
                            gameState.shootBar += fCore.Loop.timeFrameReal / 75;

                if (rIsReleased) {
                    this.power = gameState.shootBar * 40;
                    gameState.shootBar = 0;
                    if (!this.actualChosenBall) return;
                    this.shootCalculation();
                    this.progressBar.hidden = true;
                }
            }
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
        private isGrabbingBasket(_deltaTime: number): void {
            if (basketBalls != undefined) {
                if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.E])) {
                    basketBalls.forEach(basketBall => {
                        if (this.nearestDistance > fCore.Vector3.DIFFERENCE(basketBall.mtxWorld.translation, avatarNode.mtxWorld.translation).magnitude)
                            this.actualChosenBall = basketBall;
                    });

                    if (!this.actualChosenBall) return;
                    this.progressBar.hidden = false;
                    this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setVelocity(fCore.Vector3.ZERO());
                    this.actualChosenBall.getComponent(BasketBallsController).isInEnemysUse = false;
                    this.actualChosenBall.getComponent(BasketBallsController).isInPlayersUse = true;
                    this.isGrabbed = true;
                    rIsReleased = false;
                    rIsPressed = false;

                }
            }
        }

        //which target functionality for avatar
        private highlightTargetedBasket(): void {
            let mtxAvatar: ƒ.Matrix4x4 = this.cmpAvatar.getContainer().mtxWorld;
            let rayHit: ƒ.RayHitInfo = ƒ.Physics.raycast(ƒ.Vector3.DIFFERENCE(this.cmpAvatar.getPosition(), ƒ.Vector3.Y(-5.7)), mtxAvatar.getZ(), 80);
            if (rayHit.rigidbodyComponent)
                if (rayHit.rigidbodyComponent.physicsType != fCore.PHYSICS_TYPE.DYNAMIC) {
                    if (rayHit.rigidbodyComponent.getContainer().name != "Brett") return;

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
                }

        }

        private shootCalculation(): void {
            let targetOfMesh: fCore.Node;
            if (this.oldRayHit)
                if (this.oldRayHit.rigidbodyComponent.getContainer())
                    if (this.oldRayHit.rigidbodyComponent.getContainer().getParent())
                        targetOfMesh = this.oldRayHit.rigidbodyComponent.getContainer().getParent();
            if (targetOfMesh.getComponent(fCore.ComponentMaterial)) {
                targetOfMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 0.5;
                targetOfMesh.getChildren().forEach(childMesh => {
                    childMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 0.5;
                });
            }

            let playerForward: fCore.Vector3;
            playerForward = fCore.Vector3.Z();
            playerForward.transform(avatarNode.mtxWorld, false);

            //diffrent powers for diffrent distances

            this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
                new fCore.Vector3(playerForward.x * this.throwStrength, this.power, playerForward.z * this.throwStrength),
                avatarNode.mtxWorld.translation);

            cmpAudShot.play(true);
            this.isGrabbed = false;
            this.hasShot = true;
            this.timer = 2;
        }
    }
}
