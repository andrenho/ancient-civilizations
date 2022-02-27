import {Point, Rectangle} from "../common/geometry";

export enum GameObjectType { Tile, Unit, City }

export interface NationInterface {
    readonly nationType: string;
}

export interface TileInterface {
    kind: GameObjectType.Tile
    readonly terrain: string;
}

export interface UnitInterface {
    kind: GameObjectType.Unit
    readonly nation: NationInterface;
    isEqual(object: any) : boolean;
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

    get selectedUnit() : UnitInterface | null;
    get selectedUnitMovesLeft() : number | null;
    get year() : number;
}
