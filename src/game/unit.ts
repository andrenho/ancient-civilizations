import {Position} from "../common/geometry";
import {UnitType, UnitTypes} from "./static";

export default class Unit {

    steps: number;

    constructor(public pos: Position, public readonly type: UnitType) {
        this.steps = UnitTypes[type]!.steps;
    }

}