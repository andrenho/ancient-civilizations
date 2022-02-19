var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
System.register("common/geometry", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function include_point(rectangle, point) {
        return point.x >= rectangle.x && point.x < (rectangle.x + rectangle.w) && point.y >= rectangle.y && point.y < (rectangle.y + rectangle.h);
    }
    exports_1("include_point", include_point);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("game/static", [], function (exports_2, context_2) {
    "use strict";
    var Terrain, UnitType, UnitTypes, NationDef, Nations;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            (function (Terrain) {
                Terrain[Terrain["GRASSLAND"] = 0] = "GRASSLAND";
            })(Terrain || (Terrain = {}));
            exports_2("Terrain", Terrain);
            (function (UnitType) {
                UnitType[UnitType["UNIT"] = 0] = "UNIT";
            })(UnitType || (UnitType = {}));
            exports_2("UnitType", UnitType);
            exports_2("UnitTypes", UnitTypes = []);
            UnitTypes[UnitType.UNIT] = { moves: 2 };
            (function (NationDef) {
                NationDef[NationDef["PHOENICIA"] = 0] = "PHOENICIA";
            })(NationDef || (NationDef = {}));
            exports_2("NationDef", NationDef);
            exports_2("Nations", Nations = []);
            Nations[NationDef.PHOENICIA] = { id: NationDef.PHOENICIA, name: "Phoenicia", color: "#a04040", isPlayerNation: false };
        }
    };
});
System.register("game/unit", ["game/static"], function (exports_3, context_3) {
    "use strict";
    var _Unit_pos, _Unit_moves, static_1, Unit;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (static_1_1) {
                static_1 = static_1_1;
            }
        ],
        execute: function () {
            Unit = class Unit {
                constructor(nation, pos, type) {
                    this.nation = nation;
                    this.type = type;
                    _Unit_pos.set(this, void 0);
                    _Unit_moves.set(this, 0);
                    __classPrivateFieldSet(this, _Unit_pos, pos, "f");
                    this.newTurn();
                }
                get pos() { return __classPrivateFieldGet(this, _Unit_pos, "f"); }
                get moves() { return __classPrivateFieldGet(this, _Unit_moves, "f"); }
                moveBy(x, y, steps) {
                    if (steps > __classPrivateFieldGet(this, _Unit_moves, "f"))
                        return false;
                    __classPrivateFieldGet(this, _Unit_pos, "f").x += x;
                    __classPrivateFieldGet(this, _Unit_pos, "f").y += y;
                    __classPrivateFieldSet(this, _Unit_moves, __classPrivateFieldGet(this, _Unit_moves, "f") - steps, "f");
                    if (__classPrivateFieldGet(this, _Unit_moves, "f") < 0)
                        __classPrivateFieldSet(this, _Unit_moves, 0, "f");
                    return true;
                }
                isFromPlayerNation() {
                    return this.nation.isPlayerNation;
                }
                hasMovesLeft() {
                    return __classPrivateFieldGet(this, _Unit_moves, "f") > 0;
                }
                newTurn() {
                    __classPrivateFieldSet(this, _Unit_moves, static_1.UnitTypes[this.type].moves, "f");
                }
            };
            exports_3("default", Unit);
            _Unit_pos = new WeakMap(), _Unit_moves = new WeakMap();
        }
    };
});
System.register("game/tile", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("game/game", ["game/unit", "game/static"], function (exports_5, context_5) {
    "use strict";
    var _Game_activeUnit, _Game_year, _Game_playerNation, unit_1, static_2, Game;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (unit_1_1) {
                unit_1 = unit_1_1;
            },
            function (static_2_1) {
                static_2 = static_2_1;
            }
        ],
        execute: function () {
            Game = class Game {
                constructor() {
                    this.units = [];
                    _Game_activeUnit.set(this, void 0);
                    _Game_year.set(this, 2000);
                    _Game_playerNation.set(this, static_2.Nations[static_2.NationDef.PHOENICIA]);
                    __classPrivateFieldGet(this, _Game_playerNation, "f").isPlayerNation = true;
                    this.units.push(new unit_1.default(__classPrivateFieldGet(this, _Game_playerNation, "f"), { x: 0, y: 0 }, static_2.UnitType.UNIT));
                    this.units.push(new unit_1.default(__classPrivateFieldGet(this, _Game_playerNation, "f"), { x: 1, y: 1 }, static_2.UnitType.UNIT));
                    __classPrivateFieldSet(this, _Game_activeUnit, this.units[0], "f");
                }
                get activeUnit() { return __classPrivateFieldGet(this, _Game_activeUnit, "f"); }
                get year() { return __classPrivateFieldGet(this, _Game_year, "f"); }
                get playerNation() { return __classPrivateFieldGet(this, _Game_playerNation, "f"); }
                tile(pos) {
                    return { terrain: static_2.Terrain.GRASSLAND };
                }
                moveActiveUnit(rel) {
                    const unit = __classPrivateFieldGet(this, _Game_activeUnit, "f");
                    if (unit && unit.moveBy(rel.x, rel.y, 1)) {
                        if (!unit.hasMovesLeft()) {
                            this.wait_for_next_unit();
                            if (!__classPrivateFieldGet(this, _Game_activeUnit, "f"))
                                this.newTurn();
                        }
                        return unit;
                    }
                    return null;
                }
                availableUnits() {
                    return this.units.filter(unit => unit.isFromPlayerNation() && unit.hasMovesLeft());
                }
                next_unit() {
                    const units = this.availableUnits();
                    if (units.length == 0)
                        return null;
                    else if (units.length == 1)
                        return units[0];
                    let current = -1;
                    if (__classPrivateFieldGet(this, _Game_activeUnit, "f"))
                        current = units.findIndex((unit) => unit == __classPrivateFieldGet(this, _Game_activeUnit, "f"));
                    let next = (current + 1) % this.units.length;
                    return units[next];
                }
                wait_for_next_unit() {
                    __classPrivateFieldSet(this, _Game_activeUnit, this.next_unit(), "f");
                }
                newTurn() {
                    __classPrivateFieldSet(this, _Game_year, __classPrivateFieldGet(this, _Game_year, "f") - 0.5, "f");
                    this.units.forEach((unit) => unit.newTurn());
                    this.wait_for_next_unit();
                }
            };
            exports_5("default", Game);
            _Game_activeUnit = new WeakMap(), _Game_year = new WeakMap(), _Game_playerNation = new WeakMap();
        }
    };
});
System.register("common/types", [], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("ui/canvas", [], function (exports_7, context_7) {
    "use strict";
    var Canvas;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [],
        execute: function () {
            Canvas = class Canvas {
                constructor(canvasName, zoom) {
                    this.zoom = zoom;
                    this.images = new Map();
                    this.canvas = document.getElementById(canvasName);
                    this.ctx = this.canvas.getContext("2d");
                    this.resize();
                }
                resize() {
                    this.canvas.width = window.innerWidth / this.zoom / window.devicePixelRatio;
                    this.canvas.height = window.innerHeight / this.zoom / window.devicePixelRatio;
                    this.canvas.style.width = `${window.innerWidth}px`;
                    this.canvas.style.height = `${window.innerHeight}px`;
                }
                load_images_(images) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const image_load = (name, url) => {
                            return new Promise((resolve, reject) => {
                                const img = new Image();
                                img.addEventListener('load', () => resolve([name, img]));
                                img.addEventListener('error', () => reject(new Error(`Failed to load ${url}.`)));
                                img.src = url;
                            });
                        };
                        const imagePromises = [];
                        for (const imageName in images)
                            imagePromises.push(image_load(imageName, images[imageName]));
                        return new Promise(((resolve, reject) => {
                            Promise.all(imagePromises).then(values => {
                                for (const [imageName, url] of values)
                                    this.images.set(imageName, url);
                                resolve();
                            }).catch(err => reject(err));
                        }));
                    });
                }
            };
            exports_7("default", Canvas);
        }
    };
});
System.register("ui/graphics", ["common/geometry", "ui/canvas"], function (exports_8, context_8) {
    "use strict";
    var _Graphics_rel, _Graphics_blocked, _Graphics_blinkState, _Graphics_SCALE, geometry_1, canvas_1, IMAGE_LIST, TILE, ZOOM, BOUNDS_INLET, SCROLL_BY, MOVE_STEPS, Graphics;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (geometry_1_1) {
                geometry_1 = geometry_1_1;
            },
            function (canvas_1_1) {
                canvas_1 = canvas_1_1;
            }
        ],
        execute: function () {
            IMAGE_LIST = {
                warrior: 'img/warrior.png',
            };
            TILE = { W: 32, H: 32 };
            ZOOM = 2;
            BOUNDS_INLET = 3;
            SCROLL_BY = 2;
            MOVE_STEPS = 16;
            Graphics = class Graphics extends canvas_1.default {
                constructor() {
                    super("graphics", ZOOM);
                    _Graphics_rel.set(this, { x: 0, y: 0 });
                    _Graphics_blocked.set(this, false);
                    _Graphics_blinkState.set(this, true);
                    _Graphics_SCALE.set(this, { x: TILE.W / this.zoom, y: TILE.H / this.zoom });
                }
                get blocked() { return __classPrivateFieldGet(this, _Graphics_blocked, "f"); }
                load_images() {
                    return __awaiter(this, void 0, void 0, function* () {
                        return this.load_images_(IMAGE_LIST);
                    });
                }
                bounds(inlet = 0) {
                    return {
                        x: Math.round(__classPrivateFieldGet(this, _Graphics_rel, "f").x - 1) + inlet,
                        y: Math.round(__classPrivateFieldGet(this, _Graphics_rel, "f").y - 1) + inlet,
                        w: Math.round((this.canvas.width / TILE.W) + 2) - (2 * inlet),
                        h: Math.round((this.canvas.height / TILE.H) + 2) - (2 * inlet)
                    };
                }
                draw(game) {
                    const bounds = this.bounds();
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    this.drawTerrain(game, bounds);
                    this.drawUnits(game, bounds);
                }
                drawTerrain(game, bounds) {
                    for (let x = bounds.x; x < (bounds.x + bounds.w); ++x)
                        for (let y = bounds.y; y < (bounds.y + bounds.h); ++y)
                            this.drawTile(game, { x, y });
                }
                drawUnits(game, bounds) {
                    for (const unit of game.units)
                        if (geometry_1.include_point(bounds, unit.pos))
                            this.drawUnit(game, unit);
                }
                drawTile(game, pos) {
                    const rRel = this.roundRel();
                    this.ctx.fillStyle = "#50a050";
                    this.ctx.fillRect((pos.x - rRel.x) * TILE.W, (pos.y - rRel.y) * TILE.H, TILE.W, TILE.H);
                }
                drawUnit(game, unit, rel = { x: 0, y: 0 }) {
                    const image = this.images.get('warrior');
                    const tile = this.tileToPx(unit.pos, rel);
                    this.ctx.drawImage(image, tile.x, tile.y, TILE.W, TILE.H);
                    const x = tile.x + Math.round(TILE.W * 2 / 3) - 0.5;
                    const y = tile.y + 0.5;
                    const w = Math.round(TILE.W / 3);
                    const h = Math.round(TILE.H / 3);
                    this.ctx.strokeStyle = 'black';
                    this.ctx.fillStyle = unit.nation.color;
                    this.ctx.beginPath();
                    this.ctx.rect(x, y, w, h);
                    this.ctx.fill();
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
                swapBlinkState(game) {
                    if (__classPrivateFieldGet(this, _Graphics_blinkState, "f")) {
                        this.draw(game);
                    }
                    else if (game.activeUnit) {
                        this.drawTile(game, game.activeUnit.pos);
                    }
                    __classPrivateFieldSet(this, _Graphics_blinkState, !__classPrivateFieldGet(this, _Graphics_blinkState, "f"), "f");
                }
                drag(rel) {
                    __classPrivateFieldGet(this, _Graphics_rel, "f").x -= (rel.x / (TILE.W * this.zoom * window.devicePixelRatio));
                    __classPrivateFieldGet(this, _Graphics_rel, "f").y -= (rel.y / (TILE.H * this.zoom * window.devicePixelRatio));
                }
                roundRel() {
                    return {
                        x: Math.round(__classPrivateFieldGet(this, _Graphics_rel, "f").x * __classPrivateFieldGet(this, _Graphics_SCALE, "f").x) / __classPrivateFieldGet(this, _Graphics_SCALE, "f").x,
                        y: Math.round(__classPrivateFieldGet(this, _Graphics_rel, "f").y * __classPrivateFieldGet(this, _Graphics_SCALE, "f").y) / __classPrivateFieldGet(this, _Graphics_SCALE, "f").y,
                    };
                }
                scrollIfActiveUnitOutOfScreen(game) {
                    const unit = game.activeUnit;
                    if (unit) {
                        const rect = this.bounds(BOUNDS_INLET);
                        if (unit.pos.x < rect.x) {
                            __classPrivateFieldGet(this, _Graphics_rel, "f").x -= SCROLL_BY;
                            this.draw(game);
                        }
                        else if (unit.pos.x > (rect.x + rect.w - 1)) {
                            __classPrivateFieldGet(this, _Graphics_rel, "f").x += SCROLL_BY;
                            this.draw(game);
                        }
                        if (unit.pos.y < rect.y) {
                            __classPrivateFieldGet(this, _Graphics_rel, "f").y -= SCROLL_BY;
                            this.draw(game);
                        }
                        else if (unit.pos.y > (rect.y + rect.h - 1)) {
                            __classPrivateFieldGet(this, _Graphics_rel, "f").y += SCROLL_BY;
                            this.draw(game);
                        }
                    }
                }
                centerOnUnit(unit) {
                    __classPrivateFieldGet(this, _Graphics_rel, "f").x = unit.pos.x - (window.innerWidth / TILE.W / this.zoom / window.devicePixelRatio / 2) + 0.5;
                    __classPrivateFieldGet(this, _Graphics_rel, "f").y = unit.pos.y - (window.innerHeight / TILE.H / this.zoom / window.devicePixelRatio / 2) + 0.5;
                }
                tileToPx(pos, rel = { x: 0, y: 0 }) {
                    const rRel = this.roundRel();
                    return {
                        x: (pos.x - rRel.x + rel.x) * TILE.W,
                        y: (pos.y - rRel.y + rel.y) * TILE.H
                    };
                }
                animateUnitMovement(game, unit, dir) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const drawTileInPos = (pos, exceptUnit) => {
                            this.drawTile(game, pos);
                            game.units
                                .filter(unit => unit.pos.x === pos.x && unit.pos.y === pos.y && unit !== exceptUnit)
                                .forEach(unit => this.drawUnit(game, unit));
                        };
                        __classPrivateFieldSet(this, _Graphics_blocked, true, "f");
                        const pos = this.tileToPx({ x: unit.pos.x - 1, y: unit.pos.y - 1 });
                        drawTileInPos(unit.pos, unit);
                        drawTileInPos({ x: unit.pos.x - dir.x, y: unit.pos.y - dir.y }, unit);
                        const screenshot = this.ctx.getImageData(pos.x, pos.y, TILE.W * 3, TILE.H * 3);
                        yield new Promise(resolve => {
                            let handleId = 0;
                            const rel = { x: -dir.x, y: -dir.y };
                            let i = 1;
                            let step;
                            step = () => {
                                [rel.x, rel.y] = [rel.x + (dir.x / MOVE_STEPS), rel.y + (dir.y / MOVE_STEPS)];
                                this.ctx.putImageData(screenshot, pos.x, pos.y);
                                this.drawUnit(game, unit, rel);
                                if (i < MOVE_STEPS) {
                                    handleId = window.requestAnimationFrame(step);
                                }
                                else {
                                    window.cancelAnimationFrame(handleId);
                                    __classPrivateFieldSet(this, _Graphics_blocked, false, "f");
                                    resolve();
                                }
                                ++i;
                            };
                            window.requestAnimationFrame(step);
                        });
                    });
                }
            };
            exports_8("default", Graphics);
            _Graphics_rel = new WeakMap(), _Graphics_blocked = new WeakMap(), _Graphics_blinkState = new WeakMap(), _Graphics_SCALE = new WeakMap();
        }
    };
});
System.register("ui/ui", ["ui/canvas"], function (exports_9, context_9) {
    "use strict";
    var canvas_2, UI;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [
            function (canvas_2_1) {
                canvas_2 = canvas_2_1;
            }
        ],
        execute: function () {
            UI = class UI extends canvas_2.default {
                constructor() {
                    super("ui", 1);
                }
                draw(game) {
                    this.ctx.font = '32px Adonais';
                    this.ctx.fillStyle = 'black';
                    const x = this.canvas.width - 280;
                    let y = this.canvas.height - 120;
                    this.ctx.clearRect(x, y, 280, 120);
                    if (game.activeUnit)
                        this.ctx.fillText(`Steps: ${game.activeUnit.moves}`, x, y += 40);
                    this.ctx.fillText(`Year: ${game.year} B.C.`, x, y += 40);
                }
            };
            exports_9("default", UI);
        }
    };
});
System.register("index", ["ui/graphics", "game/game", "ui/ui"], function (exports_10, context_10) {
    "use strict";
    var graphics_1, game_1, ui_1, BLINK_SPEED, DIRECTIONS, game, graphics, ui, mouseDragging, touchDragging;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (graphics_1_1) {
                graphics_1 = graphics_1_1;
            },
            function (game_1_1) {
                game_1 = game_1_1;
            },
            function (ui_1_1) {
                ui_1 = ui_1_1;
            }
        ],
        execute: function () {
            BLINK_SPEED = 500;
            DIRECTIONS = {
                Numpad1: { x: -1, y: 1 },
                Numpad2: { x: 0, y: 1 },
                Numpad3: { x: 1, y: 1 },
                Numpad4: { x: -1, y: 0 },
                Numpad6: { x: 1, y: 0 },
                Numpad7: { x: -1, y: -1 },
                Numpad8: { x: 0, y: -1 },
                Numpad9: { x: 1, y: -1 },
            };
            game = new game_1.default();
            graphics = new graphics_1.default();
            ui = new ui_1.default();
            mouseDragging = false;
            touchDragging = null;
            document.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
                yield graphics.load_images();
                graphics.centerOnUnit(game.activeUnit);
                ui.draw(game);
                setInterval(() => graphics.swapBlinkState(game), BLINK_SPEED);
            }));
            document.addEventListener('keydown', (event) => __awaiter(void 0, void 0, void 0, function* () {
                const dir = DIRECTIONS[event.code];
                if (dir && !graphics.blocked) {
                    const unit = game.moveActiveUnit(dir);
                    if (unit) {
                        graphics.scrollIfActiveUnitOutOfScreen(game);
                        graphics.drawUnit(game, unit);
                        yield graphics.animateUnitMovement(game, unit, dir);
                    }
                }
                switch (event.code) {
                    case 'KeyW':
                        game.wait_for_next_unit();
                        graphics.scrollIfActiveUnitOutOfScreen(game);
                        ui.draw(game);
                        break;
                    case 'Space':
                        game.newTurn();
                        graphics.scrollIfActiveUnitOutOfScreen(game);
                        ui.draw(game);
                        break;
                }
            }));
            window.addEventListener('contextmenu', event => {
                event.preventDefault();
                return false;
            });
            window.addEventListener('mousedown', event => {
                if (event.button == 2) {
                    mouseDragging = true;
                }
            });
            window.addEventListener('mouseup', event => {
                if (event.button == 2) {
                    mouseDragging = false;
                }
            });
            window.addEventListener('mousemove', event => {
                if (mouseDragging) {
                    graphics.drag({ x: event.movementX, y: event.movementY });
                    graphics.draw(game);
                }
            });
            window.addEventListener('touchstart', event => {
                if (event.touches[0])
                    touchDragging = { x: event.touches[0].clientX, y: event.touches[0].clientY };
            });
            window.addEventListener('touchend', () => {
                touchDragging = null;
            });
            window.addEventListener('touchmove', event => {
                if (touchDragging && event.changedTouches[0]) {
                    const rel = {
                        x: event.changedTouches[0].clientX - touchDragging.x,
                        y: event.changedTouches[0].clientY - touchDragging.y,
                    };
                    touchDragging = {
                        x: event.changedTouches[0].clientX,
                        y: event.changedTouches[0].clientY,
                    };
                    graphics.drag(rel);
                    graphics.draw(game);
                }
            });
            window.addEventListener('resize', () => {
                graphics.resize();
                ui.resize();
                graphics.draw(game);
                ui.draw(game);
            });
        }
    };
});
//# sourceMappingURL=ancciv.js.map