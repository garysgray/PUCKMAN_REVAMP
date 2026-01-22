// ============================================================================
// gameUtilities.js
// ----------------------------------------------------------------------------
// Utility classes for the core game engine (rendering, input, audio, timing)
// Does NOT contain game logic itself — these classes are tools for Controller
// and Game objects.

function drawHitbox(device, obj, options = {}) 
{
    try 
    {
        const color = options.color || 'magenta';
        const lineWidth = options.lineWidth ?? 1;
        const fill = options.fill || false;
        const alpha = options.alpha ?? 1.0;

        if (typeof obj.getHitbox !== 'function') return; // safety

        const hb = obj.getHitbox(options.scale ?? 1.0, options.buffer ?? 0);
        const w = hb.right - hb.left;
        const h = hb.bottom - hb.top;
        const ctx = device.ctx;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        if (fill) 
        {
            ctx.fillStyle = color;
            ctx.fillRect(hb.left, hb.top, w, h);
        } 
        else 
        {
            ctx.strokeRect(hb.left, hb.top, w, h);
        }
        ctx.restore();
    }  
    catch (err) 
    { 
        console.warn("drawHitbox failed:", err.message); 
    }
}

// Used during play state wating for player to hit pause button
function checkForPause(device, game) 
{
    try 
    {
        const pausePressed = device.keys.isKeyPressed(keyTypes.PAUSE_KEY_L) || (game.gamePadEnabled && device.keys.isGamepadButtonPressed(gamepadButtons.PAUSE));

        // Use the persistent flag
        if (toggleOnce(pausePressed, device.keys)) 
        {
            // toggle game state
            if (game.gameState === gameStates.PLAY) 
            {
                game.setGameState(gameStates.PAUSE);
            } 
            else if (game.gameState === gameStates.PAUSE) 
            {
                game.setGameState(gameStates.PLAY);
            }
        }
    } 
    catch (e) 
    {
        console.error("checkForPause error:", e);
    }
}

function toggleOnce(isPressed, state) 
{
    if (isPressed && !state.value) 
    {
        state.value = true;
        return true;
    }

    if (!isPressed) 
    {
        state.value = false;
    }

    return false;
}

function updateHTMLMessage(game) 
{
    const msg = document.getElementById("message");
    if (!msg) return;

    if (game.gameState != gameStates.INIT) 
    {
        if (game.gamePadEnabled) 
        {
            msg.innerHTML = "<p>"+gameTexts.INIT.GAMEPAD_INSTRUCTIONS[4]+"</p>";     
        } 
        else 
        {
            msg.innerHTML = "<p>"+gameTexts.INIT.INSTRUCTIONS[4]+"</p>";
        }
    }
    else
    {
        if(game.gamePadConnected)
        {
            msg.innerHTML = "<p>"+gameTexts.INIT.HTML_DEFAULT_INSTRUCTIONS+"</p>";   
        }
        else 
        {
            msg.innerHTML = "<p>"+gameTexts.INIT.INSTRUCTIONS[4]+"</p>";
        }
        
    }
}

function setImagesForType(device, type, callback)
{
    Object.values(type).forEach(typeDef => 
    {
        if (typeDef.path) 
        {
            
            const sprite = new Sprite(typeDef.path, typeDef.type);
            device.images.addObject(sprite);

            //Call the callback if provided
            if (callback && typeof callback === "function") 
            {
                callback(typeDef, sprite); // pass the type definition and the sprite
            }
        }
    });
} 

function loadSounds(device, game, soundTypes)
{
    Object.values(soundTypes).forEach(sndDef => 
    {
        if (sndDef.path) 
        {
            device.audio.addSound(sndDef.name, sndDef.path, game.gameConsts.POOLSIZE, game.gameConsts.VOLUME,
            );
        }
    });
}

function loadTimers(game, timerTypes, timerModes)
{                                                                                                       // no looping
    const timer = new Timer( timerTypes.GAME_CLOCK, game.gameConsts.LEVEL_MAX_TIME, timerModes.COUNTDOWN, false); 
    game.gameTimers.addObject(timer);
}

function resetTimer(game, timerTypes, timerModes) 
{
    const gameClock = game.gameTimers.getObjectByName(timerTypes.GAME_CLOCK);

    if (gameClock)
    {
        gameClock.reset(game.gameConsts.LEVEL_MAX_TIME, timerModes.COUNTDOWN, false);
    }
}

function addEventListeners(game, keyTypes)
{
    window.addEventListener("gamepadconnected", (event) => game.gamePadConnected = true);
    window.addEventListener("gamepaddisconnected", (event) => game.gamePadConnected = false);

    const canvas = document.getElementById("canvas");
    canvas.tabIndex = 0; // make focusable
    canvas.focus();

    canvas.addEventListener("keydown", e => 
    {
        const blockedKeys = [
            keyTypes.UP,
            keyTypes.DOWN,
            keyTypes.LEFT,
            keyTypes.RIGHT,
            keyTypes.PLAY_KEY,
        ];

        if (blockedKeys.includes(e.code)) 
        {
            e.preventDefault();
        }
    });
}

function addKeysAndGamePads(device)
{
    device.keys.initKeys();
    device.keys.wasPausePressed = false;

    device.keys.isGamepadButtonPressed = function(buttonIndex) 
    {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        const gp = gamepads[0]; // first controller only
        return gp ? gp.buttons[buttonIndex]?.pressed : false;
    };
}

// Suggested Splits

// You can split the utilities into logical modules:


// Rendering / Canvas Utilities → renderUtils.js

        // Device class

        // drawHitbox

        // renderImage, renderClip, centerImage, putText, centerTextOnY, colorText, setFont, debugText

// Input Utilities → inputUtils.js

        // KeyManager

        // toggleOnce

        // checkForPause

        // addKeysAndGamePads

// Audio Utilities → audioUtils.js

        // Sound

        // AudioPlayer

        // loadSounds

// Timer Utilities → timerUtils.js

        // Timer

        // loadTimers, resetTimer

// Asset / Game Object Utilities → assetUtils.js

        // ObjHolder

        // Sprite

        // setImagesForType

// DOM / UI Utilities → uiUtils.js

        // updateHTMLMessage