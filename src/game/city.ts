import {ICity, ICityGood, ICityTile, Id} from "../interfaces/game-interface";
import {Point} from "../common/geometry";
import Nation from "./nation";
import Unit from "./unit";
import {Building, Good} from "../interfaces/game-enum";
import {v4 as uuidv4} from 'uuid';
import {BuildingConfig, CityStartingBuildings} from "./config";
import Messges from "../interfaces/messges";
import Messages from "../interfaces/messges";

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
    #tiles : ICityTile[] = [];

    constructor(name: string, readonly nation: Nation, readonly position: Point) {
        this.#name = name;
        for (const b of CityStartingBuildings)
            this.#buildings[b] = { units: [] };
    }

    get name() { return this.#name; }

    addUnitToBuilding(unit: Unit, building: Building) {
        if (!unit.position.isEqual(this.position))
            throw new Error(Messges.unitNotOutOfGates);
        if (!this.#buildings[building])
            throw new Error(Messges.buildingDoesNotExist);
        if (this.#buildings[building]!.units.length === BuildingConfig[building].numberOfWorkers)
            throw new Error(Messges.buildingTooManyWorkers);
        this.#buildings[building]!.units.push(unit);
    }

    addUnitToTile(unit: Unit, x: number, y: number) {
        if (this.#tiles.find(t => t.x === x && t.y === y) !== undefined)
            throw new Error(Messages.tileAlreadyHasUnit);
        this.#tiles.push({ x, y, unit: unit.toUnitObject(false) });
    }

    removeUnit(unit: Unit) {
        for (const [, cityBuilding] of Object.entries(this.#buildings))
            cityBuilding.units = cityBuilding.units.filter(u => u.id !== unit.id);
        this.#tiles = this.#tiles.filter(tile => tile.unit.id !== unit.id);
    }

    toCityObject() : ICity {
        return {
            id: this.id,
            name: this.#name,
            nation: this.nation.nationType,
            buildings: Object.entries(this.#buildings).map(([building, info]) => ({
                type: building as Building,
                units: info.units.map(unit => unit.toUnitObject(false))
            })),
            goods: this.#goods,
            tiles: this.#tiles,
        };
    }
}
