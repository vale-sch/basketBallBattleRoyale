namespace basketBallBattleRoyale {
    import fCore = FudgeCore;


    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);
    export class BasketBallsController extends fCore.ComponentScript {
        public isInUse: boolean = false;
        public isInEnemysTargetAlready: boolean = false;
        public isInFlight: boolean = false;
        constructor() {
            super();
        }
    }
}