// ============================================================================
// BillBoards Render Layer
// ----------------------------------------------------------------------------
// Handles rendering of all core game visuals (background, splash, objects, player, UI overlays). 
// Called by the Controller during the main update cycle
// Responsible only for drawing (no game logic here)
// Uses game state to decide what to render
// ============================================================================

function renderBillBoardsLayer(device, game) {   
    try 
    {
        const yBuff = game.gameConsts.HUD_BUFFER * game.gameConsts.SCREEN_HEIGHT;

        device.ctx.fillStyle = 'black'; // You can also use '#000000' or 'rgb(0, 0, 0)'
        device.ctx.fillRect(0, 0, canvas.width, canvas.height);

        // === Render Based on Game State ===
        switch (game.gameState) 
        {
            case gameStates.INIT: 
            {
                
                board = game.billBoards.getObjectByName(billBoardTypes.SPLASH.type);
                const splashImg = device.images.getImage(billBoardTypes.SPLASH.type);
                if (board && splashImg) 
                {
                    try 
                    {

                        board.render(device, splashImg, yBuff)
                    } 
                    catch (e) 
                    {
                        console.error("Failed to render splash image:", e);
                    }
                }
            } 
            break;

            case gameStates.PLAY: 
            {
            }
            break;

            case gameStates.PAUSE:
            {
                board = game.billBoards.getObjectByName(billBoardTypes.PAUSE.type);
                const pauseImg = device.images.getImage(billBoardTypes.PAUSE.type);           
                if (board && pauseImg) 
                {
                    try 
                    {
                        board.render(device, pauseImg, yBuff)
                    } 
                    catch (e) 
                    {
                        console.error("Failed to render pause screen:", e);
                    }
                }
            } 
            break;

            case gameStates.WIN: 
            {
                // Reserved for future win state content
                board = game.billBoards.getObjectByName(billBoardTypes.WIN.type);
                const splashImg = device.images.getImage(billBoardTypes.WIN.type);
                if (board && splashImg) 
                {
                    try {
                        board.render(device, splashImg, yBuff)
                    } 
                    catch (e) 
                    {
                        console.error("Failed to render win image:", e);
                    }
                }
            } 
            break;

            case gameStates.LOSE: 
            { 
                if (game.lives == 0)
                {
                    board = game.billBoards.getObjectByName(billBoardTypes.LOSE.type);
                    const dieImg = device.images.getImage(billBoardTypes.LOSE.type);
                    if (board && dieImg) 
                    {
                        try 
                        {
                            board.render(device, dieImg, yBuff)     
                        } 
                        catch (e) 
                        {
                            console.error("Failed to render lose screen:", e);
                        }
                    }
                }
                else
                {
                    board = game.billBoards.getObjectByName(billBoardTypes.FAIL.type);
                    const dieImg = device.images.getImage(billBoardTypes.FAIL.type);
                    if (board && dieImg) 
                    {
                        try 
                        {
                            board.render(device, dieImg, yBuff)     
                        } 
                        catch (e) 
                        {
                            console.error("Failed to render fail screen:", e);
                        }
                    }
                }                
            } 
            break;

            // ==============================
            // TOP SCORE
            // ==============================
            case gameStates.TOP_SCORE:
            {
                // Reserved for future win state content
                // board = game.billBoards.getObjectByName(billBoardTypes.WIN.type);
                // const splashImg = device.images.getImage(billBoardTypes.WIN.type);
                // if (board && splashImg) 
                // {
                //     try {
                //         board.render(device, splashImg, yBuff)
                //     } 
                //     catch (e) 
                //     {
                //         console.error("Failed to render win image:", e);
                //     }
                // }
            } 
            break;

            default:
                console.warn("Unknown game state in text layer:", game.gameState);
                break;
        }
    } 
    catch (e) 
    {
        console.error("Unexpected error in renderGameObjectsLayer:", e);
    }
}

// === Layer Registration ===
const billBoardsLayer = new Layer("GameObjects", renderBillBoardsLayer);
