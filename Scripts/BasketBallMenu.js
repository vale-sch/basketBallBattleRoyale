"use strict";
var basketBallBattleRoyale;
(function (basketBallBattleRoyale) {
    let menu;
    let playButton;
    window.addEventListener("load", startMenu);
    function startMenu() {
        playButton = document.querySelector("#playButton");
        playButton.addEventListener("click", startGame);
    }
    function startGame() {
        menu = document.querySelector("#menu");
        menu.hidden = true;
        basketBallBattleRoyale.init();
    }
    basketBallBattleRoyale.startGame = startGame;
})(basketBallBattleRoyale || (basketBallBattleRoyale = {}));
//# sourceMappingURL=BasketBallMenu.js.map