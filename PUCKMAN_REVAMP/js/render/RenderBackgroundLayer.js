// ============================================================================
// Background Rendering Layer
// ----------------------------------------------------------------------------
// Clears the canvas and draws background
// Must be the FIRST layer in the render pipeline
// ============================================================================

function renderBackgroundLayer(device, game) 
{
    const ctx = device.ctx;
    const cw = game.gameConsts.SCREEN_WIDTH;
    const ch = game.gameConsts.SCREEN_HEIGHT;
    
    // Clear canvas
    ctx.fillStyle = "black"; // Change to your background color
    ctx.fillRect(0, 0, cw, ch);
    
    // Optional: Add background image here if you have one
    // device.renderImage(backgroundImage, 0, 0, cw, ch);
}

// Wrap it in a Layer object
const backgroundRenderLayer = new Layer("Background", renderBackgroundLayer);