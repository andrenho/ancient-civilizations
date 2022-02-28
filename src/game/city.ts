import {CityDetails, CityObject} from "../interfaces/game-interface";
import {Point} from "../common/geometry";
import Nation from "./nation";
import Unit from "./unit";
import {Building} from "../interfaces/game-enum";
import {CityStartingBuildings} from "./config";

type CityBuilding = {
    available: boolean,
    units: Unit[],
}

export default class City {

    #name: string;
    #buildings = new Map<Building, CityBuilding>()

    constructor(name: string, readonly nation: Nation, readonly position: Point) {
        this.#name = name;
        for (const building in Building) {
            this.#buildings.set(building as Building, { available: building in CityStartingBuildings, units: [] });
        }
    }

    get name() { return this.#name; }
    get buildings() : Building[] { return Array.from(this.#buildings).map((kv) => kv[0]); }

    units_in_building(b: Building) : Unit[] {
        const building = this.#buildings.get(b);
        if (!building || !building.available)
            return [];
        return building.units;
    }

    toCityObject() : CityObject {
        return {
            name: this.#name,
            nation: this.nation.nationType,
        };
    }

    cityDetails() : CityDetails {
        return <CityDetails> {
            name: this.name,
            nation: this.nation.nationType,
            buildings: this.buildings.map(building => ({
                type: building,
                units: this.#buildings.get(building)!.units.map(unit => ({ id: unit.id, type: unit.unitType }))
            })),
        };
    }
}