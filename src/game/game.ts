import IGame, {GameConfig, ICity, Id, IGameState} from "../interfaces/game-interface";
import {P, Rectangle} from "../common/geometry";
import Tile from "./tile";
import Unit from "./unit";
import Nation from "./nation";
import {Building, Direction, Directions, NationType, Terrain, UnitType} from "../interfaces/game-enum";
import City from "./city";
import {BuildingConfig} from "./config";
import {mapTile} from "../interfaces/interface-utils";

export default class Game implements IGame {

    #playerNation?: Nation;
    #selectedUnit : Unit | null = null;
    #nations: Nation[] = [];
    #units: Unit[] = [];
    #cities: City[] = [];
    #year: number = -2000;

    get selectedUnit() : Unit | null { return this.#selectedUnit; }
    get year() { return this.#year; }

    newGame(config: GameConfig): void {
        this.#nations = [new Nation(NationType.Phoenicia)];
        this.#playerNation = this.#nations[0]!;
        this.#units.push(new Unit(P(3, 2), this.#playerNation, UnitType.Warrior));
        this.#units.push(new Unit(P(3, 2), this.#playerNation, UnitType.Warrior));
        this.#cities.push(new City("My city", this.#playerNation, P(3, 2)));
        this.moveUnitToBuilding(this.#units[1]!.id, this.#cities[0]!.id, Building.SpinnersHouse);
        this.#selectedUnit = this.#units[0]!;
    }

    gameState(bounds: Rectangle): IGameState {
        const state: IGameState = {
            tiles: [],
            tileIndex: {},
            year: this.#year,
            selectedUnitMovesLeft: this.#selectedUnit ? this.#selectedUnit.movesLeft : null,
        };

        // tiles
        let i = 0;
        for (let x = bounds.p.x; x < (bounds.p.x + bounds.w); x++) {
            state.tileIndex[x] = {};
            for (let y = bounds.p.y; y < (bounds.p.y + bounds.h); y++) {    // TODO - limit by map size
                state.tileIndex[x]![y] = i++;
                state.tiles.push({ position: { x, y }, tile: this.tile(x, y).toTileObject(), units: [] });
            }
        }

        // units
        for (const unit of this.#units.filter(u => !u.workingInCity)) {
            const tile = mapTile(state, unit.position.x, unit.position.y);
            if (tile)
                tile.units.push(unit.toUnitObject(unit.isEqual(this.#selectedUnit)));
        }
        for (let tile of state.tiles)
            tile.units.sort((unitA, unitB) => unitA.zOrder - unitB.zOrder);

        // cities
        for (const city of this.#cities.filter(c => bounds.contains(c.position))) {
            const tile = state.tiles[state.tileIndex[city.position.x]![city.position.y]!]!;
            tile.city =  city.toCityObject()
        }

        return state;
    }

    private tile(x: number, y: number) : Tile {
        return new Tile(Terrain.Grassland);  // TODO
    }

    canMoveSelectedUnit(dir: Direction): boolean {
        if (this.#selectedUnit === null)
            return false;

        // TODO - check map bounds

        const futurePos = this.#selectedUnit.position.plus(Directions[dir]);
        const moveCost = this.tile(futurePos.x, futurePos.y).moveCost;
        if (moveCost > this.#selectedUnit.movesLeft)
            return false;

        return true;
    }

    moveSelectedUnit(dir: Direction): void {
        if (this.#selectedUnit) {
            const unit = this.selectedUnit!;
            unit.move(dir);
            unit.reduceMovesBy(this.tile(unit.position.x, unit.position.y).moveCost);
            if (!unit.canMove())
                this.selectNextUnit(true);
        }
    }

    selectNextUnit(autoEndRound: boolean): Unit | null {
        let nextSelected : Unit | null

        const findNextAbleUnit = (i : number) : Unit | null => {
            for (let j = i; j < this.#units.length; ++j) {
                if (this.#units[j]!.canMove())
                    return this.#units[j]!;
            }
            return null;
        };

        if (this.#selectedUnit === null) {
            nextSelected = findNextAbleUnit(0);
        } else {
            const i = this.#units.findIndex(unit => unit.isEqual(this.#selectedUnit))!;
            nextSelected = findNextAbleUnit(i + 1);
            if (nextSelected === null)
                nextSelected = findNextAbleUnit(0);
        }

        if (nextSelected === null) {
            if (autoEndRound)
                this.newRound();
        } else {
            this.#selectedUnit = nextSelected!;
        }

        return this.#selectedUnit;
    }

    selectUnit(unitId: Id): void {
        const unit = this.#units.find(unit => unit.id === unitId);
        if (unit && unit.canMove()) {
            this.#selectedUnit = unit;
        }
    }

    newRound() : void {
        this.#units.forEach(unit => unit.newRound());
        this.#year += 0.5;
        this.#selectedUnit = null;
        this.selectNextUnit(false);
    }

    cityInTile(x: number, y: number): ICity | null {
        const city = this.#cities.find(city => city.position.x === x && city.position.y === y);
        return city ? city.toCityObject() : null;
    }

    numberOfWorkersInBuilding(building: Building) : number {
        return BuildingConfig[building as Building].numberOfWorkers;
    }

    removeUnitFromCity(unitId: Id, cityId: Id): [Unit, City] {
        const unit = this.#units.find(u => u.id === unitId);
        if (unit === undefined)
            throw new Error("This unit does not exist.");
        const city = this.#cities.find(c => c.id === cityId);
        if (city === undefined)
            throw new Error("This city does not exist.");
        unit.workingInCity = false;
        city.removeUnit(unit);
        return [unit, city];
    }

    moveUnitToBuilding(unitId: string, cityId: string, building: Building): void {
        const [unit, city] = this.removeUnitFromCity(unitId, cityId);
        city.addUnitToBuilding(unit, building);
        unit.workingInCity = true;
    }

    dump(): void {
        console.log({
            units: this.#units,
            cities: this.#cities,
        });
    }

}
