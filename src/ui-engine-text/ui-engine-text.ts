import UiInterface from "../interfaces/ui-interface";
import GameInterface, {GameObject, GameObjectType} from "../interfaces/game-interface";
import {P, Point, R} from "../common/geometry";
import Terrain from "../game/terrain";
import Tile from "../game/tile";

export default class UiEngineText implements UiInterface {

    static readonly TILE_SZ = 24;
    static readonly #terrainColors = new Map<string, string>([
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
    }

    //
    // DRAW
    //

    redraw(): void {
        const w = this.#mapCanvas.width / UiEngineText.TILE_SZ;
        const h = this.#mapCanvas.height / UiEngineText.TILE_SZ;
        for (let [p, object] of this.game.objects(R(P(0, 0), w, h)))
            this.draw(p, object);
    }

    private draw(p: Point, object: GameObject) {
        const pt = P(p.x * UiEngineText.TILE_SZ, p.y * UiEngineText.TILE_SZ);
        switch (object.kind) {
            case GameObjectType.Tile:
                this.#mapCtx.fillStyle = UiEngineText.#terrainColors.get((object as Tile).terrain)!;
                this.#mapCtx.fillRect(pt.x, pt.y, UiEngineText.TILE_SZ, UiEngineText.TILE_SZ);
                break;
            case GameObjectType.Unit:
                this.#mapCtx.font = `${UiEngineText.TILE_SZ - 2}px monospace`;
                this.#mapCtx.fillStyle = 'black';
                this.#mapCtx.textBaseline = 'top';
                this.#mapCtx.fillText('W', pt.x, pt.y);
                break;
        }
    }
}