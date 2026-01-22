// ============================================================================
// HUD Rendering Layer
// ----------------------------------------------------------------------------
// Called by controller inside render pipeline.
// Responsible for drawing all on-screen HUD text score, ammo, lives, 
// pause/resume prompts, win/lose messages, etc).
// No game logic is executed here — this function only handles text rendering.
// ============================================================================

function renderHUDLayer(device, game) 
{
    try 
    {
        const cw = game.gameConsts.SCREEN_WIDTH;
        const ch = game.gameConsts.SCREEN_HEIGHT;
        
        // Define layout positions as percentages of canvas height/width
        const layout = 
        {
            hudScoreX: 0.10,                        // Left-side HUD text (Ammo)
            hudLivesX: 0.30,                       // Right-side HUD text (Lives)
            hudClockX: 0.60,                       // Right-side HUD text (Lives)
            hudLevelX: 0.80,                       // Right-side HUD text (Lives)
            hudY: .05,                             // HUD vertical placement 1   score, lives
            //hudY2: .095,                           // HUD vertical placement 2   score
           // hudY3: .05,                            // HUD vertical placement 3   clock               
        };

        // Set default font and color
        device.setFont(game.gameConsts.FONT_SETTINGS);
        device.colorText(game.gameConsts.FONT_COLOR);
        
        switch (game.gameState) 
        {
            // ==============================
            // INIT STATE: instructions
            // ==============================
            case gameStates.INIT:
                try
                {
                }
                catch (e) 
                {
                    console.error("Error rendering INIT HUD:", e);
                }
                break;

            // ==============================
            // PLAY STATE: HUD elements (score, ammo, lives)
            // ==============================
            case gameStates.PLAY:
                try
                {
                    const scoreText = gameTexts.HUD.SCORE + game.score;
                    const livesText = gameTexts.HUD.LIVES + game.lives;
                    const levelText = gameTexts.HUD.LEVEL + game.gameLevel;
                    const timer = game.gameTimers.getObjectByName(timerTypes.GAME_CLOCK);

                    device.colorText(game.gameConsts.FONT_COLOR);
                    device.putText(scoreText, cw * layout.hudScoreX, ch * layout.hudY);
                    device.putText(livesText, cw * layout.hudLivesX, ch * layout.hudY);

                    device.putText(`Time: ${timer.formatted}`, cw * layout.hudClockX, (ch * layout.hudY) );  
                    device.putText(levelText, cw * layout.hudLevelX, ch * layout.hudY);
  
                }
                catch (e) 
                {
                    console.error("Error rendering play HUD:", e);
                }
                break;

            // ==============================
            // PAUSE STATE: Resume prompt
            // ==============================
            case gameStates.PAUSE:
                try 
                {
                }  
                catch (e) 
                {
                    console.error("Error rendering pause HUD: ", e);
                }
                break;

            // ==============================
            // WIN STATE: Replay prompt
            // ==============================
            case gameStates.WIN:
                try 
                {
                } 
                catch (e) 
                {
                    console.error("Error rendering win HUD:", e);
                }
                break;

            // ==============================
            // LOSE STATE: Restart/Revive prompt
            // ==============================
            case gameStates.LOSE:
                try 
                {
                } 
                catch (e) 
                {
                    console.error("Error rendering lose HUD:", e);
                }
                break;

            default:
                console.warn("Unknown game state in HUD layer:", game.gameState);
                break;
        }
    } 
    catch (e) 
    {
        console.error("Unexpected error in renderHUDLayer:", e);
    }
}

// Wrap it in a Layer object for controller
const hudRenderLayer = new Layer("HUD/Text", renderHUDLayer);
