// =======================================================
// MAIN.js   
// =======================================================
// =======================================================
// GAME LOOP FUNCTIONS 
// DEBUG TOGGLE W/ DEBUG FUNCTIONS
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
// DEBUG UI 
// =======================================================

// =======================================================
// DEBUG FLAGS
// =======================================================

const DEV_MODE = false; // false when shipping
//const DEV_MODE = true;     // true when dev

let HIT_BOXES  = false;
let DEBUG_TEXT = DEV_MODE;

let DRAW_DEBUG_TEXT     = DEBUG_TEXT;
let DRAW_DEBUG_HITBOXES = HIT_BOXES;


// =======================================================
// DEBUG TEXT SYSTEM
// =======================================================

// Array to hold debug lines dynamically
const debugLines = [];

function addDebugLine(line)
{
    debugLines.push(line);
}

function clearDebugLines() 
{
    debugLines.length = 0;
}

function writeDebugText() 
{
    const el = document.getElementById("debug-text");
    if (!el) return;
    el.textContent = debugLines.join("\n");
}


function updateDebugPanelVisibility()
{
    const panel = document.getElementById("debug-panel");
    if (!panel) return;

    if (DRAW_DEBUG_TEXT)
        panel.classList.remove("hidden");
    else
        panel.classList.add("hidden");
}

function updateDebugPanelPosition() 
{
    const panel  = document.getElementById("debug-panel");
    const canvas = document.getElementById("canvas");

    if (!panel || !canvas) return;

    const canvasRect = canvas.getBoundingClientRect();

    panel.style.left =
        (canvasRect.left - panel.offsetWidth - 10) + "px";

    panel.style.top =
        (canvasRect.top + canvasRect.height / 2 - panel.offsetHeight / 2) + "px";
}


// =======================================================
// DEBUG INPUT (DEV MODE ONLY)
// =======================================================

window.addEventListener("keydown", e =>
{
    if (!DEV_MODE) return;

    switch (e.code)
    {
        case "Backquote": // `
            DRAW_DEBUG_TEXT = !DRAW_DEBUG_TEXT;
            updateDebugPanelVisibility();
            break;

        case "KeyH": // H
            DRAW_DEBUG_HITBOXES = !DRAW_DEBUG_HITBOXES;
            console.log("Hitboxes:", DRAW_DEBUG_HITBOXES ? "ON" : "OFF");
            break;
    }
});

document.getElementById("debug-panel") ?.classList.toggle("hidden", !DRAW_DEBUG_TEXT);


// =======================================================
// WINDOW EVENTS
// =======================================================

window.addEventListener("load", updateDebugPanelPosition);
window.addEventListener("resize", updateDebugPanelPosition);

