import GameInterface, {CityBuilding, CityDetails, CityGood} from "../interfaces/game-interface";
import fs from "fs";
import path from "path";
import {GoodName, GoodsToShowOnCity} from "../interfaces/ui-interface";

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

        /*
        const cityBuildings = document.getElementById("city-buildings")!;
        city.buildings.map(building => this.cityBuilding(building)).forEach(element => cityBuildings.appendChild(element));
         */

        document.getElementById('city-goods')!.replaceChildren(this.cityGoodsElement(city.goods));

        /*
        const cityGoods = document.getElementById("city-buildings")!;
        city.buildings.map(building => this.cityBuilding(building)).forEach(element => cityBuildings.appendChild(element));
         */
    }

    closeCityScreen() : void {
        this.#cityDiv.style.display = "none";
    }

    cityScreenIsOpen() : boolean {
        return this.#cityDiv.style.display !== "none";
    }

    private cityBuilding(building: CityBuilding) : HTMLElement {
        const table = document.createElement('table');
        const tr = document.createElement('tr');

        table.className = "building";
        table.innerHTML = `<tr><td colspan="4" style="width: 150px;">${building.type}</td></tr>`;

        for (let i = 0; i < this.game.numberOfWorkersInBuilding(building.type); ++i) {
            const td = document.createElement('td');
            td.id = `${building}_${i}`;
            td.className = "building-unit";
            tr.appendChild(td);
        }
        
        table.appendChild(tr);
        return table;
    }

    private cityGoodsElement(goods: { [key: number]: CityGood }) : HTMLTableElement {
        const table : HTMLTableElement = document.createElement('table');
        table.innerHTML = `<tr><th></th><th>Amount</th><th>Production</th></tr>`;

        for (const good of GoodsToShowOnCity) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td style="width: 100px;">${GoodName[good]}</td><td>${goods[good]!.amount}</td><td>${goods[good]!.production}</td>`
            table.tBodies[0]!.appendChild(tr);
        }

        return table;
    }
}
