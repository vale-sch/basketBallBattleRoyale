"use strict";
var basketBallBattleRoyale;
(function (basketBallBattleRoyale) {
    var fCore = FudgeCore;
    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);
    basketBallBattleRoyale.alivePlayers = 0;
    class BasketBallBasketTrigger extends fCore.ComponentScript {
        constructor(_container) {
            super();
            this.hitsCounter = 3;
            this.removingTime = 0.75;
            this.isRemoving = false;
            this.hndTrigger = (_event) => {
                if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab") {
                    if (_event.cmpRigidbody)
                        if (this.isRemoving) {
                            _event.cmpRigidbody.getContainer().getComponent(basketBallBattleRoyale.BasketBallsController).isInPlayersUse = false;
                            _event.cmpRigidbody.getContainer().getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight = false;
                            _event.cmpRigidbody.getContainer().getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysUse = false;
                            _event.cmpRigidbody.addVelocity(new fCore.Vector3(fCore.random.getRange(-5, 5), fCore.random.getRange(-25, 25), fCore.random.getRange(-5, 5)));
                            return;
                        }
                    basketBallBattleRoyale.basketBalls.forEach(basketBall => {
                        if (basketBall.getParent() == _event.cmpRigidbody.getContainer().getParent()) {
                            this.parentToRemove = _event.cmpRigidbody.getContainer().getParent();
                        }
                    });
                    this.rgdBdyToRemove = _event.cmpRigidbody;
                    switch (this.thisContainer.getParent().name) {
                        case ("BasketBallKorb_Avatar"):
                            basketBallBattleRoyale.gameState.hitsAvatar = "Avatar Leben: " + --this.hitsCounter;
                            // if (this.hitsCounter == 0)
                            //     // window.location.reload();
                            break;
                        case ("BasketBallKorb_EnemyBlue"):
                            basketBallBattleRoyale.gameState.hitsEnemyBlue = "EnemyBlue Leben: " + --this.hitsCounter;
                            if (this.hitsCounter == 0) {
                                basketBallBattleRoyale.gameState.hitsEnemyBlue = "dead";
                                this.getRidOfNodeAndRgdbdy();
                            }
                            break;
                        case ("BasketBallKorb_EnemyRed"):
                            basketBallBattleRoyale.gameState.hitsEnemyRed = "EnemyRed Leben: " + --this.hitsCounter;
                            if (this.hitsCounter == 0) {
                                basketBallBattleRoyale.gameState.hitsEnemyRed = "dead";
                                this.getRidOfNodeAndRgdbdy();
                            }
                            break;
                        case ("BasketBallKorb_EnemyMagenta"):
                            basketBallBattleRoyale.gameState.hitsEnemyMagenta = "EnemyMagenta Leben: " + --this.hitsCounter;
                            if (this.hitsCounter == 0) {
                                basketBallBattleRoyale.gameState.hitsEnemyMagenta = "dead";
                                this.getRidOfNodeAndRgdbdy();
                            }
                            break;
                    }
                    this.isRemoving = true;
                }
            };
            this.getRidOfNodeAndRgdbdy = () => {
                basketBallBattleRoyale.alivePlayers--;
                this.thisContainer.getParent().getParent().getComponent(basketBallBattleRoyale.EnemiesController).isDead = true;
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
                basketBallBattleRoyale.players.splice(basketBallBattleRoyale.basketBalls.indexOf(this.thisContainer.getParent().getParent()), 1);
                this.thisContainer.getParent().getParent().getParent().removeChild(this.thisContainer.getParent().getParent());
            };
            this.update = () => {
                if (this.isRemoving) {
                    this.removingTime -= fCore.Loop.timeFrameReal / 1000;
                    if (this.removingTime <= 0) {
                        basketBallBattleRoyale.basketBalls.splice(basketBallBattleRoyale.basketBalls.indexOf(this.parentToRemove.getChild(0)), 1);
                        this.rgdBdyToRemove.getContainer().removeComponent(this.rgdBdyToRemove);
                        basketBallBattleRoyale.basketBallContainer.getChild(1).removeChild(this.parentToRemove);
                        this.isRemoving = false;
                        this.rgdBdyToRemove = null;
                        this.removingTime = 0.75;
                    }
                }
            };
            this.thisContainer = _container;
            this.thisContainer.getComponent(fCore.ComponentRigidbody).addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.hndTrigger);
            fCore.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 10);
            switch (this.thisContainer.getParent().name) {
                case ("BasketBallKorb_Avatar"):
                    basketBallBattleRoyale.gameState.hitsAvatar = "Avatar Leben: " + this.hitsCounter;
                    break;
                case ("BasketBallKorb_EnemyBlue"):
                    basketBallBattleRoyale.gameState.hitsEnemyBlue = "EnemyBlue Leben: " + this.hitsCounter;
                    break;
                case ("BasketBallKorb_EnemyRed"):
                    basketBallBattleRoyale.gameState.hitsEnemyRed = "EnemyRed Leben: " + this.hitsCounter;
                    break;
                case ("BasketBallKorb_EnemyMagenta"):
                    basketBallBattleRoyale.gameState.hitsEnemyMagenta = "EnemyMagenta Leben: " + this.hitsCounter;
                    break;
            }
            basketBallBattleRoyale.alivePlayers = basketBallBattleRoyale.players.length;
        }
    }
    basketBallBattleRoyale.BasketBallBasketTrigger = BasketBallBasketTrigger;
})(basketBallBattleRoyale || (basketBallBattleRoyale = {}));
//# sourceMappingURL=BasketBallBasketTrigger.js.map