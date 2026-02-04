// =======================================================
// MAIN.js   
// =======================================================
// GAME LOOP FUNCTIONS 
// =======================================================

// =======================================================
// GLOBALS
// =======================================================
let myController;
let lastTime    = performance.now();
let accumulator = 0;
let gameRunning = false;
let rafId       = null;

// =======================================================
// ENTRY POINT
// =======================================================

window.addEventListener("load", initControllerAndGame);

// =======================================================
// INIT / PRELOAD
// =======================================================

function initControllerAndGame() 
{
    try 
    {
        if (!myController) myController = new Controller();
    }
    catch (e) 
    {
        console.error("Failed to create Controller:", e);
        return;
    }

    try 
    {
        updateDebugPanelVisibility();
        updateDebugPanelPosition();
        safeStartGame();
    }
    catch (e) 
    {
        console.error("Error during init:", e);
    }
}

// =======================================================
// GAME LOOP STARTUP
// =======================================================

function safeStartGame() 
{
    if (!readyToStart()) return setTimeout(startGameSafely, 100);

    if (!gameRunning) 
    {
        gameRunning = true;

        if (window.requestIdleCallback)
            requestIdleCallback(startLoop, { timeout: 200 });
        else
            setTimeout(startLoop, 200);
    }
}

// Temporary canvas safety check
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
    const fixedStep   = 1 / 60;
    const frameTimeMax = 0.25;

    const now = performance.now();
    let frameTime = (now - lastTime) / 1000;
    lastTime = now;

    if (frameTime > frameTimeMax) frameTime = frameTimeMax;

    accumulator += frameTime;

    while (accumulator >= fixedStep) 
    {
        try 
        {
            myController.callUpdateGame(fixedStep); //// THIS IS WHAT RUNS THE GAME!!!!!
        }
        catch (e) 
        {
            console.error("updateGame error:", e);
        }

        accumulator -= fixedStep;

        myController.device.keys.clearFrameKeys();
    }

    // Updates the message at bottom of screen
    renderHTMLMessage(myController.game); 
    
    // --------------------
    // DEBUG TEXT
    // --------------------
    clearDebugLines();

    if (DRAW_DEBUG_TEXT)
    {
        try 
        {
            addDebugLine("PUCKMAN DEBUG");
            addDebugLine("----------------");
            addDebugLine(`SafeMargin: ${myController.game.mapSafeMargin}`);
            addDebugLine(`LaneSpacing: ${myController.game.mapLaneSpacing}`);
            addDebugLine(`EmptyChance: ${myController.game.mapEmptyChance}`);
            addDebugLine(`SpawnRadius: ${myController.game.mapSpawnRadius}`);
            addDebugLine(`GoalCount: ${myController.game.goalCount}`);
        }
        catch (e) 
        {
            console.error("shit not loaded yet:", e);
        }
    }

    writeDebugText();
    rafId = requestAnimationFrame(gameLoop);
}

// =======================================================
// HTML MESSAGE HANDLER
// =======================================================

function renderHTMLMessage(game) 
{
    const msg = document.getElementById("message");
    if (!msg) return;

    if (game.gameState != gameStates.INIT) 
    {
        if (game.gamePadEnabled) 
        {
            msg.innerHTML = `<p>${gameTexts.INIT.GAMEPAD_INSTRUCTIONS[4]}</p>`;
        } 
        else 
        {
            msg.innerHTML = `<p>${gameTexts.INIT.INSTRUCTIONS[4]}</p>`;
        }
    }
    else
    {
        if (game.gamePadConnected)
        {
            msg.innerHTML = `<p>${gameTexts.INIT.HTML_DEFAULT_INSTRUCTIONS}</p>`;
        }
        else 
        {
            msg.innerHTML = `<p>${gameTexts.INIT.INSTRUCTIONS[4]}</p>`;
        }
    }
}

// =======================================================
// FULLSCREEN HELPERS
// =======================================================

function toggleFullScreen(canvas) {
    if (!document.fullscreenElement) {
        if (canvas.requestFullscreen) canvas.requestFullscreen({ navigationUI: "hide" });
        else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
        else if (canvas.msRequestFullscreen) canvas.msRequestFullscreen();
    } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
    }
}

//FIXX magic nums
function resizeCanvasToFullscreen(canvas, internalWidth = 1000, internalHeight = 600) {
    if (!canvas) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const scale = Math.min(windowWidth / internalWidth, windowHeight / internalHeight);

    canvas.style.width = internalWidth * scale + "px";
    canvas.style.height = internalHeight * scale + "px";

    canvas.style.display = "block";
    canvas.style.marginLeft = "auto";
    canvas.style.marginRight = "auto";
    canvas.style.marginTop = ((windowHeight - internalHeight * scale) / 2) + "px";
    canvas.style.marginBottom = ((windowHeight - internalHeight * scale) / 2) + "px";
}

// =======================================================
// EVENT LISTENERS
// =======================================================
window.addEventListener("keydown", e => {
    if (e.code === "KeyF") {
        const canvas = document.getElementById("canvas");
        toggleFullScreen(canvas);
    }
});

document.addEventListener("fullscreenchange", () => {
    const canvas = document.getElementById("canvas");
    
    if (document.fullscreenElement) {
        // Going fullscreen → scale canvas
        resizeCanvasToFullscreen(canvas);
    } else {
        // Exiting fullscreen → restore original arcade size
        canvas.style.width = "1000px";
        canvas.style.height = "600px";
        canvas.style.margin = "0 auto";
    }
});
