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
        
        Debug.updateDebugPanelVisibility();
        Debug.updateDebugPanelPosition();
        
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
        setTimeout(safeStartGame, 100);
        return;
    }

    if (window.requestIdleCallback)
        requestIdleCallback(startLoop, { timeout: 200 });
    else
        setTimeout(startLoop, 200);
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
    let frameTime = (now - lastTime) / 1000;
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
        myController.renderHTMLMessage(myController.game);
    }

    Debug.updateDebugPanel();

    rafId = requestAnimationFrame(gameLoop);
}

// =======================================================
// FULLSCREEN MANAGEMENT
// =======================================================
function toggleFullScreen(canvas) 
{
    if (!document.fullscreenElement) 
    {
        if (canvas.requestFullscreen) 
            canvas.requestFullscreen({ navigationUI: "hide" });
        else if (canvas.webkitRequestFullscreen) 
            canvas.webkitRequestFullscreen();
        else if (canvas.msRequestFullscreen) 
            canvas.msRequestFullscreen();
    } 
    else 
    {
        if (document.exitFullscreen) 
            document.exitFullscreen();
        else if (document.webkitExitFullscreen) 
            document.webkitExitFullscreen();
        else if (document.msExitFullscreen) 
            document.msExitFullscreen();
    }
}

function resizeCanvasToFullscreen(canvas, game) 
{
    if (!canvas) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const internalWidth = game.gameConsts.SCREEN_WIDTH;
    const internalHeight = game.gameConsts.SCREEN_HEIGHT;
    const scale = Math.min(windowWidth / internalWidth, windowHeight / internalHeight);

    const scaledWidth = internalWidth * scale;
    const scaledHeight = internalHeight * scale;

    canvas.style.width = scaledWidth + "px";
    canvas.style.height = scaledHeight + "px";
    canvas.style.display = "block";
    canvas.style.margin = `${(windowHeight - scaledHeight) / 2}px auto`;
}

// =======================================================
// EVENT LISTENERS
// =======================================================
window.addEventListener("keydown", e => 
{
    if (e.code === "KeyF") 
    {
        const canvas = document.getElementById("canvas");
        toggleFullScreen(canvas);
    }
});

document.addEventListener("fullscreenchange", () => 
{
    const canvas = document.getElementById("canvas");
    if (!myController || !myController.game) return;
    
    const game = myController.game;
    
    if (document.fullscreenElement) 
    {
        resizeCanvasToFullscreen(canvas, game);
        game.isGameFullscreen = true;
    } 
    else 
    {
        canvas.style.width = game.gameConsts.SCREEN_WIDTH + "px";
        canvas.style.height = game.gameConsts.SCREEN_HEIGHT + "px";
        canvas.style.margin = "0 auto";
        game.isGameFullscreen = false;
    }
});