import {CityInterface, GameObjectType} from "../interfaces/game-interface";
import {Point} from "../common/geometry";
import Nation from "./nation";

export default class City implements CityInterface {
    kind: GameObjectType.City = GameObjectType.City;

    #name: string;

    constructor(name: string, readonly nation: Nation, readonly position: Point) {
        this.#name = name;
    }

    get name() { return this.#name; }
}