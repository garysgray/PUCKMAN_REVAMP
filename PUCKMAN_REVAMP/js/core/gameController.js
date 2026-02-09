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

    constructor() 
    {
        // Initialize Game Object
        try 
        {
            this.#game = new Game();
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
            this.#device = new Device(this.game.gameConsts.SCREEN_WIDTH, this.game.gameConsts.SCREEN_HEIGHT);
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
    }

    // ------------------------------------------------------------------------
    // Getters
    // ------------------------------------------------------------------------
    get device() { return this.#device; }
    get game() { return this.#game; }
    get layers() { return this.#layers; }
    get htmlMessageIndex() { return this.#htmlMessageIndex; }

    // ------------------------------------------------------------------------
    // Setters
    // ------------------------------------------------------------------------
    set htmlMessageIndex(v) { this.#htmlMessageIndex = v; }

    // ------------------------------------------------------------------------
    // Initialize the Game Object which will start the actual game init process
    // ------------------------------------------------------------------------
    initGameObj() 
    {
        try 
        {
            this.game.initGame(this.device);

            // Layers must be rendered in this order
            Layer.addRenderLayer(backgroundRenderLayer, this.layers);  // FIRST
            Layer.addRenderLayer(billBoardsLayer, this.layers);
            Layer.addRenderLayer(gameObjectsLayer, this.layers);
            Layer.addRenderLayer(hudRenderLayer, this.layers);
            Layer.addRenderLayer(textRenderLayer, this.layers);        // LAST
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
        if (typeof delta !== "number" || delta <= 0) delta = this.game.gameConsts.FALLBACK_DELTA; // fallback ~60fps

        try
        {
            // Independent function UpdateGame.js that updates everything game related from Game.js 
            // except rendering, that's done in each layer
            this.updateGame(this.device, this.game, delta);

            // Render each layer
            for (const layer of this.layers) 
            {
                try 
                { 
                    layer.render(this.device, this.game); 
                } 
                catch (renderError) 
                { 
                    console.error(`Error rendering layer:`, renderError.message); 
                }
            }

            // Clear per-frame input
            this.device.keys.clearFrameKeys();

        } 
        catch (error)
        {
            console.error("Game update error:", error.message);
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
                [gameStates.PAUSE]:     () => handlePauseState(device, game),
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
    renderHTMLMessage(game) 
    {
        // Get message container element
        const msg = document.getElementById("message");
        if (!msg || game.isGameFullscreen) return;
        
        // Track gamepad connection state changes
        if (game.prevGamePadConnected === undefined) 
        {
            game.prevGamePadConnected = game.gamePadConnected;
        }
        
        // Build messages array based on input method
        const messages = this.buildMessages(game);
        
        // Initialize cycling state
        if (this.htmlMessageIndex === undefined) this.htmlMessageIndex = 0;
        
        // Reset display when gamepad connects
        if (game.gamePadConnected && !game.prevGamePadConnected) 
        {
            this.htmlMessageIndex = 0;
        }
        
        // Update connection state for next frame
        game.prevGamePadConnected = game.gamePadConnected;
        
        // Ensure index stays within bounds
        if (this.htmlMessageIndex >= messages.length) 
        {
            this.htmlMessageIndex = 0;
        }
        
        // Cycle to next message when timer finishes
        const cycleTimer = game.gameTimers.getObjectByName(timerTypes.MESS_DELAY.name);
        if (cycleTimer && cycleTimer.finished)
        {
            this.htmlMessageIndex = (this.htmlMessageIndex + 1) % messages.length;
        }

        // Display current message
        const message = messages[this.htmlMessageIndex];
        
        if (message) 
        {
            msg.innerHTML = `<p>${message}</p>`;
        }
    }

    buildMessages(game)
    {
        // Build messages array based on input method
        let messages = [];
        
        if (game.gamePadEnabled && game.gamePadConnected) 
        {
            // Gamepad is connected and enabled
            messages.push(...gameTexts.INIT.GAMEPAD_INSTRUCTIONS);
        }
        else if (game.gamePadConnected && !game.gamePadEnabled) 
        {
            // Gamepad connected but not enabled - show toggle hint + keyboard controls
            messages.push(gameTexts.INIT.HTML_DEFAULT_INSTRUCTIONS);
            messages.push(...gameTexts.INIT.KEYBOARD_INSTRUCTIONS);
        }
        else 
        {
            // No gamepad or disconnected - show keyboard controls only
            messages.push(...gameTexts.INIT.KEYBOARD_INSTRUCTIONS);
        }
        
        // Remove any invalid entries
        messages = messages.filter(m => m !== undefined && m !== null && m !== "");
        if (messages.length === 0) return;

        return messages;
    }
}