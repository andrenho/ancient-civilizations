import UI from "./ui/ui";
import Game from "./game/game";

const DIRECTIONS = {
    Numpad1: { x: -1, y: 1 },
    Numpad2: { x: 0, y: 1 },
    Numpad3: { x: 1, y: 1 },
    Numpad4: { x: -1, y: 0 },
    Numpad6: { x: 1, y: 0 },
    Numpad7: { x: -1, y: -1 },
    Numpad8: { x: 0, y: -1 },
    Numpad9: { x: 1, y: -1 },
};

const game = new Game();
const ui = new UI();

document.addEventListener('DOMContentLoaded', async () => {
    await ui.load_images();
    ui.draw(game);
});


document.addEventListener('keydown', async (event) => {
    const dir = DIRECTIONS[event.code as keyof typeof DIRECTIONS];
    if (dir && !ui.blocked) {
        const unit = game.moveActiveUnit(dir);
        if (unit)
            await ui.animateUnitMovement(game, unit, dir);
        ui.drawUnit(game, unit);
    }
});

window.addEventListener('resize', () => { ui.resize(); ui.draw(game); });
