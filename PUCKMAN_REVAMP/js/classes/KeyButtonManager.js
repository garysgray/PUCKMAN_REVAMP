// ============================================================================
// KEY & BUTTON MANAGER
// ============================================================================

class KeyButtonManager 
{
	#keysDown;       // currently held keys
    #keysPressed;    // keys pressed this frame
    #keysReleased;   // keys released this frame
    #value = false;
   
	constructor() 
	{
        this.#keysDown = {};       // currently held keys
        this.#keysPressed = {};    // pressed this frame
        this.#keysReleased = {};   // released this frame

        this.initKeys();
    }

    get value() { return this.#value; }
    set value(v) { this.#value = v; }


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
        } catch (err) { console.warn("KeyManager init failed:", err.message); }
    }

    // --- Query methods ---
    isKeyDown(key) { return !!this.#keysDown[key]; }
    isKeyPressed(key) { return !!this.#keysPressed[key]; }
    isKeyReleased(key) { return !!this.#keysReleased[key]; }
    clearFrameKeys() { this.#keysPressed = {}; this.#keysReleased = {}; }

    checkForPause( game) 
    {
        try 
        {
            const pausePressed = this.isKeyPressed(keyTypes.PAUSE_KEY_L) || this.isGamepadButtonPressed(gamepadButtons.PAUSE);

            // Use the persistent flag
            if (pausePressed && !this.value)
            {
                this.value = true;
                game.setGameState(
                    game.gameState === gameStates.PLAY
                        ? gameStates.PAUSE
                        : gameStates.PLAY
                );
            }

            if (!pausePressed)
            {
                this.value = false;
            }
        } 
        catch (e) 
        {
            console.error("checkForPause error:", e);
        }
    }

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

    addEventListeners(game, keyTypes)
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

        canvas.addEventListener('keydown', function(event) 
        {
            if (!game.keyboardTouched) 
            {
                game.keyboardTouched = true; 
            }
        });
    }

    addKeysAndGamePads()
    {
        this.initKeys();
        this.wasPausePressed = false;

        this.isGamepadButtonPressed = function(buttonIndex) 
        {
            const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            const gp = gamepads[0]; // first controller only
            return gp ? gp.buttons[buttonIndex]?.pressed : false;
        };
    }
}