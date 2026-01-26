// =======================================================
// gameConfig.js
// -------------------------------------------------------
// Central data hub for the game
// =======================================================

class Game 
{
    // -----------------------------
    // Core Systems
    // -----------------------------
    #gameConsts;
    #billBoards;
    #gameTimers;

    // -----------------------------
    // Entity Holders
    // -----------------------------
    #enemyHolder;
    #borderHolder;
    #mapHolder;
    #goalHolder;

    // -----------------------------
    // Viewport
    // -----------------------------
    #canvasWidth;
    #canvasHeight;
    #canvasHalfW;
    #canvasHalfH;

    // -----------------------------
    // Border & map buffers
    // -----------------------------
    #borderHorizontalBuffer;
    #borderVerticalBuffer;
    
    // -----------------------------
    // Game State
    // -----------------------------
    #gameState;
    #score;
    #lives;
    #player;
    #gameLevel;

    // -----------------------------
    // Map / Level Generation
    // -----------------------------
    #cachedBorder;
    #cachedBorderReady;
    #cachedMap;
    #cachedMapReady;
    #mapSafeMargin;
    #mapLaneSpacing;
    #mapEmptyChance;
    #mapSpawnRadius;
    #goalCount;

    // -----------------------------
    // Input
    // -----------------------------
    #gamePadConnected;
    #gamePadEnabled;
    #keyboardTouched;

    // =======================================================
    // CONSTRUCTOR
    // =======================================================
    constructor() 
    {
        try 
        {
            // Core systems
            this.#gameConsts = new GameConsts();
            this.#billBoards = new ObjHolder();
            this.#gameTimers = new ObjHolder();

            // Entity holders
            this.#enemyHolder = new ObjHolder();
            this.#goalHolder = new ObjHolder();
            this.#borderHolder = new ObjHolder();
            this.#mapHolder = new ObjHolder();

        } 
        catch (err) 
        {
            console.error("Failed to initialize object holders:", err);
        }

        // Canvas
        this.#canvasWidth = this.#gameConsts.SCREEN_WIDTH;
        this.#canvasHeight = this.#gameConsts.SCREEN_HEIGHT;
        this.#canvasHalfW = this.#canvasWidth * 0.5;
        this.#canvasHalfH = this.#canvasHeight * 0.5;

        // Game state
        this.#gameState = gameStates.INIT;
        this.#score = 0;
        this.#lives = 0;
        this.#gameLevel = 1;
        this.#player = null;

        // Border & map buffers
        this.#borderHorizontalBuffer = 0;
        this.#borderVerticalBuffer = 0;

        // Cached assets
        this.#cachedBorder = null;
        this.#cachedBorderReady = false;
        this.#cachedMap = null;
        this.#cachedMapReady = false;

        // Map generation params
        this.#mapSafeMargin = 0;
        this.#mapLaneSpacing = 0;
        this.#mapEmptyChance = 0;
        this.#mapSpawnRadius = 0;
        this.#goalCount = 0;

        // Input
        this.#gamePadConnected = false;
        this.#gamePadEnabled = false;
        this.#keyboardTouched = false
    }

    // =======================================================
    // GETTERS
    // =======================================================
    get gameConsts() { return this.#gameConsts; }

    get billBoards() { return this.#billBoards; }
    get gameTimers() { return this.#gameTimers; }
    get enemyHolder() { return this.#enemyHolder; }
    get player() { return this.#player; }
    get borderHolder() { return this.#borderHolder; }
    get mapHolder() { return this.#mapHolder; }
    get goalHolder() { return this.#goalHolder; }

    get canvasWidth() { return this.#canvasWidth; }
    get canvasHeight() { return this.#canvasHeight; }
    get canvasHalfW() { return this.#canvasHalfW; }
    get canvasHalfH() { return this.#canvasHalfH; }

    get gameState() { return this.#gameState; }
    get score() { return this.#score; }
    get lives() { return this.#lives; }
    get gameLevel() { return this.#gameLevel; }

    get borderHorizontalBuffer() { return this.#borderHorizontalBuffer; }
    get borderVerticalBuffer() { return this.#borderVerticalBuffer; }

    get cachedBorder() { return this.#cachedBorder; }
    get cachedBorderReady() { return this.#cachedBorderReady; }

    get cachedMap() { return this.#cachedMap; }
    get cachedMapReady() { return this.#cachedMapReady; }

    get mapSafeMargin() { return this.#mapSafeMargin; }
    get mapLaneSpacing() { return this.#mapLaneSpacing; }

    get mapEmptyChance() { return this.#mapEmptyChance; }
    get mapSpawnRadius() { return this.#mapSpawnRadius; }

    get goalCount() { return this.#goalCount; }

    get gamePadConnected() { return this.#gamePadConnected; }
    get gamePadEnabled() { return this.#gamePadEnabled; }

    get keyboardTouched() { return this.#keyboardTouched; }

    // =======================================================
    // SETTERS
    // =======================================================
    set gameState(v) { this.#gameState = v; }
    set score(v) { this.#score = v; }
    set lives(v) { this.#lives = v; }
    set gameLevel(v) { this.#gameLevel = v; }
    set player(v) { this.#player = v; }

    set borderHorizontalBuffer(v) { this.#borderHorizontalBuffer = v; }
    set borderVerticalBuffer(v) { this.#borderVerticalBuffer = v; }

    set cachedBorder(v) { this.#cachedBorder = v; }
    set cachedBorderReady(v) { this.#cachedBorderReady = v; }

    set cachedMap(v) { this.#cachedMap = v; }
    set cachedMapReady(v) { this.#cachedMapReady = v; }

    set mapSafeMargin(v) { this.#mapSafeMargin = v; }
    set mapLaneSpacing(v) { this.#mapLaneSpacing = v; }

    set mapEmptyChance(v) { this.#mapEmptyChance = v; }
    set mapSpawnRadius(v) { this.#mapSpawnRadius = v; }

    set goalCount(v) { this.#goalCount = v; }

    set gamePadConnected(v) { this.#gamePadConnected = v; }
    set gamePadEnabled(v) { this.#gamePadEnabled = v; }

    set keyboardTouched(v) { this.#keyboardTouched = v; }


    // =======================================================
    // UTILITY FUNCTIONS
    // =======================================================
    decreaseLives(a = 1) { this.lives -= a; }
    increaseScore(a = 1) { this.score += a; }
    increaseGameLevel(a = 1) { this.gameLevel += a; }
    setGameState(state) { this.gameState = state; }

    // =======================================================
    // INITIALIZATION
    // =======================================================
    initGame(device)
    {
        try 
        {
            // --- Add events  ---
            device.keys.addEventListeners(this, keyTypes);

            // --- Load keyboard keys and gamepad buttons ---
            device.keys.addKeysAndGamePads();

            // --- Load images ---
            device.setImagesForType(playerSpriteTypes);
            device.setImagesForType(mapSpriteTypes);
            device.setImagesForType(goalsSpriteTypes);
            device.setImagesForType(characterSpriteTypes);

            device.setImagesForType(billBoardTypes, boardDef => 
            {
                // This runs for every sprite in billBoardTypes
                const board = new BillBoard(boardDef.type, boardDef.w, boardDef.h, 0, 0, 0, boardDef.isCenter);
                if (board.isCenter) board.centerObjectInWorld(this.canvasWidth, this.canvasHeight);
                this.billBoards.addObject(board);
            });

            // --- Load sounds ---
            AudioPlayer.loadSounds(device, this, soundTypes);

            // --- Initialize timers ---
            Timer.loadTimers(this.gameTimers, timerTypes)
        } 
        catch (err) 
        {
            console.error("Error initializing game:", err);
        }
    }

    setGame() 
    { 
        // Reset States and key game values
        if (this.gameState != gameStates.LOSE && this.gameState != gameStates.WIN)
        {
           this.gameLevel = 1;
           this.score = 0;
           this.lives = this.gameConsts.GAME_LIVES_START_AMOUNT;
        }

        // Clear out entity holders
        this.enemyHolder.clearObjects();
        this.goalHolder.clearObjects();
        this.borderHolder.clearObjects();
        this.mapHolder.clearObjects();

        // Build the borders and map
        setMapValues(this);

        // Pick a random map sprite and build border and map
        let randSprite = getRandomMapSprite(mapSpriteTypes);

        buildBorder(this, randSprite.type, randSprite.w, randSprite.h);
        buildMap(this);

        // Player & enemies
        Player.buildPlayer(this);
        Enemy.spawnEnemies(this, characterSpriteTypes, this.enemyHolder)
        
        // Reset game clock timer
        const gameClock = this.gameTimers.getObjectByName(timerTypes.GAME_CLOCK.name);
        gameClock.reset();

    }
}