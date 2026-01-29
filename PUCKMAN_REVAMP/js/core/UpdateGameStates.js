// ============================================================================
// CONTROLLER UPDATE_GAME STATE HANDLERS
// ============================================================================

// ---------------------------
// INIT STATE HANDLER
// ---------------------------
function handleInitState(device, game, playDelayTimer, delta)
{
    try
    {
        device.audio.stopAll();
        game.setGame();
        playDelayTimer.update(delta);

        // Toggle gamepad with Q
        if (game.gamePadConnected &&
            device.keys.toggleOnce(device.keys.isKeyPressed(keyTypes.Q), { value: device.keys.wasQPressed }))
        {
            game.gamePadEnabled = !game.gamePadEnabled;
        }

        if (playDelayTimer.active)
        {
            return;
        }

        // Start game if play pressed
        const playPressed = device.keys.isKeyPressed(keyTypes.PLAY_KEY) ||
                            device.keys.isGamepadButtonPressed(gamepadButtons.START);

        if ((game.gamePadEnabled && playPressed) ||
            (!game.gamePadEnabled && playPressed && game.keyboardTouched))
        {
            game.setGameState(gameStates.PLAY);
        }
    }
    catch (e)
    {
        console.error("INIT state error:", e);
    }
}
// ---------------------------
// PLAY STATE HANDLER
// ---------------------------
function handlePlayState(device, game, gameClock, delta)
{
    try
    {
        

        if (gameClock.active)
        {
            gameClock.update(delta);
        }

        if (gameClock.timeLeft === 0)
        {
            device.audio.playSound(soundTypes.TIMEOUT);

            if (game.lives === 1)
            {
                device.audio.playSound(soundTypes.LOSE);
            }

            game.decreaseLives();
            game.setGameState(gameStates.LOSE);
            return;
        }

        // Update entities
        game.player.update(device, game, delta, soundTypes.MOVE);
        game.enemyHolder.forEach(e =>
        {
            e.update(delta, game, game.player);
        });

        // Player collisions
        if (checkPlayerCollisions(game.enemyHolder, game.player) !== false)
        {
            device.audio.stopSound(soundTypes.MOVE);
            device.audio.playSound(soundTypes.HURT);

            if (game.lives === 1)
            {
                device.audio.stopSound(soundTypes.MOVE);
                device.audio.playSound(soundTypes.LOSE);
            }

            game.decreaseLives();
            game.setGameState(gameStates.LOSE);
            return;
        }

        // Goal pickup
        if (game.goalHolder.getSize() !== 0)
        {
            const idx = checkPlayerCollisions(game.goalHolder, game.player);

            if (idx !== false)
            {
                device.audio.playSound(soundTypes.PICKUP);
                game.goalHolder.subObject(idx);

                if (game.increaseScore(game.gameConsts.VALUE_FOR_GETTING_GOAL) > 0)
                {
                    device.audio.playSound(soundTypes.LIFE);
                }
            }
        }
        else
        {
            // Level complete becuse all goals have been collected
            const timeBonus = Math.floor(gameClock.timeLeft * game.gameConsts.VALUE_FOR_UNIT_OF_TIME_LEFT);
            const winBonus = game.gameConsts.VALUE_FOR_WINNING_LEVEL;
            const totalLivesGained = game.increaseScore(timeBonus) + game.increaseScore(winBonus);

            device.audio.stopSound(soundTypes.MOVE);

            if (totalLivesGained > 0)
            {
                device.audio.playSound(soundTypes.LIFE);
            }

            device.audio.playSound(soundTypes.WIN);

            game.increaseGameLevel();
            game.setGameState(gameStates.WIN);
        }

        device.keys.checkForPause(game);

    }
    catch (e)
    {
        console.error("PLAY state error:", e);
    }
}

// ---------------------------
// PAUSE STATE HANDLER
// ---------------------------
function handlePauseState(device, game)
{
    try
    {
        device.keys.checkForPause(game);
    }
    catch (e)
    {
        console.error("PAUSE state error:", e);
    }
}

// ---------------------------
// WIN STATE HANDLER
// ---------------------------
function handleWinState(device, game)
{
    try
    {
        if (device.keys.isKeyPressed(keyTypes.RESET_KEY) ||
            device.keys.isGamepadButtonPressed(gamepadButtons.START))
        {
            device.audio.stopAll();
            game.setGame();
            game.setGameState(gameStates.PLAY);
        }
    }
    catch (e)
    {
        console.error("WIN state error:", e);
    }
}

// ---------------------------
// LOSE STATE HANDLER
// ---------------------------
function handleLoseState(device, game, playDelayTimer)
{
    try
    {
        if (device.keys.isKeyPressed(keyTypes.RESET_KEY) ||
            device.keys.isGamepadButtonPressed(gamepadButtons.START))
        {
            if (game.lives !== 0)
            {
                game.setGame();
                game.setGameState(gameStates.PLAY);
            }
            else
            {
                game.setGameState(gameStates.INIT);
                playDelayTimer.setAndStart(game.gameConsts.PLAY_PAUSE_DELAY_TIME);
            }
        }
    }
    catch (e)
    {
        console.error("LOSE state error:", e);
    }
}
