import {ICity, ICityGood, Id} from "../interfaces/game-interface";
import {Point} from "../common/geometry";
import Nation from "./nation";
import Unit from "./unit";
import {Building, Good} from "../interfaces/game-enum";
import {v4 as uuidv4} from 'uuid';
import {CityStartingBuildings} from "./config";

type CityBuilding = {
    units: Unit[],
}

export default class City {

    readonly id : Id = uuidv4();
    #name: string;
    #buildings : { [key in Building]? : CityBuilding } = {};
    #goods : { [key in Good] : ICityGood } = {
        [Good.Wool]: { amount: 0, production: 0 },
        [Good.OliveOil]: { amount: 0, production: 0 },
    };

    constructor(name: string, readonly nation: Nation, readonly position: Point) {
        this.#name = name;
        for (const b of CityStartingBuildings)
            this.#buildings[b] = { units: [] };
    }

    get name() { return this.#name; }

    toCityObject() : ICity {
        return {
            id: this.id,
            name: this.#name,
            nation: this.nation.nationType,
            buildings: Object.entries(this.#buildings).map(([building, info]) => ({
                type: Number(building) as Building,
                units: info.units.map(unit => ({ id: unit.id, type: unit.unitType })),
            })),
            goods: this.#goods,
        };
    }

}
