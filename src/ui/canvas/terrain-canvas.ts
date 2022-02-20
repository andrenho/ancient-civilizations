import Canvas from "./canvas";
import Game from "../../game/game";
import {Position} from "../../common/geometry";

export default class TerrainCanvas extends Canvas {

    constructor(zoom: number) {
        super("terrain", zoom, false);
    }

    override async load_images() {
        await this.load_image_list({ grass: 'img/grass.png' });
    }

    redraw(game: Game, rel: Position): void {
        const bounds = this.bounds(rel, { x: -1, y: -1 });
        for (let x = bounds.x; x < (bounds.x + bounds.w); ++x)
            for (let y = bounds.y; y < (bounds.y + bounds.h); ++y)
                this.drawTile(game, rel, { x, y });
    }

    protected drawTile(game: Game, rel: Position, pos: Position) {
        const image = this.images.get('grass');
        const p = this.tileToPx(pos, rel);
        this.ctx.drawImage(image!, p.x, p.y, this.TILE.W, this.TILE.H);
    }
}