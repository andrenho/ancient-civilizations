import Unit from "./unit";
import Tile from "./tile";
import {Terrain, UnitType} from "./static";
import {Position} from "../common/geometry";

export default class Game {
    readonly units: Unit[] = [];
    #activeUnit: Unit | null;
    #year: number = 2000;

    constructor() {
        this.units.push(new Unit({ x: 0, y : 0 }, UnitType.UNIT));
        this.units.push(new Unit({ x: 3, y : 2 }, UnitType.UNIT));
        this.#activeUnit = this.units[0]!;
    }

    get activeUnit() { return this.#activeUnit; }
    get year() { return this.#year; }

    tile(pos: Position) : Tile {
        return { terrain: Terrain.GRASSLAND };
    }

    moveActiveUnit(rel: Position) : Unit | null {
        const unit = this.#activeUnit;
        // TODO - check if can move, calculate steps
        if (unit && unit.moveBy(rel.x, rel.y, 1)) {
            if (!unit.hasMovesLeft()) {
                this.wait_for_next_unit();
                if (!this.#activeUnit)
                    this.newTurn();
            }
            return unit;
        }
        return null;
    }

    private availableUnits() : Unit[] {
        return this.units.filter(unit => unit.isFromPlayerNation() && unit.hasMovesLeft());
    }

    private next_unit() : Unit | null {
        const units = this.availableUnits();
        if (units.length == 0)
            return null;
        else if (units.length == 1)
            return units[0]!;

        // find current unit
        let current = -1;
        if (this.#activeUnit)
            current = units.findIndex((unit) => unit == this.#activeUnit);

        // find next unit
        let next = (current + 1) % this.units.length;
        return units[next]!;
    }

    wait_for_next_unit() {
        this.#activeUnit = this.next_unit();
    }

    newTurn() {
        this.#year -= 0.5;
        this.units.forEach((unit) => unit.newTurn());
        this.wait_for_next_unit();
    }
}