// ============================================================================
// Text Rendering Layer
// ----------------------------------------------------------------------------
// Called by controller inside render pipeline.
// Responsible for drawing all on-screen text messages
// pause/resume prompts, win/lose messages, etc).
// No game logic is executed here — this function only handles text rendering.
// ============================================================================

function renderTextLayer(device, game) 
{
    try 
    {
        const cw = game.gameConsts.SCREEN_WIDTH;
        const ch = game.gameConsts.SCREEN_HEIGHT;
        
        // Define layout positions as percentages of canvas height/width
        const layout = 
        {
            initTextY: [0.60, 0.67, 0.74, 0.81],   // Intro screen text lines
            pauseY: 0.62,                          // Pause message placement
            winLoseY: 0.62,                        // Win/Lose screen placement             
        };

        // Set default font and color
        device.setFont(game.gameConsts.FONT_SETTINGS);
        device.setTextColor(game.gameConsts.FONT_COLOR);
         
        switch (game.gameState) 
        {
            // ==============================
            // INIT STATE: instructions
            // ==============================
            case gameStates.INIT:
                try
                {
                    let instructions = null;
                    layout.initTextY.forEach((pct, idx) => 
                    {
                        if (game.gamePadEnabled)
                        {
                             instructions = gameTexts.INIT.GAMEPAD_INSTRUCTIONS[idx];
                        }
                        else
                        {
                             instructions = gameTexts.INIT.INSTRUCTIONS[idx];
                        }
                        
                        
                        device.centerTextOnY(instructions, ch * pct);
                    });
                }
                catch (e) 
                {
                    console.error("Error rendering INIT text:", e);
                }
                break;

            // ==============================
            // PLAY STATE: 
            // ==============================
            case gameStates.PLAY:
                try
                {
                   //no tales to tell
                }
                catch (e) 
                {
                    console.error("Error rendering PLAY text:", e);
                }
                break;

            // ==============================
            // PAUSE STATE: Resume prompt
            // ==============================
            case gameStates.PAUSE:
                try 
                {
                    let pauseMsg = null;

                    if (game.gamePadEnabled)
                    {
                        pauseMsg = gameTexts.PAUSE.GAMEPAD_MESSAGE;
                    }
                    else
                    {
                        pauseMsg = gameTexts.PAUSE.MESSAGE;
                    }
                    
                    device.centerTextOnY(pauseMsg, ch * layout.pauseY);
                    
                } 
                catch (e) 
                {
                    console.error("Error rendering pause text:", e);
                }
                break;

            // ==============================
            // WIN STATE: Replay prompt
            // ==============================
            case gameStates.WIN:
                try 
                {
                    let winMsg = null;

                    if (game.gamePadEnabled)
                    {
                        winMsg = gameTexts.WIN.GAMEPAD_MESSAGE;
                    }
                    else
                    {
                        winMsg = gameTexts.WIN.MESSAGE;
                    }

                    device.centerTextOnY(winMsg, ch * layout.winLoseY);
                    
                } 
                catch (e) 
                {
                    console.error("Error rendering win text:", e);
                }
                break;

            // ==============================
            // LOSE STATE: Restart/Revive prompt
            // ==============================
            case gameStates.LOSE:
                try 
                {
                    let loseMsg = null;

                    const gameClock = game.gameTimers.getObjectByName(timerTypes.GAME_CLOCK.name);

                    if(game.highScoreAchived == true)
                    {
                        // FIXX need const for high score
                        let dieMsg = "HIGH SCORE"; 

                        device.centerTextOnY(dieMsg, ch * layout.winLoseY); 
                        return;   
                    }

                    else if (game.lives <= 0) 
                    {

                        if (game.gamePadEnabled)
                        {
                            loseMsg = gameTexts.LOSE.GAMEPAD_LOSE_MESSAGE;
                        }
                        else
                        {
                            loseMsg =  gameTexts.LOSE.LOSE_MESSAGE;
                        }

                        device.centerTextOnY(loseMsg, ch * layout.winLoseY);    
                    }

                    else if (gameClock.timeLeft === 0)
                    {
                        let outOfTimeMsg = null; 
                        if (game.gamePadEnabled)
                        {
                            outOfTimeMsg = gameTexts.LOSE.GAMEPAD_OUT_OF_TIME;
                        }
                        else
                        {
                            outOfTimeMsg =  gameTexts.LOSE.OUT_OF_TIME;
                        }

                        device.centerTextOnY(outOfTimeMsg, ch * layout.winLoseY); 
                    }
                    
                    else 
                    {
                        let dieMsg = null; 
                        if (game.gamePadEnabled)
                        {
                            dieMsg = gameTexts.LOSE.GAMEPAD_DIE_MESSAGE;
                        }
                        else
                        {
                            dieMsg =  gameTexts.LOSE.DIE_MESSAGE;
                        }

                        device.centerTextOnY(dieMsg, ch * layout.winLoseY);    
                    }
                } 
                
                catch (e) 
                {
                    console.error("Error rendering lose text:", e);
                }
                break;
            // ==============================
            // TOP SCORE
            // ==============================
            case gameStates.TOP_SCORE:
                try 
                {
                    let winMsg = null;

                    if (game.gamePadEnabled)
                    {
                        winMsg = gameTexts.WIN.GAMEPAD_MESSAGE;
                    }
                    else
                    {
                        winMsg = gameTexts.WIN.MESSAGE;
                    }

                    device.centerTextOnY(winMsg, ch * layout.winLoseY);
                    
                } 
                catch (e) 
                {
                    console.error("Error rendering win text:", e);
                }
                break;

            default:
                console.warn("Unknown game state in text layer:", game.gameState);
                break;
            
        }
        
    } 
    catch (e) 
    {
        console.error("Unexpected error in renderTextLayer:", e);
    }
}

// Wrap it in a Layer object for controller
const textRenderLayer = new Layer("HUD/Text", renderTextLayer);
