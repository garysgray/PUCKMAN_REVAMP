// =======================================================
//DEBUG UTILITIES.js  
// =======================================================
// =======================================================
// DEBUG TOGGLE W/ DEBUG FUNCTIONS  & DEBUG UI
// =======================================================


// =======================================================
// DEBUG FLAGS
// =======================================================

//const DEV_MODE = false; // false when shipping
const DEV_MODE = true;     // true when dev

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
// DEBUG WINDOW EVENTS
// =======================================================

window.addEventListener("load", updateDebugPanelPosition);
window.addEventListener("resize", updateDebugPanelPosition);


