import UiInterface, {KeyDirections} from "../interfaces/ui-interface";
import {P, R} from "../common/geometry";
import IGame, {IMapTile} from "../interfaces/game-interface";
import CityManagement from "./city-management";
import {charForUnitType} from "./ui-config";
import "../../css/text-engine.css";

export default class UiEngineText implements UiInterface {

    #debugInfo: HTMLPreElement;
    #cityManagement: CityManagement;

    constructor(private game: IGame) {
        this.#debugInfo = document.createElement("pre");
        this.#cityManagement = new CityManagement(game);
        this.buildUserInterface();

        game.newGame({});
    }

    //
    // USER INTERFACE
    //

    private buildUserInterface() : void {
        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        // link.setAttribute("href", "css/text-engine.css");
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
                td.addEventListener("mousedown", ev => this.onTileClick(x, y, ev));
                tr.appendChild(td);
            }
            mapTable.appendChild(tr);
        }
        gameDiv.appendChild(mapTable);

        this.#debugInfo.className = "debug-info";
        gameDiv.appendChild(this.#debugInfo);

        gameDiv.appendChild(this.#cityManagement.cityDiv);
    }

    //
    // EVENTS
    //

    onKeyDown(event: KeyboardEvent): void {
        if (this.#cityManagement.cityScreenIsOpen())
            return;

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
            if (this.#cityManagement.cityScreenIsOpen()) {
                this.#cityManagement.closeCityScreen();
                return;
            }

            const units = this.game.unitsInTile(x, y);
            if (units.length > 0)
                this.game.selectUnit(units[0]!.id);

            const city = this.game.cityInTileDetails(x, y);
            if (city)
                this.#cityManagement.openCityScreen(city!, x, y);

            this.redraw();
        }
    }

    //
    // DRAW
    //

    redraw(): void {
        const state = this.game.gameState(R(P(0, 0), 30, 30));   // TODO - map limits?

        for (const td of Array.from(document.getElementsByClassName("map-tile"))) {
            td.innerHTML = "";
            td.className = "tile map-tile";
        }
        state.tiles.forEach(t => this.draw(t));

        let text = `Year: ${-state.year} B.C.\n`;
        if (state.selectedUnitMovesLeft)
            text += `Moves left: ${state.selectedUnitMovesLeft!}`;
        this.#debugInfo.textContent = text;
    }

    private draw(tile: IMapTile) {
        const [x, y] = tile.position;
        if (tile.tile) {
            this.tile(x, y).classList.add(`terrain-${tile.tile.terrain}`);
        } else if (tile.unit) {
            const t = this.tile(x, y);
            t.innerText = charForUnitType(tile.unit.type);
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

}
