import Game from "./game/game";
import UiEngineText from "./ui-engine-text/ui-engine-text";
import UiInterface from "./interfaces/ui-interface";

const ui : UiInterface = new UiEngineText(new Game());
ui.redraw();

const gameDiv = <HTMLDivElement> document.getElementById('game')!;

document.addEventListener('keydown', event => ui.onKeyDown(event));