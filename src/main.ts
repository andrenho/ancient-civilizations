document.addEventListener('DOMContentLoaded', () => {
    const canvas = <HTMLCanvasElement> document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    ctx.font = "30px Arial";
    ctx.fillText("Hello world!", 10, 50);
});