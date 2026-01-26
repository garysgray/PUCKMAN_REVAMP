// ============================================================================
// GameObjects Render Layer
// ----------------------------------------------------------------------------
// Handles rendering of all core game visuals (background, splash, objects, player, UI overlays). 
// Called by the Controller during the main update cycle
// Responsible only for drawing (no game logic here)
// Uses game state to decide what to render
// ============================================================================
function renderGameObjectsLayer(device, game) {   
    try 
    {
        // === Render Based on Game State ===
        switch (game.gameState) 
        {
            case gameStates.INIT: 
            {
                // no game objects at this time to render
            } 
            break;

            case gameStates.PLAY: 
            {
                try
                {
                    renderBorder(device, game);
                    renderMap(device, game);

                    // Render each goal
                    game.goalHolder.forEach(element => 
                    {
                         renderStateSprite(device, element );
                    });

                    renderPlayer(device, game);

                    // Render each enemy
                    game.enemyHolder.forEach(element => 
                    {
                         renderStateSprite(device, element );
                    });

                } 
                catch (e) 
                {
                    console.error("Error rendering gameplay objects:", e);
                }
            }
            break;

            case gameStates.PAUSE:
            {
                
            } 
            break;

            case gameStates.WIN: 
            {
                // Reserved for future win state content
            } 
            break;

            case gameStates.LOSE: 
            {
                try 
                {
                    //renderPlayer(device, game);
                } 
                catch (e) 
                {
                    console.error("Failed to render player on lose screen:", e);
                }
            } 
            break;

            default:
                console.warn("Unknown game state:", game.gameState);
                break;
        }
    } 
    catch (e) 
    {
        console.error("Unexpected error in renderGameObjectsLayer:", e);
    }
}

// === Layer Registration ===
const gameObjectsLayer = new Layer("GameObjects", renderGameObjectsLayer);
