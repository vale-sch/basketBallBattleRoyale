namespace basketBallBattleRoyale {
    export class GameConfiguration {
        public _enemySpeed: number;
        public _playerSpeed: number;
        public _dificulty: number;
        constructor(_enemySpeed: number, _playerSpeed: number, _dificulty: number) {
            this._enemySpeed = _enemySpeed;
            this._playerSpeed = _playerSpeed;
            this._dificulty = _dificulty;
        }

    }
}