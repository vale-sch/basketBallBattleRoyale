"use strict";
var basketBallBattleRoyale;
(function (basketBallBattleRoyale) {
    var fCore = FudgeCore;
    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);
    basketBallBattleRoyale.alivePlayers = 0;
    class BasketBallBasketTrigger extends fCore.ComponentScript {
        constructor(_container) {
            super();
            this.amountOfLifes = 10;
            this.removingTime = 0.75;
            this.isRemoving = false;
            this.hndTrigger = (_event) => {
                if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab") {
                    if (this.isRemoving) {
                        _event.cmpRigidbody.getContainer().getComponent(basketBallBattleRoyale.BasketBallsController).isInPlayersUse = false;
                        _event.cmpRigidbody.getContainer().getComponent(basketBallBattleRoyale.BasketBallsController).isInFlight = false;
                        _event.cmpRigidbody.getContainer().getComponent(basketBallBattleRoyale.BasketBallsController).isInEnemysUse = false;
                        _event.cmpRigidbody.addVelocity(new fCore.Vector3(fCore.random.getRange(-5, 5), fCore.random.getRange(2, 8), fCore.random.getRange(-5, 5)));
                        return;
                    }
                    basketBallBattleRoyale.basketBalls.forEach(basketBall => {
                        if (basketBall.getParent() == _event.cmpRigidbody.getContainer().getParent()) {
                            this.parentToRemove = _event.cmpRigidbody.getContainer().getParent();
                        }
                    });
                    basketBallBattleRoyale.cmpAudGoal.play(true);
                    this.rgdBdyToRemove = _event.cmpRigidbody;
                    switch (this.thisContainer.getParent().name) {
                        case ("BasketBallKorb_Avatar"):
                            basketBallBattleRoyale.gameState.hitsAvatar = "avatar: " + --this.avatarsLifes;
                            if (this.avatarsLifes == 0) {
                                this.looseMenu.hidden = false;
                                this.retryButton.addEventListener("click", this.reloadPage);
                                basketBallBattleRoyale.cmpAudDeath.play(true);
                                basketBallBattleRoyale.cmpAudLoose.play(true);
                                fCore.Loop.stop();
                            }
                            break;
                        case ("BasketBallKorb_EnemyBlue"):
                            basketBallBattleRoyale.gameState.hitsEnemyBlue = "enemy-blue: " + --this.amountOfLifes;
                            if (this.amountOfLifes == 0) {
                                basketBallBattleRoyale.cmpAudDeath.play(true);
                                basketBallBattleRoyale.gameState.hitsEnemyBlue = "dead";
                                this.getRidOfNodeAndRgdbdy();
                            }
                            break;
                        case ("BasketBallKorb_EnemyRed"):
                            basketBallBattleRoyale.gameState.hitsEnemyRed = "enemy-red: " + --this.amountOfLifes;
                            if (this.amountOfLifes == 0) {
                                basketBallBattleRoyale.cmpAudDeath.play(true);
                                basketBallBattleRoyale.gameState.hitsEnemyRed = "dead";
                                this.getRidOfNodeAndRgdbdy();
                            }
                            break;
                        case ("BasketBallKorb_EnemyMagenta"):
                            basketBallBattleRoyale.gameState.hitsEnemyMagenta = "enemy-magenta: " + --this.amountOfLifes;
                            if (this.amountOfLifes == 0) {
                                basketBallBattleRoyale.cmpAudDeath.play(true);
                                basketBallBattleRoyale.gameState.hitsEnemyMagenta = "dead";
                                this.getRidOfNodeAndRgdbdy();
                            }
                            break;
                    }
                    if (basketBallBattleRoyale.alivePlayers == 1) {
                        if (localStorage.getItem("harderVersion")) {
                            this.winText = document.querySelector("#winText");
                            this.winText.innerHTML = "you have won the game, congrats!";
                            this.buttonWinText = document.querySelector("#text");
                            //this.buttonWinText.innerHTML = "";
                            this.nextLevelButton.innerHTML = "restart to menu with standard values ";
                            this.nextLevelButton.addEventListener("click", this.reloadPage);
                        }
                        else
                            this.nextLevelButton.addEventListener("click", this.writeNewDifficulty);
                        basketBallBattleRoyale.cmpAudWin.play(true);
                        this.winMenu.hidden = false;
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
                    if (this.removingTime <= 0 && this.rgdBdyToRemove.getContainer()) {
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
            this.looseMenu = document.querySelector("#loose");
            this.retryButton = document.querySelector("#retryButton");
            this.winMenu = document.querySelector("#win");
            this.nextLevelButton = document.querySelector("#nextLevel");
            this.thisContainer.getComponent(fCore.ComponentRigidbody).addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.hndTrigger);
            fCore.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 10);
            if (localStorage.getItem("harderVersion"))
                this.avatarsLifes = this.amountOfLifes - 2;
            else
                this.avatarsLifes = this.amountOfLifes + 5;
            switch (this.thisContainer.getParent().name) {
                case ("BasketBallKorb_Avatar"):
                    basketBallBattleRoyale.gameState.hitsAvatar = "avatar: " + this.avatarsLifes;
                    break;
                case ("BasketBallKorb_EnemyBlue"):
                    basketBallBattleRoyale.gameState.hitsEnemyBlue = "enemy-blue: " + this.amountOfLifes;
                    break;
                case ("BasketBallKorb_EnemyRed"):
                    basketBallBattleRoyale.gameState.hitsEnemyRed = "enemy-red: " + this.amountOfLifes;
                    break;
                case ("BasketBallKorb_EnemyMagenta"):
                    basketBallBattleRoyale.gameState.hitsEnemyMagenta = "enemy-magenta: " + this.amountOfLifes;
                    break;
            }
            basketBallBattleRoyale.alivePlayers = basketBallBattleRoyale.players.length;
        }
        reloadPage() {
            localStorage.clear();
            window.location.reload();
        }
        async writeNewDifficulty() {
            localStorage.setItem("harderVersion", "true");
            window.location.reload();
        }
    }
    basketBallBattleRoyale.BasketBallBasketTrigger = BasketBallBasketTrigger;
})(basketBallBattleRoyale || (basketBallBattleRoyale = {}));
//# sourceMappingURL=BasketBallBasketTrigger.js.map