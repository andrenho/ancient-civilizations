import GameInterface, {GameConfig, GameObject} from "../interfaces/game-interface";
import {P, Point, Rectangle} from "../common/geometry";
import Tile from "./tile";
import Terrain from "./terrain";
import Unit from "./unit";

export default class Game implements GameInterface {

    #selectedUnit : Unit | null = null;
    #units: Unit[] = [];

    selectedUnit() : Unit | null { return this.#selectedUnit; }

    newGame(config: GameConfig): void {
        this.#units.push(new Unit());
        this.#selectedUnit = this.#units[0]!;
    }

    objects(bounds: Rectangle): [Point, GameObject][] {
        const objects : [Point, GameObject][] = [];
        for (let x = 0; x < 30; x++)
            for (let y = 0; y < 30; y++)
                objects.push([P(x, y), new Tile(Terrain.Grassland)]);
        objects.push([P(1, 1), this.#units[0]!]);
        return objects;
    }

}
