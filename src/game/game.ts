import GameInterface, {GameConfig, GameObject} from "../interfaces/game-interface";
import {P, Point, Rectangle} from "../common/geometry";
import Tile from "./tile";
import Terrain from "./terrain";
import Unit from "./unit";
import Nation from "./nation";
import {NationType, UnitType} from "./static";

export default class Game implements GameInterface {

    #playerNation?: Nation;
    #selectedUnit : Unit | null = null;
    #nations: Nation[] = [];
    #units: Unit[] = [];
    #year: number = -2000;

    get selectedUnit() : Unit | null { return this.#selectedUnit; }
    get year() { return this.#year; }

    newGame(config: GameConfig): void {
        this.#nations = [new Nation(NationType.PHOENICIA)];
        this.#playerNation = this.#nations[0]!;
        this.#units.push(new Unit(this.#playerNation, UnitType.WARRIOR));
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

    get selectedUnitMovesLeft(): number | null {
        return 0;
    }

}
