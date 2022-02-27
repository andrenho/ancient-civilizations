import UiInterface from "../interfaces/ui-interface";
import GameInterface, {GameObject, GameObjectType, TileInterface, UnitInterface} from "../interfaces/game-interface";
import {P, Point, R} from "../common/geometry";

export default class UiEngineText implements UiInterface {

    static readonly TILE_SZ = 24;
    static readonly #terrainColors = new Map<string, string>([
        [ 'grassland', '#aaddaa' ],
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
                this.#mapCtx.fillStyle = this.nationColor(unit.nation.nationType);
                this.#mapCtx.fillText('W', pt.x + 6, pt.y + 2);
                if (unit.isEqual(this.game.selectedUnit)) {
                    this.#mapCtx.strokeStyle = 'red';
                    this.#mapCtx.strokeRect(pt.x, pt.y, UiEngineText.TILE_SZ, UiEngineText.TILE_SZ);
                }
                break;
        }
    }

    private nationColor(nationType: string) : string {
        switch (nationType) {
            case 'phoenicia': return '#2222cc';
            case 'egypt': return '#ff0000';
        }
        return 'gray';
    }
}
