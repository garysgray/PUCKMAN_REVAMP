// ============================================================================
// Text Rendering Layer
// ----------------------------------------------------------------------------
// Called by controller inside render pipeline.
// Responsible for drawing all on-screen text messages (instructions,
// pause/resume prompts, win/lose messages, high scores, etc).
// No game logic is executed here — this function only handles text rendering.
// ============================================================================

function renderTextLayer(device, game) 
{
    try 
    {
        // Canvas dimensions
        const cw = game.gameConsts.SCREEN_WIDTH;
        const chw = cw / 2; 
        const ch = game.gameConsts.SCREEN_HEIGHT;
        
        // Define all layout positions as percentages of canvas height/width
        const layout = 
        {
            // Initial screen instruction positions
            initTextY: [0.60, 0.67, 0.74, 0.81, 0.88],

            // High score entry instruction positions
            highScoreTextY: [0.74, 0.81, 0.88],
            
            // High scores leaderboard display
            highScores: 
            {
                titleY: 0.13,
                startY: 0.18,
                lineHeight: 0.04,
                leftColumnX: 0.25,
                rightColumnX: 0.65,
                columnOffset: -50,
                scoreOffset: 0.15,
                maxDisplay: 10,
                splitAt: 5  // Number of scores in left column before splitting to right
            },
            
            // Pause and win/lose message positions
            pauseY: 0.62,
            winLoseY: 0.62,
            
            // Top score entry screen positions
            topScoreEntry:
            {
                scoreY: 0.30,
                initialsY: 0.40,
                initialsOffset: 0.8,  // Multiplier for text height adjustment
            }
        };

        // Set default text rendering settings
        device.setFont(game.gameConsts.NORM_FONT_SETTINGS);
        device.setTextColor(game.gameConsts.FONT_COLOR);
        device.ctx.textAlign = "center";

        switch (game.gameState) 
        {
            // ==============================
            // INIT STATE - Title screen with instructions and leaderboard
            // ==============================
            case gameStates.INIT:
                try
                {
                    const instructions = buildInitInstructions(game);
                    
                    renderInstructions(device, chw, ch, layout, instructions);
                    renderHighScores(device, game, chw, ch, cw, layout)
                }
                catch (e) 
                {
                    console.error("Error rendering INIT text:", e);
                }
                break;

            // ==============================
            // PLAY STATE - No text displayed during gameplay
            // ==============================
            case gameStates.PLAY:
                try
                {
                   // No text in play state
                }
                catch (e) 
                {
                    console.error("Error rendering PLAY text:", e);
                }
                break;

            // ==============================
            // PAUSE STATE - Show resume instructions
            // ==============================
            case gameStates.PAUSE:
                try 
                {
                    
                    const pauseMsg = (game.gamePadEnabled && game.gamePadConnected)
                        ? gameTexts.PAUSE.GAMEPAD_MESSAGE
                        : gameTexts.PAUSE.MESSAGE;
                    
                    device.putText(pauseMsg, chw, ch * layout.pauseY);
                    
                    renderHighScores(device, game, chw, ch, cw, layout)
                } 
                catch (e) 
                {
                    console.error("Error rendering pause text:", e);
                }
                break;

            // ==============================
            // WIN STATE - Show continue instructions
            // ==============================
            case gameStates.WIN:
                try 
                {
                    const winMsg = (game.gamePadEnabled && game.gamePadConnected)
                        ? gameTexts.WIN.GAMEPAD_MESSAGE
                        : gameTexts.WIN.MESSAGE;

                    device.putText(winMsg, chw, ch * layout.winLoseY);
                } 
                catch (e) 
                {
                    console.error("Error rendering win text:", e);
                }
                break;
                
            // ==============================
            // LOSE STATE - Show appropriate lose/death message
            // ==============================
            case gameStates.LOSE:
                try 
                {
                    const gameClock = game.gameTimers.getObjectByName(timerTypes.GAME_CLOCK.name);

                    // Show high score achievement message
                    if (game.highScoreAchived) 
                    {
                        device.putText(gameTexts.LOSE.HIGH_SCORE, chw, ch * layout.winLoseY);
                        return;   
                    }

                    // Determine appropriate message based on loss condition
                    let loseMsg;

                    if (game.lives <= 0) 
                    {
                        loseMsg = (game.gamePadEnabled && game.gamePadConnected)
                            ? gameTexts.LOSE.GAMEPAD_LOSE_MESSAGE
                            : gameTexts.LOSE.LOSE_MESSAGE;
                    }
                    else if (gameClock.timeLeft === 0)
                    {
                        loseMsg = (game.gamePadEnabled && game.gamePadConnected)
                            ? gameTexts.LOSE.GAMEPAD_OUT_OF_TIME
                            : gameTexts.LOSE.OUT_OF_TIME;
                    }
                    else 
                    {
                        loseMsg = (game.gamePadEnabled && game.gamePadConnected)
                            ? gameTexts.LOSE.GAMEPAD_DIE_MESSAGE
                            : gameTexts.LOSE.DIE_MESSAGE;
                    }

                    device.putText(loseMsg, chw, ch * layout.winLoseY);
                } 
                catch (e) 
                {
                    console.error("Error rendering lose text:", e);
                }
                break;

            // ==============================
            // TOP SCORE - High score entry screen
            // ==============================
            case gameStates.TOP_SCORE:
                try 
                {   
                    // Render score at top
                    device.setFont(game.gameConsts.MID_FONT_SETTINGS);
                    device.putText(game.score, chw, ch * layout.topScoreEntry.scoreY);
                    
                    // Render player initials with current position highlighted
                    device.setFont(game.gameConsts.BIG_FONT_SETTINGS);
                    
                    const sampleMetrics = device.ctx.measureText(game.playerInitials.letters[0]);
                    const textWidth = sampleMetrics.width;
                    const textHeight = sampleMetrics.actualBoundingBoxAscent + sampleMetrics.actualBoundingBoxDescent;
                    const baseY = ch * layout.topScoreEntry.initialsY + textHeight * layout.topScoreEntry.initialsOffset;
                    
                    for (let i = 0; i < game.playerInitials.letters.length; i++) 
                    {
                        const x = chw + (i - 1) * textWidth;

                        // Highlight current position
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

                    // Reset color and font for instructions
                    device.setTextColor(game.gameConsts.FONT_COLOR);
                    device.setFont(game.gameConsts.NORM_FONT_SETTINGS);

                   
                    const instructions = BuildHighScoreInstructions(game);
                    renderInstructions(device, chw, ch, layout, instructions);

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

// Wrap in Layer object for controller integration
const textRenderLayer = new Layer("HUD/Text", renderTextLayer);




function buildInitInstructions(game) //messages based on input method
{
    let instructions = [];
                    
    if (game.gamePadEnabled && game.gamePadConnected) 
    {
        instructions.push(...gameTexts.INIT.GAMEPAD_INSTRUCTIONS);
    }
    else if (game.gamePadConnected && !game.gamePadEnabled) 
    {
        instructions.push(gameTexts.INIT.HTML_DEFAULT_INSTRUCTIONS);
        instructions.push(...gameTexts.INIT.KEYBOARD_INSTRUCTIONS);
    }
    else 
    {
        instructions.push(...gameTexts.INIT.KEYBOARD_INSTRUCTIONS);
    }
    return instructions;
}

function BuildHighScoreInstructions(game)
{
    let instructions = [];

    if (game.gamePadEnabled && game.gamePadConnected) 
    {
        instructions.push(...gameTexts.HIGH_SCORE.GAMEPAD_INSTRUCTIONS);
    }
    else 
    {
        instructions.push(...gameTexts.HIGH_SCORE.KEYBOARD_INSTRUCTIONS);
    }
    return instructions;
}
 
function renderHighScores(device, game, chw, ch, cw, layout)
{
    device.setFont(game.gameConsts.SCORE_TITLE_FONT);
    device.putText(gameTexts.HIGH_SCORE.TOP_SCORE_TITLE, chw, ch * layout.highScores.titleY);

    // Render top scores leaderboard in two columns
    device.setFont(game.gameConsts.SCORE_LIST_FONT);
    const topScores = game.topScores.slice(0, layout.highScores.maxDisplay);

    topScores.forEach((score, idx) => 
    {
        const rank = idx + 1;
        const rankText = rank < 10 ? ` ${rank}.` : `${rank}.`;
        const name = score.name;
        const scoreValue = score.score;
        
        // Calculate position (left or right column)
        const isLeftColumn = idx < layout.highScores.splitAt;
        const baseX = cw * (isLeftColumn ? layout.highScores.leftColumnX : layout.highScores.rightColumnX);
        const x = baseX + layout.highScores.columnOffset;
        const y = ch * (layout.highScores.startY + (idx % layout.highScores.splitAt) * layout.highScores.lineHeight);
        
        // Render rank and name (left-aligned)
        device.ctx.textAlign = "left";
        device.putText(`${rankText} ${name}`, x, y);
        
        // Render score (right-aligned)
        device.ctx.textAlign = "right";
        device.putText(scoreValue, x + cw * layout.highScores.scoreOffset, y);
    });

    // Reset text alignment
    device.ctx.textAlign = "center";
}

function renderInstructions(device, chw, ch, layout, instructions)
{
    // Render instructions
    layout.initTextY.forEach((pct, idx) => 
    {
        if (instructions[idx]) 
        {
            device.putText(instructions[idx], chw, ch * pct);
        }
    });
}
                    