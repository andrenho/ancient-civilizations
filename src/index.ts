import UI from "./ui/ui";
import Game from "./game/game";

document.addEventListener('DOMContentLoaded', async () => {
    const game = new Game();

    const ui = new UI();
    await ui.load_images();
    ui.draw();
});