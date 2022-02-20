import Game from "./game/game";
import GameUi from "./ui/game-ui";

document.addEventListener('DOMContentLoaded', async () => {
    const game = new Game();
    const game_ui = new GameUi(game);
    game_ui.captureEvents();
    await game_ui.start();
});