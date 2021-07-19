"use strict";
var basketBallBattleRoyale;
(function (basketBallBattleRoyale) {
    var fCore = FudgeCore;
    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);
    class BasketBallBasketTrigger extends fCore.ComponentScript {
        constructor(_container) {
            super();
            this.hitsCounter = 10;
            this.isRemoving = false;
            this.removingTime = 0.75;
            this.hndTrigger = (_event) => {
                if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab") {
                    if (this.isRemoving) {
                        console.log("hallo");
                        _event.cmpRigidbody.getContainer().getComponent(basketBallBattleRoyale.BasketBallsController).isInUse = false;
                        _event.cmpRigidbody.getContainer().getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight = false;
                        _event.cmpRigidbody.addVelocity(new fCore.Vector3(fCore.random.getRange(-5, 5), fCore.random.getRange(-50, 50), fCore.random.getRange(-5, 5)));
                        return;
                    }
                    // tslint:disable-next-line: no-use-before-declare
                    basketBallBattleRoyale.basketBalls.forEach(basketBall => {
                        if (basketBall.getParent() == _event.cmpRigidbody.getContainer().getParent()) {
                            this.parentToRemove = _event.cmpRigidbody.getContainer().getParent();
                        }
                    });
                    this.rgdBdyToRemove = _event.cmpRigidbody;
                    switch (this.thisContainer.getParent().name) {
                        case ("BasketBallKorb_Avatar"):
                            basketBallBattleRoyale.gameState.hitsAvatar = "Avatar Leben: " + --this.hitsCounter;
                            break;
                        case ("BasketBallKorb_EnemyBlue"):
                            basketBallBattleRoyale.gameState.hitsEnemyBlue = "EnemyBlue Leben: " + --this.hitsCounter;
                            break;
                        case ("BasketBallKorb_EnemyRed"):
                            basketBallBattleRoyale.gameState.hitsEnemyRed = "EnemyRed Leben: " + --this.hitsCounter;
                            break;
                        case ("BasketBallKorb_EnemyMagenta"):
                            basketBallBattleRoyale.gameState.hitsEnemyMagenta = "EnemyMagenta Leben: " + --this.hitsCounter;
                            break;
                    }
                    this.isRemoving = true;
                }
            };
            this.update = () => {
                if (this.isRemoving) {
                    this.removingTime -= fCore.Loop.timeFrameReal / 1000;
                    if (this.removingTime <= 0) {
                        basketBallBattleRoyale.basketBalls.splice(basketBallBattleRoyale.basketBalls.indexOf(this.parentToRemove.getChild(0)), 1);
                        this.rgdBdyToRemove.getContainer().removeComponent(this.rgdBdyToRemove);
                        basketBallBattleRoyale.basketBallContainer.getChild(1).removeChild(this.parentToRemove);
                        this.isRemoving = false;
                        this.removingTime = 0.5;
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
        }
    }
    basketBallBattleRoyale.BasketBallBasketTrigger = BasketBallBasketTrigger;
})(basketBallBattleRoyale || (basketBallBattleRoyale = {}));
//# sourceMappingURL=BasketBallBasketTrigger.js.map