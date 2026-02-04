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
    // Border & Map Buffers
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
    #highScoreAchived;

    // -----------------------------
    // Map / Level Generation
    // -----------------------------
    #cachedBorder;
    #cachedBorderReady;
    #cachedMap;
    #cachedMapReady;

    // -----------------------------
    // Input
    // -----------------------------
    #gamePadConnected;
    #gamePadEnabled;
    #keyboardTouched;

    #nextExtraLifeScore;
    #topScores;

    // =======================================================
    // CONSTRUCTOR
    // =======================================================
    constructor() 
    {
        try 
        {
            /// FIXX need to make sure all memebers are private and needed
            // Core systems
            this.#gameConsts = new GameConsts();
            this.#billBoards = new ObjHolder();
            this.#gameTimers = new ObjHolder();

            // Entity holders
            this.#enemyHolder  = new ObjHolder();
            this.#goalHolder   = new ObjHolder();
            this.#borderHolder = new ObjHolder();
            this.#mapHolder    = new ObjHolder();

            this.#topScores = JSON.parse(localStorage.getItem("topScores")) || [];

            this.prevButtons = [];
            this.prevGameState = null;
            this._stateEntered = {}; // track per-state entry 
        } 
        catch (err) 
        {
            console.error("Failed to initialize object holders:", err);
        }

        // Game state
        this.#gameState = gameStates.INIT;
        this.#score = 0;
        this.#highScoreAchived = false;
        this.#lives = 0;
        this.#gameLevel = 1; // always start with 1 for HUD
        this.#player = null;

        // Border & map buffers
        this.#borderHorizontalBuffer = 0;
        this.#borderVerticalBuffer   = 0;

        // Cached assets
        this.#cachedBorder      = null;
        this.#cachedBorderReady = false;
        this.#cachedMap         = null;
        this.#cachedMapReady    = false;

        // Input
        this.#gamePadConnected = false;
        this.#gamePadEnabled   = false;
        this.#keyboardTouched  = false;

        this.#nextExtraLifeScore = this.#gameConsts.VALUE_WHEN_NEW_LIFE_AWARDED;
    }

    // =======================================================
    // GETTERS
    // =======================================================
    get gameConsts() { return this.#gameConsts; }

    get billBoards()    { return this.#billBoards; }
    get gameTimers()    { return this.#gameTimers; }
    get enemyHolder()   { return this.#enemyHolder; }
    get player()        { return this.#player; }
    get borderHolder()  { return this.#borderHolder; }
    get mapHolder()     { return this.#mapHolder; }
    get goalHolder()    { return this.#goalHolder; }

    get gameState() { return this.#gameState; }
    get score()     { return this.#score; }
    get highScoreAchived()     { return this.#highScoreAchived; }
    get lives()     { return this.#lives; }
    get gameLevel() { return this.#gameLevel; }

    get borderHorizontalBuffer() { return this.#borderHorizontalBuffer; }
    get borderVerticalBuffer()   { return this.#borderVerticalBuffer; }

    get cachedBorder()      { return this.#cachedBorder; }
    get cachedBorderReady() { return this.#cachedBorderReady; }

    get cachedMap()      { return this.#cachedMap; }
    get cachedMapReady() { return this.#cachedMapReady; }

    get gamePadConnected() { return this.#gamePadConnected; }
    get gamePadEnabled()   { return this.#gamePadEnabled; }
    get keyboardTouched()  { return this.#keyboardTouched; }

    get nextExtraLifeScore()  { return this.#nextExtraLifeScore; }

    get topScores()  { return this.#topScores; }

    // =======================================================
    // SETTERS
    // =======================================================
    set gameState(v) { this.#gameState = v; }
    set score(v)     { this.#score = v; }
    set highScoreAchived(v)     { this.#highScoreAchived = v; }
    set lives(v)     { this.#lives = v; }
    set gameLevel(v) { this.#gameLevel = v; }
    set player(v)    { this.#player = v; }

    set borderHorizontalBuffer(v) { this.#borderHorizontalBuffer = v; }
    set borderVerticalBuffer(v)   { this.#borderVerticalBuffer = v; }

    set cachedBorder(v)      { this.#cachedBorder = v; }
    set cachedBorderReady(v) { this.#cachedBorderReady = v; }

    set cachedMap(v)      { this.#cachedMap = v; }
    set cachedMapReady(v) { this.#cachedMapReady = v; }

    set gamePadConnected(v) { this.#gamePadConnected = v; }
    set gamePadEnabled(v)   { this.#gamePadEnabled = v; }
    set keyboardTouched(v)  { this.#keyboardTouched = v; }

    set nextExtraLifeScore(v)  { this.#nextExtraLifeScore = v; }

    // =======================================================
    // INITIALIZATION
    // =======================================================
    initGame(device)
    {
        try 
        {
            // --- Add events ---
            device.keys.addEventListeners(this, keyTypes);

            // --- Load keyboard & gamepad ---
            device.keys.addKeysAndGamePads();

            // --- Load images ---
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

            // --- Load sounds ---
            AudioPlayer.loadSounds(device, this, soundTypes);

            // --- Initialize timers ---
            Timer.loadTimers(this.gameTimers, timerTypes);
        } 
        catch (err) 
        {
            console.error("Error initializing game:", err);
        }
    }

    setGame() 
    { 
        // Reset states and core values
        if (this.gameState != gameStates.LOSE && this.gameState != gameStates.WIN)
        {
            this.gameLevel = 1;
            this.score     = 0;
            this.lives     = this.gameConsts.GAME_LIVES_START_AMOUNT;
            this.nextExtraLifeScore = this.gameConsts.VALUE_WHEN_NEW_LIFE_AWARDED;
            this.highScoreAchived = false;
        }

        // Clear entity holders
        this.enemyHolder.clearObjects();
        this.goalHolder.clearObjects();
        this.borderHolder.clearObjects();
        this.mapHolder.clearObjects();

        const mapBuilder = new MapBuilder();

        // Generate map values
        mapBuilder.setMapValues(this);

        // Build border & map
        const randSprite = mapBuilder.getRandomMapSprite(mapSpriteTypes);
        mapBuilder.buildBorder(this, randSprite.type, randSprite.w, randSprite.h);
        mapBuilder.buildMap(this);

        // Spawn player & enemies
        Player.buildPlayer(this);
        Enemy.spawnEnemies(this, characterSpriteTypes, this.enemyHolder);

        // Set game clock
        const gameClock = this.gameTimers.getObjectByName(timerTypes.GAME_CLOCK.name);
        gameClock.setAndStart(this.#gameConsts.LEVEL_MAX_TIME);
    }

    // =======================================================
    // UTILITY FUNCTIONS
    // =======================================================
    decreaseLives(a = 1)   { this.lives -= a; }
    increaseGameLevel()     { this.gameLevel++; }
    //setGameState(state)     { this.gameState = state; }

    setGameState(newState)
    {
        this.prevGameState = this.gameState;
        this.gameState = newState;
    }
    
    increaseScore(a) 
    {
        if (a <= 0) return 0;

        this.score += a;

        if (this.nextExtraLifeScore === undefined) 
            this.nextExtraLifeScore = this.score + this.gameConsts.VALUE_WHEN_NEW_LIFE_AWARDED;

        // Simple check: only one life per call
        if (this.score >= this.nextExtraLifeScore) 
        {
            this.lives++;
            this.nextExtraLifeScore += this.gameConsts.VALUE_WHEN_NEW_LIFE_AWARDED;
            return 1;
        }

        return 0;
    }
    // Inside your Game class
    calculateTimeBonus(timeLeft)
    {
        // Multiply by value-per-time-unit and floor it
        return Math.floor(timeLeft * this.gameConsts.VALUE_FOR_UNIT_OF_TIME_LEFT);
    }

    addTopScore(name, score) 
    {
        this.topScores.push({ name, score });
        this.topScores.sort((a, b) => b.score - a.score); // descending
        if (this.topScores.length > 10) this.topScores.pop(); // keep top 10
        localStorage.setItem("topScores", JSON.stringify(this.topScores)); // persist
    }

    recordScore(playerName) 
    {
        this.addTopScore(playerName, this.score);
    }
    
    ///FIXX either get rid of stuff not needed or move 
    // =======================================================
    // GAMEPAD INPUT (FRAME-BASED)
    // =======================================================
    isGamepadButtonPressed(buttonIndex)
    {
        const gamepads = navigator.getGamepads?.();
        if (!gamepads) return false;

        const gp = gamepads[0];
        if (!gp) return false;

        const pressed = gp.buttons[buttonIndex]?.pressed || false;
        const prev = this.prevButtons[buttonIndex] || false;

        return pressed && !prev;
    }

    clearGamepadFrameKeys()
    {
        const gamepads = navigator.getGamepads?.();
        if (!gamepads) return;

        const gp = gamepads[0];
        if (!gp) return;

        gp.buttons.forEach((btn, i) =>
        {
            this.prevButtons[i] = btn.pressed;
        });
    }

    printTopScores()
    {
        console.log("=== TOP SCORES ===");

        this.topScores.forEach((entry, index) =>
        {
            console.log(
                `${index + 1}. ${entry.name} - ${entry.score}`
            );
        });
    }

    isStateEnter(state)
    {
        return this.gameState === state && this.prevGameState !== state;
    }

    setGameState(newState) 
    {
        // Update previous state
        this.prevGameState = this.gameState;

        // Update current state
        this.gameState = newState;

        // Mark this state as entered
        this._stateEntered[newState] = false;
    }

    // Returns true ONLY the first frame you enter the state
    isStateEnter(state) 
    {
        if (this.gameState !== state) return false;          // not current state
        if (this._stateEntered[state]) return false;         // already fired for this state
        this._stateEntered[state] = true;                    // mark as fired
        return true;                                        // first-frame entry
    }

    // Call this when leaving a state to reset its “entered” flag
    resetStateEnterFlag(state) 
    {
        this._stateEntered[state] = false;
    }

}

//localStorage.clear(); 