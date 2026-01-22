// =======================================================
// GameKeysAndButtons.js
// -------------------------------------------------------
// Purpose:
// Immutable keyboard keys and gamepad buttons settings
// =======================================================

const keyTypes = 
{
    PLAY_KEY: "Space",
    RESET_KEY: "Space",
    PAUSE_KEY_L: "ControlLeft",
    UP: "ArrowUp",
    DOWN: "ArrowDown",
    LEFT: "ArrowLeft",
    RIGHT: "ArrowRight",
    W: "KeyW",
    S: "KeyS",
    A: "KeyA",
    D: "KeyD",
    Q: "KeyQ",
};

const gamepadButtons = 
{
     START: 9,  
     PAUSE: 8 
};

Object.freeze(keyTypes);
Object.freeze(gamepadButtons);