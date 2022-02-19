import Game from "../game/game";

export function debug_open(game: Game, on_close: () => void) {
    document.getElementById('debug')!.style.display = 'block';
    document.getElementById('exit-debug')!.onclick = () => {
        document.getElementById('debug')!.style.display = 'none';
        on_close();
    }

    document.getElementById('print-game')!.onclick = () => console.log(game);
}