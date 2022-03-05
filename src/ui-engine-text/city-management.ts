import IGame, {ICityBuilding, ICityGood, IGameState, IMapTile} from "../interfaces/game-interface";
import fs from "fs";
import path from "path";
import {BuildingName, GoodName, GoodsToShowOnCity} from "../interfaces/ui-interface";
import {Good} from "../interfaces/game-enum";
import {mapTile} from "../interfaces/interface-utils";
import {drawCity, drawTile, drawUnit} from "./ui-tile";

export default class CityManagement {

    #cityDiv: HTMLDivElement;

    constructor(private game: IGame) {
        this.#cityDiv = document.createElement("div");
        this.#cityDiv.className = "city-div";
    }

    get cityDiv() { return this.#cityDiv; }

    openCityScreen(state: IGameState, x: number, y: number) {
        this.#cityDiv.innerHTML = "";

        const tile = mapTile(state, x, y);
        if (tile === undefined) return;

        const city = tile.city!;

        this.#cityDiv.style.display = "flex";
        this.#cityDiv.innerHTML = fs.readFileSync(path.join(__dirname, "template/city-template.html"), "utf8");

        document.getElementById("city-name")!.innerText = city.name;

        const cityBuildingsElement = document.getElementById("city-buildings")!;
        city.buildings.map(building => this.cityBuilding(building)).forEach(element => cityBuildingsElement.appendChild(element));

        this.drawCityTiles(state, tile, x, y);

        document.getElementById("city-goods")!.replaceChildren(this.cityGoodsElement(city.goods));

        const cityUnitsOutsideOfGate = document.getElementById("city-out-of-gate")!;
        let i = 0;
        for (const unit of tile.units) {
            cityUnitsOutsideOfGate.appendChild(this.cityUnitOutOfGate(i));
            drawUnit(unit, i++, 0, "city-out-of-gate", false);
        }
    }

    private drawCityTiles(state: IGameState, tile: IMapTile, x: number, y: number, ) {
        const cityTilesElement = document.getElementById("city-tiles")!;
        for (let ry = -1; ry <= 1; ++ry) {
            cityTilesElement.appendChild(this.cityTileRow(state, y + ry, x));
            for (let rx = -1; rx <= 1; ++rx) {
                const mtile = mapTile(state, x + rx, y + ry);
                if (mtile) {
                    drawTile(mtile, "city-tile");
                }
            }
        }
        drawCity(tile, "city-tile");
    }

    closeCityScreen() : void {
        this.#cityDiv.style.display = "none";
    }

    cityScreenIsOpen() : boolean {
        return this.#cityDiv.style.display !== "none";
    }

    private cityBuilding(building: ICityBuilding) : HTMLElement {
        const table = document.createElement("table");
        const tr = document.createElement("tr");

        table.className = "building";
        table.innerHTML = `<tr><td colspan="4" style="width: 150px;">${BuildingName[building.type]}</td></tr>`;

        for (let i = 0; i < this.game.numberOfWorkersInBuilding(building.type); ++i) {
            const td = document.createElement("td");
            td.id = `${building}_${i}`;
            td.className = "building-unit";
            tr.appendChild(td);
        }
        
        table.appendChild(tr);
        return table;
    }

    private cityGoodsElement(goods: { [key in Good ]: ICityGood }) : HTMLTableElement {
        const table : HTMLTableElement = document.createElement("table");
        table.innerHTML = `<tr><th></th><th>Amount</th><th>Production</th></tr>`;

        for (const good of GoodsToShowOnCity) {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td style="width: 100px;">${GoodName[good]}</td><td class="number">${goods[good]!.amount}</td><td class="number">${goods[good]!.production}</td>`
            table.tBodies[0]!.appendChild(tr);
        }

        return table;
    }

    private cityTileRow(state: IGameState, y: number, cityX: number) {
        const tr = document.createElement("tr");

        for (let x = cityX - 1; x <= (cityX + 1); ++x) {
            const td = document.createElement("td");
            td.id = `city-tile_${x}_${y}`;
            td.className = "tile";
            tr.appendChild(td);
        }

        return tr;
    }

    private cityUnitOutOfGate(i: number) : HTMLElement {
        const div = document.createElement('div');
        div.id = `city-out-of-gate_${i}_0`;
        div.style.marginRight = "8px";
        return div;
    }
}
