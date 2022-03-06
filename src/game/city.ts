import {ICity, ICityGood, Id} from "../interfaces/game-interface";
import {Point} from "../common/geometry";
import Nation from "./nation";
import Unit from "./unit";
import {Building, Good} from "../interfaces/game-enum";
import {v4 as uuidv4} from 'uuid';
import {BuildingConfig, CityStartingBuildings} from "./config";

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

    addUnitToBuilding(unit: Unit, building: Building) {
        if (!unit.position.isEqual(this.position))
            throw new Error("Unit is not outside of city gates.");
        if (!this.#buildings[building])
            throw new Error("This building does not exist in this city.");
        if (this.#buildings[building]!.units.length === BuildingConfig[building].numberOfWorkers)
            throw new Error("This building has too many workers already.");
        this.#buildings[building]!.units.push(unit);
    }

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
