"use strict";
var basketBallBattleRoyale;
(function (basketBallBattleRoyale) {
    let menu;
    let optionMenu;
    let playButton;
    let optionButton;
    let goBackButton;
    window.addEventListener("load", startMenu);
    function startMenu() {
        menu = document.querySelector("#menu");
        menu.hidden = false;
        optionMenu = document.querySelector("#optionMenu");
        optionMenu.hidden = true;
        playButton = document.querySelector("#playButton");
        optionButton = document.querySelector("#optionsButton");
        goBackButton = document.querySelector("#goBack");
        basketBallBattleRoyale.sliderAudio = document.querySelector("#myRange");
        optionButton.addEventListener("click", getOptions);
        playButton.addEventListener("click", startGame);
    }
    function getOptions() {
        menu.hidden = true;
        optionMenu.hidden = false;
        goBackButton.addEventListener("click", startMenu);
    }
    function startGame() {
        menu.hidden = true;
        playButton.innerHTML = "is loading...";
        basketBallBattleRoyale.init();
    }
    basketBallBattleRoyale.startGame = startGame;
})(basketBallBattleRoyale || (basketBallBattleRoyale = {}));
//# sourceMappingURL=BasketBallMenu.js.map