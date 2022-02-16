require('engine/game')
require('engine/map')
require('./draw')

local game

local MOVE_KEYS = {
    kp7 = { -1, -1 }, kp8 = { 0, -1 }, kp9 = { 1, -1 },
    kp4 = { -1, 0 },                   kp6 = { 1, 0 },
    kp1 = { -1, 1 },  kp2 = { 0, 1 },  kp3 = { 1, 1 },
}

function love.load(args)
    game = create_game()

    game.view = 'map'
    ui_initialize(game)
end

function love.update(dt)
end

function love.keypressed(key, scancode, isrepeat)
    if key == 'q' then love.event.quit() end
    if game.view == 'map' then
        for k,v in pairs(MOVE_KEYS) do if key == k then move_active_unit(game, unpack(v)) end end
    end
end

function love.draw()
    if game.view == 'map' then
        draw_map(game)
    end
end