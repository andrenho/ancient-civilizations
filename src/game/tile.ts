import {GameObjectType, TileInterface} from "../interfaces/game-interface";
import Terrain from "./terrain";

export default class Tile implements TileInterface {

    constructor(readonly terrain: Terrain) {}

    kind: GameObjectType.Tile = GameObjectType.Tile
}