import Graphics from "./ui/graphics";
import Game from "./game/game";
import UI from "./ui/ui";
import {Position} from "./common/geometry";

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
const ui = new UI();

let mouseDragging = false;
let touchDragging : Position | null = null;

document.addEventListener('DOMContentLoaded', async () => {
    await graphics.load_images();
    graphics.centerOnUnit(game.activeUnit!);
    ui.draw(game);
    setInterval(() => graphics.swapBlinkState(game), BLINK_SPEED);
});

document.addEventListener('keydown', async event => {
    const dir = DIRECTIONS[event.code as keyof typeof DIRECTIONS];
    if (dir && !graphics.blocked) {
        const unit = game.moveActiveUnit(dir);
        if (unit) {
            graphics.scrollIfActiveUnitOutOfScreen(game);
            graphics.drawUnit(game, unit);
            await graphics.animateUnitMovement(game, unit, dir);
        }
    }
    switch (event.code) {
        case 'KeyW':
            game.wait_for_next_unit();
            graphics.scrollIfActiveUnitOutOfScreen(game);
            ui.draw(game);
            break;
        case 'Space':
            game.newTurn();
            graphics.scrollIfActiveUnitOutOfScreen(game);
            ui.draw(game);
            break;
    }
});

window.addEventListener('contextmenu', event => {
    event.preventDefault()
    return false;
});

window.addEventListener('mousedown', event => {
    if (event.button == 2) {
        mouseDragging = true;
    }
});

window.addEventListener('mouseup', event => {
    if (event.button == 2) {
        mouseDragging = false;
    }
})

window.addEventListener('mousemove', event => {
    if (mouseDragging) {
        graphics.drag({ x: event.movementX, y: event.movementY } as Position);
        graphics.draw(game);
    }
});

window.addEventListener('touchstart', event => {
    if (event.touches[0])
        touchDragging = { x: event.touches[0].clientX, y: event.touches[0].clientY };
});

window.addEventListener('touchend', () => {
    touchDragging = null;
});

window.addEventListener('touchmove', event => {
    if (touchDragging && event.changedTouches[0]) {
        const rel = {
            x: event.changedTouches[0].clientX - touchDragging.x,
            y: event.changedTouches[0].clientY - touchDragging.y,
        };
        touchDragging = {
            x: event.changedTouches[0].clientX,
            y: event.changedTouches[0].clientY,
        };
        graphics.drag(rel);
        graphics.draw(game);
    }
});

window.addEventListener('resize', () => {
    graphics.resize();
    ui.resize();
    graphics.draw(game);
    ui.draw(game);
});
