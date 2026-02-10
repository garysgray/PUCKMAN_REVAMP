// ============================================================================
// GameObjects Render Layer
// ----------------------------------------------------------------------------
// Handles rendering of core game visuals: borders, map, goals, player, enemies.
// Purely visual — no game logic here. Called during the main update cycle.
// ============================================================================
function renderGameObjectsLayer(device, game, opts) 
{
    try 
    {
        const { screenWidth, screenHeight } = opts;

        // === Render Based on Game State ===
        switch (game.gameState) 
        {
            case gameStates.INIT:
                // No game objects to render in INIT state
                break;

            case gameStates.PLAY:
                try 
                {
                    // Core map elements
                    RenderUtil.renderBorder(device, game, screenWidth, screenHeight);
                    RenderUtil.renderMap(device, game, screenWidth, screenHeight);

                    // Goals
                    game.goalHolder.forEach(element => 
                    {
                        RenderUtil.renderStateSprite(device, element);
                    });

                    // Player
                    RenderUtil.renderPlayer(device, game);

                    // Enemies
                    game.enemyHolder.forEach(element => 
                    {
                        RenderUtil.renderStateSprite(device, element);
                    });

                } catch (e) {
                    console.error("Error rendering gameplay objects:", e);
                }
                break;

            case gameStates.PAUSE:
                // Optional: overlay paused visuals if needed
                break;

            case gameStates.WIN:
                // Reserved for future win state content
                break;

            case gameStates.LOSE:
                try 
                {
                    // Optional: render player or other effects on lose screen
                    // RenderUtil.renderPlayer(device, game);
                } 
                catch (e) 
                {
                    console.error("Failed to render player on lose screen:", e);
                }
                break;

            case gameStates.TOP_SCORE:
                // Reserved for top score visuals
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

// Wrap it in a Layer object for controller integration
const gameObjectsLayer = new Layer("GameObjects", renderGameObjectsLayer);
