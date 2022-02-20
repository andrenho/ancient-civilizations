import Canvas from "./canvas";
import Game from "../../game/game";
import {Position} from "../../common/geometry";

export default class UnitsCanvas extends Canvas {

    constructor(zoom: number) {
        super("units", zoom);
    }

    override async load_images() {
        await this.load_image_list({ warrior: 'img/warrior.png' });
    }

    redraw(game: Game, rel: Position): void {
        const bounds = this.bounds(rel, { x: -1, y: -1 });
        for (const unit of game.units_in(bounds)) {
            const image = this.images.get('warrior');
            const p = this.tileToPx(unit.pos, rel);
            this.ctx.drawImage(image!, p.x, p.y, this.TILE.W, this.TILE.H);
        }
    }

}