import UiInterface, {KeyDirections} from "../interfaces/ui-interface";
import {P, R} from "../common/geometry";
import {NationType, Terrain} from "../interfaces/game-enum";
import GameInterface, {MapTile} from "../interfaces/game-interface";

export default class UiEngineText implements UiInterface {

    static readonly TILE_SZ = 24;
    static readonly #terrainColors = new Map<Terrain, string>([
        [ Terrain.Grassland, '#aaddaa' ],
    ]);

    #mapCanvas: HTMLCanvasElement;
    #mapCtx: CanvasRenderingContext2D;

    constructor(private game: GameInterface) {
        this.#mapCanvas = document.getElementById('map-canvas')! as HTMLCanvasElement;
        this.#mapCtx = this.#mapCanvas.getContext('2d')!;
        game.newGame({});
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
            case 'w':
                this.game.selectNextUnit(false);
                break;
            case ' ':
                this.game.newRound();
                break;
        }
        this.redraw();
    }

    //
    // DRAW
    //

    redraw(): void {
        const w = this.#mapCanvas.width / UiEngineText.TILE_SZ;
        const h = this.#mapCanvas.height / UiEngineText.TILE_SZ;
        const state = this.game.gameState(R(P(0, 0), w, h));

        state.tiles.forEach(t => this.draw(t));

        let text = `Year: ${-state.year} B.C.\n`;
        if (state.selectedUnitMovesLeft)
            text += `Moves left: ${state.selectedUnitMovesLeft!}`;
        document.getElementById('debug-info')!.innerText = text;
    }

    private draw(tile: MapTile) {
        const [x, y] = tile.position;
        const pt = P(x * UiEngineText.TILE_SZ, y * UiEngineText.TILE_SZ);
        if (tile.tile) {
            this.#mapCtx.fillStyle = UiEngineText.#terrainColors.get(tile.tile.terrain)!;
            this.#mapCtx.fillRect(pt.x, pt.y, UiEngineText.TILE_SZ, UiEngineText.TILE_SZ);
        } else if (tile.unit) {
            this.writeText('W', pt.x, pt.y, UiEngineText.nationColor(tile.unit.nation));
            if (tile.unit.selected) {
                this.#mapCtx.strokeStyle = 'red';
                this.#mapCtx.strokeRect(pt.x, pt.y, UiEngineText.TILE_SZ, UiEngineText.TILE_SZ);
            }
        } else if (tile.city) {
            this.writeText('C', pt.x, pt.y, UiEngineText.nationColor(tile.city.nation), true);
        }
    }

    private writeText(text: string, x: number, y: number, color: string, invert: boolean = false) {
        this.#mapCtx.font = `${UiEngineText.TILE_SZ - 2}px monospace`;
        this.#mapCtx.textBaseline = 'top';
        if (invert) {
            this.#mapCtx.fillStyle = color;
            this.#mapCtx.fillRect(x, y, UiEngineText.TILE_SZ, UiEngineText.TILE_SZ);
            this.#mapCtx.fillStyle = 'white';
        } else {
            this.#mapCtx.fillStyle = color;
        }
        this.#mapCtx.fillText(text, x + 6, y + 2);
    }

    private static nationColor(nationType: NationType) : string {
        switch (nationType) {
            case NationType.Phoenicia: return '#2222cc';
            case NationType.Egypt: return '#ff0000';
        }
        return 'gray';
    }
}
