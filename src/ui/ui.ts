import Game from "../game/game";

const IMAGE_LIST = {
    warrior: 'img/warrior.png',
};

export default class UI {
    canvas = <HTMLCanvasElement> document.getElementById("canvas");
    ctx = this.canvas.getContext("2d");
    images = new Map<string, HTMLImageElement>();
    game: Game;

    constructor(game: Game) {
        this.game = game;
        window.addEventListener('resize', () => { this.resize(); this.drawMap(); });
        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth / 2;
        this.canvas.height = window.innerHeight / 2;
        this.canvas.style.width = `${window.innerWidth}px`
        this.canvas.style.height = `${window.innerHeight}px`
        console.log('resize!');
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

    drawMap() {
        this.ctx.font = "30px Arial";
        this.ctx.fillText("Hello world!", 10, 50);

        this.ctx.drawImage(this.images.get('warrior'), 5, 100);
    }
}