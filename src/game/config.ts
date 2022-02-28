import {Building, Terrain, UnitType} from "../interfaces/game-enum";

type UnitTypeConfigType = {
    moves: number,
};

type TerrainConfigType = {
    moveCost: number,
};

export const UnitTypeConfig : { [key in UnitType]: UnitTypeConfigType } = {
    [UnitType.Warrior]: { moves: 2 },
}

export const TerrainConfig : { [key in Terrain]: TerrainConfigType } = {
    [Terrain.Grassland]: { moveCost: 1 },
}

export const CityStartingBuildings : Building[] = [
    Building.SpinnersHouse, Building.OliveOilPress,
];