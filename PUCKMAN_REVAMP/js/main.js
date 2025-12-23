// =======================================================
// MAIN.js
// =======================================================

// =======================================================
// DEBUG TOOLS
// =======================================================
const DEV_MODE = true; // false when shipping
//const DEV_MODE = false; // false when shipping

let HIT_BOXES = false;
let DEBUG_TEXT = DEV_MODE;

let DRAW_DEBUG_TEXT = DEBUG_TEXT;
let DRAW_DEBUG_HITBOXES = HIT_BOXES;

// Array to hold debug lines dynamically
const debugLines = [];

// Add a line dynamically
function addDebugLine(line)
{
    debugLines.push(line);
}

// Clear all debug lines
function clearDebugLines() 
{
    debugLines.length = 0;
}

// Write debug panel
function writeDebugText() 
{
    const el = document.getElementById("debug-text");
    if (!el) return;
    el.textContent = debugLines.join("\n");
}

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

        updateDebugPanelVisibility(); // DEBUG UI INIT
        updateDebugPanelPosition();   // DEBUG UI INIT POSITION

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

    // Clear old debug lines
    clearDebugLines();

    // Add default debug lines
    if (DRAW_DEBUG_TEXT)
    {
        addDebugLine("PUCKMAN DEBUG");
        addDebugLine("----------------");
        addDebugLine(`Player X: ${myController.game.player.posX.toFixed(1)}`);
        addDebugLine(`Player Y: ${myController.game.player.posY.toFixed(1)}`);
        addDebugLine(`Lives: ${myController.game.lives}`);
        addDebugLine(`Score: ${myController.game.score}`);
        addDebugLine(`Enemies: ${myController.game.enemyHolder.getSize()}`);
    }

    // Render all debug lines
    writeDebugText();

    rafId = requestAnimationFrame(gameLoop);
}

// =======================================================
// DEV MODE STUFF
// =======================================================
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
    const panel = document.getElementById("debug-panel");
    const canvas = document.getElementById("canvas");
    if (!panel || !canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    panel.style.left = (canvasRect.left - panel.offsetWidth - 10) + "px"; // 10px gap
    panel.style.top = (canvasRect.top + canvasRect.height / 2 - panel.offsetHeight / 2) + "px";
}

// Toggle debug panel and hitboxes
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

document.getElementById("debug-panel")
    ?.classList.toggle("hidden", !DRAW_DEBUG_TEXT);

// =======================================================
// WINDOW EVENTS
// =======================================================
window.addEventListener("load", updateDebugPanelPosition);
window.addEventListener("resize", updateDebugPanelPosition);
