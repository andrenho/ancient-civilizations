import {Building, Direction, Good} from "./game-enum";

export const KeyDirections : { [key: string]: Direction } = {
    Numpad7: Direction.NW,
    Numpad8: Direction.N,
    Numpad9: Direction.NE,
    Numpad4: Direction.W,
    Numpad6: Direction.E,
    Numpad1: Direction.SW,
    Numpad2: Direction.S,
    Numpad3: Direction.SE,
}

export const GoodsToShowOnCity: Good[] = [
    Good.Wool, Good.OliveOil,
];

export const GoodName : { [key in Good]: string } = {
    [Good.Wool] : "Wool",
    [Good.OliveOil] : "Olive Oil",
}

export const BuildingName : { [key in Building] : string } = {
    [Building.SpinnersHouse]: "Spinner's House",
    [Building.OliveOilPress]: "Olive Oil Press",
}

export default interface UiInterface {
    update(): void;
    onKeyDown(event: KeyboardEvent): void;
}