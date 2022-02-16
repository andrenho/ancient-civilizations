function move_active_unit(game, dir_x, dir_y)
    if game.active_unit then
        game.active_unit.x = game.active_unit.x + dir_x
        game.active_unit.y = game.active_unit.y + dir_y
    end
end