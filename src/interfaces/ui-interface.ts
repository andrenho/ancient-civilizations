import {Direction, Good} from "./game-enum";

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

export default interface UiInterface {
    redraw(): void;
    onKeyDown(event: KeyboardEvent): void;
}