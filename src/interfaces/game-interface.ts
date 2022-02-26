import {Point, Rectangle} from "../common/geometry";

export enum GameObjectType { Tile, Unit, City }

export interface TileInterface {
    kind: GameObjectType.Tile
    terrain: string;
}

export interface UnitInterface {
    kind: GameObjectType.Unit
}

export interface CityInterface {
    kind: GameObjectType.City
}

export type GameObject = TileInterface | UnitInterface | CityInterface;

export type GameConfig = {
}

export default interface GameInterface {

    newGame(config: GameConfig) : void;

    objects(bounds: Rectangle) : [Point, GameObject][];

}