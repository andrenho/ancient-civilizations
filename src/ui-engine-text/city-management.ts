import GameInterface, {CityDetails} from "../interfaces/game-interface";
import {Goods} from "../interfaces/game-enum";
import {charForUnitType} from "./ui-config";

export default class CityManagement {

    #cityDiv: HTMLDivElement;

    constructor(private game: GameInterface) {
        this.#cityDiv = document.createElement("div");
        this.#cityDiv.className = "city-div";
    }

    get cityDiv() { return this.#cityDiv; }

    openCityScreen(city: CityDetails, cityX: number, cityY: number) {
        const three = [0, 1, 2];

        const buildings = city.buildings.map(building => `
            <table class="building">
                <tr><td colspan="4" style="width: 150px;">${building.type}</td></tr>
                <tr>${three.map(n => `<td class="building-unit" id="building_${building.type}_${n}"></td>`).join("")}<td></td></tr>
            </table>
        `).join("");

        const outOfGate = this.game.unitsInTile(cityX, cityY).map(unit => `<div class="tile ${`nation-${unit.nation}`}">${charForUnitType(unit.type)}</div>`).join("");

        const goods = Object.keys(city.goods).map(good => `<tr>
            <td style="width: 100px;">${good}</td>
            <td>${city.goods[good as Goods]}</td>
        </tr>`).join("");

        this.#cityDiv.innerHTML = `
            <h1 style="margin-top: 6px; margin-bottom: 6px;">${city.name}</h1>
            <div style="display: flex; align-content: stretch;">
                <div style="display: flex; flex-direction: column; flex-grow: 1;">
                    <div>
                        <h3>Buildings</h3>
                        ${buildings}
                    </div>
                    <div>
                        <h3>Tiles</h3>
                        <table class="tiles">
                            ${three.map(() => `<tr>${three.map(n => `<td class="tile" id="city-tile_${n}"></td>`).join("")}</tr>`).join("")}
                        </table>
                    </div>
                </div>
                <div style="flex-grow: 1;">
                    <div>
                        <h3>Goods</h3>
                        <table>${goods}</table>
                    </div>
                    <div>
                        <h3>Out of gates</h3>
                        <div style="display: flex; flex-direction: row;">${outOfGate}</div>
                    </div>
                </div>
            </div>
        `;
        this.#cityDiv.style.display = "flex";
    }

    closeCityScreen() : void {
        this.#cityDiv.style.display = "none";
    }

    cityScreenIsOpen() : boolean {
        return this.#cityDiv.style.display !== "none";
    }
}