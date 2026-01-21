// =======================================================
// gameConfig.js
// -------------------------------------------------------
// Central data hub for the game
// =======================================================

class Game 
{
    #gameConsts;
    #billBoards;
    #gameTimers;
    
    #enemyHolder;
    #boarderHolder;
    #mapHolder;
    #goalHolder;

    #canvasWidth;
    #canvasHeight;
    #canvasHalfW;
    #canvasHalfH;

    #gameState;
    #score;
    #lives;
    #player;
    #gameLevel;

    #boarderHorizontalBuffer;
    #boarderVerticleBuffer;

    #cachedBorder;
    #cachedBorderReady;

    #cachedMap;
    #cachedMapReady;

    #mapSafeMargin;
    #mapLaneSpacing;

    #mapEmptyChance;
    #mapSpawnRadius;
    #goalCount;
    
    #gamePadConnected;
    #gamePadEnabled;
    #gameIsPaused;


    constructor() 
    {
        try 
        {
            this.#gameConsts = new GameConsts();
            this.#billBoards = new ObjHolder();
            this.#gameTimers = new ObjHolder();
            this.#enemyHolder = new ObjHolder();
            this.#goalHolder = new ObjHolder();
            this.#boarderHolder = new ObjHolder();
            this.#mapHolder = new ObjHolder();
        } 
        catch (err) 
        {
            console.error("Failed to initialize object holders:", err);
        }

        this.#canvasWidth = this.#gameConsts.SCREEN_WIDTH;
        this.#canvasHeight = this.#gameConsts.SCREEN_HEIGHT;
        this.#canvasHalfW = this.#canvasWidth * 0.5;
        this.#canvasHalfH = this.#canvasHeight * 0.5;

        this.#gameState = GameDefs.gameStates.INIT;
        this.#score = 0;
        this.#lives = 0;
        this.#gameLevel = 1;
        this.#player = null;

        this.#boarderHorizontalBuffer = 0;
        this.#boarderVerticleBuffer = 0;

        this.#cachedBorder = null;
        this.#cachedBorderReady = false;

        this.#cachedMap = null;
        this.#cachedMapReady = false;

        this.#mapSafeMargin = 0;
        this.#mapLaneSpacing = 0;

        this.#mapEmptyChance = 0;
        this.#mapSpawnRadius = 0;

        this.#goalCount = 0;

        this.#gamePadConnected = false;
        this.#gamePadEnabled = false;
        this.#gameIsPaused = false;
    }

    // =======================================================
    // GETTERS and SETTERS
    // =======================================================
    get gameConsts() { return this.#gameConsts; }

    get billBoards() { return this.#billBoards; }
    get gameTimers() { return this.#gameTimers; }
    get enemyHolder() { return this.#enemyHolder; }
    get player() { return this.#player; }
    get boarderHolder() { return this.#boarderHolder; }
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

    get boarderHorizontalBuffer() { return this.#boarderHorizontalBuffer; }
    get boarderVerticleBuffer() { return this.#boarderVerticleBuffer; }

    get cachedBorder () { return this.#cachedBorder ; }
    get cachedBorderReady () { return this.#cachedBorderReady ; }

    get cachedMap () { return this.#cachedMap ; }
    get cachedMapReady () { return this.#cachedMapReady ; }

    get mapSafeMargin(){ return this.#mapSafeMargin; }
    get mapLaneSpacing(){ return this.#mapLaneSpacing; }

    get mapEmptyChance(){ return this.#mapEmptyChance; }
    get mapSpawnRadius(){ return this.#mapSpawnRadius; }

    get goalCount(){ return this.#goalCount; }

    get gamePadConnected(){ return this.#gamePadConnected; }
    get gamePadEnabled(){ return this.#gamePadEnabled; }
    get gameIsPaused(){ return this.#gameIsPaused; }

    /// SETS
    set gameState(v) { this.#gameState = v; }
    set score(v) { this.#score = v; }
    set lives(v) { this.#lives = v; }
    set gameLevel(v) { this.#gameLevel = v; }
    set boarderHorizontalBuffer(v) { this.#boarderHorizontalBuffer = v; }
    set boarderVerticleBuffer(v) { this.#boarderVerticleBuffer = v; }

    set cachedBorder (v) { this.#cachedBorder  = v; }
    set cachedBorderReady (v) { this.#cachedBorderReady  = v; }

    set cachedMap (v) { this.#cachedMap  = v; }
    set cachedMapReady (v) { this.#cachedMapReady  = v; }

    set player (v) { this.#player  = v; }

    set mapSafeMargin (v) { this.#mapSafeMargin  = v; }
    set mapLaneSpacing (v) { this.#mapLaneSpacing  = v; }

    set mapEmptyChance (v) { this.#mapEmptyChance  = v; }
    set mapSpawnRadius (v) { this.#mapSpawnRadius  = v; }

    set goalCount (v) { this.#goalCount  = v; }

    set gamePadConnected (v) { this.#gamePadConnected  = v; }
    set gamePadEnabled (v) { this.#gamePadEnabled  = v; }
    set gameIsPaused (v) { this.#gameIsPaused  = v; }

    // =======================================================
    // FUNCTIONS
    // =======================================================

    decreaseLives(a) { this.lives -= a; }
    increaseScore(a) { this.score += a; }
    setGameState(state) { this.gameState = state; }
    increaseGameLevel(a) { this.#gameLevel += a; }

    initGame(device)
    {
        try 
        {
            device.keys.initKeys();

            device.keys.wasPausePressed = false;

            device.keys.isGamepadButtonPressed = function(buttonIndex) 
            {
                const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
                const gp = gamepads[0]; // first controller only
                return gp ? gp.buttons[buttonIndex]?.pressed : false;
            };

            window.addEventListener("gamepadconnected", (event) => 
            {
                this.gamePadConnected = true;
                //console.log("Gamepad connected:", event.gamepad);
            });

            window.addEventListener("gamepaddisconnected", (event) => 
            {
                 this.gamePadConnected = false;
                //console.log("Gamepad disconnected:", event.gamepad);
            });

            //load and set images in holder type
            this.setImagesForType(device, GameDefs.playerSpriteTypes);
            this.setImagesForType(device, GameDefs.mapSpriteTypes);
            this.setImagesForType(device, GameDefs.goalsSpriteTypes);
            this.setImagesForType(device, GameDefs.characterSpriteTypes);

            this.setImagesForType(device, GameDefs.billBoardTypes, boardDef => 
            {
                // This runs for every sprite in billBoardTypes
                const board = new BillBoard(boardDef.type, boardDef.w, boardDef.h, 0, 0, 0, boardDef.isCenter);
                if (board.isCenter) board.centerObjectInWorld(this.canvasWidth, this.canvasHeight);
                this.billBoards.addObject(board);
            });

             // Load sounds
            Object.values(GameDefs.soundTypes).forEach(sndDef => 
            {
                if (sndDef.path) 
                {
                    device.audio.addSound(sndDef.name, sndDef.path, this.gameConsts.POOLSIZE, this.gameConsts.VOLUME,
                    );
                }
            });

            const timer = new Timer(
                GameDefs.timerTypes.GAME_CLOCK,
                this.gameConsts.LEVEL_MAX_TIME,
                GameDefs.timerModes.COUNTDOWN,
                false // no looping
            );

            this.gameTimers.addObject(timer);
        } 
        catch (err) 
        {
            console.error("Error initializing game:", err);
        }
    }

    setGame() 
    { 
        if (this.gameState != GameDefs.gameStates.LOSE && this.gameState != GameDefs.gameStates.WIN)
        {
           this.gameLevel = 1;
           this.score = 0;
           this.lives = this.gameConsts.GAME_LIVES_START_AMOUNT;
        }

        // Need to reset level even if player wins level
        // Clear out these holders
        this.enemyHolder.clearObjects();
        this.goalHolder.clearObjects();
        this.boarderHolder.clearObjects();
        this.mapHolder.clearObjects();

        // Build the boarders and map
        this.setMapValues();
        let randValue = Math.floor(Math.random() * (Object.values(GameDefs.mapSpriteTypes).length));
        let randSprite = Object.values(GameDefs.mapSpriteTypes)[randValue];
        this.buildBoarder(randSprite.type, randSprite.w, randSprite.h);
        this.buildMap();
        this.buildPlayer();

        // Reset Enemies
        // fixx maybe need an enemyResetFunction()
        Object.values(GameDefs.characterSpriteTypes).forEach(spriteDef =>
        {
            const enemy = new Enemy(
                spriteDef.type,
                spriteDef.w,
                spriteDef.h,        
                this.canvasHalfW,
                this.canvasHalfH,
                spriteDef.s
            );

            this.enemyHolder.addObject(enemy);
        });

        // reset gameclock
        // FIX make game clock a timer instead
        const gameClock = this.gameTimers.getObjectByName(GameDefs.timerTypes.GAME_CLOCK);
        if (gameClock)
        {
            gameClock.reset(
                this.gameConsts.LEVEL_MAX_TIME,
                GameDefs.timerModes.COUNTDOWN,
                false
            );
        }
    }

    setImagesForType(device, type, callback)
    {
        Object.values(type).forEach(typeDef => 
        {
            if (typeDef.path) 
            {
                
                const sprite = new Sprite(typeDef.path, typeDef.type);
                device.images.addObject(sprite);

                //Call the callback if provided
                if (callback && typeof callback === "function") 
                {
                    callback(typeDef, sprite); // pass the type definition and the sprite
                }
            }
        });
    }

    buildPlayer()
    {
        try 
        {
            this.player = new Player(
                GameDefs.playerSpriteTypes.PLAYER.w,
                GameDefs.playerSpriteTypes.PLAYER.h,
                this.canvasHalfW,
                this.boarderVerticleBuffer + this.gameConsts.MAP_BUFFER_Y,
                this.gameConsts.PLAYER_SPEED
            );
        } 
        catch (err) 
        {
            console.error("Failed to initialize player:", err);
        }
    }

    buildMap() 
    {
        try 
        {
            const tilesX = this.gameConsts.NUM_MAP_X_TILES;
            const tilesY = this.gameConsts.NUM_MAP_Y_TILES;
            const centerX = Math.floor(tilesX / 2);
            const centerY = Math.floor(tilesY / 2);

            const palette = Object.values(GameDefs.mapSpriteTypes);
            const goalsPalette = Object.values(GameDefs.goalsSpriteTypes);

            // 0 = walkable, 1 = wall
            const grid = Array.from({ length: tilesY }, () => Array(tilesX).fill(0));

            // --------------------------

            // Build wall grid
            for (let y = 0; y < tilesY; y++) 
            {
                for (let x = 0; x < tilesX; x++) 
                {
                    // border exclusion & spawn safe zone
                    if (x < this.mapSafeMargin ||
                        y < this.mapSafeMargin ||
                        x >= tilesX - this.mapSafeMargin ||
                        y >= tilesY - this.mapSafeMargin ||
                        (Math.abs(x - centerX) <= this.mapSpawnRadius &&
                        Math.abs(y - centerY) <= this.mapSpawnRadius))
                        continue;

                    if (x % this.mapLaneSpacing === 0 ||
                        y % this.mapLaneSpacing === 0 ||
                        Math.random() > this.mapEmptyChance)
                        grid[y][x] = 1;
                }
            }

            // Place wall tiles
            for (let y = 0; y < tilesY; y++) 
            {
                for (let x = 0; x < tilesX; x++) 
                {
                    if (grid[y][x] !== 1) continue;

                    const screenX = this.gameConsts.MAP_BUFFER_X + x * this.gameConsts.MAP_TILE_WIDTH;
                    const screenY = this.gameConsts.MAP_BUFFER_Y + y * this.gameConsts.MAP_TILE_HEIGHT;

                    // rainbow effect
                    const dx = Math.abs(x - centerX);
                    const dy = Math.abs(y - centerY);
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    const maxDist = Math.sqrt(centerX*centerX + centerY*centerY);
                    const randIndex = Math.floor(Math.random() * palette.length);
                    const shift = Math.floor((dist / maxDist) * palette.length);
                    const colorIndex = (randIndex + shift) % palette.length;

                    const tileDef = palette[colorIndex];

                    this.mapHolder.addObject(new GameObject(
                        tileDef.type,
                        this.gameConsts.MAP_TILE_WIDTH,
                        this.gameConsts.MAP_TILE_HEIGHT, 
                        screenX,
                        screenY
                    ));
                }
            }

            //  Place goals safely
            //  FIXX magic nums
            //const GOAL_COUNT = 5; // 10–20
            for (let g = 0; g < this.goalCount; g++) 
            {
                let placed = false;

                for (let attempt = 0; attempt < 500 && !placed; attempt++) 
                {
                    const x = Math.floor(Math.random() * tilesX);
                    const y = Math.floor(Math.random() * tilesY);

                    // grid walkable + border + spawn zone
                    if (grid[y][x] !== 0 ||
                        x < this.mapSafeMargin ||
                        y < this.mapSafeMargin ||
                        x >= tilesX - this.mapSafeMargin ||
                        y >= tilesY - this.mapSafeMargin ||
                        (Math.abs(x - centerX) <= this.mapSpawnRadius &&
                        Math.abs(y - centerY) <= this.mapSpawnRadius))
                        continue;

                    const screenX = this.gameConsts.MAP_BUFFER_X + x * this.gameConsts.MAP_TILE_WIDTH;
                    const screenY = this.gameConsts.MAP_BUFFER_Y + y * this.gameConsts.MAP_TILE_HEIGHT;

                    const goalDef = goalsPalette[Math.floor(Math.random() * goalsPalette.length)];

                    const tempGoal = new GameObject(
                        goalDef.type,
                        this.gameConsts.MAP_TILE_WIDTH,
                        this.gameConsts.MAP_TILE_HEIGHT,
                        screenX,
                        screenY
                    );

                    // world-space collision
                    if (overlapsAny(tempGoal, this.mapHolder))  continue;
                    if (overlapsAny(tempGoal, this.goalHolder)) continue;
                    if (overlapsAny(tempGoal, this.enemyHolder)) continue;

                    if (this.player) 
                    {
                        const playerHolder = { getSize: () => 1, getIndex: () => this.player };
                        if (overlapsAny(tempGoal, playerHolder)) continue;
                    }

                    this.goalHolder.addObject(tempGoal);
                    placed = true;
                }

                if (!placed) console.warn("Failed to place a goal:", g);
            }
            // tell renderer to rebuild cached border
            this.cachedMapReady = false;
        }
        catch (err) 
        {
            console.error("Failed to build map:", err);
        }    
    }

    buildBoarder(name, width, height) 
    {
        try 
        {
            let maxWidth = Math.floor(this.canvasWidth / width);
            let maxHeight = Math.floor((this.canvasHeight - this.canvasHeight * this.gameConsts.HUD_BUFFER) / height);

            if (maxWidth % 2 !== 0) maxWidth--;
            if (maxHeight % 2 !== 0) maxHeight--;

            this.boarderHorizontalBuffer = (this.canvasWidth - maxWidth * width) * 0.5;
            this.boarderVerticleBuffer = (this.canvasHeight - (this.canvasHeight * this.gameConsts.HUD_BUFFER + maxHeight * height)) * 0.5;

            // Top & Bottom
            for (let i = 0; i < maxWidth; i++) 
            {
                this.boarderHolder.addObject(
                    new GameObject(name, width, height, i * width + this.boarderHorizontalBuffer, this.boarderVerticleBuffer + this.canvasHeight * this.gameConsts.HUD_BUFFER)
                );
                this.boarderHolder.addObject(
                    new GameObject(name, width, height, i * width + this.#boarderHorizontalBuffer, this.canvasHeight - (this.boarderVerticleBuffer + height))
                );
            }

            // Left & Right
            for (let i = 0; i < maxHeight; i++) 
            {
                this.boarderHolder.addObject(
                    new GameObject(name, width, height, this.boarderHorizontalBuffer, i * width + this.boarderVerticleBuffer + this.canvasHeight * this.gameConsts.HUD_BUFFER)
                );
                this.boarderHolder.addObject(
                    new GameObject(name, width, height, this.canvasWidth - (this.boarderHorizontalBuffer + width), i * width + this.boarderVerticleBuffer + this.canvasHeight * this.gameConsts.HUD_BUFFER)
                );
            }

            // tell renderer to rebuild cached border
            this.cachedBorderReady = false;
        }
        catch (err) 
        {
            console.error("Failed to build boarder:", err);
        }    
    }

    createCache(device, holder, cacheKey, readyKey) 
    {
        const canvas = document.createElement("canvas");
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasHeight;
        const ctx = canvas.getContext("2d");

        // Draw all sprites from the holder
        for (let i = 0; i < holder.getSize(); i++) 
        {
            const obj = holder.getIndex(i);
            const img = device.images.getImage(obj.name);
            if (!img) continue;

            ctx.drawImage(img, obj.posX, obj.posY, obj.width, obj.height);
        }

        // Dynamically set the class members
        this[cacheKey] = canvas;
        this[readyKey] = true;
    }

    setMapValues() 
    {
        // =======================================================
        // 1) LEVEL CONTROL
        // =======================================================
        // Player can level forever, but difficulty stops scaling.
        const MAX_DIFFICULTY_LEVEL = 50;
        const level = Math.min(this.gameLevel, MAX_DIFFICULTY_LEVEL);

        // Every 5 levels = new difficulty tier
        const tier = Math.floor((level - 1) / 5);

        // =======================================================
        // 2) BASE VALUES (LEVEL 1 FEEL)
        // =======================================================
        const BASE_SAFE_MARGIN   = 4;
        const BASE_LANE_SPACING  = 9;
        const BASE_EMPTY_CHANCE  = 0.99; // easiest maps
        const BASE_SPAWN_RADIUS  = 4;
        const BASE_GOALS         = 2;    // start with 2 goals

        this.mapSafeMargin   = BASE_SAFE_MARGIN;
        this.mapLaneSpacing  = BASE_LANE_SPACING;
        this.mapEmptyChance  = BASE_EMPTY_CHANCE;
        this.mapSpawnRadius  = BASE_SPAWN_RADIUS;
        this.goalCount       = BASE_GOALS;

        // =======================================================
        // 3) DIFFICULTY PER TIER (BIG STEPS)
        // =======================================================
        const SAFE_MARGIN_STEP   = 1;
        const LANE_SPACING_STEP  = 1;
        const EMPTY_CHANCE_STEP  = 0.05;
        const SPAWN_RADIUS_STEP  = 1;
        const GOALS_STEP         = 2;   // +2 goals per tier

        this.mapSafeMargin  -= tier * SAFE_MARGIN_STEP;
        this.mapLaneSpacing -= tier * LANE_SPACING_STEP;
        this.mapEmptyChance -= tier * EMPTY_CHANCE_STEP;
        this.mapSpawnRadius -= tier * SPAWN_RADIUS_STEP;
        this.goalCount      += tier * GOALS_STEP;

        // =======================================================
        // 4) SMALL PER-LEVEL VARIATION (FLAVOR)
        // =======================================================
        if (level % 2 === 0)
        {
            this.mapEmptyChance += 0.02; // tiny random tweak
            this.goalCount += 1;          // occasional extra goal
        }

        // =======================================================
        // 5) HARD LIMITS (DESIGN SAFETY NET)
        // =======================================================
        const MIN_SAFE_MARGIN   = 2;
        const MIN_LANE_SPACING  = 9;
        const MIN_SPAWN_RADIUS  = 2;
        const MIN_EMPTY_CHANCE  = 0.75;
        const MAX_EMPTY_CHANCE  = 0.99;
        const MAX_GOALS         = 15;
        const MIN_GOALS         = 2;

        this.mapSafeMargin  = Math.max(MIN_SAFE_MARGIN,  this.mapSafeMargin);
        this.mapLaneSpacing = Math.max(MIN_LANE_SPACING, this.mapLaneSpacing);
        this.mapSpawnRadius = Math.max(MIN_SPAWN_RADIUS, this.mapSpawnRadius);
        this.mapEmptyChance = Math.max(MIN_EMPTY_CHANCE, Math.min(MAX_EMPTY_CHANCE, this.mapEmptyChance));
        this.goalCount      = Math.max(MIN_GOALS, Math.min(MAX_GOALS, this.goalCount));

        // =======================================================
        // 6) DEBUG
        // =======================================================
        // console.log(
        //     `LEVEL: ${this.gameLevel} | TIER: ${tier}`,
        //     {
        //         safeMargin: this.mapSafeMargin,
        //         laneSpacing: this.mapLaneSpacing,
        //         emptyChance: this.mapEmptyChance.toFixed(2),
        //         spawnRadius: this.mapSpawnRadius,
        //         goalCount: this.goalCount
        //     }
        // );
    }

}