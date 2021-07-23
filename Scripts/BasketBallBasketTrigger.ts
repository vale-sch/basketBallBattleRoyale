namespace basketBallBattleRoyale {
    import fCore = FudgeCore;

    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);
    export let alivePlayers: number = 0;
    export let isInMenu: boolean;
    export class BasketBallBasketTrigger extends fCore.ComponentScript {


        private amountOfLifes: number = 10;
        private avatarsLifes: number;
        private removingTime: number = 0.75;

        private retryButton: HTMLButtonElement;
        private looseMenu: HTMLDivElement;

        private nextLevelButton: HTMLButtonElement;
        private winText: HTMLHeadingElement;
        private winMenu: HTMLDivElement;

        private parentToRemove: fCore.Node;
        private thisContainer: fCore.Node;
        private rgdBdyToRemove: fCore.ComponentRigidbody;

        private isRemoving: boolean = false;

        constructor(_container: fCore.Node) {
            super();
            this.thisContainer = _container;
            this.looseMenu = document.querySelector("#loose");
            this.retryButton = document.querySelector("#retryButton");
            this.winMenu = document.querySelector("#win");
            this.nextLevelButton = document.querySelector("#nextLevel");

            this.thisContainer.getComponent(fCore.ComponentRigidbody).addEventListener(fCore.EVENT_PHYSICS.TRIGGER_ENTER, this.hndTrigger);
            fCore.Loop.addEventListener(fCore.EVENT.LOOP_FRAME, this.update);
            fCore.Loop.start(fCore.LOOP_MODE.TIME_REAL, 10);
            if (localStorage.getItem("harderVersion"))
                this.avatarsLifes = this.amountOfLifes - 2;
            else
                this.avatarsLifes = this.amountOfLifes + 5;

            switch (this.thisContainer.getParent().name) {
                case ("BasketBallKorb_Avatar"):
                    gameState.hitsAvatar = "avatar: " + this.avatarsLifes;
                    break;
                case ("BasketBallKorb_EnemyBlue"):
                    gameState.hitsEnemyBlue = "enemy-blue: " + this.amountOfLifes;
                    break;
                case ("BasketBallKorb_EnemyRed"):
                    gameState.hitsEnemyRed = "enemy-red: " + this.amountOfLifes;
                    break;
                case ("BasketBallKorb_EnemyMagenta"):
                    gameState.hitsEnemyMagenta = "enemy-magenta: " + this.amountOfLifes;
                    break;
            }
            alivePlayers = players.length;
        }

        private hndTrigger = (_event: fCore.EventPhysics): void => {
            if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab") {
                if (this.isRemoving) {
                    _event.cmpRigidbody.getContainer().getComponent(BasketBallsController).isInPlayersUse = false;
                    _event.cmpRigidbody.getContainer().getComponent(BasketBallsController).isInFlight = false;
                    _event.cmpRigidbody.getContainer().getComponent(BasketBallsController).isInEnemysUse = false;
                    _event.cmpRigidbody.addVelocity(new fCore.Vector3(fCore.random.getRange(-5, 5), fCore.random.getRange(2, 8), fCore.random.getRange(-5, 5)));
                    return;
                }
                basketBalls.forEach(basketBall => {
                    if (basketBall.getParent() == _event.cmpRigidbody.getContainer().getParent()) {
                        this.parentToRemove = _event.cmpRigidbody.getContainer().getParent();
                    }
                });
                cmpAudGoal.play(true);
                this.rgdBdyToRemove = _event.cmpRigidbody;
                switch (this.thisContainer.getParent().name) {
                    case ("BasketBallKorb_Avatar"):
                        gameState.hitsAvatar = "avatar: " + --this.avatarsLifes;
                        if (this.avatarsLifes == 0) {
                            this.looseMenu.hidden = false;
                            this.retryButton.addEventListener("click", this.reloadPage);
                            isInMenu = true;
                            cmpAudDeath.play(true);
                            cmpAudLoose.play(true);
                            cmpAudBackground.play(false);
                            fCore.Loop.stop();
                        }
                        break;
                    case ("BasketBallKorb_EnemyBlue"):
                        gameState.hitsEnemyBlue = "enemy-blue: " + --this.amountOfLifes;
                        if (this.amountOfLifes == 0) {
                            cmpAudDeath.play(true);
                            gameState.hitsEnemyBlue = "dead";
                            this.getRidOfNodeAndRgdbdy();
                        }

                        break;
                    case ("BasketBallKorb_EnemyRed"):
                        gameState.hitsEnemyRed = "enemy-red: " + --this.amountOfLifes;
                        if (this.amountOfLifes == 0) {
                            cmpAudDeath.play(true);
                            gameState.hitsEnemyRed = "dead";
                            this.getRidOfNodeAndRgdbdy();
                        }
                        break;
                    case ("BasketBallKorb_EnemyMagenta"):
                        gameState.hitsEnemyMagenta = "enemy-magenta: " + --this.amountOfLifes;
                        if (this.amountOfLifes == 0) {
                            cmpAudDeath.play(true);
                            gameState.hitsEnemyMagenta = "dead";
                            this.getRidOfNodeAndRgdbdy();
                        }
                        break;
                }
                if (alivePlayers == 1) {
                    isInMenu = true;
                    if (localStorage.getItem("harderVersion")) {
                        this.winText = document.querySelector("#winText");
                        this.winText.innerHTML = "you have won the game, congrats!";
                        this.nextLevelButton.innerHTML = "restart to menu with standard values ";
                        this.nextLevelButton.addEventListener("click", this.reloadPage);
                    }
                    else
                        this.nextLevelButton.addEventListener("click", this.writeNewDifficulty);
                    cmpAudWin.play(true);
                    this.winMenu.hidden = false;
                }
                this.isRemoving = true;
            }
        }
        private reloadPage(): void {
            localStorage.clear();
            window.location.reload();
        }
        private async writeNewDifficulty(): Promise<void> {
            localStorage.setItem("harderVersion", "true");
            window.location.reload();
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
                if (this.removingTime <= 0 && this.rgdBdyToRemove.getContainer()) {
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