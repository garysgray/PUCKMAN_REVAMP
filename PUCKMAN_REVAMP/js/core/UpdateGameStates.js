// ============================================================================
// CONTROLLER UPDATE_GAME STATE HANDLERS
// ============================================================================

// ---------------------------
// INIT STATE HANDLER
// ---------------------------
function handleInitState(device, game, delta) 
{
    try 
    {
        const stateDelayTimer = game.gameTimers.getObjectByName(timerTypes.STATE_DELAY.name);
        // ---------------------------
        // Run once on entering INIT
        // ---------------------------
        if (game.isStateEnter(gameStates.INIT)) 
        {
            // Stop all sounds and reset game entities & timers
            device.audio.stopAll();
            game.setGame();
            console.log("INIT state entered: game reset");

            // Clear old input frames
            device.keys.clearFrameKeys();
            game.clearGamepadFrameKeys();
        }

        stateDelayTimer.update(delta);

        // If still active then we wait till delay is done
        if (stateDelayTimer.active)
        {
            return;
        }

        // ---------------------------
        // Toggle gamepad on Q (frame-safe)
        // ---------------------------
        if (game.gamePadConnected) 
        {
            const toggleQ = device.keys.toggleOnce(device.keys.isKeyPressed(keyTypes.Q), { value: device.keys.wasQPressed });
            if (toggleQ) game.gamePadEnabled = !game.gamePadEnabled;
        }

        // ---------------------------
        // Check start input (keyboard or gamepad)
        // ---------------------------
        const startPressed = device.keys.isKeyPressed(keyTypes.PLAY_KEY) || device.keys.isGamepadButtonPressed(gamepadButtons.START);

        // Accept input based on current control method
        if ((game.gamePadEnabled && startPressed) || (!game.gamePadEnabled && startPressed && game.keyboardTouched)) 
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
            game.clearGamepadFrameKeys();
            device.keys.clearFrameKeys();
        }

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
        device.keys.checkForPause(game, keyTypes.PAUSE_KEY_L, gamepadButtons.PAUSE, gameStates.PLAY, gameStates.PAUSE);

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
        // Run once on entering PAUSE
        if (game.isStateEnter(gameStates.PAUSE))
        {
            // Clear frame-based inputs so nothing leaks in
            device.audio.stopAll();
            game.clearGamepadFrameKeys();
            device.keys.clearFrameKeys();
        }
        // Allow pause toggle using the SAME logic as play
        device.keys.checkForPause(game, keyTypes.PAUSE_KEY_L, gamepadButtons.PAUSE, gameStates.PLAY, gameStates.PAUSE);

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
        // Run once on entering WIN
        
        if (game.isStateEnter(gameStates.WIN)) 
        {
            device.audio.setAudioGameState(AudioStates.WIN); 

            // Clear previous frame inputs
            game.clearGamepadFrameKeys();
            device.keys.clearFrameKeys();
        }

        // Check inputs per frame safely
        const resetPressed = device.keys.isKeyPressed(keyTypes.RESET_KEY);
        const startPressed = game.isGamepadButtonPressed(gamepadButtons.START);

        if (resetPressed || startPressed) 
        {
            // Stop sounds at start of state
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
function handleLoseState(device, game, delta) 
{
    try 
    {
        const stateDelayTimer = game.gameTimers.getObjectByName(timerTypes.STATE_DELAY.name);

        // Run once on entering LOSE
        if (game.isStateEnter(gameStates.LOSE)) 
        {
            device.audio.setAudioGameState(AudioStates.LOSE); // set lose audio
            device.keys.clearFrameKeys();                     // clear old keyboard presses
            game.clearGamepadFrameKeys();                     // clear old gamepad presses
        }

        // ----------------------------
        // Handle restart if still has lives
        // ----------------------------
        if (game.lives !== game.gameConsts.NO_LIVES) 
        {
            const resetPressed = device.keys.isKeyPressed(keyTypes.RESET_KEY);
            const startPressed = game.isGamepadButtonPressed(gamepadButtons.START);

            if (resetPressed || startPressed) 
            {
                stateDelayTimer.setAndStart(game.gameConsts.STATE_DELAY_TIME);
                device.audio.setAudioGameState(AudioStates.PLAY); // unlock audio
                game.setGame();
                game.setGameState(gameStates.PLAY);
            }
        } 
        else 
        {
            // ----------------------------
            // High score logic
            // ----------------------------
            const lowestScore = game.topScores.length < 10 ? 0 : game.topScores[game.topScores.length - 1].score;

            //if (!stateDelayTimer.active) 
           

            if (game.score > lowestScore) 
            {
                // Run once on entering high-score-qualifying LOSE
                if (!game.highScoreAchived) 
                {
                    game.highScoreAchived = true;
                    stateDelayTimer.setAndStart(game.gameConsts.HIGE_SCORE_DELAY_TIME);
                }

                    stateDelayTimer.update(delta)

                    
                if (!stateDelayTimer.active)
                {
                    game.recordScore("AAA"); // Replace with player input later
                    game.setGameState(gameStates.TOP_SCORE);
                    game.highScoreAchived = false;

                    device.keys.clearFrameKeys();
                    game.clearGamepadFrameKeys();
                }
            } 
            else 
            {
                // No high score: allow restart safely
                const resetPressed = device.keys.isKeyPressed(keyTypes.RESET_KEY); 
                const startPressed = game.isGamepadButtonPressed(gamepadButtons.START);

                if (resetPressed || startPressed) 
                {
                    game.setGameState(gameStates.INIT);
                    //playDelayTimer.setAndStart(game.gameConsts.PLAY_PAUSE_DELAY_TIME);
                }
            }
        }
    } 
    catch (e) 
    {
        console.error("LOSE state error:", e);
    }
}

// ---------------------------
// TOP SCORE STATE HANDLER
// ---------------------------
function handleTopScoreState(device, game) 
{
    try 
    {
        const stateDelayTimer = game.gameTimers.getObjectByName(timerTypes.STATE_DELAY.name);
        // Run once on entering TOP_SCORE
        if (game.isStateEnter(gameStates.TOP_SCORE)) 
        {
            console.log("TOP_SCORE active");
            game.printTopScores();
 
            // Clear previous frame buttons so old presses don't carry over
            game.clearGamepadFrameKeys();
            device.keys.clearFrameKeys();
        }

        // Now check input per frame safely
        const resetPressed = device.keys.isKeyPressed(keyTypes.RESET_KEY);
        const startPressed = game.isGamepadButtonPressed(gamepadButtons.START);

        if (resetPressed || startPressed) 
        {
            stateDelayTimer.setAndStart(game.gameConsts.STATE_DELAY_TIME);
            game.setGameState(gameStates.INIT);
            return;
        }
    } 
    catch (e) 
    {
        console.error("TOP_SCORE state error:", e);
    }
}

