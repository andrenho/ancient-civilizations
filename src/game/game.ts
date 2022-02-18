import Unit from "./unit";
import Tile from "./tile";
import {Terrain, UnitType} from "./static";
import {Position} from "../common/geometry";

export default class Game {
    units: Unit[] = [];
    activeUnit: Unit | undefined;

    constructor() {
        this.units.push(new Unit({ x: 0, y : 0 }, UnitType.UNIT));
        this.activeUnit = this.units[0];
    }

    tile(pos: Position) : Tile {
        return { terrain: Terrain.GRASSLAND };
    }

    moveActiveUnit(rel: Position) : Unit | undefined {
        const unit = this.activeUnit;
        if (unit)
            [unit.pos.x, unit.pos.y] = [unit.pos.x + rel.x, unit.pos.y + rel.y];
        return unit;
    }
}