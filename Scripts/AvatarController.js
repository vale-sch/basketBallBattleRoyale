"use strict";
var basketBallBattleRoyale;
(function (basketBallBattleRoyale) {
    var fCore = FudgeCore;
    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);
    //Event Systems------------------------------------------------------------
    let rIsPressed;
    let rIsReleased;
    function handler_Key_Pressed(_event) {
        if (_event.code == FudgeCore.KEYBOARD_CODE.SPACE) {
            rIsPressed = true;
            rIsReleased = false;
        }
    }
    function handler_Key_Released(_event) {
        if (_event.code == FudgeCore.KEYBOARD_CODE.SPACE) {
            rIsReleased = true;
            rIsPressed = false;
        }
    }
    let isPointerInGame;
    function onPointerDown(_event) {
        if (!basketBallBattleRoyale.isInMenu)
            if (!isPointerInGame)
                basketBallBattleRoyale.canvas.requestPointerLock();
    }
    function pointerLockChange(_event) {
        if (!document.pointerLockElement)
            isPointerInGame = false;
        else
            isPointerInGame = true;
    }
    function onMouseMove(_event) {
        if (isPointerInGame) {
            let rotFriction = 10;
            basketBallBattleRoyale.avatarNode.mtxLocal.rotateY(-_event.movementX / rotFriction);
            basketBallBattleRoyale.avatarNode.getComponent(fCore.ComponentRigidbody).rotateBody(fCore.Vector3.Y(-_event.movementX / rotFriction));
            if (checkIfMouseMoveIsStillValid(_event.movementY))
                basketBallBattleRoyale.cmpCamera.mtxPivot.rotateX(_event.movementY / rotFriction);
        }
    }
    function checkIfMouseMoveIsStillValid(_movementY) {
        let topRotLock = -10;
        let botRotLock = 15;
        if (_movementY < 0) {
            if (basketBallBattleRoyale.cmpCamera.mtxPivot.rotation.x <= topRotLock)
                return false;
            else
                return true;
        }
        else {
            if (basketBallBattleRoyale.cmpCamera.mtxPivot.rotation.x >= botRotLock)
                return false;
            else
                return true;
        }
    }
    //Event Systems------------------------------------------------------------
    class AvatarController {
        constructor(_players) {
            this.forwardMovement = 0;
            this.backwardMovement = 0;
            this.frictionFactor = 8;
            this.throwStrength = 450;
            this.nearestDistance = 6;
            this.power = 0;
            this.progressBar = document.querySelector("#shootBar");
            this.update = () => {
                if (this.hasShot && this.actualChosenBall) {
                    this.timer -= fCore.Loop.timeFrameReal / 1000;
                    if (this.timer <= 0) {
                        this.hasShot = false;
                        if (this.actualChosenBall) {
                            this.actualChosenBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInPlayersUse = false;
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
                        if (basketBallBattleRoyale.gameState.shootBar <= 12)
                            if (!localStorage.getItem("harderVersion"))
                                basketBallBattleRoyale.gameState.shootBar += fCore.Loop.timeFrameReal / 100;
                            else
                                basketBallBattleRoyale.gameState.shootBar += fCore.Loop.timeFrameReal / 75;
                    if (rIsReleased) {
                        this.power = basketBallBattleRoyale.gameState.shootBar * 40;
                        basketBallBattleRoyale.gameState.shootBar = 0;
                        if (!this.actualChosenBall)
                            return;
                        this.shootCalculation();
                        this.progressBar.hidden = true;
                    }
                }
            };
            this.players = _players;
            document.addEventListener("mousedown", onPointerDown);
            document.addEventListener("pointerlockchange", pointerLockChange);
            document.addEventListener("keypress", handler_Key_Pressed);
            document.addEventListener("keyup", handler_Key_Released);
            window.addEventListener("mousemove", onMouseMove);
            this.start();
        }
        async start() {
            this.createAvatar();
            console.log("avatar is initialized!");
            let response = await fetch("./JSON/Config.json");
            let textResponse = await response.text();
            let asd = textResponse.split(":");
            let playerSpeed = parseInt(asd[1]);
            this.movementspeed = playerSpeed;
            if (localStorage.getItem("harderVersion"))
                this.movementspeed = playerSpeed - 1;
            fCore.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
        }
        createAvatar() {
            this.cmpAvatar = new fCore.ComponentRigidbody(75, fCore.PHYSICS_TYPE.DYNAMIC, fCore.COLLIDER_TYPE.CYLINDER, fCore.PHYSICS_GROUP.DEFAULT);
            this.cmpAvatar.restitution = 0.1;
            this.cmpAvatar.rotationInfluenceFactor = fCore.Vector3.ZERO();
            this.cmpAvatar.friction = 100;
            basketBallBattleRoyale.avatarNode = new fCore.Node("AvatarNode");
            basketBallBattleRoyale.avatarNode.addComponent(new fCore.ComponentTransform(fCore.Matrix4x4.TRANSLATION(fCore.Vector3.Y(1))));
            this.childAvatarNode = new fCore.Node("childAvatarNode");
            this.childAvatarNode.addComponent(new fCore.ComponentTransform());
            this.childAvatarNode.mtxLocal.translate(new fCore.Vector3(0, 1, 4.75));
            basketBallBattleRoyale.avatarNode.appendChild(this.childAvatarNode);
            basketBallBattleRoyale.avatarNode.addComponent(basketBallBattleRoyale.cmpCamera);
            basketBallBattleRoyale.avatarNode.addComponent(this.cmpAvatar);
            this.players[0].appendChild(basketBallBattleRoyale.avatarNode);
        }
        handleInputAvatar(_deltaTime) {
            if (fCore.Keyboard.isPressedOne([
                fCore.KEYBOARD_CODE.W,
                fCore.KEYBOARD_CODE.ARROW_UP
            ]))
                this.forwardMovement = this.movementspeed;
            else if (this.forwardMovement >= 0)
                this.forwardMovement -= _deltaTime * this.frictionFactor;
            if (fCore.Keyboard.isPressedOne([
                fCore.KEYBOARD_CODE.S,
                fCore.KEYBOARD_CODE.ARROW_DOWN
            ]))
                this.backwardMovement = -this.movementspeed;
            else if (this.backwardMovement <= 0)
                this.backwardMovement += _deltaTime * this.frictionFactor;
        }
        avatarMovement(_deltaTime) {
            let playerForward;
            playerForward = fCore.Vector3.Z();
            playerForward.transform(basketBallBattleRoyale.avatarNode.mtxWorld, false);
            let movementVelocity = new fCore.Vector3();
            movementVelocity.x =
                playerForward.x * (this.forwardMovement + this.backwardMovement) * this.movementspeed;
            movementVelocity.y = this.cmpAvatar.getVelocity().y;
            movementVelocity.z =
                playerForward.z * (this.forwardMovement + this.backwardMovement) * this.movementspeed;
            this.cmpAvatar.setVelocity(movementVelocity);
        }
        //avatars functionality for grabbing basketballs
        isGrabbingBasket(_deltaTime) {
            if (basketBallBattleRoyale.basketBalls != undefined) {
                if (fCore.Keyboard.isPressedOne([fCore.KEYBOARD_CODE.E])) {
                    basketBallBattleRoyale.basketBalls.forEach(basketBall => {
                        if (this.nearestDistance > fCore.Vector3.DIFFERENCE(basketBall.mtxWorld.translation, basketBallBattleRoyale.avatarNode.mtxWorld.translation).magnitude)
                            this.actualChosenBall = basketBall;
                    });
                    if (!this.actualChosenBall)
                        return;
                    this.progressBar.hidden = false;
                    this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setVelocity(fCore.Vector3.ZERO());
                    this.actualChosenBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysUse = false;
                    this.actualChosenBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInPlayersUse = true;
                    this.isGrabbed = true;
                    rIsReleased = false;
                    rIsPressed = false;
                }
            }
        }
        //which target functionality for avatar
        highlightTargetedBasket() {
            let mtxAvatar = this.cmpAvatar.getContainer().mtxWorld;
            let rayHit = ƒ.Physics.raycast(ƒ.Vector3.DIFFERENCE(this.cmpAvatar.getPosition(), ƒ.Vector3.Y(-5.7)), mtxAvatar.getZ(), 80);
            if (rayHit.rigidbodyComponent)
                if (rayHit.rigidbodyComponent.physicsType != fCore.PHYSICS_TYPE.DYNAMIC) {
                    if (rayHit.rigidbodyComponent.getContainer().name != "Brett")
                        return;
                    let meshContainer = rayHit.rigidbodyComponent.getContainer().getParent();
                    meshContainer.getComponent(fCore.ComponentMaterial).clrPrimary.a = 1.5;
                    meshContainer.getChildren().forEach(childMesh => {
                        childMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 1.5;
                    });
                    if (this.oldRayHit && this.oldRayHit.rigidbodyComponent.getContainer())
                        if (this.oldRayHit.rigidbodyComponent != rayHit.rigidbodyComponent) {
                            let oldMesh = this.oldRayHit.rigidbodyComponent.getContainer().getParent();
                            oldMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 0.5;
                            oldMesh.getChildren().forEach(childMesh => {
                                childMesh.getComponent(fCore.ComponentMaterial).clrPrimary.a = 0.5;
                            });
                        }
                    this.oldRayHit = rayHit;
                }
        }
        shootCalculation() {
            let targetOfMesh;
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
            let playerForward;
            playerForward = fCore.Vector3.Z();
            playerForward.transform(basketBallBattleRoyale.avatarNode.mtxWorld, false);
            //diffrent powers for diffrent distances
            this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(playerForward.x * this.throwStrength, this.power, playerForward.z * this.throwStrength), basketBallBattleRoyale.avatarNode.mtxWorld.translation);
            basketBallBattleRoyale.cmpAudShot.play(true);
            this.isGrabbed = false;
            this.hasShot = true;
            this.timer = 2;
        }
    }
    basketBallBattleRoyale.AvatarController = AvatarController;
})(basketBallBattleRoyale || (basketBallBattleRoyale = {}));
//# sourceMappingURL=AvatarController.js.map