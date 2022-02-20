import Game from "../../game/game";
import {Position, Rectangle} from "../../common/geometry";

export default abstract class Canvas {

    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected images = new Map<string, HTMLImageElement>();

    protected readonly TILE = { W: 32, H: 32 };

    protected constructor(canvasName: string, protected zoom: number, transparent : boolean = true) {
        this.canvas = document.getElementById(canvasName)! as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d", { alpha: transparent })!;
        this.resize();
    }

    async load_images() : Promise<void> { /* implement this */ }

    abstract redraw(game: Game, rel: Position) : void;

    resize() {
        this.canvas.width = window.innerWidth / this.zoom / window.devicePixelRatio;
        this.canvas.height = window.innerHeight / this.zoom / window.devicePixelRatio;
        this.canvas.style.width = `${window.innerWidth}px`
        this.canvas.style.height = `${window.innerHeight}px`
    }

    protected async load_image_list(images: { [key: string]: string }) : Promise<void> {
        const image_load = (name: string, url: string) : Promise<[string, HTMLImageElement]> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.addEventListener('load', () => resolve([name, img]));
                img.addEventListener('error', () => reject(new Error(`Failed to load ${url}.`)));
                img.src = url;
            });
        };

        const imagePromises : Promise<[string, HTMLImageElement]>[] = [];
        for (const imageName in images)
            imagePromises.push(image_load(imageName, images[imageName]!));

        return new Promise(((resolve, reject) => {
            Promise.all(imagePromises).then(values => {
                for (const [imageName, url] of values)
                    this.images.set(imageName, url);
                resolve();
            }).catch(err => reject(err));
        }));
    }

    protected bounds(rel: Position, inlet: Position = { x: 0, y: 0 }) : Rectangle {
        return {
            x: Math.round(-rel.x / this.TILE.W + inlet.x),
            y: Math.round(-rel.y / this.TILE.H + inlet.y),
            w: Math.round(this.canvas.width / this.TILE.W - (2 * inlet.x)),
            h: Math.round(this.canvas.height / this.TILE.H - (2 * inlet.y))
        }
    }

    protected tileToPx(tilePos: Position, rel: Position) : Position {
        return {
            x: Math.floor(tilePos.x * this.TILE.W + rel.x),
            y: Math.floor(tilePos.y * this.TILE.H + rel.y)
        };
    }
}