import {IGameState, IMapTile} from "./game-interface";

export function mapTile(state: IGameState, x: number, y: number) : IMapTile | undefined {
    const sx = state.tileIndex[x];
    if (sx === undefined)
        return undefined;
    const sy = sx[y];
    if (sy === undefined)
        return undefined;
    return state.tiles[sy];
}