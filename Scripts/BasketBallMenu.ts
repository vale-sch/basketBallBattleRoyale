namespace basketBallBattleRoyale {

    export let sliderAudio: HTMLInputElement;

    let menu: HTMLDivElement;
    let optionMenu: HTMLDivElement;
    let playButton: HTMLButtonElement;
    let optionButton: HTMLButtonElement;
    let goBackButton: HTMLButtonElement;

    window.addEventListener("load", startMenu);

    function startMenu(): void {
        menu = document.querySelector("#menu");
        menu.hidden = false;
        optionMenu = document.querySelector("#optionMenu");
        optionMenu.hidden = true;
        playButton = document.querySelector("#playButton");
        optionButton = document.querySelector("#optionsButton");
        goBackButton = document.querySelector("#goBack");
        sliderAudio = document.querySelector("#myRange");
        optionButton.addEventListener("click", getOptions);
        playButton.addEventListener("click", startGame);
    }

    function getOptions(): void {
        menu.hidden = true;
        optionMenu.hidden = false;
        goBackButton.addEventListener("click", startMenu);
    }

    export function startGame(): void {
        menu.hidden = true;
        init();
    }
}