import {GameObjectType, UnitInterface} from "../interfaces/game-interface";

export default class Unit implements UnitInterface {
    static idCounter : number = 0;

    kind: GameObjectType.Unit = GameObjectType.Unit;

    readonly #id : number;

    constructor() {
        this.#id = Unit.idCounter++;
    }

    isEqual(object: any) : boolean {
        if (!(object instanceof Unit))
            return false;
        return (object as Unit).#id === this.#id;
    }
}
