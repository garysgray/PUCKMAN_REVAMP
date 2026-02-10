// ============================================================================
// BillBoards Render Layer
// ----------------------------------------------------------------------------
// Handles rendering of all core game visuals (background, splash, objects, player, UI overlays). 
// Purely visual; no game logic here. Called by the controller during main update cycle.
// ============================================================================
function renderBillBoardsLayer(device, game, opts) 
{   
    try
    {
        // Destructure needed options
        const { screenWidth, screenHeight, hudBuff } = opts;
        const yBuff = hudBuff * screenHeight;

        // Clear background
        device.ctx.fillStyle = 'black';
        device.ctx.fillRect(0, 0, screenWidth, screenHeight);

        let board, img;

        // === Render based on current game state ===
        switch (game.gameState) 
        {
            case gameStates.INIT:
                board = game.billBoards.getObjectByName(billBoardTypes.SPLASH.type);
                img = device.images.getImage(billBoardTypes.SPLASH.type);
                break;

            case gameStates.PAUSE:
                board = game.billBoards.getObjectByName(billBoardTypes.PAUSE.type);
                img = device.images.getImage(billBoardTypes.PAUSE.type);
                break;

            case gameStates.WIN:
                board = game.billBoards.getObjectByName(billBoardTypes.WIN.type);
                img = device.images.getImage(billBoardTypes.WIN.type);
                break;

            case gameStates.LOSE:
                if (game.lives === 0) 
                {
                    board = game.billBoards.getObjectByName(billBoardTypes.LOSE.type);
                    img = device.images.getImage(billBoardTypes.LOSE.type);
                } else {
                    board = game.billBoards.getObjectByName(billBoardTypes.FAIL.type);
                    img = device.images.getImage(billBoardTypes.FAIL.type);
                }
                break;

            case gameStates.PLAY:
            case gameStates.TOP_SCORE:
                // Nothing special to render for these states
                return;

            default:
                console.warn("Unknown game state in BillBoards layer:", game.gameState);
                return;
        }

        // Render the board if both the object and image exist
        if (board && img) 
        {
            try 
            {
                board.render(device, img, yBuff);
            } 
            catch (e) 
            {
                console.error(`Failed to render ${game.gameState} image:`, e);
            }
        }

    } 
    catch (e) 
    {
        console.error("Unexpected error in renderBillBoardsLayer:", e);
    }
}

// === Layer Registration ===
const billBoardsLayer = new Layer("GameObjects", renderBillBoardsLayer);
