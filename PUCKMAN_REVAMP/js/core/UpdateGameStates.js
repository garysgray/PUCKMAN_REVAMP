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

        // If still active then we wait till delay is done
        if (playDelayTimer.active)
        {
            return;
        }

        // Start game if play pressed
        const playPressed = device.keys.isKeyPressed(keyTypes.PLAY_KEY) || device.keys.isGamepadButtonPressed(gamepadButtons.START);

        if ((game.gamePadEnabled && playPressed) || (!game.gamePadEnabled && playPressed && game.keyboardTouched))
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
function handlePlayState(device, game, gameClock, loseSoundDelayTimer, delta)
{
    try
    {
        device.audio.setAudioGameState(AudioStates.PLAY);

        // Update game clock
        if (gameClock.active) gameClock.update(delta);

        // Timer ran out
        if (gameClock.timeLeft === game.gameConsts.NO_TIME)
        {
            device.audio.requestSound(soundTypes.TIMEOUT, game.gameConsts.PRIORITY_TIMEOUT, [AudioStates.PLAY]);

            if (game.lives === game.gameConsts.LAST_LIFE)
            {
                device.audio.setAudioGameState(AudioStates.LOSE);
                device.audio.requestSound(soundTypes.LOSE, game.gameConsts.PRIORITY_LOSE, [AudioStates.LOSE]);
            }

            game.decreaseLives();
            device.audio.setAudioGameState(AudioStates.LOSE);
            game.setGameState(gameStates.LOSE);
            return;
        }

        // Update entities
        game.player.update(device, game, delta, soundTypes.MOVE);
        game.enemyHolder.forEach(e => e.update(delta, game, game.player));

        // ---------------------------
        // Player collisions
        // ---------------------------
    
        const hitIndex = checkPlayerCollisions(game.enemyHolder, game.player);

        if (hitIndex !== false && !game.player.isDying) 
        {
            // Latch death
            game.player.isDying = true;

            device.audio.stopSound(soundTypes.MOVE);

            // Play HURT once
            if (!game.player.justHit) 
            {
                device.audio.requestSound(soundTypes.HURT);
                game.player.justHit = true;
            }

            // Last life -> delay LOSE sound
            if (game.lives === game.gameConsts.LAST_LIFE) 
            {
                if (!loseSoundDelayTimer.active) 
                    loseSoundDelayTimer.setAndStart(game.gameConsts.LOSE_SOUND_DELAY_TIME);

                return; // delayed LOSE handled below
            } 
            else 
            {
                game.decreaseLives();
                game.setGameState(gameStates.LOSE);
                return;
            }
        }

        // ---------------------------
        // Handle delayed LOSE for last life
        // ---------------------------
        if (game.player.isDying && game.lives === game.gameConsts.LAST_LIFE)
        {
            if (loseSoundDelayTimer.update(delta))
            {
                device.audio.setAudioGameState(AudioStates.LOSE);
                device.audio.requestSound(soundTypes.LOSE, game.gameConsts.PRIORITY_LOSE_DELAYED, [AudioStates.LOSE]);
                game.decreaseLives();
                game.setGameState(gameStates.LOSE);
                return;
            }
        }

        // ---------------------------
        // Goal pickup
        // ---------------------------
        if (game.goalHolder.getSize() !== game.gameConsts.NO_LIVES)
        {
            const goalIndex = checkPlayerCollisions(game.goalHolder, game.player);
            if (goalIndex !== false)
            {
                device.audio.requestSound(soundTypes.PICKUP);
                game.goalHolder.subObject(goalIndex);

                if (game.increaseScore(game.gameConsts.VALUE_FOR_GETTING_GOAL) > game.gameConsts.NO_VALUE)
                    device.audio.requestSound(soundTypes.LIFE);
            }
        }
        else
        {
            // Level complete
            const timeBonus = game.calculateTimeBonus(gameClock.timeLeft);
            const winBonus = game.gameConsts.VALUE_FOR_WINNING_LEVEL;
            const totalLivesGained = game.increaseScore(timeBonus) + game.increaseScore(winBonus);

            device.audio.stopSound(soundTypes.MOVE);

            if (totalLivesGained > game.gameConsts.NO_VALUE)
                device.audio.requestSound(soundTypes.LIFE);

            device.audio.setAudioGameState(AudioStates.WIN);
            device.audio.requestSound(soundTypes.WIN, game.gameConsts.PRIORITY_WIN, [AudioStates.WIN]);

            game.increaseGameLevel();
            game.setGameState(gameStates.WIN);
        }

        // Pause check
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
            device.audio.setAudioGameState(AudioStates.PLAY);
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
            if (game.lives !== game.gameConsts.NO_LIVES)
            {
                device.audio.setAudioGameState(AudioStates.PLAY); // unlock audio
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


