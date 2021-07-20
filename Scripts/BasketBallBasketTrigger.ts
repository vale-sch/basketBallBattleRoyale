namespace basketBallBattleRoyale {
    import fCore = FudgeCore;

    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);
    export let alivePlayers: number = 0;
    export class BasketBallBasketTrigger extends fCore.ComponentScript {
        private hitsCounter: number = 3;
        private removingTime: number = 0.75;

        private parentToRemove: fCore.Node;
        private thisContainer: fCore.Node;
        private rgdBdyToRemove: fCore.ComponentRigidbody;

        private isRemoving: boolean = false;

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
            alivePlayers = players.length;
        }

        private hndTrigger = (_event: fCore.EventPhysics): void => {
            if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab") {
                if (_event.cmpRigidbody)
                    if (this.isRemoving) {
                        _event.cmpRigidbody.getContainer().getComponent(BasketBallsController).isInPlayersUse = false;
                        _event.cmpRigidbody.getContainer().getComponent(BasketBallsController).isInFlight = false;
                        _event.cmpRigidbody.getContainer().getComponent(BasketBallsController).isInEnemysUse = false;
                        _event.cmpRigidbody.addVelocity(new fCore.Vector3(fCore.random.getRange(-5, 5), fCore.random.getRange(-25, 25), fCore.random.getRange(-5, 5)));
                        return;
                    }
                basketBalls.forEach(basketBall => {
                    if (basketBall.getParent() == _event.cmpRigidbody.getContainer().getParent()) {
                        this.parentToRemove = _event.cmpRigidbody.getContainer().getParent();
                    }
                });
                this.rgdBdyToRemove = _event.cmpRigidbody;
                switch (this.thisContainer.getParent().name) {
                    case ("BasketBallKorb_Avatar"):
                        gameState.hitsAvatar = "Avatar Leben: " + --this.hitsCounter;
                        // if (this.hitsCounter == 0)
                        //     // window.location.reload();
                        break;
                    case ("BasketBallKorb_EnemyBlue"):
                        gameState.hitsEnemyBlue = "EnemyBlue Leben: " + --this.hitsCounter;
                        if (this.hitsCounter == 0) {
                            gameState.hitsEnemyBlue = "dead";
                            this.getRidOfNodeAndRgdbdy();
                        }

                        break;
                    case ("BasketBallKorb_EnemyRed"):
                        gameState.hitsEnemyRed = "EnemyRed Leben: " + --this.hitsCounter;
                        if (this.hitsCounter == 0) {
                            gameState.hitsEnemyRed = "dead";
                            this.getRidOfNodeAndRgdbdy();
                        }
                        break;
                    case ("BasketBallKorb_EnemyMagenta"):
                        gameState.hitsEnemyMagenta = "EnemyMagenta Leben: " + --this.hitsCounter;
                        if (this.hitsCounter == 0) {
                            gameState.hitsEnemyMagenta = "dead";
                            this.getRidOfNodeAndRgdbdy();
                        }
                        break;
                }
                this.isRemoving = true;
            }
        }
        private getRidOfNodeAndRgdbdy = (): void => {
            alivePlayers--;
            this.thisContainer.getParent().getParent().getComponent(EnemiesController).isDead = true;
            this.thisContainer.getParent().getParent().getChildren().forEach(element => {
                if (element.getComponent(fCore.ComponentRigidbody))
                    element.removeComponent(element.getComponent(fCore.ComponentRigidbody));
                else
                    element.getChild(0).getChildren().forEach(element => {
                        if (element.getComponent(fCore.ComponentRigidbody))
                            element.removeComponent(element.getComponent(fCore.ComponentRigidbody));
                        element.getChildren().forEach(element => {
                            if (element.getComponent(fCore.ComponentRigidbody))
                                element.removeComponent(element.getComponent(fCore.ComponentRigidbody));
                        });
                    });
            });

            players.splice(basketBalls.indexOf(this.thisContainer.getParent().getParent()), 1);
            this.thisContainer.getParent().getParent().getParent().removeChild(this.thisContainer.getParent().getParent());
        }
        private update = (): void => {
            if (this.isRemoving) {
                this.removingTime -= fCore.Loop.timeFrameReal / 1000;
                if (this.removingTime <= 0) {
                    basketBalls.splice(basketBalls.indexOf(this.parentToRemove.getChild(0)), 1);
                    this.rgdBdyToRemove.getContainer().removeComponent(this.rgdBdyToRemove);
                    basketBallContainer.getChild(1).removeChild(this.parentToRemove);
                    this.isRemoving = false;
                    this.rgdBdyToRemove = null;
                    this.removingTime = 0.75;
                }
            }
        }
    }
}