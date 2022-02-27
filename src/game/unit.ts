import {GameObjectType, UnitInterface} from "../interfaces/game-interface";
import Nation from "./nation";
import {Direction, Directions, UnitType} from "../interfaces/game-enum";
import {Point} from "../common/geometry";
import {UnitTypeConfig} from "./config";

export default class Unit implements UnitInterface {

    static idCounter : number = 0;

    kind: GameObjectType.Unit = GameObjectType.Unit;

    readonly #id : number;
    #position: Point;
    #movesLeft: number;

    constructor(position: Point, readonly nation: Nation, readonly unitType: UnitType) {
        this.#id = Unit.idCounter++;
        this.#position = position;
        this.#movesLeft = 0;
        this.newRound();
    }

    get position() { return this.#position; }
    get movesLeft() { return this.#movesLeft; }

    move(dir: Direction) {
        this.#position = this.#position.plus(Directions[dir]);
    }

    reduceMovesBy(moveCost: number) {
        this.#movesLeft -= moveCost;
        if (this.#movesLeft < 0)
            this.#movesLeft = 0;
    }

    newRound() {
        this.#movesLeft = UnitTypeConfig[this.unitType].moves;
    }

    isEqual(object: any) : boolean {
        if (!(object instanceof Unit))
            return false;
        return (object as Unit).#id === this.#id;
    }
}
