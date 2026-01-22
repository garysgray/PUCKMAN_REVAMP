// ============================================================================
// KEY MANAGER
// ============================================================================

class KeyManager 
{
	#keysDown;       // currently held keys
    #keysPressed;    // keys pressed this frame
    #keysReleased;   // keys released this frame

	constructor() 
	{
        this.#keysDown = {};       // currently held keys
        this.#keysPressed = {};    // pressed this frame
        this.#keysReleased = {};   // released this frame

        this.initKeys();
    }

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

}