// ============================================================================
// HUD Rendering Layer
// ----------------------------------------------------------------------------
// Responsible for drawing HUD elements (score, lives, etc).
// Purely visual — no game logic here.
// ============================================================================
function renderHUDLayer(device, game, opts) 
{
    try 
    {
        const { screenWidth, screenHeight, hudBuff, normFont, highlightColor, fontColor } = opts;

        device.setFont(normFont);
        device.setTextColor(fontColor);

        // Skip HUD in INIT state
        if (game.gameState === gameStates.INIT) return;

        // Render HUD for all other states
        RenderUtil.renderHud(device, game, screenWidth, screenHeight);

    } 
    catch (e) 
    {
        console.error("Error in renderHUDLayer:", e);
    }
}

// Wrap it in a Layer object
const hudRenderLayer = new Layer("HUD", renderHUDLayer);
