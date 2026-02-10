// =======================================================
// MAIN.js   
// Entry point and game loop
// =======================================================

// =======================================================
// GLOBALS
// =======================================================
let myController;
let lastTime = performance.now();
let accumulator = 0;
let rafId = null;

const FIXED_TIMESTEP = 1 / 60;
const MAX_FRAME_TIME = 0.25;
const SAFE_START_VALUE = 100;
const TIME_OUT_VALUE = 200;
const ONE_THOUSAND = 1000;

// =======================================================
// ENTRY POINT
// =======================================================
window.addEventListener("load", init);

// =======================================================
// INITIALIZATION
// =======================================================
function init() 
{
    try 
    {
        myController = new Controller();
        
        DebugUtil.updateDebugPanelVisibility();
        DebugUtil.updateDebugPanelPosition();
        
        safeStartGame();
    }
    catch (e) 
    {
        console.error("Initialization failed:", e);
    }
}

function safeStartGame() 
{
    if (!readyToStart()) 
    {
        setTimeout(safeStartGame, SAFE_START_VALUE);
        return;
    }

    if (window.requestIdleCallback)
        requestIdleCallback(startLoop, { timeout: TIME_OUT_VALUE });
    else
        setTimeout(startLoop, TIME_OUT_VALUE);
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
// GAME LOOP
// =======================================================
function gameLoop() 
{
    const now = performance.now();
    
    let frameTime = (now - lastTime) / ONE_THOUSAND;
    
    lastTime = now;

    // Clamp frame time to prevent spiral of death
    if (frameTime > MAX_FRAME_TIME) frameTime = MAX_FRAME_TIME;

    accumulator += frameTime;

    // Fixed timestep updates
    while (accumulator >= FIXED_TIMESTEP) 
    {
        try 
        {
            // Update game logic
            myController.callUpdateGame(FIXED_TIMESTEP);

            // Update HTML message cycle timer
            const cycleTimer = myController.game.gameTimers.getObjectByName(timerTypes.MESS_DELAY.name);

            if (cycleTimer && cycleTimer.active) 
            {
                cycleTimer.update(FIXED_TIMESTEP);
            }
            else
            {
                cycleTimer.setAndStart(myController.game.gameConsts.HTML_MESS_DELAY_TIME);
            }
        }
        catch (e) 
        {
            console.error("Update error:", e);
        }

        accumulator -= FIXED_TIMESTEP;

        myController.device.keys.clearFrameKeys();
    }

    // Render HTML overlay (if not fullscreen)
    if (!myController.game.isGameFullscreen)
    {
        myController.renderHTMLMessage(myController.device, myController.game);
    }

    DebugUtil.updateDebugPanel();

    rafId = requestAnimationFrame(gameLoop);
}

