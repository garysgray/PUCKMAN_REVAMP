// ============================================================================
// Background Rendering Layer
// ----------------------------------------------------------------------------
// Clears the canvas and draws the background.
// Must be the FIRST layer in the render pipeline.
// ============================================================================
function renderBackgroundLayer(device, game, opts) 
{
    try 
    {
        const { screenWidth: cw, screenHeight: ch } = opts;
        const ctx = device.ctx;

        // Clear the canvas
        ctx.fillStyle = "black"; // Change to your desired background color
        ctx.fillRect(0, 0, cw, ch);

        // Optional: Add a background image if needed
        // const bgImage = device.images.getImage('background');
        // if (bgImage) ctx.drawImage(bgImage, 0, 0, cw, ch);

    }
    catch (e) 
    {
        console.error("Unexpected error in renderBackgroundLayer:", e);
    }
}

// Wrap it in a Layer object for the render pipeline
const backgroundRenderLayer = new Layer("Background", renderBackgroundLayer);
