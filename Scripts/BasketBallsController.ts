namespace basketBallBattleRoyale {
    import fCore = FudgeCore;


    fCore.Project.registerScriptNamespace(basketBallBattleRoyale);
    export class BasketBallsController extends fCore.ComponentScript {
        public isInPlayersUse: boolean;
        public isInEnemysUse: boolean;
        public isInFlight: boolean;
        constructor() {
            super();
        }
    }
}