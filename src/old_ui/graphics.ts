import Game from "../game/game";
import {include_point, Position, Rectangle} from "../common/geometry";
import Unit from "../game/unit";
import Canvas from "./canvas";

const IMAGE_LIST= {
    warrior: 'img/warrior.png',
};

const TILE = { W: 32, H: 32 };
const ZOOM = 2;
const BOUNDS_INLET = 3;
const SCROLL_BY = 2;
const MOVE_STEPS = 16;

export default class Graphics extends Canvas {

    #rel        = <Position> { x: 0, y: 0 };
    #blinkState = true;

    readonly #SCALE = { x: TILE.W / this.zoom, y: TILE.H / this.zoom };

    blocked     = false;

    constructor() {
        super("graphics", ZOOM);
    }

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
        const image = this.images.get('warrior');
        const tile = this.tileToPx(unit.pos, rel);

        this.ctx.drawImage(image!, tile.x, tile.y, TILE.W, TILE.H);

        const x = tile.x + Math.round(TILE.W * 2 / 3) - 0.5;
        const y = tile.y + 0.5;
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
        const unit = game.activeUnit;
        if (unit) {
            const rect = this.bounds(BOUNDS_INLET);
            if (unit.pos.x < rect.x) {
                this.#rel.x -= SCROLL_BY;
                this.draw(game);
            } else if (unit.pos.x > (rect.x + rect.w - 1)) {
                this.#rel.x += SCROLL_BY;
                this.draw(game);
            }
            if (unit.pos.y < rect.y) {
                this.#rel.y -= SCROLL_BY;
                this.draw(game);
            } else if (unit.pos.y > (rect.y + rect.h - 1)) {
                this.#rel.y += SCROLL_BY;
                this.draw(game);
            }
        }
    }

    centerOnUnit(unit: Unit) {
        this.#rel.x = unit.pos.x - (window.innerWidth / TILE.W / this.zoom / window.devicePixelRatio / 2) + 0.5;
        this.#rel.y = unit.pos.y - (window.innerHeight / TILE.H / this.zoom / window.devicePixelRatio / 2) + 0.5;
    }

    private tileToPx(pos: Position, rel: Position = { x: 0, y: 0 }) : Position {
        const rRel = this.roundRel();
        return {
            x: (pos.x - rRel.x + rel.x) * TILE.W,
            y: (pos.y - rRel.y + rel.y) * TILE.H
        };
    }

    pxToTile(pxPos: Position) : Position {
        return {
            x: Math.floor((pxPos.x / this.zoom / TILE.W / window.devicePixelRatio) + this.#rel.x),
            y: Math.floor((pxPos.y / this.zoom / TILE.H / window.devicePixelRatio) + this.#rel.y)
        };
    }

    async animateUnitMovement(game: Game, unit: Unit, dir: Position) {

        const drawTileInPos = (pos: Position, exceptUnit: Unit) => {
            this.drawTile(game, pos);
            game.units
                .filter(unit => unit.pos.x === pos.x && unit.pos.y === pos.y && unit !== exceptUnit)
                .forEach(unit => this.drawUnit(game, unit));
        };

        this.blocked = true;
        const pos = this.tileToPx({ x: unit.pos.x - 1, y: unit.pos.y - 1});

        // take a screenshot without the unit
        drawTileInPos(unit.pos, unit);
        drawTileInPos({ x: unit.pos.x - dir.x, y: unit.pos.y - dir.y}, unit);
        const screenshot = this.ctx.getImageData(pos.x, pos.y, TILE.W*3, TILE.H*3);

        await new Promise<void>(resolve => {

            let handleId = 0;

            const rel: Position = { x: -dir.x, y: -dir.y };
            let i = 1;

            let step : () => void;
            step = () => {
                [rel.x, rel.y] = [rel.x + (dir.x / MOVE_STEPS), rel.y + (dir.y / MOVE_STEPS)];

                this.ctx.putImageData(screenshot, pos.x, pos.y);
                this.drawUnit(game, unit, rel);

                if (i < MOVE_STEPS) {
                    handleId = window.requestAnimationFrame(step);   // next animation frame
                } else {
                    window.cancelAnimationFrame(handleId);    // done, let's return
                    this.blocked = false;
                    resolve();
                }
                ++i;
            };
            window.requestAnimationFrame(step);
        });
    }

}
