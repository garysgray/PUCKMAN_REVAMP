// // ============================================================================
// // KEY & BUTTON MANAGER
// // ============================================================================

// class KeyButtonManager 
// {
// 	#keysDown;       // currently held keys
//     #keysPressed;    // keys pressed this frame
//     #keysReleased;   // keys released this frame
//     #value = false;
   
// 	constructor() 
// 	{
//         this.#keysDown = {};       // currently held keys
//         this.#keysPressed = {};    // pressed this frame
//         this.#keysReleased = {};   // released this frame

//         this.initKeys();
//     }

//     get value() { return this.#value; }
//     set value(v) { this.#value = v; }


//     initKeys() 
//     {
//         try 
//         {
//             window.addEventListener("keydown", e => {
//                 if (!this.#keysDown[e.code]) this.#keysPressed[e.code] = true;
//                 this.#keysDown[e.code] = true;
//             });
//             window.addEventListener("keyup", e => {
//                 delete this.#keysDown[e.code];
//                 this.#keysReleased[e.code] = true;
//             });
//         } catch (err) { console.warn("KeyManager init failed:", err.message); }
//     }

//     // --- Query methods ---
//     isKeyDown(key) { return !!this.#keysDown[key]; }
//     isKeyPressed(key) { return !!this.#keysPressed[key]; }
//     isKeyReleased(key) { return !!this.#keysReleased[key]; }
//     clearFrameKeys() { this.#keysPressed = {}; this.#keysReleased = {}; }

//     checkForPause( game) 
//     {
//         try 
//         {
//             const pausePressed = this.isKeyPressed(keyTypes.PAUSE_KEY_L) || this.isGamepadButtonPressed(gamepadButtons.PAUSE);

//             // Use the persistent flag
//             if (pausePressed && !this.value)
//             {
//                 this.value = true;
//                 game.setGameState(
//                     game.gameState === gameStates.PLAY
//                         ? gameStates.PAUSE
//                         : gameStates.PLAY
//                 );
//             }

//             if (!pausePressed)
//             {
//                 this.value = false;
//             }
//         } 
//         catch (e) 
//         {
//             console.error("checkForPause error:", e);
//         }
//     }

//     toggleOnce(isPressed, state) 
//     {
//         if (isPressed && !state.value) 
//         {
//             state.value = true;
//             return true;
//         }

//         if (!isPressed) 
//         {
//             state.value = false;
//         }

//         return false;
//     }

//     addEventListeners(game, keyTypes)
//     {
//         window.addEventListener("gamepadconnected", (event) => game.gamePadConnected = true);
//         window.addEventListener("gamepaddisconnected", (event) => game.gamePadConnected = false);

//         const canvas = document.getElementById("canvas");
//         canvas.tabIndex = 0; // make focusable
//         canvas.focus();

//         canvas.addEventListener("keydown", e => 
//         {
//             const blockedKeys = [
//                 keyTypes.UP,
//                 keyTypes.DOWN,
//                 keyTypes.LEFT,
//                 keyTypes.RIGHT,
//                 keyTypes.PLAY_KEY,
//             ];

//             if (blockedKeys.includes(e.code)) 
//             {
//                 e.preventDefault();
//             }
//         });

//         canvas.addEventListener('keydown', function(event) 
//         {
//             if (!game.keyboardTouched) 
//             {
//                 game.keyboardTouched = true; 
//             }
//         });
//     }

//     addKeysAndGamePads()
//     {
//         this.initKeys();
//         this.wasPausePressed = false;

//         this.isGamepadButtonPressed = function(buttonIndex) 
//         {
//             const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
//             const gp = gamepads[0]; // first controller only
//             return gp ? gp.buttons[buttonIndex]?.pressed : false;
//         };
//     }
// }
// ============================================================================
// KEY & BUTTON MANAGER
// ============================================================================

class KeyButtonManager 
{
    #keysDown;       // currently held keys
    #keysPressed;    // keys pressed this frame
    #keysReleased;   // keys released this frame
    #value = false;  // persistent toggle flag (e.g., pause)

    constructor() 
    {
        this.#keysDown = {};
        this.#keysPressed = {};
        this.#keysReleased = {};

        this.initKeys();
        this.wasPausePressed = false;

        // In KeyButtonManager constructor, REPLACE all the axis stuff with this:
        this.axisThreshold = 0.5;
        this.axisPressed = {}; // Track which axes are currently pressed

        this.getGamepadAxis = function(axisIndex) 
        {
            const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            const gp = gamepads[0];
            return gp ? (gp.axes[axisIndex] || 0) : 0;
        };

        this.wasAxisJustPressed = function(axisIndex, direction) 
        {
            const key = `${axisIndex}_${direction}`;
            const currentValue = this.getGamepadAxis(axisIndex);
            
            const isPressed = direction < 0 
                ? currentValue < -this.axisThreshold 
                : currentValue > this.axisThreshold;
            
            // Check if it JUST became pressed (wasn't pressed before)
            if (isPressed && !this.axisPressed[key]) {
                this.axisPressed[key] = true;
                return true;
            }
            
            // Clear when released
            if (!isPressed) {
                this.axisPressed[key] = false;
            }
            
            return false;
        };
        
    }

    get value() { return this.#value; }
    set value(v) { this.#value = v; }

    // ------------------------------------------------------------------------
    // Initialize keyboard events
    // ------------------------------------------------------------------------
    initKeys() 
    {
        try 
        {
            window.addEventListener("keydown", e => {
                if (!this.#keysDown[e.code]) this.#keysPressed[e.code] = true;
                this.#keysDown[e.code] = true;
            });
            window.addEventListener("keyup", e => {
                delete this.#keysDown[e.code];
                this.#keysReleased[e.code] = true;
            });
        } 
        catch (err) 
        {
            console.warn("KeyManager init failed:", err.message);
        }
    }

    // ------------------------------------------------------------------------
    // Query methods
    // ------------------------------------------------------------------------
    isKeyDown(key) { return !!this.#keysDown[key]; }
    isKeyPressed(key) { return !!this.#keysPressed[key]; }
    isKeyReleased(key) { return !!this.#keysReleased[key]; }

    clearFrameKeys() 
    { 
        this.#keysPressed = {}; 
        this.#keysReleased = {};
        this.lastAxisValues = [0, 0, 0, 0]; // Add this line
    }

    // ------------------------------------------------------------------------
    // Toggle-once utility for frame-safe input
    // ------------------------------------------------------------------------
    toggleOnce(isPressed, state) 
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


    // ------------------------------------------------------------------------
    // Pause handling (works for keyboard + gamepad)
    // ------------------------------------------------------------------------
    checkForPause(game, key, button, originState, pauseState) 
    {
        try 
        {
            const keyDown = this.isKeyPressed(key);
            const padDown = this.isGamepadButtonPressed(button);

            // Only toggle when the button/key was not down last frame
            if ((keyDown || padDown) && !this.wasPausePressed)
            {
                this.wasPausePressed = true;

                game.setGameState(
                    game.gameState === originState
                        ? pauseState
                        : originState
                );
            }

            // Reset the per-frame flag when neither is pressed
            if (!keyDown && !padDown) 
            {
                this.wasPausePressed = false;
            }
        }
        catch (e) 
        {
            console.error("checkForPause error:", e);
        }
    }


    // ------------------------------------------------------------------------
    // Setup canvas key prevention and focus
    // ------------------------------------------------------------------------
    addEventListeners(game, keyTypes)
    {
        window.addEventListener("gamepadconnected", () => game.gamePadConnected = true);
        window.addEventListener("gamepaddisconnected", () => game.gamePadConnected = false);

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
            if (blockedKeys.includes(e.code)) e.preventDefault();
        });

        canvas.addEventListener("keydown", () => 
        {
            if (!game.keyboardTouched) game.keyboardTouched = true;
        });
    }

    // ------------------------------------------------------------------------
    // Initializes keyboard + gamepad functionality after construction
    // ------------------------------------------------------------------------
    addKeysAndGamePads()
    {
        this.initKeys();
        this.wasPausePressed = false;

        // Ensure gamepad function is attached
        this.isGamepadButtonPressed = function(buttonIndex) 
        {
            const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            const gp = gamepads[0]; // first controller only
            return gp ? gp.buttons[buttonIndex]?.pressed : false;
        };
    }
}

