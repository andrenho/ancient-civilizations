import Unit from "./unit";
import Tile from "./tile";
import {Terrain} from "./static";
import {Position} from "../common/geometry";

export default class Game {
    units: Unit[] = [];
    activeUnit: number = 0;

    constructor() {
        this.units.push(new Unit({ x: 0, y : 0 }));
    }

    tile(pos: Position) : Tile {
        return { terrain: Terrain.GRASSLAND };
    }

    moveActiveUnit(rel: Position, callbackIfPossible: (unit: Unit) => void) {
        const unit = this.units[this.activeUnit];
        if (unit) {
            callbackIfPossible(unit);
            [unit.pos.x, unit.pos.y] = [unit.pos.x + rel.x, unit.pos.y + rel.y];
        }
    }
}