import {NationInterface} from "../interfaces/game-interface";
import {NationType} from "./static";

export default class Nation implements NationInterface {

    constructor(readonly nationType: NationType) {
    }

}