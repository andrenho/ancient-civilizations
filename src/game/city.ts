import {Nation} from "./static";
import {Position} from "../common/geometry";

export default class City {

    constructor(readonly nation: Nation, readonly pos: Position, readonly name: String) {
    }

}