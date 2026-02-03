// ============================================================================
// Controller Class (Test-Friendly Version)
// ----------------------------------------------------------------------------
// Works with real Game/Device or with fake/mock classes for Jasmine tests
// ============================================================================
class Controller 
{
    #device;    // Manages canvas and input
    #game;      // Holds core game state and logic
    #layers;    // Array of Layer instances (render order matters)

    // Fake constructor with fake objects for testing
    constructor(GameClass = null, DeviceClass = null, canvasEl = null) 
    {
        // Use real classes if not provided
        const GameCtor = GameClass || (typeof Game !== 'undefined' ? Game : class { initGame() {} });
        const DeviceCtor = DeviceClass || (typeof Device !== 'undefined' ? Device : class {});

        // Initialize Game Object
        try 
        {
            this.#game = new GameCtor();
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
            this.#device = new DeviceCtor(this.game.gameConsts.SCREEN_WIDTH, this.game.gameConsts.SCREEN_HEIGHT, canvasEl);
        } 
        catch (error) 
        {
            console.error("Failed to initialize Device:", error.message);
            alert("An error occurred while setting up the game environment.");
            return;
        }

        // Initialize layers
        this.#layers = [];

        // Initialize the Game Obj wich will start the game init proccess
        this.initGameObj();
    }

    // ------------------------------------------------------------------------
    // Getters
    // ------------------------------------------------------------------------
    get device() { return this.#device; }
    get game() { return this.#game; }
    get layers() { return this.#layers; }

    // ------------------------------------------------------------------------
    // Initialize the Game Obj wich will start the actual game init proccess
    // ------------------------------------------------------------------------
    initGameObj() 
    {
        try 
        {
            this.game.initGame(this.device);

            // Layers have to be rendered in this order
            if (typeof billBoardsLayer !== 'undefined')  Layer.addRenderLayer(billBoardsLayer, this.layers);      // game backgrounds
            if (typeof hudRenderLayer !== 'undefined')   Layer.addRenderLayer(hudRenderLayer, this.layers);       // game HUD
            if (typeof textRenderLayer !== 'undefined')  Layer.addRenderLayer(textRenderLayer, this.layers);      // game text
            if (typeof gameObjectsLayer !== 'undefined') Layer.addRenderLayer(gameObjectsLayer, this.layers);     // game objects
            
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
            // independent function UpdateGame.js that updates everything game related from Game.js 
            // except rendering, thats done in each layer affiliated
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
            // Get timers
            const gameClock = game.gameTimers.getObjectByName(timerTypes.GAME_CLOCK.name);
            const playDelayTimer = game.gameTimers.getObjectByName(timerTypes.PLAY_DELAY.name);
            const loseSoundDelayTimer = game.gameTimers.getObjectByName(timerTypes.LOSE_DELAY.name);

            // State handlers
            const stateHandlers =
            {
                [gameStates.INIT]:  () => handleInitState(device, game, playDelayTimer, delta),
                [gameStates.PLAY]:  () => handlePlayState(device, game, gameClock, loseSoundDelayTimer, delta),
                [gameStates.PAUSE]: () => handlePauseState(device, game),
                [gameStates.WIN]:   () => handleWinState(device, game),
                [gameStates.LOSE]:  () => handleLoseState(device, game, playDelayTimer)
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

}
