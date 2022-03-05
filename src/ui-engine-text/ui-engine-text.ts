import UiInterface, {KeyDirections} from "../interfaces/ui-interface";
import {P, R} from "../common/geometry";
import IGame, {IGameState, IMapTile} from "../interfaces/game-interface";
import CityManagement from "./city-management";
import "../../css/text-engine.css";
import {mapTile} from "../interfaces/interface-utils";
import {drawCity, drawTile, drawUnit} from "./ui-tile";

export default class UiEngineText implements UiInterface {

    #debugInfo: HTMLPreElement;
    #cityManagement: CityManagement;
    #state?: IGameState;

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
        this.update();
    }

    private onTileClick(x: number, y: number, ev: MouseEvent) {
        if (!this.#state) return;

        if (ev.button === 0) {
            if (this.#cityManagement.cityScreenIsOpen()) {
                this.#cityManagement.closeCityScreen();
                return;
            }

            const tile = mapTile(this.#state, x, y);
            if (tile !== undefined) {
                if (tile.unit)
                    this.game.selectUnit(tile.unit.id);

                if (tile.city)
                    this.#cityManagement.openCityScreen(this.#state, x, y);

                this.update();
            }
        }
    }

    //
    // DRAW
    //

    update() : void {
        this.#state = this.game.gameState(R(P(0, 0), 30, 30));   // TODO - map limits?
        this.redraw();
    }

    redraw(): void {
        if (!this.#state)
            return;

        for (const td of Array.from(document.getElementsByClassName("map-tile"))) {
            td.innerHTML = "";
            td.className = "tile map-tile";
        }
        this.#state.tiles.forEach(t => this.draw(t));

        let text = `Year: ${-this.#state.year} B.C.\n`;
        if (this.#state.selectedUnitMovesLeft)
            text += `Moves left: ${this.#state.selectedUnitMovesLeft!}`;
        this.#debugInfo.textContent = text;
    }

    private draw(tile: IMapTile) {
        drawTile(tile, "tile");
        if (tile.unit) {
            drawUnit(tile.unit, tile.position[0], tile.position[1], "tile", tile.unit.selected ?? false);
        }
        drawCity(tile, "tile");
    }


}
