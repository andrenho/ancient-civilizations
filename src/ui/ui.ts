export default class UI {
    canvas = <HTMLCanvasElement> document.getElementById("canvas");
    ctx = this.canvas.getContext("2d");

    constructor() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    draw() {
        this.ctx.font = "30px Arial";
        this.ctx.fillText("Hello world!", 10, 50);

        const img = new Image();
        img.onload = () => this.ctx.drawImage(img, 5, 100);
        img.src = 'img/warrior.png';
    }
}