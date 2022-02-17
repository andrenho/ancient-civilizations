import UI from "./ui/ui";
import Game from "./game/game";

const game = new Game();

document.addEventListener('DOMContentLoaded', async () => {
    const ui = new UI(game);
    await ui.load_images();
    ui.drawMap();
});