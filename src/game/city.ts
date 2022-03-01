import {CityDetails, CityObject, Id} from "../interfaces/game-interface";
import {Point} from "../common/geometry";
import Nation from "./nation";
import Unit from "./unit";
import {Buildings, Goods} from "../interfaces/game-enum";
import {CityStartingBuildings} from "./config";
import {v4 as uuidv4} from 'uuid';

type CityBuilding = {
    available: boolean,
    units: Unit[],
}

export default class City {

    readonly id : Id = uuidv4();
    #name: string;
    #buildings = new Map<Buildings, CityBuilding>()
    #goods = new Map<Goods, number>();

    constructor(name: string, readonly nation: Nation, readonly position: Point) {
        this.#name = name;
        for (const building in Buildings) {
            this.#buildings.set(building as Buildings, { available: building in CityStartingBuildings, units: [] });
        }
        for (const good in Goods) {
            this.#goods.set(good as Goods, 0);
        }
    }

    get name() { return this.#name; }
    get buildings() : Buildings[] { return Array.from(this.#buildings).map((kv) => kv[0]); }

    units_in_building(b: Buildings) : Unit[] {
        const building = this.#buildings.get(b);
        if (!building || !building.available)
            return [];
        return building.units;
    }

    toCityObject() : CityObject {
        return {
            id: this.id,
            name: this.#name,
            nation: this.nation.nationType,
        };
    }

    cityDetails() : CityDetails {
        return <CityDetails> {
            id: this.id,
            name: this.name,
            nation: this.nation.nationType,
            buildings: this.buildings.map(building => ({
                type: building,
                units: this.#buildings.get(building)!.units.map(unit => ({ id: unit.id, type: unit.unitType }))
            })),
            goods: Array.from(this.#goods.entries()).reduce((main, [k, v]) => ({...main, [k]: v}), {})
        };
    }
}