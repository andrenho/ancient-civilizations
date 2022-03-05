import IGame, {ICityBuilding, ICityGood, IGameState} from "../interfaces/game-interface";
import fs from "fs";
import path from "path";
import {BuildingName, GoodName, GoodsToShowOnCity} from "../interfaces/ui-interface";
import {Good} from "../interfaces/game-enum";
import {mapTile} from "../interfaces/interface-utils";
import {drawTile} from "./ui-tile";

export default class CityManagement {

    #cityDiv: HTMLDivElement;

    constructor(private game: IGame) {
        this.#cityDiv = document.createElement("div");
        this.#cityDiv.className = "city-div";
    }

    get cityDiv() { return this.#cityDiv; }

    openCityScreen(state: IGameState, x: number, y: number) {
        const tile = mapTile(state, x, y);
        if (tile === undefined) return;

        const city = tile.city!;
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

        const cityBuildingsElement = document.getElementById("city-buildings")!;
        city.buildings.map(building => this.cityBuilding(building)).forEach(element => cityBuildingsElement.appendChild(element));

        const cityTilesElement = document.getElementById('city-tiles')!;
        for (let ry = -1; ry <= 1; ++ry) {
            cityTilesElement.appendChild(this.cityTileRow(state, y + ry, x));
            for (let rx = -1; rx <= 1; ++rx) {
                const mtile = mapTile(state, x + rx, y + ry);
                if (mtile) {
                    drawTile(mtile, 'city-tile');
                }
            }
        }

        document.getElementById('city-goods')!.replaceChildren(this.cityGoodsElement(city.goods));
    }

    closeCityScreen() : void {
        this.#cityDiv.style.display = "none";
    }

    cityScreenIsOpen() : boolean {
        return this.#cityDiv.style.display !== "none";
    }

    private cityBuilding(building: ICityBuilding) : HTMLElement {
        const table = document.createElement('table');
        const tr = document.createElement('tr');

        table.className = "building";
        table.innerHTML = `<tr><td colspan="4" style="width: 150px;">${BuildingName[building.type]}</td></tr>`;

        for (let i = 0; i < this.game.numberOfWorkersInBuilding(building.type); ++i) {
            const td = document.createElement('td');
            td.id = `${building}_${i}`;
            td.className = "building-unit";
            tr.appendChild(td);
        }
        
        table.appendChild(tr);
        return table;
    }

    private cityGoodsElement(goods: { [key in Good ]: ICityGood }) : HTMLTableElement {
        const table : HTMLTableElement = document.createElement('table');
        table.innerHTML = `<tr><th></th><th>Amount</th><th>Production</th></tr>`;

        for (const good of GoodsToShowOnCity) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td style="width: 100px;">${GoodName[good]}</td><td>${goods[good]!.amount}</td><td>${goods[good]!.production}</td>`
            table.tBodies[0]!.appendChild(tr);
        }

        return table;
    }

    private cityTileRow(state: IGameState, y: number, cityX: number) {
        const tr = document.createElement('tr');

        for (let x = cityX - 1; x <= (cityX + 1); ++x) {
            const td = document.createElement('td');
            td.id = `city-tile_${x}_${y}`;
            td.className = "tile";
            tr.appendChild(td);
        }

        return tr;
    }
}
