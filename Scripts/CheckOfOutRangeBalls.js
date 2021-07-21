"use strict";
var basketBallBattleRoyale;
(function (basketBallBattleRoyale) {
    var fCore = FudgeCore;
    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);
    class CheckOfOutRangeBalls extends fCore.ComponentScript {
        constructor(_container) {
            super();
            this.hndTrigger = (_event) => {
                if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab") {
                    basketBallBattleRoyale.basketBalls.splice(basketBallBattleRoyale.basketBalls.indexOf(_event.cmpRigidbody.getContainer().getParent()), 1);
                    basketBallBattleRoyale.basketBallContainer.getChild(1).removeChild(_event.cmpRigidbody.getContainer().getParent());
                    _event.cmpRigidbody.getContainer().removeComponent(_event.cmpRigidbody);
                }
            };
            this.thisContainer = _container;
            this.thisContainer.getComponent(fCore.ComponentRigidbody).addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, this.hndTrigger);
        }
    }
    basketBallBattleRoyale.CheckOfOutRangeBalls = CheckOfOutRangeBalls;
})(basketBallBattleRoyale || (basketBallBattleRoyale = {}));
//# sourceMappingURL=CheckOfOutRangeBalls.js.map