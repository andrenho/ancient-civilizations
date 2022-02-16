local TILE_W = 32
local TILE_H = 32
local SCALE = 2

local images = {}
local nation_colors = {}
local r = { x = -5, y = -5 }

function ui_initialize(game)
    love.graphics.setDefaultFilter('nearest', 'nearest')

    images.warrior = love.graphics.newImage('media/warrior.png')

    nation_colors[game.nations[1]] = { 1, 0.5, 0 }  -- egypt
    nation_colors[game.nations[2]] = { 1, 0, 0 }    -- phoenicia
end

function draw_map(game)
    love.graphics.scale(SCALE, SCALE)
    love.graphics.clear(0.3, 0.7, 0.3)

    -- center in main unit
    if game.active_unit then
        r.x = game.active_unit.x - (love.graphics.getWidth() / 2 / SCALE / TILE_W) + 0.5
        r.y = game.active_unit.y - (love.graphics.getHeight() / 2 / SCALE / TILE_H) + 0.5
    end

    -- units
    for _,unit in ipairs(game.units) do
        local image = images.warrior
        local x = (unit.x - r.x) * TILE_W
        local y = (unit.y - r.y) * TILE_H
        love.graphics.draw(image, x, y)

        -- draw nation
        local rect = { x = (unit.x - r.x) * TILE_W + 24, y = (unit.y - r.y) * TILE_H, w = 8, h = 8 }
        love.graphics.setColor(unpack(nation_colors[unit.nation]))
        love.graphics.rectangle('fill', rect.x, rect.y, rect.h, rect.w)
        love.graphics.setColor(0, 0, 0)
        love.graphics.rectangle('line', rect.x, rect.y, rect.h, rect.w)
        love.graphics.setColor(1, 1, 1)
    end
end