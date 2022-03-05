import {Rectangle} from "../common/geometry";
import {Building, Direction, Good, NationType, Terrain, UnitType} from "./game-enum";

export type Id = string;

//
// CITY INTERFACE
//

export type ICityGood = {
    amount: number,
    production: number
};

export type ICityBuilding = {
    type: Building,
    units: {
        id: Id,
        type: UnitType,
    }[],
}

//
// GAME OBJECTS
//

export type ITile = {
    terrain: Terrain,
}

export type IUnit = {
    id: Id,
    nation: NationType,
    type: UnitType,
    selected?: boolean,
}

export type ICity = {
    id: Id,
    name: string,
    nation: NationType,
    buildings: ICityBuilding[],
    goods: { [key in Good]: ICityGood },
}

export type IMapTile = {
    position: [number, number],
    tile: ITile,
    unit?: IUnit,
    city?: ICity,
}

export type IGameState = {
    tiles: IMapTile[],
    tileIndex: { [key: number]: { [ key: number] : number } },
    year: number;
    selectedUnitMovesLeft: number | null;
}

//
// GAME INTERFACE
//

export type GameConfig = {
}

export default interface IGame {

    newGame(config: GameConfig) : void;

    gameState(bounds: Rectangle) : IGameState;

    canMoveSelectedUnit(dir: Direction) : boolean;
    moveSelectedUnit(dir: Direction) : void;
    selectUnit(unitId: Id) : void;

    cityInTile(x: number, y: number) : ICity | null;

    selectNextUnit(autoEndRound: boolean): void;
    newRound() : void;

    numberOfWorkersInBuilding(building: Building) : number;
}
