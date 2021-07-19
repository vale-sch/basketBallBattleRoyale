"use strict";
var basketBallBattleRoyale;
(function (basketBallBattleRoyale) {
    var fudgeUI = FudgeUserInterface;
    class GameState extends FudgeCore.Mutable {
        constructor() {
            super(...arguments);
            this.hitsAvatar = "";
            this.hitsEnemyBlue = "";
            this.hitsEnemyRed = "";
            this.hitsEnemyMagenta = "";
        }
        // tslint:disable-next-line: no-empty
        reduceMutator(_mutator) {
        }
    }
    basketBallBattleRoyale.GameState = GameState;
    basketBallBattleRoyale.gameState = new GameState();
    class Hud {
        static start() {
            let domHud = document.querySelector("div");
            Hud.controller = new fudgeUI.Controller(basketBallBattleRoyale.gameState, domHud);
            Hud.controller.updateUserInterface();
        }
    }
    basketBallBattleRoyale.Hud = Hud;
})(basketBallBattleRoyale || (basketBallBattleRoyale = {}));
//# sourceMappingURL=Hud.js.map