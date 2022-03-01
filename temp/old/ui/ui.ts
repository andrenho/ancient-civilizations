import {Position} from "../common/geometry";
import Game from "../game/game";
import {debug_open} from "./debug";
import MapCanvas from "./canvas/map-canvas";
import HudCanvas from "./canvas/hud-canvas";
import CityCanvas from "./canvas/city-canvas";

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

export default class UI {

    #mouseDragging = false;
    #lastMousePosition = <Position> { x: 0, y: 0 };
    #touchDragging : Position | null = null;

    #mapCanvas = new MapCanvas();
    #cityCanvas = new CityCanvas();
    #hudCanvas = new HudCanvas();

    constructor(private game: Game) {
    }

    captureEvents() {
        // document.addEventListener('keydown', event => this.onKeyDown(event));
        document.addEventListener('keyup', event => this.onKeyUp(event));
        window.addEventListener('mousedown', event => this.onMouseDown(event));
        window.addEventListener('mouseup', event => this.onMouseUp(event));
        window.addEventListener('mousemove', event => this.onMouseMove(event));
        window.addEventListener('touchstart', event => this.onTouchStart(event));
        window.addEventListener('touchend', () => this.onTouchEnd());
        window.addEventListener('touchmove', event => this.onTouchMove(event));
        window.addEventListener('resize', () => this.onWindowResize());

        window.addEventListener('contextmenu', event => { event.preventDefault(); return false; });  // prevent menu on right click
    }

    async start() : Promise<void> {
        await Promise.all([
            this.#mapCanvas.load_images(),
            this.#hudCanvas.load_font()
        ]);
        this.#mapCanvas.centerOnUnit(this.game.activeUnit!);
        this.#mapCanvas.draw(this.game);
        this.#hudCanvas.draw(this.game);
        setInterval(() => this.#mapCanvas.swapBlinkState(this.game), BLINK_SPEED);
    }

    private onWindowResize() {
        this.#mapCanvas.resize();
        this.#mapCanvas.draw(this.game);
        this.#hudCanvas.resize();
        this.#hudCanvas.draw(this.game);
    }

    private async onKeyDown(event: KeyboardEvent) {
        const dir = DIRECTIONS[event.code as keyof typeof DIRECTIONS];
        if (dir && !this.#mapCanvas.blocked) {
            const unit = this.game.moveActiveUnit(dir);
            if (unit) {
                this.#mapCanvas.scrollIfActiveUnitOutOfScreen(this.game);
                await this.#mapCanvas.animateUnitMovement(this.game, unit, dir);
                this.#hudCanvas.draw(this.game);
            }
        }

        switch (event.code) {
            case 'KeyW':
                this.game.wait_for_next_unit();
                this.#mapCanvas.scrollIfActiveUnitOutOfScreen(this.game);
                this.#hudCanvas.draw(this.game);
                break;
            case 'Space':
                this.game.newTurn();
                this.#mapCanvas.scrollIfActiveUnitOutOfScreen(this.game);
                this.#hudCanvas.draw(this.game);
                break;
            case 'KeyM':
                if (event.ctrlKey && new URLSearchParams(window.location.search).get('debug') != null) {
                    this.#mapCanvas.blocked = true;
                    debug_open(this.game, this.#mapCanvas.pxToTile(this.#lastMousePosition), () => this.#mapCanvas.blocked = false);
                }
                break;
        }

        if (event.key == 'Control') {
            this.#mapCanvas.drawTileMarker(this.game, this.#mapCanvas.pxToTile({ x: this.#lastMousePosition.x, y: this.#lastMousePosition.y }));
        }
    }

    private onKeyUp(event: KeyboardEvent) {
        if (event.key == 'Control') {
            this.#mapCanvas.drawTileMarker(this.game, null);
        }
    }

    private onMouseDown(event: MouseEvent) {
        if (event.button == 1) {
            const tile = this.#mapCanvas.pxToTile({ x: event.x, y: event.y });
            const city = this.game.cityInPos(tile, this.game.playerNation)
            if (city)
                this.#cityCanvas.show(city);
        } else if (event.button == 2) {
            this.#mouseDragging = true;
        }
    }

    private onMouseUp(event: MouseEvent) {
        if (event.button == 2) {
            this.#mouseDragging = false;
        }
    }

    private onMouseMove(event: MouseEvent) {
        this.#lastMousePosition = { x: event.x, y: event.y };
        if (this.#mouseDragging) {
            this.#mapCanvas.drag({ x: event.movementX, y: event.movementY } as Position);
            this.#mapCanvas.draw(this.game);
        }
        if (event.ctrlKey) {
            this.#mapCanvas.drawTileMarker(this.game, this.#mapCanvas.pxToTile({ x: event.x, y: event.y }));
        }
    }

    private onTouchStart(event: TouchEvent) {
        if (event.touches[0])
            this.#touchDragging = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }

    private onTouchEnd() {
        this.#touchDragging = null;
    }

    private onTouchMove(event: TouchEvent) {
        if (this.#touchDragging && event.changedTouches[0]) {
            const rel = {
                x: event.changedTouches[0].clientX - this.#touchDragging.x,
                y: event.changedTouches[0].clientY - this.#touchDragging.y,
            };
            this.#touchDragging = {
                x: event.changedTouches[0].clientX,
                y: event.changedTouches[0].clientY,
            };
            this.#mapCanvas.drag(rel);
            this.#mapCanvas.draw(this.game);
        }
    }
}