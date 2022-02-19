import {StringMap} from "../common/types";

export default abstract class Canvas {

    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected images = new Map<string, HTMLImageElement>();

    constructor(canvasName: string, protected zoom: number) {
        this.canvas = document.getElementById(canvasName)! as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d")!;
        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth / this.zoom / window.devicePixelRatio;
        this.canvas.height = window.innerHeight / this.zoom / window.devicePixelRatio;
        this.canvas.style.width = `${window.innerWidth}px`
        this.canvas.style.height = `${window.innerHeight}px`
    }

    async load_images_(images: StringMap) : Promise<void> {
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

}
