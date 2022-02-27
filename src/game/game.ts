import GameInterface, {GameConfig, GameObject} from "../interfaces/game-interface";
import {P, Point, Rectangle} from "../common/geometry";
import Tile from "./tile";
import Unit from "./unit";
import Nation from "./nation";
import {Direction, Directions, NationType, Terrain, UnitType} from "../interfaces/game-enum";

export default class Game implements GameInterface {

    #playerNation?: Nation;
    #selectedUnit : Unit | null = null;
    #nations: Nation[] = [];
    #units: Unit[] = [];
    #year: number = -2000;

    get selectedUnit() : Unit | null { return this.#selectedUnit; }
    get year() { return this.#year; }

    newGame(config: GameConfig): void {
        this.#nations = [new Nation(NationType.Phoenicia)];
        this.#playerNation = this.#nations[0]!;
        this.#units.push(new Unit(P(1, 1), this.#playerNation, UnitType.Warrior));
        this.#units.push(new Unit(P(3, 3), this.#playerNation, UnitType.Warrior));
        this.#selectedUnit = this.#units[0]!;
    }

    objects(bounds: Rectangle): [Point, GameObject][] {
        const objects : [Point, GameObject][] = [];
        for (let x = 0; x < 30; x++)
            for (let y = 0; y < 30; y++)
                objects.push([P(x, y), this.tile(P(x, y))])
        for (const unit of this.#units)
            objects.push([unit.position, unit]);
        return objects;
    }

    get selectedUnitMovesLeft(): number | null {
        if (this.#selectedUnit)
            return this.#selectedUnit!.movesLeft;
        return null;
    }

    private tile(p: Point) : Tile {
        return new Tile(Terrain.Grassland);  // TODO
    }

    canMoveSelectedUnit(dir: Direction): boolean {
        if (this.#selectedUnit === null)
            return false;

        // TODO - check map bounds

        const futurePos = this.#selectedUnit.position.plus(Directions[dir]);
        const moveCost = this.tile(futurePos).moveCost;
        if (moveCost > this.#selectedUnit.movesLeft)
            return false;

        return true;
    }

    moveSelectedUnit(dir: Direction): void {
        if (this.#selectedUnit) {
            this.#selectedUnit!.move(dir);
            this.#selectedUnit!.reduceMovesBy(this.tile(this.#selectedUnit!.position).moveCost);
        }
    }

    selectNextUnit(): Unit | null {
        let nextSelected : Unit | undefined

        const findNextAbleUnit = (i : number) : Unit | undefined => {
            for (let j = i; j < this.#units.length; ++j) {
                if (this.#units[j]!.canMove())
                    return this.#units[j];
            }
            return undefined;
        };

        if (this.#selectedUnit === null) {
            nextSelected = findNextAbleUnit(0);
        } else {
            const i = this.#units.findIndex(unit => unit.isEqual(this.#selectedUnit))!;
            nextSelected = findNextAbleUnit(i + 1);
            if (nextSelected === null)
                nextSelected = findNextAbleUnit(0);
        }

        if (nextSelected === null)
            this.newRound();
        else
            this.#selectedUnit = nextSelected!;

        return this.#selectedUnit;
    }

    newRound() : void {
        this.#units.forEach(unit => unit.newRound());
        this.#year -= 0.5;
    }

}
