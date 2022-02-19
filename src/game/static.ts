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

// 
// NATIONS
//

export enum NationDef {
    PHOENICIA,
}

export interface Nation {
    id: NationDef,
    name: string,
    color: string,
    isPlayerNation: boolean,
}

export const Nations: Nation[] = [];
Nations[NationDef.PHOENICIA] = <Nation> { id: NationDef.PHOENICIA, name: "Phoenicia", color: "#a04040", isPlayerNation: false };
