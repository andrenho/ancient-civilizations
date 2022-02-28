import UiInterface, {KeyDirections} from "../interfaces/ui-interface";
import {P, R} from "../common/geometry";
import {Goods, UnitType} from "../interfaces/game-enum";
import GameInterface, {CityDetails, CityObject, MapTile} from "../interfaces/game-interface";

export default class UiEngineText implements UiInterface {

    #debugInfo: HTMLPreElement;
    #cityDiv: HTMLDivElement;

    constructor(private game: GameInterface) {
        this.#debugInfo = document.createElement("pre");
        this.#cityDiv = document.createElement("div");
        this.buildUserInterface();

        game.newGame({});
    }

    //
    // USER INTERFACE
    //

    private buildUserInterface() : void {
        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "css/text-engine.css");
        document.head.appendChild(link);

        const gameDiv = document.getElementById("game")!;

        const mapTable: HTMLTableElement = document.createElement("table");
        mapTable.className = "map";
        for (let y = 0; y < 30; ++y) {
            const tr : HTMLTableRowElement = document.createElement("tr");
            for (let x = 0; x < 30; ++x) {
                const td : HTMLTableCellElement = document.createElement("td");
                td.id = `tile_${x}_${y}`;
                td.className = "tile map-tile";
                td.addEventListener('mousedown', ev => this.onTileClick(x, y, ev));
                tr.appendChild(td);
            }
            mapTable.appendChild(tr);
        }
        gameDiv.appendChild(mapTable);

        this.#debugInfo.className = "debug-info";
        gameDiv.appendChild(this.#debugInfo);

        this.#cityDiv.className = "city-div";
        gameDiv.appendChild(this.#cityDiv);
    }

    //
    // EVENTS
    //

    onKeyDown(event: KeyboardEvent): void {
        const dir = KeyDirections[event.code];
        if (dir !== undefined && this.game.canMoveSelectedUnit(dir!)) {
            this.game.moveSelectedUnit(dir!);
        }
        switch (event.key) {
            case "w":
                this.game.selectNextUnit(false);
                break;
            case " ":
                this.game.newRound();
                break;
        }
        this.redraw();
    }

    private onTileClick(x: number, y: number, ev: MouseEvent) {
        if (ev.button === 0) {
            const units = this.game.unitsInTile(x, y);
            if (units.length > 0)
                this.game.selectUnit(units[0]!.id);

            const city = this.game.cityInTileDetails(x, y);
            if (city)
                this.showCity(city!, x, y);

            this.redraw();
        }
    }

    //
    // DRAW
    //

    redraw(): void {
        const state = this.game.gameState(R(P(0, 0), 30, 30));   // TODO - map limits?

        for (const td of document.getElementsByClassName("map-tile")) {
            td.innerHTML = "";
            td.className = "tile map-tile";
        }
        state.tiles.forEach(t => this.draw(t));

        let text = `Year: ${-state.year} B.C.\n`;
        if (state.selectedUnitMovesLeft)
            text += `Moves left: ${state.selectedUnitMovesLeft!}`;
        this.#debugInfo.textContent = text;
    }

    private draw(tile: MapTile) {
        const [x, y] = tile.position;
        if (tile.tile) {
            this.tile(x, y).classList.add(`terrain-${tile.tile.terrain}`);
        } else if (tile.unit) {
            const t = this.tile(x, y);
            t.innerText = UiEngineText.charForUnitType(tile.unit.type);
            t.classList.add(`nation-${tile.unit.nation}`);
            if (tile.unit.selected)
                t.classList.add("unit-selected");
        } else if (tile.city) {
            const t = this.tile(x, y);
            t.innerText = "C";
            t.classList.add("city");
        }
    }

    private tile(x: number, y: number) : HTMLTableCellElement {
        return document.getElementById(`tile_${x}_${y}`)! as HTMLTableCellElement;
    }

    private static charForUnitType(unitType: UnitType) {
        switch (unitType) {
            case UnitType.Warrior: return "W";
        }
        return '';
    }

    //
    // CITY
    //

    private showCity(city: CityDetails, x: number, y: number) {
        const three = [0, 1, 2];

        const buildings = city.buildings.map(building => `
            <table class="building">
                <tr><td colspan="4" style="width: 150px;">${building.type}</td></tr>
                <tr>${three.map(n => `<td class="building-unit" id="building_${building.type}_${n}"></td>`).join('')}<td></td></tr>
            </table>
        `).join('');

        const outOfGate = this.game.unitsInTile(x, y).map(unit => `<div class="tile ${`nation-${unit.nation}`}">${UiEngineText.charForUnitType(unit.type)}</div>`).join('');

        const goods = Object.keys(city.goods).map(good => `<tr>
            <td style="width: 100px;">${good}</td>
            <td>${city.goods[good as Goods]}</td>
        </tr>`).join('');

        const cityHTML = `
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
                            ${three.map(() => `<tr>${three.map(n => `<td class="tile" id="city-tile_${n}"></td>`).join('')}</tr>`).join('')}
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

        this.#cityDiv.innerHTML = cityHTML;
        this.#cityDiv.style.display = 'flex';
    }
}
