import {GameObjectType, UnitInterface} from "../interfaces/game-interface";
import Nation from "./nation";
import {UnitType} from "./static";

export default class Unit implements UnitInterface {
    static idCounter : number = 0;

    kind: GameObjectType.Unit = GameObjectType.Unit;

    readonly #id : number;

    constructor(readonly nation: Nation, readonly unitType: UnitType) {
        this.#id = Unit.idCounter++;
    }

    isEqual(object: any) : boolean {
        if (!(object instanceof Unit))
            return false;
        return (object as Unit).#id === this.#id;
    }
}
