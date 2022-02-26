import GameInterface, {GameConfig, GameObject} from "../interfaces/game-interface";
import {P, Point, Rectangle} from "../common/geometry";
import Tile from "./tile";
import Terrain from "./terrain";
import Unit from "./unit";

export default class Game implements GameInterface {

    newGame(config: GameConfig): void {
        // TODO
    }

    objects(bounds: Rectangle): Map<Point, GameObject[]> {
        const map = new Map<Point, GameObject[]>();
        for (let x = 0; x < 30; x++)
            for (let y = 0; y < 30; y++)
                map.set(P(x, y), [new Tile(Terrain.Grassland)]);
        console.log(P(1,1).toString());
        map.get(P(1, 1))!.push(new Unit());
        return map;
    }

}