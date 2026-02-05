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
        const chw = cw/2; 
        const ch = game.gameConsts.SCREEN_HEIGHT;
        
        // Define layout positions as percentages of canvas height/width
        const layout = 
        {
            initTextY: [0.60, 0.67, 0.74, 0.81],   // Intro screen text lines
            pauseY: 0.62,                          // Pause message placement
            winLoseY: 0.62,                        // Win/Lose screen placement             
        };

        // Set default font and color
        device.setFont(game.gameConsts.NORM_FONT_SETTINGS);
        device.setTextColor(game.gameConsts.FONT_COLOR);

        device.ctx.textAlign = "center";

        switch (game.gameState) 
        {
            
            // ==============================
            // INIT STATE: instructions
            // ==============================
            case gameStates.INIT:
                try
                {
                    // Instructions
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
                        
                        device.putText(instructions, chw, ch * pct);
                    });
                    // Top Scores Title
                    device.setFont("bold 30pt VT323");
                    device.putText("TOP SCORES", chw, ch * 0.10);
                    
                    // Top Scores List - Split into two columns with aligned names
                    device.setFont("bold 18pt VT323");
                    const topScores = game.topScores.slice(0, 10);
                    const startY = 0.15;
                    const lineHeight = 0.04;
                    const leftX = (cw * 0.25) - 50;   // Left column - TWEAK THIS VALUE (subtract more to move left)
                    const rightX = cw * 0.65;          // Right column
                    
                    topScores.forEach((score, idx) => 
                    {
                        const rank = idx + 1;
                        const rankText = rank < 10 ? ` ${rank}.` : `${rank}.`;
                        const name = score.name;
                        const scoreValue = score.score;
                        
                        const x = idx < 5 ? leftX : rightX;
                        const y = ch * (startY + (idx % 5) * lineHeight);
                        
                        // Left-align rank and name, right-align score
                        device.ctx.textAlign = "left";
                        device.putText(`${rankText} ${name}`, x, y);
                        
                        device.ctx.textAlign = "right";
                        device.putText(scoreValue, x + cw * 0.15, y); // Score offset to the right
                    });
                    
                    // Reset text alignment
                    device.ctx.textAlign = "center";
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
                    
                    device.putText(pauseMsg, chw , ch * layout.pauseY);
                    
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

                    device.putText(winMsg, chw , ch * layout.winLoseY);
                    
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
                
                    const gameClock = game.gameTimers.getObjectByName(timerTypes.GAME_CLOCK.name);

                    if(game.highScoreAchived == true)
                    {
                        let highScoreMsg = gameTexts.LOSE.HIGH_SCORE;

                        device.putText(highScoreMsg, chw, ch * layout.winLoseY);
                         
                        return;   
                    }

                    else if (game.lives <= 0) 
                    {
                         let loseMsg = null;
                        if (game.gamePadEnabled)
                        {
                            loseMsg = gameTexts.LOSE.GAMEPAD_LOSE_MESSAGE;
                        }
                        else
                        {
                            loseMsg =  gameTexts.LOSE.LOSE_MESSAGE;
                        }

                        device.putText(loseMsg, chw, ch * layout.winLoseY);   
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

                        device.putText(outOfTimeMsg, chw, ch * layout.winLoseY);  
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

                        device.putText(dieMsg, chw, ch * layout.winLoseY);    
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
                    // High Score
                    device.setFont(game.gameConsts.MID_FONT_SETTINGS);
                    device.putText(game.score, cw/2, ch/3);
                    
                    // Player Initials
                    device.setFont(game.gameConsts.BIG_FONT_SETTINGS);
                    
                    const sampleMetrics = device.ctx.measureText(game.playerInitials.letters[0]);
                    const textWidth = sampleMetrics.width;
                    const textHeight = sampleMetrics.actualBoundingBoxAscent + sampleMetrics.actualBoundingBoxDescent;
                    const baseY = ch/2 + textHeight * 0.8;
                    
                    // for (let i = 0; i < game.playerInitials.letters.length; i++) 
                    // {
                    //     const x = cw/2 + (i - 1) * textWidth;
                    //     device.putText(game.playerInitials.letters[i], x, baseY);
                    // }
                    for (let i = 0; i < game.playerInitials.letters.length; i++) 
                    {
                        const x = cw/2 + (i - 1) * textWidth;

                        if (i === game.playerInitials.position)
                        {
                            device.setTextColor(game.gameConsts.HIGHLIGHT_COLOR);
                        }
                        else
                        {
                            device.setTextColor(game.gameConsts.FONT_COLOR);
                        }

                        device.putText(game.playerInitials.letters[i], x, baseY);
                    }

                    device.setTextColor(game.gameConsts.FONT_COLOR);
                    
                    // Instructions
                    device.setFont(game.gameConsts.NORM_FONT_SETTINGS);
                    device.putText(gameTexts.LOSE.HIGH_SCORE, cw/2, ch - ch/6);
                    device.putText(gameTexts.LOSE.INITIALS_REQUEST, cw/2, ch - ch/9);
                } 
                catch (e) 
                {
                    console.error("Error rendering top score:", e);
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
