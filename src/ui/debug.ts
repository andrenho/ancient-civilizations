import Game from "../game/game";
import {Position} from "../common/geometry";
import {UnitType, UnitTypes} from "../game/static";

export function debug_open(game: Game, tilePos: Position, on_close: () => void) {
    const close = () => {
        document.getElementById('debug')!.style.display = 'none';
        on_close();
    };

    document.getElementById('debug')!.style.display = 'block';
    document.getElementById('exit-debug')!.onclick = () => close();

    document.getElementById('print-game')!.onclick = () => { console.log(game); close(); };

    const createUnit = document.getElementById('create-unit')!;
    createUnit.innerText = `Create unit at (${tilePos.x}, ${tilePos.y})`;
    createUnit.onclick = () => {
        game.createUnit(game.playerNation, tilePos, UnitType.UNIT);
        close();
    }
}