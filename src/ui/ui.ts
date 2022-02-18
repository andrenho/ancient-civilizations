import Canvas from "./canvas";
import Game from "../game/game";

export default class UI extends Canvas {
    constructor() {
        super("ui", 1);
    }

    draw(game: Game) {
        this.ctx.font = '32px Adonais';
        this.ctx.fillStyle = 'black';
        const x = this.canvas.width - 280;   // TODO - don't use magic numbers
        let y = this.canvas.height - 120;
        this.ctx.clearRect(x, y, 280, 120);
        if (game.activeUnit)
            this.ctx.fillText(`Steps: ${game.activeUnit.steps}`, x, y += 40);
        this.ctx.fillText(`Year: ${game.year} B.C.`, x, y += 40);
    }
}