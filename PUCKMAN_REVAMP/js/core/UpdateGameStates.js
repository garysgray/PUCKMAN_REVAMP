// ============================================================================
// GAME STATE HANDLERS
// ============================================================================

// ============================================================================
// INIT STATE
// ============================================================================
function handleInitState(device, game, delta) 
{
    try 
    {
        const stateDelayTimer = game.gameTimers.getObjectByName(timerTypes.STATE_DELAY.name);
        const spawnDelayTimer = myController.game.gameTimers.getObjectByName(timerTypes.SPAWN_DELAY.name);

        if (game.isStateEnter(gameStates.INIT)) 
        {
            device.audio.stopAll();
            game.setGame();
            device.keys.clearFrameKeys();

            // Reset animation state
            game.attractModeStarted = false;
            game.attractModeEnemiesFollowing = false;
            
            
        }

        // Run the Demo Animation
        game.runLevelCompleteAnimation(delta);

        if (spawnDelayTimer && spawnDelayTimer.active) 
        {
            spawnDelayTimer.update(delta);
        }
        else
        {
            spawnDelayTimer.setAndStart(150);
        }

        stateDelayTimer.update(delta);
        if (stateDelayTimer.active) return;

        // Toggle gamepad with Q
        if (device.keys.gamePadConnected) 
        {
            const toggleQ = device.keys.toggleOnce(device.keys.isKeyPressed(keyTypes.Q), { value: device.keys.wasQPressed });
            if (toggleQ) device.keys.gamePadEnabled = !device.keys.gamePadEnabled;
        }

        // Start game input
        const keyboardStart = device.keys.isKeyPressed(keyTypes.PLAY_KEY);
        const gamepadStart = device.keys.gamePadEnabled && device.keys.isGamepadButtonPressed(gamepadButtons.START);

        if (keyboardStart || gamepadStart) 
        {
            game.setGame();
            game.setGameState(gameStates.PLAY);
        }
    } 
    catch (e) 
    {
        console.error("INIT state error:", e);
    }
}

// ============================================================================
// PLAY STATE
// ============================================================================
function handlePlayState(device, game, delta)
{
    try
    {
        const loseSoundDelayTimer = game.gameTimers.getObjectByName(timerTypes.LOSE_DELAY.name);
        const gameClock = game.gameTimers.getObjectByName(timerTypes.GAME_CLOCK.name);

        if (game.isStateEnter(gameStates.PLAY))
        {
            device.audio.stopAll();
            device.audio.setAudioGameState(AudioStates.PLAY);
            device.keys.clearFrameKeys();
        }

        // Update game clock
        if (gameClock.active) gameClock.update(delta);

        // Handle timeout
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

        // Update player
        game.player.update(device, game, delta, soundTypes.MOVE, game.gameConsts.SCREEN_WIDTH, game.gameConsts.SCREEN_HEIGHT, game.gameConsts.HUD_BUFFER);

        // Update enemies with collision
        game.enemyHolder.forEach(e => 
        {
            e.update(delta, game, game.player);
            e.tryMoveWithCollision(game.mapHolder, e.deltaX, e.deltaY);
            e.enforceBorderBounds(game.borderHorizontalBuffer, game.borderVerticalBuffer, game.gameConsts.SCREEN_WIDTH, game.gameConsts.SCREEN_HEIGHT, game.gameConsts.HUD_BUFFER);
        });

        // Check enemy collision
        const hitIndex = Collision.checkPlayerCollisions(game.enemyHolder, game.player);

        if (hitIndex !== false && !game.player.isDying) 
        {
            game.player.isDying = true;
            device.audio.stopSound(soundTypes.MOVE);

            if (!game.player.justHit) 
            {
                device.audio.requestSound(soundTypes.HURT);
                game.player.justHit = true;
            }

            // Last life: delayed game over
            if (game.lives === game.gameConsts.LAST_LIFE) 
            {
                if (!loseSoundDelayTimer.active) loseSoundDelayTimer.setAndStart(game.gameConsts.LOSE_SOUND_DELAY_TIME);
                return;
            } 
            else 
            {
                game.decreaseLives();
                game.setGameState(gameStates.LOSE);
                return;
            }
        }

        // Handle delayed last-life game over
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

        // Handle goal collection
        if (game.goalHolder.getSize() !== game.gameConsts.NO_VALUE)
        {
            const goalIndex = Collision.checkPlayerCollisions(game.goalHolder, game.player);
            
            if (goalIndex !== false) 
            {
                device.audio.requestSound(soundTypes.PICKUP);
                game.goalHolder.subObject(goalIndex);

                const livesEarned = game.scoreManager.increaseScore(game.gameConsts.VALUE_FOR_GETTING_GOAL);
                if (livesEarned > 0) 
                {
                    game.lives += livesEarned;
                    device.audio.requestSound(soundTypes.LIFE);
                }
            }
        }
        else
        {
            // Level complete
            const timeBonus = game.scoreManager.calculateTimeBonus(gameClock.timeLeft);
            const winBonus = game.gameConsts.VALUE_FOR_WINNING_LEVEL;
            const totalLivesEarned = game.scoreManager.increaseScore(timeBonus) + game.scoreManager.increaseScore(winBonus);

            device.audio.stopSound(soundTypes.MOVE);

            if (totalLivesEarned > 0) 
            {
                game.lives += totalLivesEarned;
                device.audio.requestSound(soundTypes.LIFE);
            }

            device.audio.setAudioGameState(AudioStates.WIN);
            device.audio.requestSound(soundTypes.WIN, game.gameConsts.PRIORITY_WIN, [AudioStates.WIN]);
            game.increaseGameLevel();
            game.setGameState(gameStates.WIN);
        }

        device.keys.checkForPause(game, keyTypes.PAUSE_KEY_L, gamepadButtons.PAUSE, gameStates.PLAY, gameStates.PAUSE);
    }
    catch (e)
    {
        console.error("PLAY state error:", e);
    }
}

// ============================================================================
// PAUSE STATE
// ============================================================================
function handlePauseState(device, game, delta)
{
    try
    {
        if (game.isStateEnter(gameStates.PAUSE))
        {
            device.audio.stopAll();
            device.keys.clearFrameKeys();
        }

        device.keys.checkForPause(game, keyTypes.PAUSE_KEY_L, gamepadButtons.PAUSE, gameStates.PLAY, gameStates.PAUSE);
    }
    catch (e)
    {
        console.error("PAUSE state error:", e);
    }
}

// ============================================================================
// WIN STATE
// ============================================================================
function handleWinState(device, game) 
{
    try 
    {
        if (game.isStateEnter(gameStates.WIN)) 
        {
            device.audio.setAudioGameState(AudioStates.WIN);
            device.keys.clearFrameKeys();
        }

        const resetPressed = device.keys.isKeyPressed(keyTypes.RESET_KEY);
        const startPressed = device.keys.isGamepadButtonPressed(gamepadButtons.START);

        if (resetPressed || startPressed) 
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

// ============================================================================
// LOSE STATE
// ============================================================================
function handleLoseState(device, game, delta) 
{
    try 
    {
        const stateDelayTimer = game.gameTimers.getObjectByName(timerTypes.STATE_DELAY.name);

        if (game.isStateEnter(gameStates.LOSE)) 
        {
            device.audio.setAudioGameState(AudioStates.LOSE);
            device.keys.clearFrameKeys();
        }

        if (game.lives !== game.gameConsts.NO_LIVES) 
        {
            // Retry allowed
            const resetPressed = device.keys.isKeyPressed(keyTypes.RESET_KEY);
            const startPressed = device.keys.isGamepadButtonPressed(gamepadButtons.START);

            if (resetPressed || startPressed)
            {
                stateDelayTimer.setAndStart(game.gameConsts.STATE_DELAY_TIME);
                device.audio.setAudioGameState(AudioStates.PLAY);
                game.setGame();
                game.setGameState(gameStates.PLAY);
            }
        } 
        else 
        {
            // Game over - check for high score
            const lowestScore = game.scoreManager.topScores.length < 10 ? 0 : game.scoreManager.topScores[game.scoreManager.topScores.length - 1].score;

            if (game.score > lowestScore) 
            {
                if (!game.highScoreAchived) 
                {
                    game.highScoreAchived = true;
                    stateDelayTimer.setAndStart(game.gameConsts.HIGH_SCORE_DELAY_TIME);
                }

                stateDelayTimer.update(delta);

                if (!stateDelayTimer.active)
                {
                    game.clearAllObjects();
                    device.keys.clearFrameKeys();

                    game.highScoreAchived = false;
                    game.setGameState(gameStates.TOP_SCORE);
                }
            } 
            else 
            {
                // No high score - return to attract mode
                const resetPressed = device.keys.isKeyPressed(keyTypes.RESET_KEY); 
                const startPressed = device.keys.isGamepadButtonPressed(gamepadButtons.START);

                if (resetPressed || startPressed) 
                {
                    game.clearAllObjects(game);
                    device.keys.clearFrameKeys();

                    game.setGameState(gameStates.INIT);
                }
            }
        }
    } 
    catch (e) 
    {
        console.error("LOSE state error:", e);
    }
}

// ============================================================================
// TOP SCORE STATE
// ============================================================================
function handleTopScoreState(device, game) 
{
    try 
    {
        const stateDelayTimer = game.gameTimers.getObjectByName(timerTypes.STATE_DELAY.name);
        
        if (game.isStateEnter(gameStates.TOP_SCORE)) device.keys.clearFrameKeys();

        // Keyboard input
        const upPressed = device.keys.isKeyPressed(keyTypes.UP);
        const downPressed = device.keys.isKeyPressed(keyTypes.DOWN);
        const leftPressed = device.keys.isKeyPressed(keyTypes.LEFT);
        const rightPressed = device.keys.isKeyPressed(keyTypes.RIGHT);
        const confirmPressed = device.keys.isKeyPressed(keyTypes.ENTER);

        // Gamepad input
        const gpUp = device.keys.wasAxisJustPressed(1, -1);
        const gpDown = device.keys.wasAxisJustPressed(1, 1);
        const gpLeft = device.keys.wasAxisJustPressed(0, -1);
        const gpRight = device.keys.wasAxisJustPressed(0, 1);
        const gpConfirm = device.keys.isGamepadButtonPressed(gamepadButtons.X);

        // Handle input
        if (upPressed || gpUp) game.scoreManager.cycleCurrentLetter(+1);
        if (downPressed || gpDown) game.scoreManager.cycleCurrentLetter(-1);
        if (leftPressed || gpLeft) game.scoreManager.moveToPreviousPosition();
        if (rightPressed || gpRight) game.scoreManager.moveToNextPosition();

        // Submit initials
        if (confirmPressed || gpConfirm)
        {
            game.scoreManager.recordScore();
            stateDelayTimer.setAndStart(game.gameConsts.STATE_DELAY_TIME);
            game.setGameState(gameStates.INIT);
            return;
        }

        // Skip to INIT
        const resetPressed = device.keys.isKeyPressed(keyTypes.RESET_KEY);
        const startPressed = device.keys.isGamepadButtonPressed(gamepadButtons.START);

        if (resetPressed || startPressed) 
        {
            stateDelayTimer.setAndStart(game.gameConsts.STATE_DELAY_TIME);
            game.setGameState(gameStates.INIT);
        }
    } 
    catch (e) 
    {
        console.error("TOP_SCORE state error:", e);
    }
}

//localStorage.removeItem("topScores");