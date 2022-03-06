import IGame, {ICity, ICityBuilding, ICityGood, Id, IGameState, IMapTile, IUnit} from "../interfaces/game-interface";
import fs from "fs";
import path from "path";
import {BuildingName, GoodName, GoodsToShowOnCity} from "../interfaces/ui-interface";
import {Building, Good} from "../interfaces/game-enum";
import {mapTile} from "../interfaces/interface-utils";
import {drawCity, drawTile, drawUnit} from "./ui-tile";

enum SelectionType { OutOfGate, Building, Tile }

type Selected = {
    type: SelectionType,
    unitId?: Id,
    building?: Building,
    tile?: { x: number, y: number }
}

export default class CityManagement {

    #cityDiv: HTMLDivElement;
    #selection: Selected | undefined;
    #state?: IGameState;
    #x? : number;
    #y? : number;
    #tile?: IMapTile;
    #city?: ICity;

    constructor(private game: IGame) {
        this.#cityDiv = document.createElement("div");
        this.#cityDiv.className = "city-div";
        this.#cityDiv.addEventListener("click", ev => {
            if (ev.button === 0) {
                this.#selection = undefined;
                this.redraw();
            }
        });
    }

    get cityDiv() { return this.#cityDiv; }

    openCityScreen(state: IGameState, x: number, y: number) {
        this.#selection = undefined;
        this.#state = state;
        this.#x = x;
        this.#y = y;

        const tile = mapTile(this.#state!, this.#x!, this.#y!);
        if (tile === undefined) return;
        this.#city = tile.city!;
        this.#tile = tile;

        this.redraw();
    }

    private redraw() {
        this.#cityDiv.innerHTML = "";

        this.#cityDiv.style.display = "flex";
        this.#cityDiv.innerHTML = fs.readFileSync(path.join(__dirname, "template/city-template.html"), "utf8");

        document.getElementById("city-name")!.innerText = this.#city!.name;

        const cityBuildingsElement = document.getElementById("city-buildings")!;
        this.#city!.buildings.map(building => this.cityBuilding(building)).forEach(element => cityBuildingsElement.appendChild(element));

        this.drawCityTiles(this.#state!, this.#tile!, this.#x!, this.#y!);

        document.getElementById("city-goods")!.replaceChildren(this.cityGoodsElement(this.#city!.goods));

        const cityUnitsOutsideOfGate = document.getElementById("city-out-of-gate")!;
        let i = 0;
        for (const unit of this.#tile!.units) {
            cityUnitsOutsideOfGate.appendChild(this.cityUnitOutOfGate(unit, i));
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
        tr.addEventListener("click", ev => {
            if (ev.button === 0)
                this.select({ type: SelectionType.Building, building: building.type });
            ev.stopPropagation();
        });

        table.className = "building";
        table.innerHTML = `<tr><td colspan="4" style="width: 150px;">${BuildingName[building.type]}</td></tr>`;

        for (let i = 0; i < this.game.numberOfWorkersInBuilding(building.type); ++i) {
            const td = document.createElement("td");
            td.id = `${building}_${i}`;
            td.className = "building-unit";
            tr.appendChild(td);
        }
        tr.appendChild(document.createElement("td"));
        
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
            td.addEventListener("click", ev => {
                if (ev.button === 0)
                    this.select({ type: SelectionType.Tile, tile: { x, y } });
                ev.stopPropagation();
            });
            tr.appendChild(td);
        }

        return tr;
    }

    private cityUnitOutOfGate(unit: IUnit, i: number) : HTMLElement {
        const div = document.createElement("div");
        div.id = `city-out-of-gate_${i}_0`;
        div.className = "out-of-gate";
        div.addEventListener("click", ev => {
            if (ev.button === 0)
                this.select({ type: SelectionType.OutOfGate, unitId: unit.id });
            ev.stopPropagation();
        });
        if (this.#selection && this.#selection.type === SelectionType.OutOfGate && this.#selection.unitId === unit.id)
            div.classList.add("selected");
        return div;
    }

    private select(selected: Selected) {
        console.log(selected);
        if (this.#selection === undefined || this.#selection.type === selected.type) {
            if (selected.unitId)
                this.#selection = selected;
        } else {
            try {
                switch (selected.type) {
                    case SelectionType.Building:
                        this.game.moveUnitToBuilding(selected.unitId!, this.#city!.id, selected.building!);
                        break;
                }
                this.#selection = undefined;
            } catch (e) {
                alert(e);
            }
        }
        this.redraw();
    }
}
