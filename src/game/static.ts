//
// TERRAINS
//

export enum Terrain {
    GRASSLAND
}

//
// UNIT TYPE
//

interface UnitTypeConfig {
    moves: number;
}

export enum UnitType {
    UNIT
}

export const UnitTypes: UnitTypeConfig[] = [];
UnitTypes[UnitType.UNIT] = { moves: 2 };
