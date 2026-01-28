// ============================================================================
// MAIN GAME UPDATE
// ----------------------------------------------------------------------------
// Handles all per-frame updates depending on the current game state.
// Called each frame with delta time since last frame.
function updateGame(device, game, delta) 
{
    try 
    {
        // Get main timers
        const gameClock = game.gameTimers.getObjectByName(timerTypes.GAME_CLOCK.name);
        const playDelayTimer = game.gameTimers.getObjectByName(timerTypes.PLAY_DELAY.name);

        // Decide what to do based on current game state
        switch (game.gameState) 
        {
            // -------------------------------------------------------
            // INIT state: game setup and waiting for start
            // -------------------------------------------------------
            case gameStates.INIT:
                try 
                {
                    // Reset the game
                    game.setGame();

                    // Update the short delay before allowing play
                    playDelayTimer.update(delta);

                    // Toggle gamepad usage with Q key (once per press)
                    if (game.gamePadConnected && device.keys.toggleOnce(device.keys.isKeyPressed(keyTypes.Q), { value: device.keys.wasQPressed })) 
                    {
                        game.gamePadEnabled = !game.gamePadEnabled;
                    }

                    // If play delay timer is still active, skip starting
                    if (playDelayTimer.active) break;

                    // Check if the player pressed "play" (keyboard or gamepad)
                    const playPressed = device.keys.isKeyPressed(keyTypes.PLAY_KEY) || device.keys.isGamepadButtonPressed(gamepadButtons.START);
                    if ((game.gamePadEnabled && playPressed) || (!game.gamePadEnabled && playPressed && game.keyboardTouched)) 
                    {
                        game.setGameState(gameStates.PLAY); // start the game
                    }
                }
                catch (e) { console.error("INIT state error:", e); }
                break;

            // -------------------------------------------------------
            // PLAY state: main game loop
            // -------------------------------------------------------
            case gameStates.PLAY:
                try 
                {
                    // Update game clock timer and check if time ran out
                    if (gameClock.active) gameClock.update(delta);
                    if (gameClock.timeLeft === 0) { game.setGameState(gameStates.LOSE); break; }

                    // Update player and all enemies
                    game.player.update(device, game, delta);
                    game.enemyHolder.forEach(e => e.update(delta, game, game.player));

                    // Check for collisions between player and enemies
                    if (checkPlayerCollisions(game.enemyHolder, game.player) !== false) 
                    {
                        device.audio.playSound(soundTypes.HURT.name);
                        game.setGameState(gameStates.LOSE); // lose if hit
                        break;
                    }

                    // Check for collisions between player and goals
                    if (game.goalHolder.getSize()) 
                    {
                        const idx = checkPlayerCollisions(game.goalHolder, game.player);
                        if (idx !== false) 
                        {
                            game.goalHolder.subObject(idx); // remove collected goal
                            device.audio.playSound(soundTypes.GET.name);
                            game.increaseScore(game.gameConsts.VALUE_FOR_GETTING_GOAL); // increase score
                        }
                    }
                    else 
                    {
                        // All goals collected: award remaining time and winning points
                        const value = Math.floor(gameClock.timeLeft * game.gameConsts.VALUE_FOR_UNIT_OF_TIME_LEFT);
                        game.increaseScore(value);

                        game.increaseScore(game.gameConsts.VALUE_FOR_WINNING_LEVEL);

                        game.increaseGameLevel(); // move to next level
                        
                        game.setGameState(gameStates.WIN); // trigger win state
                        
                        break;
                    }

                    // Check for pause input
                    device.keys.checkForPause(game);

                    

                }
                catch (e) { console.error("PLAY state error:", e); }
                break;

            // -------------------------------------------------------
            // PAUSE state: frozen gameplay
            // -------------------------------------------------------
            case gameStates.PAUSE:
                try 
                { 
                    device.keys.checkForPause(game); // allow unpausing
                }
                catch (e) { console.error("PAUSE state error:", e); }
                break;

            // -------------------------------------------------------
            // WIN state: player completed level
            // -------------------------------------------------------
            case gameStates.WIN:
                try 
                {
                    // Reset game if player presses reset/start
                    if (device.keys.isKeyPressed(keyTypes.RESET_KEY) || device.keys.isGamepadButtonPressed(gamepadButtons.START)) 
                    {
                        game.setGame();
                        game.setGameState(gameStates.PLAY); // start new level
                    }
                }
                catch (e) { console.error("WIN state error:", e); }
                break;

            // -------------------------------------------------------
            // LOSE state: player failed the level
            // -------------------------------------------------------
            case gameStates.LOSE:
                try 
                {
                    // Allow retrying or returning to INIT depending on lives
                    if (device.keys.isKeyPressed(keyTypes.RESET_KEY) || device.keys.isGamepadButtonPressed(gamepadButtons.START)) 
                    {
                        if (game.lives !== 0) 
                        {
                            game.lives--;          // reduce lives
                            game.setGame();        // reset level
                            game.setGameState(gameStates.PLAY); // retry
                        } else {
                            game.setGameState(gameStates.INIT); // game over
                            playDelayTimer.setAndStart(game.gameConsts.PLAY_PAUSE_DELAY_TIME); // reset delay timer
                        }
                    }
                } 
                catch (e) { console.error("LOSE state error:", e); }
                break;

            // -------------------------------------------------------
            // Unknown state
            // -------------------------------------------------------
            default:
                console.warn("Unknown game state:", game.gameState);
        }
    } 
    catch (e) { console.error("updateGame main error:", e); }
}


function addScoreWithExtraLife(game) 
{
    //game.increaseScore(value); // existing method to increase score

    // Check if player reached or passed the next milestone
    if (game.score >= game.nextExtraLifeScore) {
        game.lives++; // give an extra life
        console.log("Extra life awarded! Total lives:", game.lives);

        // Set next milestone (increments by 5000 each time)
        game.nextExtraLifeScore += game.gameConsts.VALUE_WHEN_NEW_LIFE_AWARDED;
        console.log("next value:", game.nextExtraLifeScore);
    }
}