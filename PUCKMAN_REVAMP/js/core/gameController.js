// ============================================================================
// Controller Class
// ----------------------------------------------------------------------------
// Manages the game loop, device, and rendering layers
// ============================================================================
class Controller 
{
    #device;            // Manages canvas and input
    #game;              // Holds core game state and logic
    #layers;            // Array of Layer instances (render order matters)
    #htmlMessageIndex;  // Keeps track of HTML message to be displayed when not in FULL SCREEN
    #htmlMessagePhase;
    #gameConsts;
    
    constructor(gameConsts = new GameConsts()) 
    {
        // Initialize Game Object
        try 
        {
            this.#game = new Game();

            this.#gameConsts = gameConsts;
        } 
        catch (error) 
        {
            console.error("Failed to initialize Game:", error.message);
            alert("An error occurred while initializing the game. Please try again.");
            return;
        }

        // Initialize Device Object
        try 
        {
            this.#device = new Device(this.#gameConsts.SCREEN_WIDTH, this.#gameConsts.SCREEN_HEIGHT);
        } 
        catch (error) 
        {
            console.error("Failed to initialize Device:", error.message);
            alert("An error occurred while setting up the game environment.");
            return;
        }

        // Initialize layers
        this.#layers = [];

        // Initialize the Game Object which will start the game init process
        this.initGameObj();

        this.#htmlMessageIndex = 0;
        this.htmlMessagePhase = "visible"; // visible | fading

    }

    // ------------------------------------------------------------------------
    // Getters
    // ------------------------------------------------------------------------
    get device() { return this.#device; }
    get game() { return this.#game; }
    get layers() { return this.#layers; }
    get htmlMessageIndex() { return this.#htmlMessageIndex; }
    get htmlMessagePhase() { return this.#htmlMessagePhase; }

    get gameConsts() { return this.#gameConsts; }

    // ------------------------------------------------------------------------
    // Setters
    // ------------------------------------------------------------------------
    set htmlMessageIndex(v) { this.#htmlMessageIndex = v; }
    set htmlMessagePhase(v) { this.#htmlMessagePhase = v; }

    // ------------------------------------------------------------------------
    // Initialize the Game Object which will start the actual game init process
    // ------------------------------------------------------------------------
    initGameObj() 
    {
        try 
        {
            this.game.initGame(this.device);

            // Layers must be rendered in this order
            Layer.addRenderLayers(
            [
                backgroundRenderLayer,
                billBoardsLayer,
                gameObjectsLayer,
                hudRenderLayer,
                textRenderLayer
            ], 
            this.layers);
        }
        catch (error) 
        {
            console.error("Failed to initialize game components:", error.message);
            alert("An error occurred while initializing game components.");
        }
    }

    // ------------------------------------------------------------------------
    // Update + Render
    // ------------------------------------------------------------------------
    callUpdateGame(delta) 
    {
        // Ensure delta is valid
        if (typeof delta !== "number" || delta <= 0) {
            delta = this.#gameConsts.FALLBACK_DELTA; // fallback ~60fps
        }

        try {
            // Update all game logic (separate from rendering)
            this.updateGame(this.device, this.game, delta);

            // Pack all constants into a single options object
            const renderOpts = {
                screenWidth: this.gameConsts.SCREEN_WIDTH,
                screenHeight: this.gameConsts.SCREEN_HEIGHT,
                hudBuff: this.gameConsts.HUD_BUFFER,
                normFont: this.gameConsts.NORM_FONT_SETTINGS,
                midFont: this.gameConsts.MID_FONT_SETTINGS,
                bigFont: this.gameConsts.BIG_FONT_SETTINGS,
                highlightColor: this.gameConsts.HIGHLIGHT_COLOR,
                fontColor: this.gameConsts.FONT_COLOR
            };

            // Render all layers in order
            for (const layer of this.layers) {
                layer.render(this.device, this.game, renderOpts);
            }

            // Clear per-frame input
            this.device.keys.clearFrameKeys();

        } catch (error) {
            console.error("Game update error:", error);
            alert("An error occurred during the game update. Please restart.");
        }
    }

    updateGame(device, game, delta)
    {
        try
        {
            // State handlers
            const stateHandlers =
            {
                [gameStates.INIT]:      () => handleInitState(device, game, delta),
                [gameStates.PLAY]:      () => handlePlayState(device, game, delta),
                [gameStates.PAUSE]:     () => handlePauseState(device, game, delta),
                [gameStates.WIN]:       () => handleWinState(device, game),
                [gameStates.LOSE]:      () => handleLoseState(device, game, delta),
                [gameStates.TOP_SCORE]: () => handleTopScoreState(device, game), 
            };

            const handler = stateHandlers[game.gameState];

            if (handler)
            {
                handler();
            }
            else
            {
                console.warn("Unknown game state:", game.gameState);
            }
        }
        catch (e)
        {
            console.error("updateGame main error:", e);
        }
    }

    // ------------------------------------------------------------------------
    // HTML Message Cycler
    // ------------------------------------------------------------------------
    // Displays rotating instruction messages in the HTML overlay during INIT state.
    // Messages cycle based on timer and adapt to gamepad connection status.
    // ------------------------------------------------------------------------
    renderHTMLMessage(device, game) 
    {
        const fadeTimeValue = 0.9;

        const container = document.getElementById("message");
        if (!container || game.isGameFullscreen) return;

        let textEl = container.querySelector(".message-text");
        if (!textEl) {
            textEl = document.createElement("p");
            textEl.className = "message-text";
            container.appendChild(textEl);
        }

        const messages = this.buildMessages(device, game);
        if (!messages || messages.length === 0) return;

        if (this.htmlMessageIndex === undefined) this.htmlMessageIndex = 0;
        if (this.htmlMessagePhase === undefined) this.htmlMessagePhase = "visible";

        const cycleTimer = game.gameTimers.getObjectByName(timerTypes.MESS_DELAY.name);
        if (!cycleTimer) return;

        const progress = cycleTimer.progress; // 0 → 1

        // Fade OUT during last 25% of timer
        if (progress > fadeTimeValue && this.htmlMessagePhase === "visible")  
        {
            textEl.classList.add("fade-out");
            this.htmlMessagePhase = "fading";
        }

        // Timer finished → swap + fade IN
        if (cycleTimer.finished) 
        {
            this.htmlMessageIndex = (this.htmlMessageIndex + 1) % messages.length;
            textEl.textContent = messages[this.htmlMessageIndex];

            textEl.classList.remove("fade-out");
            this.htmlMessagePhase = "visible";
        }

        // Initial draw
        if (!textEl.textContent) {
            textEl.textContent = messages[this.htmlMessageIndex];
        }
    }

    buildMessages(device)
    {
        const SPLICE_INDEX = 2;

        // Build messages array based on input method
        let messages = [];

        // give it the defaults
        messages.push(...gameTexts.INIT.DEFAULT_INSTRUCTIONS);
        
        if (device.keys.gamePadEnabled && device.keys.gamePadConnected) 
        {
            // Gamepad connected and enabled
            messages.splice(SPLICE_INDEX, 0, ...gameTexts.INIT.GAMEPAD_INSTRUCTIONS);
        }
        else if (device.keys.gamePadConnected && !device.keys.gamePadEnabled) 
        {
            // Gamepad connected but not enabled - show toggle hint + keyboard controls
            messages.splice(SPLICE_INDEX, 0, ...gameTexts.INIT.GAMEPAD_INSTRUCTIONS);
            messages.unshift(gameTexts.INIT.HTML_DEFAULT_INSTRUCTIONS);
        }
        else 
        {
            // No gamepad or disconnected - show keyboard controls only
            messages.unshift(...gameTexts.INIT.KEYBOARD_INSTRUCTIONS);
        }
        
        // Remove any invalid entries
        messages = messages.filter(m => m !== undefined && m !== null && m !== "");
        if (messages.length === 0) return;

        return messages;
    }
}