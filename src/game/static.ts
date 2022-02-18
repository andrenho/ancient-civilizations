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
    steps: number;
}

export enum UnitType {
    UNIT
}

export const UnitTypes: UnitTypeConfig[] = [];
UnitTypes[UnitType.UNIT] = { steps: 2 };
