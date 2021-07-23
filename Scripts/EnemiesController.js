"use strict";
var basketBallBattleRoyale;
(function (basketBallBattleRoyale) {
    var fCore = FudgeCore;
    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);
    class EnemiesController extends fCore.ComponentScript {
        constructor(_containerEnemy, _rgdBdyEnemy, _containerTriggers) {
            super();
            this.isDead = false;
            this.throwStrength = 10;
            this.idleTime = 1.5;
            this.speedThreshold = 12;
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
            //behaviaor functinality
            this.update = () => {
                if (this.isDead) {
                    if (this.targetedBall && !this.hasCheckedEverything) {
                        if (this.targetedBall.getComponent(fCore.ComponentRigidbody)) {
                            basketBallBattleRoyale.basketBalls.splice(basketBallBattleRoyale.basketBalls.indexOf(this.targetedBall.getParent()), 1);
                            let rgdBdyToRemove = this.targetedBall.getComponent(fCore.ComponentRigidbody);
                            this.targetedBall.removeComponent(rgdBdyToRemove);
                            basketBallBattleRoyale.basketBallContainer.getChild(1).removeChild(this.targetedBall.getParent());
                        }
                        this.resetReferences();
                        this.hasCheckedEverything = true;
                    }
                    return;
                }
                if (this.hasShot) {
                    this.idleTime = this.idleTime - fCore.Loop.timeFrameReal / 1000;
                    this.moveToRandomPoint();
                    if (this.idleTime <= 0) {
                        this.actualChosenBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight = false;
                        this.actualChosenBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysUse = false;
                        this.actualChosenBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInPlayersUse = false;
                        this.resetReferences();
                        this.hasShot = false;
                    }
                    return;
                }
                if (this.targetedBall) {
                    if (!this.targetedBall || !this.targetedBall.getComponent(fCore.ComponentRigidbody) || this.targetedBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInPlayersUse) {
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
                        if (!this.targetedBall && !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInPlayersUse && !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInPlayersUse)
                            howMuchActiveBalls++;
                });
                if (howMuchActiveBalls == 0)
                    return;
                this.allDistances = null;
                this.allDistances = Array(howMuchActiveBalls);
                for (let i = 0; i < basketBallBattleRoyale.basketBalls.length; i++) {
                    if (basketBallBattleRoyale.basketBalls[i].getComponent(basketBallBattleRoyale.BasketBallsController))
                        if (!basketBallBattleRoyale.basketBalls[i].getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysUse && !basketBallBattleRoyale.basketBalls[i].getComponent(basketBallBattleRoyale.BasketBallsController).isInPlayersUse && !basketBallBattleRoyale.basketBalls[i].getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight)
                            this.allDistances[i] = Math.floor(fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBallBattleRoyale.basketBalls[i].mtxWorld.translation).magnitude);
                }
                let sortedDistances = this.allDistances.sort();
                basketBallBattleRoyale.basketBalls.forEach(basketBall => {
                    if (basketBall.getComponent(basketBallBattleRoyale.BasketBallsController)) {
                        if (sortedDistances[0] == Math.floor(fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBall.mtxWorld.translation).magnitude))
                            if (!basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInPlayersUse || !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight || !this.targetedBall) {
                                basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysUse = true;
                                this.targetedBall = basketBall;
                            }
                            else if (sortedDistances[1] == Math.floor(fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBall.mtxWorld.translation).magnitude))
                                if (!basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInPlayersUse || !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight || !this.targetedBall) {
                                    basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysUse = true;
                                    this.targetedBall = basketBall;
                                }
                                else if (sortedDistances[2] == Math.floor(fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBall.mtxWorld.translation).magnitude))
                                    if (!basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInPlayersUse || !basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight || !this.targetedBall) {
                                        basketBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysUse = true;
                                        this.targetedBall = basketBall;
                                    }
                    }
                });
            };
            this.moveToRandomPoint = () => {
                this.rgdBdyEnemy.setRotation(new fCore.Vector3(0, (this.enemyContainer.mtxWorld.translation.x - this.randomPointVec.x) - (this.enemyContainer.mtxWorld.translation.z - this.randomPointVec.z) * 10, 0));
                let distanceToRandom = fCore.Vector3.DIFFERENCE(new fCore.Vector3((this.randomPointVec.x - this.enemyContainer.mtxWorld.translation.x), 0, (this.randomPointVec.z - this.enemyContainer.mtxWorld.translation.z)), this.enemyContainer.mtxWorld.translation).magnitude;
                if (distanceToRandom > 3) {
                    if (this.rgdBdyEnemy.getVelocity().magnitude < this.speedThreshold)
                        this.rgdBdyEnemy.addVelocity(new fCore.Vector3((this.randomPointVec.x - this.enemyContainer.mtxWorld.translation.x), 0, (this.randomPointVec.z - this.enemyContainer.mtxWorld.translation.z)));
                }
                else
                    this.rgdBdyEnemy.addVelocity(fCore.Vector3.ZERO());
            };
            this.moveToAvailableBalls = () => {
                if (this.targetedBall.getComponent(fCore.ComponentRigidbody)) {
                    this.distanceBallMag = fCore.Vector3.DIFFERENCE(this.targetedBall.mtxWorld.translation, this.enemyContainer.mtxWorld.translation).magnitude;
                    if (this.distanceBallMag > 2) {
                        if (this.rgdBdyEnemy.getVelocity().magnitude < this.speedThreshold)
                            this.rgdBdyEnemy.addVelocity(new fCore.Vector3((this.targetedBall.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x) / this.distanceBallMag, 0, (this.targetedBall.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z) / (this.distanceBallMag)));
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
                    if (this.rgdBdyEnemy.getVelocity().magnitude < this.speedThreshold)
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
                    this.actualChosenBall.getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysUse = false;
                }
                if (this.hasGrabbed) {
                    let randomTargetNmb = new fCore.Random().getRangeFloored(0, 4);
                    if (!this.containerTriggers[randomTargetNmb].getContainer().getParent().getChild(0).getChild(0).getComponent(fCore.ComponentRigidbody))
                        return;
                    if (this.myBsktTrigger == this.containerTriggers[randomTargetNmb])
                        return;
                    this.rndChosenTarget = this.containerTriggers[randomTargetNmb];
                    this.rgdBdyEnemy.rotateBody(new fCore.Vector3(0, (this.rndChosenTarget.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x) - (this.rndChosenTarget.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z), 0));
                    let enemyForward = new fCore.Vector3(this.rndChosenTarget.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x, 0, this.rndChosenTarget.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z);
                    enemyForward.transform(this.rndChosenTarget.mtxWorld, false);
                    this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(new fCore.Vector3(enemyForward.x * this.throwStrength, 275, enemyForward.z * this.throwStrength), this.enemyContainer.mtxWorld.translation);
                    this.randomPointVec = new fCore.Vector3(fCore.random.getRangeFloored(-6, 6), 0, fCore.random.getRangeFloored(-6, 6));
                    this.idleTime = 1.5;
                    basketBallBattleRoyale.cmpAudShot.play(true);
                    this.hasShot = true;
                }
            };
            this.resetReferences = () => {
                this.actualChosenBall = null;
                this.targetedBall = null;
                this.isInGrabbingRange = false;
                this.allDistances = null;
                this.hasGrabbed = false;
                this.idleTime = 1.5;
            };
            this.containerEnemy = _containerEnemy;
            this.rgdBdyEnemy = _rgdBdyEnemy;
            this.enemyContainer = _rgdBdyEnemy.getContainer();
            this.containerTriggers = _containerTriggers;
            if (localStorage.getItem("harderVersion"))
                this.speedThreshold = 16;
            this.childEnemyNode = new fCore.Node("childAvatarNode");
            this.childEnemyNode.addComponent(new fCore.ComponentTransform());
            this.childEnemyNode.mtxLocal.translate(new fCore.Vector3(0, 3, 0));
            this.containerEnemy.appendChild(this.childEnemyNode);
            this.whoAmI();
            fCore.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
            console.log("enemy is initialized!");
        }
    }
    basketBallBattleRoyale.EnemiesController = EnemiesController;
})(basketBallBattleRoyale || (basketBallBattleRoyale = {}));
//# sourceMappingURL=EnemiesController.js.map