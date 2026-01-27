// ============================================================================
// MAIN GAME UPDATE
// ----------------------------------------------------------------------------
function updateGame(device, game, delta) 
{
    try 
    {
        const gameClock = game.gameTimers.getObjectByName(timerTypes.GAME_CLOCK.name);
        const playDelayTimer = game.gameTimers.getObjectByName(timerTypes.PLAY_DELAY.name);

        switch (game.gameState) 
        {
            case gameStates.INIT:
                try 
                {
                    game.setGame();
                    playDelayTimer.update(delta);

                    if (game.gamePadConnected && device.keys.toggleOnce(device.keys.isKeyPressed(keyTypes.Q), { value: device.keys.wasQPressed })) 
                    {
                        game.gamePadEnabled = !game.gamePadEnabled;
                    }

                    if (playDelayTimer.active) break;

                    const playPressed = device.keys.isKeyPressed(keyTypes.PLAY_KEY) || device.keys.isGamepadButtonPressed(gamepadButtons.START);
                    if ((game.gamePadEnabled && playPressed) || (!game.gamePadEnabled && playPressed && game.keyboardTouched)) 
                    {
                        game.setGameState(gameStates.PLAY);
                    }
                }
                catch (e) { console.error("INIT state error:", e); }
                break;

            case gameStates.PLAY:
                try 
                {
                    if (gameClock.active) gameClock.update(delta);
                    if (gameClock.timeLeft === 0) { game.setGameState(gameStates.LOSE); break; }

                    // Player & enemies
                    game.player.update(device, game, delta);
                    game.enemyHolder.forEach(e => e.update(delta, game, game.player));

                    // Player collisions with enemies
                    if (checkPlayerCollisions(game.enemyHolder, game.player) !== false) 
                    {
                        device.audio.playSound(soundTypes.HURT.name);
                        game.setGameState(gameStates.LOSE);
                        break;
                    }

                    // Player collisions with goals
                    if (game.goalHolder.getSize()) 
                    {
                        const idx = checkPlayerCollisions(game.goalHolder, game.player);
                        if (idx !== false) 
                        {
                            game.goalHolder.subObject(idx);
                            device.audio.playSound(soundTypes.GET.name);
                            game.increaseScore(1);
                        }
                    }
                    else 
                    {
                        game.setGameState(gameStates.WIN);
                        game.increaseGameLevel();
                        break;
                    }

                    device.keys.checkForPause(game);

                }
                catch (e) { console.error("PLAY state error:", e); }
                break;

            case gameStates.PAUSE:
                try { device.keys.checkForPause(game); }
                catch (e) { console.error("PAUSE state error:", e); }
                break;

            case gameStates.WIN:
                try 
                {
                    if (device.keys.isKeyPressed(keyTypes.RESET_KEY) || device.keys.isGamepadButtonPressed(gamepadButtons.START)) 
                    {
                        game.setGame();
                        game.setGameState(gameStates.PLAY);
                    }
                }
                catch (e) { console.error("WIN state error:", e); }
                break;

            case gameStates.LOSE:
                try 
                {
                    if (device.keys.isKeyPressed(keyTypes.RESET_KEY) || device.keys.isGamepadButtonPressed(gamepadButtons.START)) 
                    {
                        if (game.lives !== 0) 
                        {
                            game.lives--;
                            game.setGame();
                            game.setGameState(gameStates.PLAY);
                        } else {
                            game.setGameState(gameStates.INIT);
                            playDelayTimer.reset(game.gameConsts.PLAY_PAUSE_DELAY_TIME);
                        }
                    }
                } 
                catch (e) { console.error("LOSE state error:", e); }
                break;

            default:
                console.warn("Unknown game state:", game.gameState);
        }
    } catch (e) { console.error("updateGame main error:", e); }
}