import Game from "../game/game";
import {include_point, Position, Rectangle} from "../common/geometry";
import Unit from "../game/unit";
import Canvas from "./canvas";
import {StringMap} from "../common/types";

const IMAGE_LIST: StringMap = {
    warrior: 'img/warrior.png',
};

const TILE = { W: 32, H: 32 };
const MOVE_STEPS = 16;
const ZOOM = 2;

export default class Graphics extends Canvas {

    #rel        = <Position> { x: -5, y: -5 };
    #blocked    = false;
    #blinkState = true;

    constructor() {
        super("graphics", ZOOM);
    }

    get blocked(): boolean { return this.#blocked; }

    async load_images() : Promise<void> {
        return this.load_images_(IMAGE_LIST);
    }

    private bounds() : Rectangle {
        return {
            x: Math.round(this.#rel.x - 1),
            y: Math.round(this.#rel.y - 1),
            w: Math.round((this.canvas.width / TILE.W) + 3),
            h: Math.round((this.canvas.height / TILE.H) + 3)
        };
    }

    draw(game: Game) {
        const bounds = this.bounds();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawTerrain(game, bounds);
        this.drawUnits(game, bounds);
    }

    private drawTerrain(game: Game, bounds: Rectangle) {
        for (let x = bounds.x; x < (bounds.x + bounds.w); ++x)
            for (let y = bounds.y; y < (bounds.y + bounds.h); ++y)
                this.drawTile(game, { x, y });
    }

    private drawUnits(game: Game, bounds: Rectangle) {
        for (const unit of game.units)
            if (include_point(bounds, unit.pos))
                this.drawUnit(game, unit);
    }

    private drawTile(game: Game, pos: Position) {
        this.ctx.fillStyle = "#50a050";
        this.ctx.fillRect((pos.x - this.#rel.x) * TILE.W, (pos.y - this.#rel.y) * TILE.H, TILE.W, TILE.H);
    }

    drawUnit(game: Game, unit: Unit, rel: Position = { x: 0, y: 0 }) {
        const image = this.images.get('warrior');
        const x = (unit.pos.x - this.#rel.x + rel.x) * TILE.W;
        const y = (unit.pos.y - this.#rel.y + rel.y) * TILE.H;

        this.ctx.drawImage(image!, x, y, TILE.W, TILE.H);
    }

    swapBlinkState(game: Game) {
        if (this.#blinkState) {
            this.draw(game);
        } else if (game.activeUnit) {
            this.drawTile(game, game.activeUnit.pos);
        }
        this.#blinkState = !this.#blinkState;
    }

    async animateUnitMovement(game: Game, unit: Unit, dir: Position) : Promise<void> {

        const draw_tiles = (game: Game, pos: Position) => {
            for (let x = pos.x - 1; x <= pos.x + 1; ++x)
                for (let y = pos.y - 1; y <= pos.y + 1; ++y)
                    this.drawTile(game, { x, y });
        };

        return new Promise(resolve => {

            let handleId = 0;

            this.#blocked = true;
            const rel: Position = { x: -dir.x, y: -dir.y };
            const orig: Position = { x: unit.pos.x - dir.x, y: unit.pos.y - dir.y };
            let i = 1;

            let step : () => void;
            step = () => {
                [rel.x, rel.y] = [rel.x + (dir.x / MOVE_STEPS), rel.y + (dir.y / MOVE_STEPS)];

                draw_tiles(game, orig);
                this.drawUnit(game, unit, rel);

                if (i < MOVE_STEPS) {
                    handleId = window.requestAnimationFrame(step);   // next animation frame
                } else {
                    this.#blocked = false;    // animation completed, return
                    window.cancelAnimationFrame(handleId);
                    draw_tiles(game, orig);
                    resolve();
                }
                ++i;
            };
            window.requestAnimationFrame(step);
        });
    }

    startDragging() {
    }

    stopDragging() {
    }
}
