"use strict";
var basketBallBattleRoyale;
(function (basketBallBattleRoyale) {
    var fCore = FudgeCore;
    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);
    class EnemiesController extends fCore.ComponentScript {
        constructor(_containerEnemy, _rgdBdyEnemy, _containerTriggers) {
            super();
            this.throwStrength = 10;
            this.idleTime = 1;
            this.movementSpeed = 1.2;
            this.hasGrabbed = false;
            this.isInGrabbingRange = false;
            this.hasShot = false;
            this.whoAmI = () => {
                this.containerTriggers.forEach(trigger => {
                    if (trigger.getContainer().getParent().getParent().getChild(1).name != "Avatar")
                        if (this.containerEnemy.name == trigger.getContainer().getParent().getParent().getChild(1).name) {
                            this.myBsktTrigger = trigger;
                        }
                });
            };
            this.update = () => {
                if (this.hasShot) {
                    this.idleTime = this.idleTime - fCore.Loop.timeFrameReal / 1000;
                    if (this.idleTime <= 0) {
                        this.actualChosenBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight = false;
                        this.actualChosenBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready = false;
                        this.actualChosenBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInUse = false;
                        this.resetReferences();
                        this.hasShot = false;
                    }
                    this.moveToRandomPoint();
                    return;
                }
                if (this.targetedBall) {
                    if (!this.targetedBall || !this.targetedBall.getComponent(fCore.ComponentRigidbody) || this.targetedBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInUse) {
                        this.resetReferences();
                        return;
                    }
                    if (this.isInGrabbingRange) {
                        this.calculationAndShot();
                        return;
                    }
                    this.moveToAvailableBalls();
                }
                else
                    this.checkNearestBall();
            };
            this.checkNearestBall = () => {
                if (!basketBallBattleRoyale.basketBalls)
                    return;
                let howMuchActiveBalls = 0;
                basketBallBattleRoyale.basketBalls.forEach(basketBall => {
                    if (basketBall.getComponent(basketBallBattleRoyale.BasketBallsController))
                        if (!basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready && !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInUse)
                            howMuchActiveBalls++;
                });
                if (howMuchActiveBalls == 0)
                    return;
                this.allDistances = null;
                this.allDistances = Array(howMuchActiveBalls);
                for (let i = 0; i < basketBallBattleRoyale.basketBalls.length; i++) {
                    if (basketBallBattleRoyale.basketBalls[i].getComponent(basketBallBattleRoyale.BasketBallsController))
                        if (!basketBallBattleRoyale.basketBalls[i].getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready && !basketBallBattleRoyale.basketBalls[i].getComponent(basketBallBattleRoyale.BasketBallsController).isInUse)
                            this.allDistances[i] = Math.floor(fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBallBattleRoyale.basketBalls[i].mtxWorld.translation).magnitude);
                }
                let sortedDistances = this.allDistances.sort();
                basketBallBattleRoyale.basketBalls.forEach(basketBall => {
                    if (basketBall.getComponent(basketBallBattleRoyale.BasketBallsController)) {
                        if (sortedDistances[0] == Math.floor(fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBall.mtxWorld.translation).magnitude))
                            if (!basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready || !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInUse || !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight || !this.targetedBall) {
                                basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready = true;
                                this.targetedBall = basketBall;
                            }
                            else if (sortedDistances[1] == Math.floor(fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBall.mtxWorld.translation).magnitude))
                                if (!basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready || !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInUse || !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight || !this.targetedBall) {
                                    basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready = true;
                                    this.targetedBall = basketBall;
                                }
                                else if (sortedDistances[2] == Math.floor(fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBall.mtxWorld.translation).magnitude))
                                    if (!basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready || !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInUse || !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight || !this.targetedBall) {
                                        basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysTargetAlready = true;
                                        this.targetedBall = basketBall;
                                    }
                    }
                });
            };
            this.moveToRandomPoint = () => {
                this.rgdBdyEnemy.setRotation(new fCore.Vector3(0, (this.enemyContainer.mtxWorld.translation.x - this.randomPointVec.x) - (this.enemyContainer.mtxWorld.translation.z - this.randomPointVec.z) * 10, 0));
                if (this.rgdBdyEnemy.getVelocity().magnitude < 5)
                    this.rgdBdyEnemy.addVelocity(new fCore.Vector3((this.randomPointVec.x - this.enemyContainer.mtxWorld.translation.x), 0, (this.randomPointVec.z - this.enemyContainer.mtxWorld.translation.z)));
                else
                    this.rgdBdyEnemy.addVelocity(fCore.Vector3.ZERO());
            };
            this.moveToAvailableBalls = () => {
                if (this.targetedBall.getComponent(fCore.ComponentRigidbody)) {
                    this.distanceBallMag = fCore.Vector3.DIFFERENCE(this.targetedBall.mtxWorld.translation, this.enemyContainer.mtxWorld.translation).magnitude;
                    if (this.distanceBallMag > 2) {
                        if (this.rgdBdyEnemy.getVelocity().magnitude < 15)
                            this.rgdBdyEnemy.addVelocity(new fCore.Vector3((this.targetedBall.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x) / (this.distanceBallMag * this.movementSpeed), 0, (this.targetedBall.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z) / (this.distanceBallMag * this.movementSpeed)));
                        this.rgdBdyEnemy.setRotation(new fCore.Vector3(0, (this.enemyContainer.mtxWorld.translation.x - this.targetedBall.mtxWorld.translation.x) - (this.enemyContainer.mtxWorld.translation.z - this.targetedBall.mtxWorld.translation.z), 0));
                        if (this.distanceBallMag <= 4) {
                            this.isInGrabbingRange = true;
                            this.actualChosenBall = this.targetedBall;
                            this.rgdBdyEnemy.setVelocity(fCore.Vector3.ZERO());
                            return;
                        }
                    }
                }
            };
            this.calculationAndShot = () => {
                this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setVelocity(fCore.Vector3.ZERO());
                this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setRotation(fCore.Vector3.ZERO());
                this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setPosition(this.childEnemyNode.mtxWorld.translation);
                this.actualChosenBall.mtxWorld.translate(this.childEnemyNode.mtxWorld.translation);
                this.rgdBdyEnemy.setRotation(fCore.Vector3.ZERO());
                let distanceToMiddle = fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBallBattleRoyale.cylFloor.mtxWorld.translation).magnitude;
                if (distanceToMiddle > 2.5) {
                    if (this.rgdBdyEnemy.getVelocity().magnitude < 15)
                        this.rgdBdyEnemy.setVelocity(new fCore.Vector3((basketBallBattleRoyale.cylFloor.mtxWorld.translation.x - this.containerEnemy.mtxWorld.translation.x), 0, (basketBallBattleRoyale.cylFloor.mtxWorld.translation.z - this.containerEnemy.mtxWorld.translation.z)));
                    return;
                }
                else
                    this.rgdBdyEnemy.setVelocity(fCore.Vector3.ZERO());
                this.idleTime -= fCore.Loop.timeFrameReal / 1000;
                if (this.idleTime <= 0) {
                    this.isInGrabbingRange = false;
                    this.hasGrabbed = true;
                    this.actualChosenBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight = true;
                }
                if (this.hasGrabbed) {
                    let randomTargetNmb = new fCore.Random().getRangeFloored(0, 4);
                    this.rndChosenTarget = this.containerTriggers[randomTargetNmb];
                    if (this.myBsktTrigger == this.rndChosenTarget)
                        return;
                    this.rgdBdyEnemy.rotateBody(new fCore.Vector3(0, (this.rndChosenTarget.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x) - (this.rndChosenTarget.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z), 0));
                    let enemyForward = new fCore.Vector3(this.rndChosenTarget.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x, 0, this.rndChosenTarget.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z);
                    enemyForward.transform(this.rndChosenTarget.mtxWorld, false);
                    this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(enemyForward.x * this.throwStrength, 275, enemyForward.z * this.throwStrength), this.enemyContainer.mtxWorld.translation);
                    this.randomPointVec = new fCore.Vector3(fCore.random.getRangeFloored(-15, 15), 0, fCore.random.getRangeFloored(-15, 15));
                    this.idleTime = 2;
                    this.hasShot = true;
                }
            };
            this.resetReferences = () => {
                this.actualChosenBall = null;
                this.targetedBall = null;
                this.isInGrabbingRange = false;
                this.allDistances = null;
                this.hasGrabbed = false;
                this.idleTime = 1;
            };
            this.containerEnemy = _containerEnemy;
            this.rgdBdyEnemy = _rgdBdyEnemy;
            this.enemyContainer = _rgdBdyEnemy.getContainer();
            this.containerTriggers = _containerTriggers;
            this.childEnemyNode = new fCore.Node("childAvatarNode");
            this.childEnemyNode.addComponent(new fCore.ComponentTransform());
            this.childEnemyNode.mtxLocal.translate(new fCore.Vector3(0, 3, 0));
            this.containerEnemy.appendChild(this.childEnemyNode);
            this.whoAmI();
            fCore.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
        }
    }
    basketBallBattleRoyale.EnemiesController = EnemiesController;
})(basketBallBattleRoyale || (basketBallBattleRoyale = {}));
//# sourceMappingURL=EnemiesController.js.map