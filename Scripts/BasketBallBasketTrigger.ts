namespace basketBallBattleRoyale {
    import fCore = FudgeCore;

    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);

    export class BasketBallBasketTrigger extends fCore.ComponentScript {
        private thisContainer: fCore.Node;
        private hitsCounter: number = 10;
        private parentToRemove: fCore.Node;
        private isRemoving: boolean = false;
        private removingTime: number = 0.75;
        private rgdBdyToRemove: fCore.ComponentRigidbody;
        constructor(_container: fCore.Node) {
            super();
            this.thisContainer = _container;
            this.thisContainer.getComponent(fCore.ComponentRigidbody).addEventListener(fCore.EVENT_PHYSICS.TRIGGER_ENTER, this.hndTrigger);
            fCore.Loop.addEventListener(fCore.EVENT.LOOP_FRAME, this.update);
            fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 10);
            switch (this.thisContainer.getParent().name) {
                case ("BasketBallKorb_Avatar"):
                    gameState.hitsAvatar = "Avatar Leben: " + this.hitsCounter;
                    break;
                case ("BasketBallKorb_EnemyBlue"):
                    gameState.hitsEnemyBlue = "EnemyBlue Leben: " + this.hitsCounter;
                    break;
                case ("BasketBallKorb_EnemyRed"):
                    gameState.hitsEnemyRed = "EnemyRed Leben: " + this.hitsCounter;
                    break;
                case ("BasketBallKorb_EnemyMagenta"):
                    gameState.hitsEnemyMagenta = "EnemyMagenta Leben: " + this.hitsCounter;
                    break;
            }
        }

        private hndTrigger = (_event: fCore.EventPhysics): void => {
            if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab") {
                if (this.isRemoving) {
                    console.log("hallo");
                    _event.cmpRigidbody.getContainer().getComponent(BasketBallsController).isInUse = false;
                    _event.cmpRigidbody.getContainer().getComponent(BasketBallsController).isInFlight = false;
                    _event.cmpRigidbody.addVelocity(new fCore.Vector3(fCore.random.getRange(-5, 5), fCore.random.getRange(-50, 50), fCore.random.getRange(-5, 5)));
                    return;
                }
                // tslint:disable-next-line: no-use-before-declare
                basketBalls.forEach(basketBall => {
                    if (basketBall.getParent() == _event.cmpRigidbody.getContainer().getParent()) {
                        this.parentToRemove = _event.cmpRigidbody.getContainer().getParent();
                    }
                });
                this.rgdBdyToRemove = _event.cmpRigidbody;
                switch (this.thisContainer.getParent().name) {
                    case ("BasketBallKorb_Avatar"):
                        gameState.hitsAvatar = "Avatar Leben: " + --this.hitsCounter;
                        break;
                    case ("BasketBallKorb_EnemyBlue"):
                        gameState.hitsEnemyBlue = "EnemyBlue Leben: " + --this.hitsCounter;
                        break;
                    case ("BasketBallKorb_EnemyRed"):
                        gameState.hitsEnemyRed = "EnemyRed Leben: " + --this.hitsCounter;
                        break;
                    case ("BasketBallKorb_EnemyMagenta"):
                        gameState.hitsEnemyMagenta = "EnemyMagenta Leben: " + --this.hitsCounter;
                        break;
                }
                this.isRemoving = true;
            }
        }

        private update = (): void => {
            if (this.isRemoving) {
                this.removingTime -= fCore.Loop.timeFrameReal / 1000;
                if (this.removingTime <= 0) {
                    basketBalls.splice(basketBalls.indexOf(this.parentToRemove.getChild(0)), 1);
                    this.rgdBdyToRemove.getContainer().removeComponent(this.rgdBdyToRemove);
                    basketBallContainer.getChild(1).removeChild(this.parentToRemove);

                    this.isRemoving = false;
                    this.removingTime = 0.5;
                }
            }
        }
    }
}