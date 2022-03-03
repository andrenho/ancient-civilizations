import {CityDetails, CityGood, CityObject, Id} from "../interfaces/game-interface";
import {Point} from "../common/geometry";
import Nation from "./nation";
import Unit from "./unit";
import {Good} from "../interfaces/game-enum";
import {v4 as uuidv4} from 'uuid';
import {iterateEnumValues} from "../common/enums";

type CityBuilding = {
    available: boolean,
    units: Unit[],
}

export default class City {

    readonly id : Id = uuidv4();
    #name: string;
    // #buildings : { [key in Buildings]? : CityBuilding } = {};
    #goods : { [key: number] : CityGood } = {};

    constructor(name: string, readonly nation: Nation, readonly position: Point) {
        this.#name = name;
        /*
        for (const idx in Object.values(Buildings)) {
            this.#buildings[Buildings[idx]] = { available: BuildingConfig[Buildings[idx]] in CityStartingBuildings, units: [] };
        }
         */
        // for (const good in Good)
        for (const good of iterateEnumValues(Good)) {
            this.#goods[good] = { amount: 0, production: 0 };
        }
        console.log(this.#goods);

        // this.#goods.set(good, 0);

    }

    get name() { return this.#name; }
    /*
    get buildings() : Buildings[] { return Array.from(this.#buildings).map((kv) => kv[0]); }

    units_in_building(b: Buildings) : Unit[] {
        const building = this.#buildings.get(b);
        if (!building || !building.available)
            return [];
        return building.units;
    }

     */

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
            buildings: [] /* this.buildings.map(building => ({
                type: building,
                units: this.#buildings.get(building)!.units.map(unit => ({ id: unit.id, type: unit.unitType }))
            })) */,
            goods: this.#goods,
        };
    }
}
