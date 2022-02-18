import {Position} from "../common/geometry";
import {UnitType, UnitTypes} from "./static";

export default class Unit {

    #pos: Position;
    #moves: number = 0;

    constructor(pos: Position, public readonly type: UnitType) {
        this.#pos = pos;
        this.newTurn();
    }

    get pos() { return this.#pos; }
    get moves() { return this.#moves; }

    moveBy(x: number, y: number, steps: number) : boolean {
        if (steps > this.#moves)
            return false;
        this.#pos.x += x;
        this.#pos.y += y;
        this.#moves -= steps;
        if (this.#moves < 0)
            this.#moves = 0;
        return true;
    }

    isFromPlayerNation() : boolean {
        return true;  // TODO
    }

    hasMovesLeft() : boolean {
        return this.#moves > 0;
    }

    newTurn() {
        this.#moves = UnitTypes[this.type]!.moves;
    }
}