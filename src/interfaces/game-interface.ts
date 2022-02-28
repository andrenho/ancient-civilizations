import {Rectangle} from "../common/geometry";
import {Buildings, Direction, Goods, NationType, Terrain, UnitType} from "./game-enum";

//
// CITY INTERFACE
//

export type CityDetails = {
    id: Id,
    name: string,
    nation: NationType,
    buildings: {
        type: Buildings,
        units: {
            id: Id,
            type: UnitType,
        }[],
    }[],
    goods: { [key in Goods]: number },
}

//
// GAME OBJECTS
//

export type Id = string;

export type TileObject = {
    terrain: Terrain,
}

export type UnitObject = {
    id: Id,
    nation: NationType,
    type: UnitType,
    selected?: boolean,
}

export type CityObject = {
    id: Id,
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

//
// GAME INTERFACE
//

export type GameConfig = {
}

export default interface GameInterface {

    newGame(config: GameConfig) : void;

    gameState(bounds: Rectangle) : GameState;

    canMoveSelectedUnit(dir: Direction) : boolean;
    moveSelectedUnit(dir: Direction) : void;

    unitsInTile(x: number, y: number) : UnitObject[];
    selectUnit(unitId: Id) : void;

    cityInTileDetails(x: number, y: number) : CityDetails | null;

    selectNextUnit(autoEndRound: boolean): void;
    newRound() : void;
}
