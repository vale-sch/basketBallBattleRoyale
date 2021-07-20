namespace basketBallBattleRoyale {
    import fCore = FudgeCore;
    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);
    export class EnemiesController extends fCore.ComponentScript {
        public isDead: boolean = false;
        private myBsktTrigger: fCore.ComponentMesh;

        private containerEnemy: fCore.Node;
        private enemyContainer: fCore.Node;
        private childEnemyNode: fCore.Node;
        private throwStrength: number = 10;
        private containerTriggers: fCore.ComponentMesh[];
        private rgdBdyEnemy: fCore.ComponentRigidbody;

        private actualChosenBall: fCore.Node;
        private targetedBall: fCore.Node;
        private idleTime: number = 1;
        private speedThreshold: number = 10;
        private rndChosenTarget: fCore.ComponentMesh;
        private hasGrabbed: boolean = false;
        private isInGrabbingRange: boolean = false;
        private distanceBallMag: number;
        private hasShot: boolean = false;
        private allDistances: number[];
        private randomPointVec: fCore.Vector3;
        private hasCheckedEverything: boolean;
        constructor(_containerEnemy?: fCore.Node, _rgdBdyEnemy?: fCore.ComponentRigidbody, _containerTriggers?: fCore.ComponentMesh[]) {
            super();
            this.containerEnemy = _containerEnemy;
            this.rgdBdyEnemy = _rgdBdyEnemy;
            this.enemyContainer = _rgdBdyEnemy.getContainer();
            this.containerTriggers = _containerTriggers;

            this.childEnemyNode = new fCore.Node("childAvatarNode");
            this.childEnemyNode.addComponent(new fCore.ComponentTransform());
            this.childEnemyNode.mtxLocal.translate(new fCore.Vector3(0, 3, 0));

            this.containerEnemy.appendChild(this.childEnemyNode);
            this.whoAmI();
            fCore.Loop.addEventListener(fCore.EVENT.LOOP_FRAME, this.update);
            fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 60);
        }
        private whoAmI = (): void => {
            this.containerTriggers.forEach(trigger => {
                if (trigger.getContainer().getParent().getParent().getChild(1).name != "Avatar")
                    if (this.containerEnemy.name == trigger.getContainer().getParent().getParent().getChild(1).name) {
                        this.myBsktTrigger = trigger;
                    }
            });

        }

        private update = (): void => {
            if (!this.hasCheckedEverything)
                if (this.isDead) {
                    if (this.actualChosenBall) {
                        basketBalls.splice(basketBalls.indexOf(this.actualChosenBall.getParent()), 1);
                        let rgdBdyToRemove: fCore.ComponentRigidbody = this.actualChosenBall.getComponent(fCore.ComponentRigidbody);
                        this.actualChosenBall.removeComponent(rgdBdyToRemove);
                        basketBallContainer.getChild(1).removeChild(this.actualChosenBall.getParent());
                        this.resetReferences();
                    }
                    this.hasCheckedEverything = true;
                    return;
                }
            if (this.isDead) return;
            if (this.hasShot) {
                this.idleTime = this.idleTime - fCore.Loop.timeFrameReal / 1000;
                this.moveToRandomPoint();
                if (this.idleTime <= 0) {
                    this.actualChosenBall.getComponent(BasketBallsController).isInFlight = false;
                    this.actualChosenBall.getComponent(BasketBallsController).isInEnemysUse = false;
                    this.actualChosenBall.getComponent(BasketBallsController).isInPlayersUse = false;
                    this.resetReferences();
                    this.hasShot = false;
                }
                return;
            }

            if (this.targetedBall) {
                if (!this.targetedBall || !this.targetedBall.getComponent(fCore.ComponentRigidbody) || this.targetedBall.getComponent(BasketBallsController).isInPlayersUse) {
                    this.resetReferences();
                    return;
                }
                if (this.isInGrabbingRange) {
                    this.calculationAndShot();
                    return;
                }
                this.moveToAvailableBalls();
            } else
                this.checkNearestBall();

        }

        private checkNearestBall = (): void => {
            if (!basketBalls)
                return;
            let howMuchActiveBalls: number = 0;
            basketBalls.forEach(basketBall => {
                if (basketBall.getComponent(BasketBallsController))
                    if (!basketBall.getComponent(BasketBallsController).isInEnemysUse && !basketBall.getComponent(BasketBallsController).isInPlayersUse)
                        howMuchActiveBalls++;
            });

            if (howMuchActiveBalls == 0) return;
            this.allDistances = null;
            this.allDistances = Array<number>(howMuchActiveBalls);
            for (let i: number = 0; i < basketBalls.length; i++) {
                if (basketBalls[i].getComponent(BasketBallsController))
                    if (!basketBalls[i].getComponent(BasketBallsController).isInEnemysUse && !basketBalls[i].getComponent(BasketBallsController).isInPlayersUse)
                        this.allDistances[i] = Math.floor(fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBalls[i].mtxWorld.translation).magnitude);
            }

            let sortedDistances: number[] = this.allDistances.sort();
            basketBalls.forEach(basketBall => {
                if (basketBall.getComponent(BasketBallsController)) {
                    if (sortedDistances[0] == Math.floor(fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBall.mtxWorld.translation).magnitude))
                        if (!basketBall.getComponent(BasketBallsController).isInEnemysUse || !basketBall.getComponent(BasketBallsController).isInPlayersUse || !basketBall.getComponent(BasketBallsController).isInFlight || !this.targetedBall)
                            this.targetedBall = basketBall;
                        else if (sortedDistances[1] == Math.floor(fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBall.mtxWorld.translation).magnitude))
                            if (!basketBall.getComponent(BasketBallsController).isInEnemysUse || !basketBall.getComponent(BasketBallsController).isInPlayersUse || !basketBall.getComponent(BasketBallsController).isInFlight || !this.targetedBall)
                                this.targetedBall = basketBall;
                            else if (sortedDistances[2] == Math.floor(fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, basketBall.mtxWorld.translation).magnitude))
                                if (!basketBall.getComponent(BasketBallsController).isInEnemysUse || !basketBall.getComponent(BasketBallsController).isInPlayersUse || !basketBall.getComponent(BasketBallsController).isInFlight || !this.targetedBall)
                                    this.targetedBall = basketBall;
                }
            });
            if (this.targetedBall)
                this.targetedBall.getComponent(BasketBallsController).isInEnemysUse = true;
        }


        private moveToRandomPoint = (): void => {
            this.rgdBdyEnemy.setRotation(new fCore.Vector3(0, (this.enemyContainer.mtxWorld.translation.x - this.randomPointVec.x) - (this.enemyContainer.mtxWorld.translation.z - this.randomPointVec.z) * 10, 0));
            let distanceToRandom: number = fCore.Vector3.DIFFERENCE(new fCore.Vector3((this.randomPointVec.x - this.enemyContainer.mtxWorld.translation.x), 0, (this.randomPointVec.z - this.enemyContainer.mtxWorld.translation.z)), this.enemyContainer.mtxWorld.translation).magnitude;
            if (distanceToRandom > 1) {
                if (this.rgdBdyEnemy.getVelocity().magnitude < this.speedThreshold)
                    this.rgdBdyEnemy.addVelocity(new fCore.Vector3((this.randomPointVec.x - this.enemyContainer.mtxWorld.translation.x), 0, (this.randomPointVec.z - this.enemyContainer.mtxWorld.translation.z)));
            }
            else
                this.rgdBdyEnemy.addVelocity(fCore.Vector3.ZERO());

        }

        private moveToAvailableBalls = (): void => {
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
        }
        private calculationAndShot = (): void => {
            this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setVelocity(fCore.Vector3.ZERO());
            this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setRotation(fCore.Vector3.ZERO());
            this.actualChosenBall.getComponent(fCore.ComponentRigidbody).setPosition(this.childEnemyNode.mtxWorld.translation);
            this.actualChosenBall.mtxWorld.translate(this.childEnemyNode.mtxWorld.translation);
            this.rgdBdyEnemy.setRotation(fCore.Vector3.ZERO());
            let distanceToMiddle: number = fCore.Vector3.DIFFERENCE(this.enemyContainer.mtxWorld.translation, cylFloor.mtxWorld.translation).magnitude;
            if (distanceToMiddle > 2.5) {
                if (this.rgdBdyEnemy.getVelocity().magnitude < this.speedThreshold)
                    this.rgdBdyEnemy.setVelocity(new fCore.Vector3((cylFloor.mtxWorld.translation.x - this.containerEnemy.mtxWorld.translation.x), 0, (cylFloor.mtxWorld.translation.z - this.containerEnemy.mtxWorld.translation.z)));
                return;
            }
            else
                this.rgdBdyEnemy.setVelocity(fCore.Vector3.ZERO());

            this.idleTime -= fCore.Loop.timeFrameReal / 1000;
            if (this.idleTime <= 0) {
                this.isInGrabbingRange = false;
                this.hasGrabbed = true;
                this.actualChosenBall.getComponent(BasketBallsController).isInFlight = true;
            }

            if (this.hasGrabbed) {

                let randomTargetNmb: number = new fCore.Random().getRangeFloored(0, 4);
                console.log(this.containerTriggers[randomTargetNmb].getContainer().getParent().name);
                if (!this.containerTriggers[randomTargetNmb].getContainer().getParent().getChild(0).getChild(0).getComponent(fCore.ComponentRigidbody)) return;
                if (this.myBsktTrigger == this.containerTriggers[randomTargetNmb]) return;
                this.rndChosenTarget = this.containerTriggers[randomTargetNmb];
                this.rgdBdyEnemy.rotateBody(new fCore.Vector3(0, (this.rndChosenTarget.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x) - (this.rndChosenTarget.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z), 0));
                let enemyForward: fCore.Vector3 = new fCore.Vector3(this.rndChosenTarget.mtxWorld.translation.x - this.enemyContainer.mtxWorld.translation.x, 0, this.rndChosenTarget.mtxWorld.translation.z - this.enemyContainer.mtxWorld.translation.z);
                enemyForward.transform(this.rndChosenTarget.mtxWorld, false);

                this.actualChosenBall.getComponent(fCore.ComponentRigidbody).applyImpulseAtPoint(
                    new fCore.Vector3(enemyForward.x * this.throwStrength, 275, enemyForward.z * this.throwStrength),
                    this.enemyContainer.mtxWorld.translation);
                this.randomPointVec = new fCore.Vector3(fCore.random.getRangeFloored(-6, 6), 0, fCore.random.getRangeFloored(-6, 6));
                this.idleTime = 2;
                this.hasShot = true;
            }
        }
        private resetReferences = (): void => {
            this.actualChosenBall = null;
            this.targetedBall = null;
            this.isInGrabbingRange = false;
            this.allDistances = null;
            this.hasGrabbed = false;
            this.idleTime = 1;
        }
    }
}