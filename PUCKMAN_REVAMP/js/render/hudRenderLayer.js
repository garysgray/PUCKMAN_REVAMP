// ============================================================================
// HUD Rendering Layer
// ----------------------------------------------------------------------------
// Responsible for drawing HUD elements (score, lives, etc)
// No game logic — render only
// ============================================================================

function renderHUDLayer(device, game) 
{
    try 
    {
        device.setFont(game.gameConsts.NORM_FONT_SETTINGS);
        device.setTextColor(game.gameConsts.FONT_COLOR);

        // No HUD in INIT
        if (game.gameState === gameStates.INIT)
            return;

        // HUD visible in all other states
        RenderUtil.renderHud(device, game);
    } 
    catch (e) 
    {
        console.error("Error in renderHUDLayer:", e);
    }
}

// Layer registration
const hudRenderLayer = new Layer("HUD", renderHUDLayer);
