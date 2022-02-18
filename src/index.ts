import Graphics from "./ui/graphics";
import Game from "./game/game";

const BLINK_SPEED = 500;

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
const graphics = new Graphics();

document.addEventListener('DOMContentLoaded', async () => {
    await graphics.load_images();
    graphics.draw(game);
    setInterval(() => graphics.swapBlinkState(game), BLINK_SPEED);
});

document.addEventListener('keydown', async (event) => {
    const dir = DIRECTIONS[event.code as keyof typeof DIRECTIONS];
    if (dir && !graphics.blocked) {
        const unit = game.moveActiveUnit(dir);
        if (unit) {
            await graphics.animateUnitMovement(game, unit, dir);
            graphics.drawUnit(game, unit);
        }
    }
});

window.addEventListener('resize', () => { graphics.resize(); graphics.draw(game); });
