import {UnitType} from "../interfaces/game-enum";

export function charForUnitType(unitType: UnitType) : string {
    switch (unitType) {
        case UnitType.Warrior: return "W";
    }
    return "";
}

