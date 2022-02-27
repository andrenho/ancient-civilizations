import {NationInterface} from "../interfaces/game-interface";

export enum NationType {
    PHOENICIA = 'phoenicia',
    EGYPT = 'egypt',
}

export default class Nation implements NationInterface {

    constructor(readonly nationType: NationType) {
    }

}