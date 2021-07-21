namespace basketBallBattleRoyale {

    let menu: HTMLDivElement;
    let playButton: HTMLButtonElement;
    window.addEventListener("load", startMenu);

    function startMenu(): void {
        playButton = document.querySelector("#playButton");
        playButton.addEventListener("click", startGame);
    }
    export function startGame(): void {
        menu = document.querySelector("#menu");
        menu.hidden = true;
        init();
    }


}