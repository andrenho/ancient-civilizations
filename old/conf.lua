function love.conf(t)
    t.version = '11.3'
    t.window.title = 'Ancient Civiliations'
    -- TODO - t.icon = ...
    t.window.resizable = true
    t.window.display = 2  -- TODO

    -- disable unused stuff
    t.modules.physics = false
end