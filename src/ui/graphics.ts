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
const BOUNDS_INLET = 3;
const SCROLL_BY = 2;

export default class Graphics extends Canvas {

    #rel        = <Position> { x: 0, y: 0 };
    #blocked    = false;
    #blinkState = true;

    readonly #SCALE = { x: TILE.W / this.zoom, y: TILE.H / this.zoom };

    constructor() {
        super("graphics", ZOOM);
    }

    get blocked(): boolean { return this.#blocked; }

    async load_images() : Promise<void> {
        return this.load_images_(IMAGE_LIST);
    }

    private bounds(inlet: number = 0) : Rectangle {
        return {
            x: Math.round(this.#rel.x - 1) + inlet,
            y: Math.round(this.#rel.y - 1) + inlet ,
            w: Math.round((this.canvas.width / TILE.W) + 2) - (2 * inlet),
            h: Math.round((this.canvas.height / TILE.H) + 2) - (2 * inlet)
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
        const rRel = this.roundRel();
        this.ctx.fillStyle = "#50a050";
        this.ctx.fillRect((pos.x - rRel.x) * TILE.W, (pos.y - rRel.y) * TILE.H, TILE.W, TILE.H);
    }

    drawUnit(game: Game, unit: Unit, rel: Position = { x: 0, y: 0 }) {
        const rRel = this.roundRel();
        const image = this.images.get('warrior');
        let x = (unit.pos.x - rRel.x + rel.x) * TILE.W;
        let y = (unit.pos.y - rRel.y + rel.y) * TILE.H;

        this.ctx.drawImage(image!, x, y, TILE.W, TILE.H);

        x += Math.round(TILE.W * 2 / 3) - 0.5;
        y += 0.5;
        const w = Math.round(TILE.W / 3);
        const h = Math.round(TILE.H / 3);
        this.ctx.strokeStyle = 'black';
        this.ctx.fillStyle = unit.nation.color;
        this.ctx.beginPath();
        this.ctx.rect(x, y, w, h);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
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

    drag(rel: Position) {
        this.#rel.x -= (rel.x / (TILE.W * this.zoom * window.devicePixelRatio));
        this.#rel.y -= (rel.y / (TILE.H * this.zoom * window.devicePixelRatio));
    }

    private roundRel() : Position {
        return {
            x: Math.round(this.#rel.x * this.#SCALE.x) / this.#SCALE.x,
            y: Math.round(this.#rel.y * this.#SCALE.y) / this.#SCALE.y,
        }
    }

    scrollIfActiveUnitOutOfScreen(game: Game) {
        if (game.activeUnit) {
            const rect = this.bounds(BOUNDS_INLET);
            if (game.activeUnit.pos.x < rect.x) {
                this.#rel.x -= SCROLL_BY;
                this.draw(game);
            } else if (game.activeUnit.pos.x > (rect.x + rect.w - 1)) {
                this.#rel.x += SCROLL_BY;
                this.draw(game);
            }
            if (game.activeUnit.pos.y < rect.y) {
                this.#rel.y -= SCROLL_BY;
                this.draw(game);
            } else if (game.activeUnit.pos.y > (rect.y + rect.h - 1)) {
                this.#rel.y += SCROLL_BY;
                this.draw(game);
            }
        }
    }

    centerOnUnit(unit: Unit) {
        this.#rel.x = unit.pos.x - (window.innerWidth / TILE.W / this.zoom / window.devicePixelRatio / 2) + 0.5;
        this.#rel.y = unit.pos.y - (window.innerHeight / TILE.H / this.zoom / window.devicePixelRatio / 2) + 0.5;
    }

}
