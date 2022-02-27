import {NationInterface} from "../interfaces/game-interface";
import {NationType} from "../interfaces/game-enum";

export default class Nation implements NationInterface {

    constructor(readonly nationType: NationType) {
    }

}