import {GameObjectType, UnitInterface} from "../interfaces/game-interface";

export default class Unit implements UnitInterface {
    kind: GameObjectType.Unit = GameObjectType.Unit;
}