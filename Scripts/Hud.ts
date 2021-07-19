namespace basketBallBattleRoyale {
    import fudgeUI = FudgeUserInterface;

    export class GameState extends FudgeCore.Mutable {
        public hitsAvatar: string = "";
        public hitsEnemyBlue: string = "";
        public hitsEnemyRed: string = "";
        public hitsEnemyMagenta: string = "";
        // tslint:disable-next-line: no-empty
        protected reduceMutator(_mutator: FudgeCore.Mutator): void {
        }
    }
    export let gameState: GameState = new GameState();

    export class Hud {
        private static controller: fudgeUI.Controller;
        public static start(): void {
            let domHud: HTMLDivElement = document.querySelector("div");
            Hud.controller = new fudgeUI.Controller(gameState, domHud);
            Hud.controller.updateUserInterface();
        }
    }
}