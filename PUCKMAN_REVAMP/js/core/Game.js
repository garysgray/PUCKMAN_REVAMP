// =======================================================
// gameConfig.js
// -------------------------------------------------------
// Central data hub for the game
// =======================================================

class Game 
{
    // =======================================================
    // PRIVATE FIELDS
    // =======================================================

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
    // Border & Map Buffers
    // -----------------------------
    #borderHorizontalBuffer;
    #borderVerticalBuffer;

    // -----------------------------
    // Game State
    // -----------------------------
    #gameState;
    #prevGameState;
    #stateEntered;

    // -----------------------------
    // Game Runtime Data
    // -----------------------------
    #lives;
    #player;
    #gameLevel;

    // -----------------------------
    // Scoring
    // -----------------------------
    #scoreManager;

    // -----------------------------
    // Fullscreen
    // -----------------------------
    #isGameFullscreen;

    // =======================================================
    // CONSTRUCTOR
    // =======================================================
    constructor() 
    {
        try 
        {
            // Core systems
            this.#gameConsts   = new GameConsts();
            this.#scoreManager = new ScoreManager(this.#gameConsts);
            this.#billBoards   = new ObjHolder();
            this.#gameTimers   = new ObjHolder();

            // Entity holders
            this.#enemyHolder  = new ObjHolder();
            this.#goalHolder   = new ObjHolder();
            this.#borderHolder = new ObjHolder();
            this.#mapHolder    = new ObjHolder();

            // Game state
            this.#gameState     = gameStates.INIT;
            this.#prevGameState = null;
            this.#stateEntered  = {};

            // Runtime data
            this.#lives     = 0;
            this.#gameLevel = this.gameConsts.LEVEL_1;
            this.#player    = null;

            // Buffers
            this.#borderHorizontalBuffer = 0;
            this.#borderVerticalBuffer   = 0;

            // Fullscreen
            this.#isGameFullscreen = false;
        } 
        catch (err) 
        {
            console.error("Failed to initialize Game:", err);
        }
    }

    // =======================================================
    // GETTERS
    // =======================================================
    get gameConsts() { return this.#gameConsts; }
    get scoreManager() { return this.#scoreManager; }

    get billBoards()   { return this.#billBoards; }
    get gameTimers()   { return this.#gameTimers; }
    get enemyHolder()  { return this.#enemyHolder; }
    get borderHolder() { return this.#borderHolder; }
    get mapHolder()    { return this.#mapHolder; }
    get goalHolder()   { return this.#goalHolder; }

    get player()    { return this.#player; }
    get lives()     { return this.#lives; }
    get gameLevel() { return this.#gameLevel; }

    get gameState()     { return this.#gameState; }
    get prevGameState() { return this.#prevGameState; }
    get stateEntered()  { return this.#stateEntered; }

    get borderHorizontalBuffer() { return this.#borderHorizontalBuffer; }
    get borderVerticalBuffer()   { return this.#borderVerticalBuffer; }

    get isGameFullscreen() { return this.#isGameFullscreen; }

    // -----------------------------
    // Score delegation
    // -----------------------------
    get score()              { return this.#scoreManager.score; }
    get topScores()          { return this.#scoreManager.topScores; }
    get playerInitials()     { return this.#scoreManager.playerInitials; }
    get nextExtraLifeScore() { return this.#scoreManager.nextExtraLifeScore; }
    get highScoreAchived()   { return this.#scoreManager.highScoreAchieved; }

    // =======================================================
    // SETTERS
    // =======================================================
    set gameState(v) { this.#gameState = v; }
    set prevGameState(v) { this.#prevGameState = v; }

    set lives(v)     { this.#lives = v; }
    set gameLevel(v) { this.#gameLevel = v; }
    set player(v)    { this.#player = v; }

    set borderHorizontalBuffer(v) { this.#borderHorizontalBuffer = v; }
    set borderVerticalBuffer(v)   { this.#borderVerticalBuffer = v; }

    set isGameFullscreen(v) { this.#isGameFullscreen = v; }
    set highScoreAchived(v) { this.#scoreManager.highScoreAchieved = v; }

    // =======================================================
    // INITIALIZATION
    // =======================================================
    initGame(device)
    {
        try 
        {
            // Input
            device.keys.addEventListeners(keyTypes);
            device.keys.addKeysAndGamePads();

            // Images
            device.setImagesForType(playerSpriteTypes);
            device.setImagesForType(mapSpriteTypes);
            device.setImagesForType(goalsSpriteTypes);
            device.setImagesForType(characterSpriteTypes);

            device.setImagesForType(billBoardTypes, boardDef => 
            {
                const board = new BillBoard(boardDef.type, boardDef.w, boardDef.h, 0, 0, 0, boardDef.isCenter);
                if (board.isCenter)
                {
                    board.centerObjectInWorld(this.gameConsts.SCREEN_WIDTH, this.gameConsts.SCREEN_HEIGHT);
                    this.billBoards.addObject(board);
                }
            });

            // Audio
            AudioPlayer.loadSounds(device, this, soundTypes);

            // Timers
            Timer.loadTimers(this.gameTimers, timerTypes);
        } 
        catch (err) 
        {
            console.error("Error initializing game:", err);
        }
    }

    // =======================================================
    // GAME RESET / SETUP
    // =======================================================
    setGame() 
    {
        if (this.gameState !== gameStates.LOSE && this.gameState !== gameStates.WIN)
        {
            this.gameLevel = this.gameConsts.LEVEL_1;
            this.lives     = this.gameConsts.GAME_LIVES_START_AMOUNT;

            this.scoreManager.nextExtraLifeScore = this.#gameConsts.VALUE_WHEN_NEW_LIFE_AWARDED;
            this.scoreManager.highScoreAchived = false;

            this.scoreManager.resetScore(); 
            this.scoreManager.resetInitials(); 

            //this.scoreManager.resetScoringValues();
        }

        this.enemyHolder.clearObjects();
        this.goalHolder.clearObjects();
        this.borderHolder.clearObjects();
        this.mapHolder.clearObjects();

        const mapBuilder = new MapBuilder();

        mapBuilder.setMapValues(this);

        const randSprite = mapBuilder.getRandomMapSprite(mapSpriteTypes);
        mapBuilder.buildBorder(this, randSprite.type, randSprite.w, randSprite.h);
        mapBuilder.buildMap(this);

        Player.buildPlayer(this);
        Enemy.spawnEnemies(this, characterSpriteTypes, this.enemyHolder);

        const gameClock = this.gameTimers.getObjectByName(timerTypes.GAME_CLOCK.name);
        gameClock.setAndStart(this.#gameConsts.LEVEL_MAX_TIME);
    }

    // =======================================================
    // STATE & GAMEPLAY HELPERS
    // =======================================================
    decreaseLives(a = 1) { this.lives -= a; }
    increaseLives() { this.lives++; }
    increaseGameLevel() { this.gameLevel++; }
    
    setGameState(newState) 
    {
        this.prevGameState = this.gameState;
        this.gameState     = newState;
        this.stateEntered[newState] = false;
    }

    isStateEnter(state) 
    {
        if (this.gameState !== state) return false;
        if (this.stateEntered[state]) return false;

        this.stateEntered[state] = true;
        return true;
    }

    resetStateEnterFlag(state) 
    {
        this.stateEntered[state] = false;
    }
}
