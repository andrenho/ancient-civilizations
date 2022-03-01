import Game from "./game/game";
import UI from "./ui/ui";

document.addEventListener('DOMContentLoaded', async () => {
    const game = new Game();
    const ui = new UI(game);
    ui.captureEvents();
    await ui.start();
});