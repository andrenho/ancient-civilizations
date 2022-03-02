import GameInterface, {CityDetails, GameConfig, GameState, Id, MapTile, UnitObject} from "../interfaces/game-interface";
import {P, Rectangle} from "../common/geometry";
import Tile from "./tile";
import Unit from "./unit";
import Nation from "./nation";
import {Buildings, Direction, Directions, NationType, Terrain, UnitType} from "../interfaces/game-enum";
import City from "./city";
import {BuildingConfig} from "./config";

export default class Game implements GameInterface {

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
        this.#units.push(new Unit(P(1, 1), this.#playerNation, UnitType.Warrior));
        this.#units.push(new Unit(P(3, 3), this.#playerNation, UnitType.Warrior));
        this.#cities.push(new City("My city", this.#playerNation, P(3, 2)));
        this.#selectedUnit = this.#units[0]!;
    }

    gameState(bounds: Rectangle): GameState {
        const state: GameState = {
            tiles: [],
            year: this.#year,
            selectedUnitMovesLeft: this.#selectedUnit ? this.#selectedUnit.movesLeft : null,
        };
        for (let x = bounds.p.x; x < (bounds.p.x + bounds.w); x++)   // TODO - limit by map size
            for (let y = bounds.p.y; y < (bounds.p.y + bounds.h); y++)
                state.tiles.push({ position: [x, y], tile: this.tile(x, y).toTileObject() });
        state.tiles.push(...this.#units.filter(u => bounds.contains(u.position)).map(u => <MapTile> {
            position: [u.position.x, u.position.y],
            unit: u.toUnitObject(u.isEqual(this.#selectedUnit))
        }));
        state.tiles.push(...this.#cities.filter(c => bounds.contains(c.position)).map(c => <MapTile> {
            position: [c.position.x, c.position.y],
            city: c.toCityObject()
        }));
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

    unitsInTile(x: number, y: number): UnitObject[] {
        return this.#units.filter(unit => unit.position.x == x && unit.position.y == y).map(unit => unit.toUnitObject());
    }

    newRound() : void {
        this.#units.forEach(unit => unit.newRound());
        this.#year += 0.5;
        this.#selectedUnit = null;
        this.selectNextUnit(false);
    }

    cityInTileDetails(x: number, y: number): CityDetails | null {
        const city = this.#cities.find(city => city.position.x === x && city.position.y === y);
        return city ? city.cityDetails() : null;
    }


    numberOfWorkersInBuilding(building: Buildings) : number {
        console.log(building);
        console.log(BuildingConfig);
        return BuildingConfig[building as Buildings].numberOfWorkers;
    }

}
