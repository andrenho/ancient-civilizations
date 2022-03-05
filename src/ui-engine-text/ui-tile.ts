import {IMapTile, IUnit} from "../interfaces/game-interface";
import {UnitType} from "../interfaces/game-enum";

function charForUnitType(unitType: UnitType) : string {
    switch (unitType) {
        case UnitType.Warrior: return "W";
    }
    return "";
}

function tileElement(tile: IMapTile, baseElementId: string) : HTMLElement | null {
    const [x, y] = tile.position;

    return document.getElementById(`${baseElementId}_${x}_${y}`);
}

export function drawTile(tile: IMapTile, baseElementId: string) : void {
    const element = tileElement(tile, baseElementId);
    if (!element) return;
        element.classList.add(`terrain-${tile.tile.terrain}`);
}

export function drawUnit(unit: IUnit, x: number, y: number, baseElementId: string, markAsSelected: boolean) : void {
    const element = document.getElementById(`${baseElementId}_${x}_${y}`);
    if (!element) return;
    element.innerText = charForUnitType(unit.type);
    element.classList.add(`nation-${unit.nation}`);
    if (markAsSelected)
        element.classList.add("unit-selected");
}

export function drawCity(tile: IMapTile, baseElementId: string) : void {
    const element = tileElement(tile, baseElementId);
    if (!element || !tile.city) return;

    element.innerText = "C";
    element.classList.add("city");
    element.classList.add(`nation-${tile.city.nation}`);
}
