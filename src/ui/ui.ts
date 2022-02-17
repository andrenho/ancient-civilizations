import Game from "../game/game";
import {include_point, Position, Rectangle} from "../common/geometry";
import Unit from "../game/unit";

const IMAGE_LIST = {
    warrior: 'img/warrior.png',
};

const TILE = { W: 32, H: 32 };
const ZOOM = 2;
const MOVE_STEPS = 16;

export default class UI {

    canvas  = <HTMLCanvasElement> document.getElementById("canvas");
    ctx     = this.canvas.getContext("2d");
    images  = new Map<string, HTMLImageElement>();
    rel     = <Position> { x: -5, y: -5 };
    blocked = false;

    constructor() {
        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth / ZOOM;
        this.canvas.height = window.innerHeight / ZOOM;
        this.canvas.style.width = `${window.innerWidth}px`
        this.canvas.style.height = `${window.innerHeight}px`
    }

    async load_images() : Promise<void> {
        const image_load = (name: string, url: string) : Promise<[string, HTMLImageElement]> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.addEventListener('load', () => resolve([name, img]));
                img.addEventListener('error', () => reject(new Error(`Failed to load ${url}.`)));
                img.src = url;
            });
        };

        const imagePromises : Promise<[string, HTMLImageElement]>[] = [];
        for (const imageName in IMAGE_LIST) {
            imagePromises.push(image_load(imageName, IMAGE_LIST[imageName as keyof typeof IMAGE_LIST]));
        }

        return new Promise(((resolve, reject) => {
            Promise.all(imagePromises).then(values => {
                for (const [imageName, url] of values)
                    this.images.set(imageName, url);
                resolve();
            }).catch(err => reject(err));
        }));
    }

    bounds() : Rectangle {
        return {
            x: Math.round(this.rel.x - 1),
            y: Math.round(this.rel.y - 1),
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

    drawTerrain(game: Game, bounds: Rectangle) {
        for (let x = bounds.x; x < (bounds.x + bounds.w); ++x) {
            for (let y = bounds.y; y < (bounds.y + bounds.h); ++y) {
                this.ctx.fillStyle = "#50a050";
                this.ctx.fillRect((x - this.rel.x) * TILE.W, (y - this.rel.y) * TILE.H, TILE.W, TILE.H);
            }
        }
    }

    drawUnits(game: Game, bounds: Rectangle) {
        for (const unit of game.units)
            if (include_point(bounds, unit.pos))
                this.drawUnit(game, unit);
    }

    drawUnit(game: Game, unit: Unit, rel: Position = { x: 0, y: 0 }) {
        const image = this.images.get('warrior');
        const x = (unit.pos.x - this.rel.x) * TILE.W;
        const y = (unit.pos.y - this.rel.y) * TILE.H;
        this.ctx.drawImage(image, x, y, TILE.W, TILE.H);
    }

    animateUnitMovement(unit: Unit, dir: Position) {
        this.blocked = true;

        const rel: Position = { x: 0, y: 0 };
        function step() {
            [rel.x, rel.y] = [rel.x + (dir.x / MOVE_STEPS), rel.y + (dir.y / MOVE_STEPS)];
            // ...
        }

        this.blocked = false;
    }
}