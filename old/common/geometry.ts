export interface Position {
    x: number;
    y: number;
}

export interface Rectangle {
    x: number;
    y: number;
    w: number;
    h: number;
}

export function include_point(rectangle: Rectangle, point: Position) : boolean {
    return point.x >= rectangle.x && point.x < (rectangle.x + rectangle.w) && point.y >= rectangle.y && point.y < (rectangle.y + rectangle.h);
}