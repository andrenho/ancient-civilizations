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

const unitTypes : UnitTypeConfig[] = [];
unitTypes[UnitType.UNIT] = { steps: 2 };
