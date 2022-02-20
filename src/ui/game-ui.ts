import TerrainCanvas from "./canvas/terrain-canvas";
import Game from "../game/game";
import Canvas from "./canvas/canvas";
import {Position} from "../common/geometry";
import UnitsCanvas from "./canvas/units-canvas";

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

export default class GameUi {

    /*
    let mouseDragging = false;
    let touchDragging : Position | null = null;
     */

    #rel = <Position> { x: 0, y: 0 };
    #mouseDragging = false;
    #lastMousePosition = <Position> { x: 0, y: 0 };
    #zoom = 2;

    terrainCanvas: TerrainCanvas = new TerrainCanvas(this.#zoom);
    unitsCanvas: UnitsCanvas = new UnitsCanvas(this.#zoom);
    canvases: Canvas[] = [ this.terrainCanvas, this.unitsCanvas ];

    constructor(private game: Game) {
    }

    captureEvents() {
        document.addEventListener('keydown', event => this.onKeyDown(event));
        window.addEventListener('mousedown', event => this.onMouseDown(event));
        window.addEventListener('mouseup', event => this.onMouseUp(event));
        window.addEventListener('mousemove', event => this.onMouseMove(event));
        window.addEventListener('touchmove', event => this.onTouchMove(event));
        window.addEventListener('resize', event => this.onWindowResize());

        window.addEventListener('contextmenu', event => { event.preventDefault(); return false; });  // prevent menu on right click
    }

    private applyCanvases(f: (canvas: Canvas, data: any) => (void), data: any = undefined) {
        this.canvases.map(canvas => f(canvas, data));
    }

    private redrawMap() {
        this.applyCanvases(canvas => canvas.redraw(this.game, this.#rel));
    }

    async start() : Promise<void> {
        await Promise.all(this.canvases.map(canvas => canvas.load_images()));
        this.redrawMap();
        /*
        graphics.centerOnUnit(game.activeUnit!);
        ui.draw(game);
        setInterval(() => graphics.swapBlinkState(game), BLINK_SPEED);
         */
    }

    onWindowResize() {
        this.applyCanvases(canvas => canvas.resize());
        this.redrawMap();
        /*
        graphics.resize();
        ui.resize();
        graphics.draw(game);
        ui.draw(game);
         */
    }

    onKeyDown(event: KeyboardEvent) {
        /*
        const dir = DIRECTIONS[event.code as keyof typeof DIRECTIONS];
        if (dir && !graphics.blocked) {
            const unit = game.moveActiveUnit(dir);
            if (unit) {
                graphics.scrollIfActiveUnitOutOfScreen(game);
                graphics.drawUnit(game, unit);
                await graphics.animateUnitMovement(game, unit, dir);
                ui.draw(game);
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
            case 'KeyM':
                if (event.ctrlKey && new URLSearchParams(window.location.search).get('debug') != null) {
                    graphics.blocked = true;
                    debug_open(game, graphics.pxToTile(lastMousePosition), () => graphics.blocked = false);
                }
                break;
        }
         */
    }

    onMouseDown(event: MouseEvent) {
        if (event.button == 2) {
            this.#mouseDragging = true;
        }
    }

    onMouseUp(event: MouseEvent) {
        if (event.button == 2) {
            this.#mouseDragging = false;
        }
    }

    onMouseMove(event: MouseEvent) {
        this.#lastMousePosition = { x: event.x, y: event.y };
        if (this.#mouseDragging) {
            this.#rel.x = this.#rel.x + (event.movementX / this.#zoom);
            this.#rel.y = this.#rel.y + (event.movementY / this.#zoom);
            this.redrawMap();
        }
    }

    onTouchStart() {
        /*
        if (event.touches[0])
            touchDragging = { x: event.touches[0].clientX, y: event.touches[0].clientY };
         */
    }

    onTouchEnd() {
        /*
        touchDragging = null;
         */
    }

    onTouchMove(event: TouchEvent) {
        /*
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
         */
    }

}