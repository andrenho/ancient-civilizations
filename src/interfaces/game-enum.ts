import {P, Point} from "../common/geometry";

export enum NationType {
    Phoenicia,
    Egypt,
}

export enum UnitType {
    Warrior,
}

export enum Terrain {
    Grassland,
}

export enum Buildings {
    SpinnersHouse,
    OliveOilPress,
}

export enum Goods {
    Wool,
    OliveOil,
}

export const enum Direction { NW = "nw", N = "n", NE = "ne", E = "e", W = "w", SW = "sw", S = "s", SE = "se" }

export const Directions : { [key in Direction]: Point } = {
    [Direction.NW]: P(-1, -1),
    [Direction.N]: P(0, -1),
    [Direction.NE]: P(1, -1),
    [Direction.W]: P(-1, 0),
    [Direction.E]: P(1, 0),
    [Direction.SW]: P(-1, 1),
    [Direction.S]: P(0, 1),
    [Direction.SE]: P(1, 1),
}
