export class Point {

    constructor(readonly x: number, readonly y: number) {}

    plus(diff: Point) {
        return new Point(this.x + diff.x, this.y + diff.y);
    }

    isEqual(other: Point) {
        return this.x === other.x && this.y === other.y;
    }
}

export class Rectangle {
    constructor(readonly p: Point, readonly w: number, readonly h: number) {}

    contains(p: Point) : boolean {
        return p.x >= this.p.x && (p.x < this.p.x + this.w) && p.y >= this.p.y && (p.y < this.p.y + this.h);
    }
}

export function P(x: number, y: number) { return new Point(x, y); }
export function R(p: Point, w: number, h: number) { return new Rectangle(p, w, h); }