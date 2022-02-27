import UiInterface, {KeyDirections} from "../interfaces/ui-interface";
import GameInterface, {GameObject, GameObjectType, TileInterface, UnitInterface} from "../interfaces/game-interface";
import {P, Point, R} from "../common/geometry";
import {Direction, NationType, Terrain} from "../interfaces/game-enum";

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
            this.redraw();
        }
    }

    //
    // DRAW
    //

    redraw(): void {
        const w = this.#mapCanvas.width / UiEngineText.TILE_SZ;
        const h = this.#mapCanvas.height / UiEngineText.TILE_SZ;
        for (let [p, object] of this.game.objects(R(P(0, 0), w, h)))
            this.draw(p, object);

        let text = `Year: ${-this.game.year} B.C.\n`;
        if (this.game.selectedUnit)
            text += `Moves left: ${this.game.selectedUnitMovesLeft!}`;
        document.getElementById('debug-info')!.innerText = text;
    }

    private draw(p: Point, object: GameObject) {
        const pt = P(p.x * UiEngineText.TILE_SZ, p.y * UiEngineText.TILE_SZ);
        switch (object.kind) {
            case GameObjectType.Tile:
                this.#mapCtx.fillStyle = UiEngineText.#terrainColors.get((object as TileInterface).terrain)!;
                this.#mapCtx.fillRect(pt.x, pt.y, UiEngineText.TILE_SZ, UiEngineText.TILE_SZ);
                break;
            case GameObjectType.Unit:
                const unit : UnitInterface = object;
                this.#mapCtx.font = `${UiEngineText.TILE_SZ - 2}px monospace`;
                this.#mapCtx.textBaseline = 'top';
                this.#mapCtx.fillStyle = UiEngineText.nationColor(unit.nation.nationType);
                this.#mapCtx.fillText('W', pt.x + 6, pt.y + 2);
                if (unit.isEqual(this.game.selectedUnit)) {
                    this.#mapCtx.strokeStyle = 'red';
                    this.#mapCtx.strokeRect(pt.x, pt.y, UiEngineText.TILE_SZ, UiEngineText.TILE_SZ);
                }
                break;
        }
    }

    private static nationColor(nationType: NationType) : string {
        switch (nationType) {
            case NationType.Phoenicia: return '#2222cc';
            case NationType.Egypt: return '#ff0000';
        }
        return 'gray';
    }
}
