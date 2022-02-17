import UI from './ui/ui';

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    ui.hello();

    /*
    const canvas = <HTMLCanvasElement> document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    ctx.font = "30px Arial";
    ctx.fillText("Hello world!", 10, 50);

    const img = new Image();
    img.onload = () => ctx.drawImage(img, 5, 100);
    img.src = 'img/warrior.png';
     */
});