import {Position} from "../common/geometry";
import {UnitType, UnitTypes} from "./static";

export default class Unit {

    pos: Position;
    type: UnitType;
    steps: number;

    constructor(pos: Position, type: UnitType) {
        this.pos = pos;
        this.type = type;
        this.steps = UnitTypes[type]!.steps;
    }

}