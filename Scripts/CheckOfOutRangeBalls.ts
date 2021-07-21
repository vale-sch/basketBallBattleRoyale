namespace basketBallBattleRoyale {
    import fCore = FudgeCore;
    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);

    export class CheckOfOutRangeBalls extends fCore.ComponentScript {
        private thisContainer: fCore.Node;
        constructor(_container: fCore.Node) {
            super();
            this.thisContainer = _container;
            this.thisContainer.getComponent(fCore.ComponentRigidbody).addEventListener(fCore.EVENT_PHYSICS.TRIGGER_ENTER, this.hndTrigger);

        }
        private hndTrigger = (_event: fCore.EventPhysics): void => {
            if (_event.cmpRigidbody.getContainer().name == "BasketBallPrefab") {
                basketBalls.splice(basketBalls.indexOf(_event.cmpRigidbody.getContainer().getParent()), 1);
                basketBallContainer.getChild(1).removeChild(_event.cmpRigidbody.getContainer().getParent());
                _event.cmpRigidbody.getContainer().removeComponent(_event.cmpRigidbody);
            }
        }
    }
}
