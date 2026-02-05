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
let gameRunning = false;
let rafId = null;

const FIXED_TIMESTEP = 1 / 60;
const MAX_FRAME_TIME = 0.25;

// =======================================================
// ENTRY POINT
// =======================================================
window.addEventListener("load", initControllerAndGame);

// =======================================================
// INITIALIZATION
// =======================================================
function initControllerAndGame() 
{
    try 
    {
        if (!myController) myController = new Controller();
        
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

    if (gameRunning) return;

    gameRunning = true;

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
            myController.callUpdateGame(FIXED_TIMESTEP);
        }
        catch (e) 
        {
            console.error("Update error:", e);
        }

        accumulator -= FIXED_TIMESTEP;
        myController.device.keys.clearFrameKeys();
    }

    // Render
    renderHTMLMessage(myController.game);
    Debug.updateDebugPanel();

    rafId = requestAnimationFrame(gameLoop);
}

// =======================================================
// HTML MESSAGE HANDLER
// =======================================================
function renderHTMLMessage(game) 
{
    const msg = document.getElementById("message");
    if (!msg) return;

    let message;

    if (game.gameState !== gameStates.INIT) 
    {
        message = game.gamePadEnabled 
            ? gameTexts.INIT.GAMEPAD_INSTRUCTIONS[4]
            : gameTexts.INIT.INSTRUCTIONS[4];
    }
    else
    {
        message = game.gamePadConnected 
            ? gameTexts.INIT.HTML_DEFAULT_INSTRUCTIONS
            : gameTexts.INIT.INSTRUCTIONS[4];
    }

    msg.innerHTML = `<p>${message}</p>`;
}

// =======================================================
// FULLSCREEN FUNCTIONS
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

function resizeCanvasToFullscreen(canvas, internalWidth = 1000, internalHeight = 600) 
{
    if (!canvas) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const scale = Math.min(windowWidth / internalWidth, windowHeight / internalHeight);

    const scaledWidth = internalWidth * scale;
    const scaledHeight = internalHeight * scale;

    canvas.style.width = scaledWidth + "px";
    canvas.style.height = scaledHeight + "px";
    canvas.style.display = "block";
    canvas.style.margin = `${(windowHeight - scaledHeight) / 2}px auto`;
}

// =======================================================
// FULL SCREEN EVENT LISTENERS
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
    
    if (document.fullscreenElement) 
    {
        resizeCanvasToFullscreen(canvas);
    } 
    else 
    {
        canvas.style.width = "1000px";
        canvas.style.height = "600px";
        canvas.style.margin = "0 auto";
    }
});