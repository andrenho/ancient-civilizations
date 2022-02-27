export class Point {

    constructor(readonly x: number, readonly y: number) {}

    plus(diff: Point) {
        return new Point(this.x + diff.x, this.y + diff.y);
    }
}

export class Rectangle {
    constructor(readonly p: Point, readonly w: number, readonly h: number) {}
}

export function P(x: number, y: number) { return new Point(x, y); }
export function R(p: Point, w: number, h: number) { return new Rectangle(p, w, h); }