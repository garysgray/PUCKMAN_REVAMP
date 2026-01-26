// ============================================================================
// MAIN STATE LOGIC
// ----------------------------------------------------------------------------
// Update Game States
// - Called each frame from the controller's update() function
// - NOTE - function does not belong to Game Controller class
// - Handles updates to core game logic, input responses, and state transitions
// - Calls for all game objects updates depending on current game state
// ============================================================================
function updateGame(device, game, delta) 
{
    try 
    {
        const gameClock = game.gameTimers.getObjectByName(timerTypes.GAME_CLOCK.name); 
        const playDelayTimer = game.gameTimers.getObjectByName(timerTypes.PLAY_DELAY.name);

        switch (game.gameState) 
        {
            // -------------------------------------------------------
            // INIT STATE
            // -------------------------------------------------------
            case gameStates.INIT:
                try 
                {
                    game.setGame();

                    playDelayTimer.update(delta);

                    if (game.gamePadConnected)
                    {
                        if (device.keys.toggleOnce(device.keys.isKeyPressed(keyTypes.Q), { value: device.keys.wasQPressed })) 
                        {
                            game.gamePadEnabled = !game.gamePadEnabled;
                        }
                    }
                    
                    if (playDelayTimer.active) break;

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
                break;

            // -------------------------------------------------------
            // PLAY STATE
            // -------------------------------------------------------
            case gameStates.PLAY:
                try 
                {
                    if (gameClock.active)
                    {
                        // Update game time clock
                        gameClock.update(delta);
                    }

                    if (gameClock.timeLeft == 0)
                    {
                        game.setGameState(gameStates.LOSE);
                        break;
                    }

                    // update player movement
                    game.player.update(device, game, delta);

                    // update enemies movemnets
                    game.enemyHolder.forEach(element => 
                    {
                         element.update(delta, game, game.player);
                    });

                    // check player enemy collision
                    if (checkPlayerGameObjCollisions(game.enemyHolder, game.player) !== false)
                    {
                         device.audio.playSound(soundTypes.HURT.name);
                         game.setGameState(gameStates.LOSE);
                         break;
                    }

                    // check player goals/fruit collision
                    //FIXX need a level up function
                    if(game.goalHolder.getSize() != 0)
                    {
                        const tempValue = checkPlayerGameObjCollisions( game.goalHolder, game.player);           
                        if (tempValue !== false)
                        {
                            game.goalHolder.subObject(tempValue);
                            device.audio.playSound(soundTypes.GET.name);
                            // FIXX need fix magic num
                            game.increaseScore(1); 
                        }

                        if (game.goalHolder.getSize() === 0)
                        {
                            //should go to next level FIXX function?
                            game.setGameState(gameStates.WIN); 
                            game.increaseGameLevel(1); 
                            break;
                        }
                    }

                    device.keys.checkForPause( game); 

                } 
                catch (e) 
                {
                    console.error("PLAY state error:", e);
                }
                break;

            // -------------------------------------------------------
            // PAUSE STATE
            // -------------------------------------------------------
            case gameStates.PAUSE:
                try 
                {    
                    device.keys.checkForPause( game); 
                    
                }
                catch (e) 
                {
                    console.error("PAUSE state error:", e);
                }
                break;

            // -------------------------------------------------------
            // WIN STATE - currently not in use
            // -------------------------------------------------------
            case gameStates.WIN:
                try 
                {
                    // Check for game restart and Init game if it happens  
                    if (device.keys.isKeyPressed(keyTypes.RESET_KEY) ||
                    device.keys.isGamepadButtonPressed(gamepadButtons.START))
                    {
                        //game.setGameState(gameStates.INIT);
                        game.setGame();  
                        game.setGameState(gameStates.PLAY);
                    }
                } 
                catch (e) 
                {
                    console.error("WIN state error:", e);
                }
                break;

            // -------------------------------------------------------
            // LOSE STATE
            // -------------------------------------------------------
            case gameStates.LOSE:
                try 
                { 
                    if (device.keys.isKeyPressed(keyTypes.RESET_KEY) ||
                    device.keys.isGamepadButtonPressed(gamepadButtons.START)) 
                    {
                        if(game.lives != 0)
                        {
                            game.lives--;
                            game.setGame() 
                            game.setGameState(gameStates.PLAY);
                            break
                        }
                        else
                        { 
                            game.setGameState(gameStates.INIT);
                            playDelayTimer.start();
                        }
                    }
                } 
                catch (e) 
                {
                    console.error("LOSE state error:", e);
                }
                break;

            default:
                console.warn("Unknown game state:", game.gameState);
                break;
        }
    } 
    catch (e) 
    {
        console.error("updateGameStates main error:", e);
    }
}

