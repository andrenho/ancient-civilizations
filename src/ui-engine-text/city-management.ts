import GameInterface, {CityBuilding, CityDetails} from "../interfaces/game-interface";
import fs from "fs";
import path from "path";

export default class CityManagement {

    #cityDiv: HTMLDivElement;

    constructor(private game: GameInterface) {
        this.#cityDiv = document.createElement("div");
        this.#cityDiv.className = "city-div";
    }

    get cityDiv() { return this.#cityDiv; }

    openCityScreen(city: CityDetails, cityX: number, cityY: number) {
        /*
        const three = [0, 1, 2];

        const buildings = city.buildings.map(building => `
            <table class="building">
                <tr><td colspan="4" style="width: 150px;">${building.type}</td></tr>
                <tr>${three.map(n => `<td class="building-unit" id="building_${building.type}_${n}"></td>`).join("")}<td></td></tr>
            </table>
        `).join("");

        const outOfGate = this.game.unitsInTile(cityX, cityY).map(unit => `<div class="tile ${`nation-${unit.nation}`}">${charForUnitType(unit.type)}</div>`).join("");

        ${three.map(() => `<tr>${three.map(n => `<td class="tile" id="city-tile_${n}"></td>`).join("")}</tr>`).join("")}
         */
        this.#cityDiv.style.display = "flex";
        this.#cityDiv.innerHTML = fs.readFileSync(path.join(__dirname, "template/city-template.html"), "utf8");

        document.getElementById("city-name")!.innerText = city.name;

        const cityBuildings = document.getElementById("city-buildings")!;
        city.buildings.map(building => this.cityBuilding(building)).forEach(element => cityBuildings.appendChild(element));

    }

    closeCityScreen() : void {
        this.#cityDiv.style.display = "none";
    }

    cityScreenIsOpen() : boolean {
        return this.#cityDiv.style.display !== "none";
    }

    private cityBuilding(building: CityBuilding) : HTMLElement {
        return undefined;
    }
}