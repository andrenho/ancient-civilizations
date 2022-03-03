import {Buildings, Terrain, UnitType} from "../interfaces/game-enum";

type UnitTypeConfigType = {
    moves: number,
};

type TerrainConfigType = {
    name: string,
    moveCost: number,
};

type BuildingConfigType = {
    name: string,
    numberOfWorkers: number;
};

export const UnitTypeConfig : { [key in UnitType]: UnitTypeConfigType } = {
    [UnitType.Warrior]: { moves: 2 },
}

export const TerrainConfig : { [key in Terrain]: TerrainConfigType } = {
    [Terrain.Grassland]: { name: "Grassland", moveCost: 1 },
}

export const BuildingConfig : { [key in Buildings]: BuildingConfigType } = {
    [Buildings.SpinnersHouse]: { name: "Spinner's House", numberOfWorkers: 3 },
    [Buildings.OliveOilPress]: { name: "Olive Oil Press", numberOfWorkers: 3 },
};

export const CityStartingBuildings : Buildings[] = [
    Buildings.SpinnersHouse, Buildings.OliveOilPress,
];
