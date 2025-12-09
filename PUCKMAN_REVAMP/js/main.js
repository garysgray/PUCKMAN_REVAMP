// =======================================================
// MAIN.js
// =======================================================

// =======================================================
// DEBUG TOOLS
// =======================================================
let HIT_BOXES = false;
let DEBUG_TEXT = false;

// Uncomment for debugging
// HIT_BOXES = true;
// DEBUG_TEXT = true;

let DRAW_DEBUG_TEXT = DEBUG_TEXT;
let DRAW_DEBUG_HITBOXES = HIT_BOXES;

// =======================================================
// GLOBALS
// =======================================================
let myController;
let lastTime = performance.now();
let accumulator = 0;
let gameRunning = false;
let rafId = null;

// =======================================================
// MAIN POINT OF ENTRY
// =======================================================
window.addEventListener("load", initControllerAndGame);

// =======================================================
// PRELOAD FUNCTIONS
// =======================================================
function initControllerAndGame() 
{
    try 
    {
        if (!myController) myController = new Controller();
    } catch (e) 
    {
        console.error("Failed to create Controller:", e);
        return;
    }

    try 
    {
        myController.game.initGame(myController.device);
        myController.game.setGame(myController.device);
        safeStartGame();
    } catch (e) 
    {
        console.error("Error during init:", e);
    }
}

// =======================================================
// GAME LOOP MANAGEMENT FUNCTIONS
// =======================================================
function safeStartGame() 
{
    // Start your normal game loop
    if (!readyToStart()) return setTimeout(startGameSafely, 100);
    if (!gameRunning) 
    {
        gameRunning = true;
        if (window.requestIdleCallback) requestIdleCallback(startLoop, { timeout: 200 });
        else setTimeout(startLoop, 200);
    }
}

function readyToStart() 
{
    const canvas = document.getElementById("canvas");
    return canvas && canvas.getContext && canvas.width > 0 && canvas.height > 0;
}

function startLoop() 
{
    lastTime = performance.now();
    requestAnimationFrame(() => requestAnimationFrame(gameLoop));
}

// =======================================================
// DEBUG RENDER
// =======================================================
function renderDebugText(texts) 
{
    const posX = myController.game.gameConsts.SCREEN_WIDTH * 0.07;
    let posY = myController.game.gameConsts.SCREEN_HEIGHT * 0.2;
    const buffY = myController.game.gameConsts.SCREEN_HEIGHT * 0.05;
    texts.forEach(t => 
    {
        myController.device.debugText(t, posX, posY, myController.game.gameConsts.DEBUG_TEXT_COLOR);
        posY += buffY;
    });
}

// =======================================================
// GAME LOOP
// =======================================================
function gameLoop() 
{
    const fixedStep = 1 / 60,
        frameTimeMax = 0.25;
    const now = performance.now();
    let frameTime = (now - lastTime) / 1000;
    lastTime = now;
    if (frameTime > frameTimeMax) frameTime = frameTimeMax;

    accumulator += frameTime;
    while (accumulator >= fixedStep) 
    {
        try 
        {
            myController.updateGame(fixedStep);
        } catch (e) 
        {
            console.error("updateGame error:", e);
        }
        accumulator -= fixedStep;
    }

    if (DRAW_DEBUG_TEXT)
    { 
        {
            renderDebugText([
                "HELLO",
                "how goes it"
            ]);
        }
    }

    rafId = requestAnimationFrame(gameLoop);
}
