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
        switch (game.gameState) 
        {
            // -------------------------------------------------------
            // INIT STATE
            // -------------------------------------------------------
            case GameDefs.gameStates.INIT:
                try 
                {
                    
                    if (device.keys.isKeyPressed(GameDefs.keyTypes.PLAY_KEY)) 
                    {
                        game.initGame(device)
                        game.setGame();
                        game.setGameState(GameDefs.gameStates.PLAY);
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

                    // update player movement
                    game.player.update(device, game, delta);

                    
                    checkPlayerGameObjCollisions(device, game, game.goalHolder, game.player);
                    
                    
                    
                    
                    
                    // update enemies movemnets
                    game.enemyHolder.forEach(element => 
                    {
                         element.update(delta, game, game.player);
                    });

                    checkPlayerGameObjCollisions(device, game, game.enemyHolder, game.player)
                    
                    checkforPause(device, game); 

                    // if goals holder is empty chage game state
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
                    // while in pause mode if player un-pauses
                    if (device.keys.isKeyPressed(GameDefs.keyTypes.PAUSE_KEY_L)) 
                    {
                        // Update states
                        game.setGameState(GameDefs.gameStates.PLAY);

                    }
                    // Dev hack if you want to restart game quickly
                    if (device.keys.isKeyDown(GameDefs.keyTypes.RESET_KEY)) 
                    {
                        game.setGameState(GameDefs.gameStates.INIT);
                    }
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
                    if (device.keys.isKeyDown(GameDefs.keyTypes.RESET_KEY)) 
                    {
                        game.setGameState(GameDefs.gameStates.INIT);
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
                    if (device.keys.isKeyDown(GameDefs.keyTypes.RESET_KEY)) 
                    {
                        game.setGameState(GameDefs.gameStates.INIT);
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

// Used during play state wating for player to hit pause button
function checkforPause(device, game)  
{     
    try 
    {
        if (device.keys.isKeyPressed(GameDefs.keyTypes.PAUSE_KEY_L)) 
        {
            if (game.gameState === GameDefs.gameStates.PLAY )   
            {
                // Switch to pause mode
                game.setGameState(GameDefs.gameStates.PAUSE);
            }
            else if (game.gameState === GameDefs.gameStates.PAUSE) 
            {
                // Resume play mode
                game.setGameState(GameDefs.gameStates.PLAY);
            }
        }
    } 
    catch (e) 
    {
        console.error("checkforPause error:", e);
    }
}  

function checkPlayerGameObjCollisions(device, game, holder, player) 
{
    for (let i = holder.getSize() - 1; i >= 0; i--) 
    {
        const obj = holder.getIndex(i);

        if (roughNear(player, obj) && rectsCollide(player.getHitbox(), obj.getHitbox())) 
        {
            if (holder === game.goalHolder) 
            {
                device.audio.playSound(GameDefs.soundTypes.GET.name);
                holder.subObject(i);
                // FIXX make a set value for points to get goals
                game.increaseScore(1);
                //console.log("Goal collected:", obj.name);
                //return;
                if (holder.getSize() == 0)
                {
                        // fixx need a level up function

                        //change game state 
                        game.gameState = GameDefs.gameStates.INIT;
                        return;
                }
            }

            if (holder === game.enemyHolder) 
            {
                //FIXX need a reset game level function
                device.audio.playSound(GameDefs.soundTypes.HURT.name);
                game.gameState = GameDefs.gameStates.INIT;
                return;
            }
        }  
    }
}


