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
    #demoGoalHolder;

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


    //-----------------------------
    // Demo
    // -----------------------------
    #attractModeStarted;
    #attractModeEnemiesFollowing;

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

            this.#demoGoalHolder   = new ObjHolder();

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

            this.attractModeStarted = false;
            this.attractModeEnemiesFollowing = false;

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

    get demoGoalHolder()   { return this.#demoGoalHolder; }

    get player()    { return this.#player; }
    get lives()     { return this.#lives; }
    get gameLevel() { return this.#gameLevel; }

    get gameState()     { return this.#gameState; }
    get prevGameState() { return this.#prevGameState; }
    get stateEntered()  { return this.#stateEntered; }

    get borderHorizontalBuffer() { return this.#borderHorizontalBuffer; }
    get borderVerticalBuffer()   { return this.#borderVerticalBuffer; }

    get isGameFullscreen() { return this.#isGameFullscreen; }

    get attractModeStarted() { return this.#attractModeStarted; }
    get attractModeEnemiesFollowing()   { return this.#attractModeEnemiesFollowing; }

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

    set demoGoalHolder(v) { this.#demoGoalHolder = v; }

    set attractModeStarted(v) { this.#attractModeStarted = v; }
    set attractModeEnemiesFollowing(v) { this.#attractModeEnemiesFollowing = v; }


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
            AudioPlayer.loadSounds(device, this.gameConsts.POOLSIZE, soundTypes);

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

        const mapBuilder = new MapBuilder(this.gameConsts);

        mapBuilder.setMapValues(this);

        const randSprite = mapBuilder.getRandomMapSprite(mapSpriteTypes);
        mapBuilder.buildBorder(this, randSprite.type, randSprite.w, randSprite.h);
        mapBuilder.buildMap(this);

        this.player = Player.buildPlayer( this.gameConsts.SCREEN_WIDTH, this.borderVerticalBuffer, this.gameConsts.MAP_BUFFER_Y);

        Enemy.spawnEnemies(characterSpriteTypes, this.enemyHolder, this.gameConsts.SCREEN_WIDTH, this.gameConsts.SCREEN_HEIGHT);

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

    clearAllObjects()
    {   
        this.enemyHolder.clearObjects();
        this.borderHolder.clearObjects();
        this.mapHolder.clearObjects();
        this.demoGoalHolder.clearObjects();
        this.player.kill();
    }

    // ------------------------------------------------------------------------
    // ATTRACT MODE ANIMATION
    // ------------------------------------------------------------------------
    runLevelCompleteAnimation(delta) 
    {
        const player = this.player;
        const enemies = this.enemyHolder;
        const yBuff = this.gameConsts.SCREEN_HEIGHT / 35;
        const widthHalf = this.gameConsts.SCREEN_WIDTH / 2;
        const heightHalf = this.gameConsts.SCREEN_HEIGHT / 2;
        const playerDemoSpeed = 172;

        if (!this.attractModeStarted) 
        {
            this.attractModeStarted = true;
            this.attractModeEnemiesFollowing = true;

            const fruits = Object.values(goalsSpriteTypes);
            this.demoGoalHolder = this.buildRandomFruitHolder(fruits, fruits.length, widthHalf, heightHalf + yBuff, MAP_TILE_SIZE.w * 2);

            this.player.movePos(-(MAP_TILE_SIZE.h / 2), heightHalf + yBuff);
            this.player.playerState = playStates.RIGHT;
            this.player.speed = playerDemoSpeed;

            this.enemyHolder.forEach(enemy => 
            {
                enemy.movePos(-(MAP_TILE_SIZE.w * 2), heightHalf + yBuff);
                enemy.behaveState = behaveStates.FOLLOW;
            });
        }

        // Check fruit collisions
        this.demoGoalHolder.forEach(aFruit => 
        {
            if (aFruit && aFruit.alive && Collision.checkSingleCollisions(aFruit, player)) aFruit.kill();
        });

        player.posX += player.speed * delta;

        if (player.posX >= this.gameConsts.SCREEN_WIDTH + player.width) 
        {
            player.posX = -player.width;

            enemies.forEach(enemy => 
            {
                enemy.movePos(-(MAP_TILE_SIZE.w * 2), heightHalf + MAP_TILE_SIZE.h);
                enemy.behaveState = behaveStates.FOLLOW;
            });

            // Pick new fruits every loop
            const fruits = Object.values(goalsSpriteTypes);
            this.demoGoalHolder = this.buildRandomFruitHolder(fruits, fruits.length, widthHalf, heightHalf + yBuff, MAP_TILE_SIZE.w * 2);
        }

        enemies.forEach(enemy => 
        {
            enemy.update(delta, this, player);
            enemy.posX += enemy.deltaX;
            enemy.posY += enemy.deltaY;
        });

        return false;
    }

    // ------------------------------------------------------------------------
    // BUILD RANDOM FRUIT HOLDER
    // ------------------------------------------------------------------------
    buildRandomFruitHolder(fruits, numFruit, fixedPosX, fixedPosY, offSetX) 
    {
        const tempFruitHolder = new ObjHolder();
        if (!fruits || fruits.length === 0) return tempFruitHolder;

        numFruit = Math.max(1, Math.min(numFruit, fruits.length));
        const used = [];
        const centerOffset = (numFruit - 1) / 2;

        while (used.length < numFruit) 
        {
            const fruit = fruits[Math.floor(Math.random() * fruits.length)];
            if (used.includes(fruit)) continue;
            used.push(fruit);

            const index = used.length - 1;
            const demoFruit = new GameObject
            (
                fruit.type,
                fruit.w,
                fruit.h,
                fixedPosX + ((index - centerOffset) * offSetX),
                fixedPosY,
                0
            );
            tempFruitHolder.addObject(demoFruit);
        }

        return tempFruitHolder;
    }
}
