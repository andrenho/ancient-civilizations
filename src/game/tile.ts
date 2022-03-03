import {ITile} from "../interfaces/game-interface";
import {Terrain} from "../interfaces/game-enum";
import {TerrainConfig} from "./config";

export default class Tile {

    constructor(readonly terrain: Terrain) {}

    get moveCost() : number {
        return TerrainConfig[this.terrain].moveCost;
    }

    toTileObject() : ITile {
        return { terrain: this.terrain };
    }
}
