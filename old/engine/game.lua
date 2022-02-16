function create_game()
    local game = {
        nations = {
            { name = 'Egypt' },
            { name = 'Phoenicia' },
        }
    }
    game.player = game.nations[2]
    game.units = {
        { x = 0, y = 0, nation = game.player },
    }
    start_round(game)
    return game
end

function start_round(game)
    -- find first active unit
    for _,unit in ipairs(game.units) do
        if unit.nation == game.player then
            game.active_unit = unit
            break
        end
    end
end