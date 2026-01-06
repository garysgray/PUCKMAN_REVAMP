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
        this.#boarderHorizontalBuffer = 0;
        this.#boarderVerticleBuffer = 0;

        this.#cachedBorder = null;
        this.#cachedBorderReady = false;

        this.#cachedMap = null;
        this.#cachedMapReady = false;

        this.#player = null;

        this.#mapSafeMargin = 2;
        this.#mapLaneSpacing = 9;

        this.#mapEmptyChance = .99;
        this.#mapSpawnRadius = 4;
    }

    // =======================================================
    // GETTERS and SETTERS
    // =======================================================
    get gameConsts() { return this.#gameConsts; }
    get billBoards() { return this.#billBoards; }
    get gameTimers() { return this.#gameTimers; }
    get enemyHolder() { return this.#enemyHolder; }
    get canvasWidth() { return this.#canvasWidth; }
    get canvasHeight() { return this.#canvasHeight; }
    get canvasHalfW() { return this.#canvasHalfW; }
    get canvasHalfH() { return this.#canvasHalfH; }
    get gameState() { return this.#gameState; }
    get score() { return this.#score; }
    get lives() { return this.#lives; }
    get player() { return this.#player; }
    get boarderHolder() { return this.#boarderHolder; }
    get mapHolder() { return this.#mapHolder; }
    
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

    get goalHolder() { return this.#goalHolder; }

    /// SETS
    set gameState(v) { this.#gameState = v; }
    set score(v) { this.#score = v; }
    set lives(v) { this.#lives = v; }
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

    // =======================================================
    // FUNCTIONS
    // =======================================================

    decreaseLives(a) { this.lives -= a; }
    increaseScore(a) { this.score += a; }
    setGameState(state) { this.gameState = state; }

    initGame(device)
    {
        try 
        {
            device.keys.initKeys();

            // --- Clear all object holders to prevent duplicates ---
            device.images.clearObjects();
            this.enemyHolder.clearObjects();
            this.boarderHolder.clearObjects();
            this.billBoards.clearObjects();
            this.gameTimers.clearObjects();

            this.goalHolder.clearObjects();
            

            //load and set images in holder type
            this.setImagesForType(device, GameDefs.playerSpriteTypes);
            this.setImagesForType(device, GameDefs.mapSpriteTypes);
            this.setImagesForType(device, GameDefs.goalsSpriteTypes);

            this.setImagesForType(device, GameDefs.billBoardTypes, boardDef => 
            {
                // This runs for every sprite in billBoardTypes
                const board = new BillBoard(boardDef.type, boardDef.w, boardDef.h, 0, 0, 0, boardDef.isCenter);
                if (board.isCenter) board.centerObjectInWorld(this.canvasWidth, this.canvasHeight);
                this.billBoards.addObject(board);
            });

            this.setImagesForType(device, GameDefs.characterSpriteTypes, spriteDef => 
            {
                this.enemyHolder.addObject( new Enemy(spriteDef.type, spriteDef.w, spriteDef.h, this.canvasHalfW, this.canvasHalfH, spriteDef.s));
            });
            
             // Load sounds
            Object.values(GameDefs.soundTypes).forEach(sndDef => 
            {
                if (sndDef.path) 
                {
                    device.audio.addSound(
                        sndDef.name,
                        sndDef.path,
                        this.gameConsts.POOLSIZE,
                        this.gameConsts.VOLUME,
                    );
                }
            });

            // Timer
            const timer = new Timer(GameDefs.timerTypes.GAME_CLOCK, 0, GameDefs.timerModes.COUNTUP);
            this.gameTimers.addObject(timer);

            let randValue = Math.floor(Math.random() * (Object.values(GameDefs.mapSpriteTypes).length));
            let randSprite = Object.values(GameDefs.mapSpriteTypes)[randValue];
            this.buildBoarder(randSprite.type, randSprite.w, randSprite.h);

            this.buildMap();
            this.buildPlayer();

        } 
        catch (err) 
        {
            console.error("Error initializing game:", err);
        }
    }

    

    setGame() 
    {
        this.score = 0;
        this.lives = this.gameConsts.GAME_LIVES_START_AMOUNT;

        //this.enemyHolder.clearObjects();

        const gameClock = this.gameTimers.getObjectByName(GameDefs.timerTypes.GAME_CLOCK);
        if (gameClock) gameClock.start();
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
            const GOAL_COUNT = 30 + Math.floor(Math.random() * 51); // 10–20

            for (let g = 0; g < GOAL_COUNT; g++) 
            {
                let placed = false;

                for (let attempt = 0; attempt < 50 && !placed; attempt++) 
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
}
