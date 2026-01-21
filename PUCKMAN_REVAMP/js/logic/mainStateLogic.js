// ============================================================================
// MAIN STATE LOGIC
// ----------------------------------------------------------------------------
// Update Game States
// - Called each frame from the controller's update() function
// - Handles updates to core game logic, input responses, and state transitions
// - Calls for all game objects updates depending on current game state
// ============================================================================

function updateGameStates(device, game, delta) 
{
    try 
    {
        // Updates the message at bottom of screen 
        updateHTMLMessage(game); 
        
        switch (game.gameState) 
        {
            // -------------------------------------------------------
            // INIT STATE
            // -------------------------------------------------------
            case GameDefs.gameStates.INIT:
                try 
                {
                    game.setGame();

                    if ( game.gamePadConnected)
                    {
                        if (toggleOnce(device.keys.isKeyPressed(GameDefs.keyTypes.Q), { value: device.keys.wasQPressed })) 
                        {
                            game.gamePadEnabled = !game.gamePadEnabled;
                        }
                    }
                    else
                    {
                        game.gamePadEnabled = false;
                    }
                    

                    if( game.gamePadEnabled ) //need a little time or gamepad button press gets recorded to soon. 
                    {
                        setTimeout(() => 
                        {
                            if (device.keys.isKeyPressed(GameDefs.keyTypes.PLAY_KEY) || (game.gamePadEnabled && device.keys.isGamepadButtonPressed(GameDefs.gamepadButtons.START))) 
                            {       
                                game.setGameState(GameDefs.gameStates.PLAY);
                            }
                        }, 500);
                    }
                    else
                    {
                        if (device.keys.isKeyPressed(GameDefs.keyTypes.PLAY_KEY) || (game.gamePadEnabled && device.keys.isGamepadButtonPressed(GameDefs.gamepadButtons.START))) 
                            {       
                                game.setGameState(GameDefs.gameStates.PLAY);
                            }
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
            case GameDefs.gameStates.PLAY:
                try 
                {
                     
                    // Game clock that helps update when NPC's speed should incread and give player points
                    const gameClock = game.gameTimers.getObjectByName(GameDefs.timerTypes.GAME_CLOCK);

                    if (gameClock.active)
                    {
                        // Update game time clock
                        gameClock.update(delta);
                    }

                    if (gameClock.timeLeft == 0)
                    {
                        game.setGameState(GameDefs.gameStates.LOSE);
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
                         device.audio.playSound(GameDefs.soundTypes.HURT.name);
                         game.setGameState(GameDefs.gameStates.LOSE);
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
                            device.audio.playSound(GameDefs.soundTypes.GET.name);
                            // FIXX need fix magic num
                            game.increaseScore(1); 
                        }

                        if (game.goalHolder.getSize() === 0)
                        {
                            //should go to next level FIXX function?
                            game.setGameState(GameDefs.gameStates.WIN); 
                            game.increaseGameLevel(1); 
                            break;
                        }
                    }

                    checkForPause(device, game); 

                } 
                catch (e) 
                {
                    console.error("PLAY state error:", e);
                }
                break;

            // -------------------------------------------------------
            // PAUSE STATE
            // -------------------------------------------------------
            case GameDefs.gameStates.PAUSE:
                try 
                {
                
                    checkForPause(device, game); 
                    
                }
                catch (e) 
                {
                    console.error("PAUSE state error:", e);
                }
                break;

            // -------------------------------------------------------
            // WIN STATE - currently not in use
            // -------------------------------------------------------
            case GameDefs.gameStates.WIN:
                try 
                {
                    // Check for game restart and Init game if it happens  
                    if (device.keys.isKeyPressed(GameDefs.keyTypes.RESET_KEY) ||
                    device.keys.isGamepadButtonPressed(GameDefs.gamepadButtons.START))
                    {
                        //game.setGameState(GameDefs.gameStates.INIT);
                        game.setGame();  
                        game.setGameState(GameDefs.gameStates.PLAY);
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
            case GameDefs.gameStates.LOSE:
                try 
                {
                    if (device.keys.isKeyPressed(GameDefs.keyTypes.RESET_KEY) ||
                    device.keys.isGamepadButtonPressed(GameDefs.gamepadButtons.START)) 
                    {
                        if(game.lives != 0)
                        {
                            game.lives--;
                            game.setGame() 
                            game.setGameState(GameDefs.gameStates.PLAY);
                            break
                        }
                        else{ game.setGameState(GameDefs.gameStates.INIT);}
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

 

