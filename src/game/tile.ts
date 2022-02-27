import {GameObjectType, TileInterface} from "../interfaces/game-interface";
import {Terrain} from "../interfaces/game-enum";
import {TerrainConfig} from "./config";

export default class Tile implements TileInterface {

    constructor(readonly terrain: Terrain) {}

    get moveCost() : number {
        return TerrainConfig[this.terrain].moveCost;
    }

    kind: GameObjectType.Tile = GameObjectType.Tile
}