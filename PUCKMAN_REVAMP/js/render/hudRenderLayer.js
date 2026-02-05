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
        // Set default font and color
        device.setFont(game.gameConsts.NORM_FONT_SETTINGS);
        device.setTextColor(game.gameConsts.FONT_COLOR);

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
                    Render.renderHud(device,game)
  
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
                    Render.renderHud(device,game)
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
                    Render.renderHud(device,game)
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
                    Render.renderHud(device,game)
                } 
                catch (e) 
                {
                    console.error("Error rendering lose HUD:", e);
                }
                break;
                // ==============================
            // TOP SCORE
            // ==============================
            case gameStates.TOP_SCORE:
                try 
                {
                    Render.renderHud(device,game)
                } 
                catch (e) 
                {
                    console.error("Error rendering win text:", e);
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
