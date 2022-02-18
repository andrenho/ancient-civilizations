import Unit from "./unit";
import Tile from "./tile";
import {Terrain, UnitType} from "./static";
import {Position} from "../common/geometry";

export default class Game {
    readonly units: Unit[] = [];
    readonly #activeUnit: Unit | undefined;
    #year: number = 2000;

    constructor() {
        this.units.push(new Unit({ x: 0, y : 0 }, UnitType.UNIT));
        this.#activeUnit = this.units[0];
    }

    get activeUnit() { return this.#activeUnit; }
    get year() { return this.#year; }

    tile(pos: Position) : Tile {
        return { terrain: Terrain.GRASSLAND };
    }

    moveActiveUnit(rel: Position) : Unit | undefined {
        const unit = this.#activeUnit;
        if (unit) {
            // TODO - move this to unit
            [unit.pos.x, unit.pos.y] = [unit.pos.x + rel.x, unit.pos.y + rel.y];
            unit.steps -= 1;
        }
        return unit;
    }
}