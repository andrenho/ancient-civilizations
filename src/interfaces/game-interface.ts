import {Point, Rectangle} from "../common/geometry";
import {Direction, NationType, Terrain, UnitType} from "./game-enum";

export const enum GameObjectType { Tile = 'tile', Unit = 'unit', City = 'city' }

export type UnitId = string;

export type TileObject = {
    terrain: Terrain,
}

export type UnitObject = {
    id: UnitId,
    nation: NationType,
    type: UnitType,
    selected?: boolean,
}

export type CityObject = {
    name: string,
    nation: NationType,
}

export type MapTile = {
    position: [number, number],
    tile?: TileObject,
    unit?: UnitObject,
    city?: CityObject,
}

export type GameState = {
    tiles: MapTile[],
    year: number;
    selectedUnitMovesLeft: number | null;
}

export type GameConfig = {
}

export default interface GameInterface {

    newGame(config: GameConfig) : void;

    gameState(bounds: Rectangle) : GameState;

    canMoveSelectedUnit(dir: Direction) : boolean;
    moveSelectedUnit(dir: Direction) : void;

    unitsInTile(x: number, y: number) : UnitObject[];
    selectUnit(unitId: UnitId) : void;

    selectNextUnit(autoEndRound: boolean): void;
    newRound() : void;
}
