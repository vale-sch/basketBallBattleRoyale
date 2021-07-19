"use strict";
var basketBallBattleRoyale;
(function (basketBallBattleRoyale) {
    var fCore = FudgeCore;
    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);
    class BasketBallsController extends fCore.ComponentScript {
        constructor() {
            super();
            this.isInUse = false;
            this.isInEnemysTargetAlready = false;
            this.isInFlight = false;
        }
    }
    basketBallBattleRoyale.BasketBallsController = BasketBallsController;
})(basketBallBattleRoyale || (basketBallBattleRoyale = {}));
//# sourceMappingURL=BasketBallsController.js.map