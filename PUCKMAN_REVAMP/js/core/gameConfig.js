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
    
    #gameSprites;

    #enemyHolder;
    #boarderHolder;
    #mapHolder;
    #fruitHolder;

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
    

    constructor() 
    {
        try 
        {
            this.#gameConsts = new GameConsts();
            this.#billBoards = new ObjHolder();
            this.#gameTimers = new ObjHolder();
            this.#enemyHolder = new ObjHolder();
            this.#gameSprites = new ObjHolder();

            this.#boarderHolder = new ObjHolder();
            this.#mapHolder = new ObjHolder();

        } catch (err) 
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

        this.cachedBorder = null;
        this.cachedBorderReady = false;

        this.cachedMap = null;
        this.cachedMapReady = false;

        // FIXX give player a default start pos ---relocate code or get rid of redundent
        // try 
        // {
        //     this.#player = new Player(
        //         GameDefs.playerSpriteTypes.PLAYER.w,
        //         GameDefs.playerSpriteTypes.PLAYER.h,
        //         0,
        //         0,
        //         this.#gameConsts.PLAYER_SPEED
        //     );
        // } catch (err) 
        // {
        //     console.error("Failed to initialize player:", err);
        // }
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
    get player() { return this.#player; }
    get gameSprites() { return this.#gameSprites; }
    get boarderHolder() { return this.#boarderHolder; }
    get mapHolder() { return this.#mapHolder; }
    
    get boarderHorizontalBuffer() { return this.#boarderHorizontalBuffer; }
    get boarderVerticleBuffer() { return this.#boarderVerticleBuffer; }

    get cachedBorder () { return this.#cachedBorder ; }
    get cachedBorderReady () { return this.#cachedBorderReady ; }

    get cachedMap () { return this.#cachedMap ; }
    get cachedMapReady () { return this.#cachedMapReady ; }

    /// SETS

    set gameState(v) { this.#gameState = v; }
    set score(v) { this.#score = v; }
    set boarderHorizontalBuffer(v) { this.#boarderHorizontalBuffer = v; }
    set boarderVerticleBuffer(v) { this.#boarderVerticleBuffer = v; }

    set cachedBorder (v) { this.#cachedBorder  = v; }
    set cachedBorderReady (v) { this.#cachedBorderReady  = v; }

    set cachedMap (v) { this.#cachedMap  = v; }
    set cachedMapReady (v) { this.#cachedMapReady  = v; }


// =======================================================
// FUNCTIONS
// =======================================================

    decreaseLives(a) { this.lives -= a; }
    increaseScore(a) { this.score += a; }
    setGameState(state) { this.gameState = state; }

    
    //initGame(device, preloadedImages = {}, preloadedAudio = {})
    initGame(device)
    {
        // --- Clear all object holders to prevent duplicates ---
        this.enemyHolder.clearObjects();
        this.boarderHolder.clearObjects();
        this.billBoards.clearObjects();
        this.gameTimers.clearObjects();

        // Clear only the Sprite instances in device.images, keep the preloaded images intact
        device.images.clearObjects();
        
        try 
        {
            device.keys.initKeys();

            //load and set images in holder type
            this.setImagesForType(device, GameDefs.playerSpriteTypes);
            this.setImagesForType(device, GameDefs.mapSpriteTypes);

            this.setImagesForType(device, GameDefs.billBoardTypes, boardDef => 
            {
                // This runs for every sprite in billBoardTypes
                const board = new BillBoard(boardDef.type, boardDef.w, boardDef.h, 0, 0, 0, boardDef.isCenter);
                if (board.isCenter) board.centerObjectInWorld(this.canvasWidth, this.canvasHeight);
                this.billBoards.addObject(board);
            });

            // FIXX magic nums
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

        } catch (err) {
            console.error("Error initializing game:", err);
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

    setGame(device) 
    {
        this.score = 0;
        this.lives = this.gameConsts.GAME_LIVES_START_AMOUNT;
        const gameClock = this.gameTimers.getObjectByName(GameDefs.timerTypes.GAME_CLOCK);
        if (gameClock) gameClock.start();

        let randValue = Math.floor(Math.random() * (Object.values(GameDefs.mapSpriteTypes).length));
        let randSprite = Object.values(GameDefs.mapSpriteTypes)[randValue];
        this.buildBoarder(randSprite.type, randSprite.w, randSprite.h);

        //FIXX dont need this probbaly
        randValue = Math.floor(Math.random() * (Object.values(GameDefs.mapSpriteTypes).length));
        randSprite = Object.values(GameDefs.mapSpriteTypes)[randValue];
        this.buildMap(randSprite.w, randSprite.h);

         // FIXX magic nums
        try 
        {
            this.#player = new Player(
                GameDefs.playerSpriteTypes.PLAYER.w,
                GameDefs.playerSpriteTypes.PLAYER.h,
                this.canvasHalfW,
                95,
                this.#gameConsts.PLAYER_SPEED
            );
        } catch (err) 
        {
            console.error("Failed to initialize player:", err);
        }
    }

    buildMap(tileWidth, tileHeight) 
    {
        // FIXX magic nums
        const tilesX = 36;
        const tilesY = 20;

        const bufferX = 70;
        const bufferY = 70;

        const safeMargin = 3;
        const laneSpacing = 90;
        const emptyChance = 0.65;
        const spawnRadius = 2;

        const palette = Object.values(GameDefs.mapSpriteTypes);

        const centerX = Math.floor(tilesX / 2);
        const centerY = Math.floor(tilesY / 2);

        const grid = Array.from({ length: tilesX }, () => Array.from({ length: tilesY }, () => 0));

        // Fill grid with structured lanes + random walls
        for (let row = 0; row < tilesX; row++) 
        {
            for (let col = 0; col < tilesY; col++) 
            {
                if (row < safeMargin || col < safeMargin || row >= tilesX - safeMargin || col >= tilesY - safeMargin)
                    continue;

                if (Math.abs(row - centerX) <= spawnRadius && Math.abs(col - centerY) <= spawnRadius)
                    continue;

                if (row % laneSpacing === 0 || col % laneSpacing === 0 || Math.random() > emptyChance)
                    grid[row][col] = 1;
            }
        }

        // Place objects based on grid
        for (let row = 0; row < tilesX; row++) 
        {
            for (let col = 0; col < tilesY; col++) 
            {
                if (grid[row][col] === 1) 
                {
                    const screenX = bufferX + row * tileWidth;
                    const screenY = bufferY + col * tileHeight;

                    // Distance from center
                    const distX = Math.abs(row - centerX);
                    const distY = Math.abs(col - centerY);
                    const dist = Math.sqrt(distX*distX + distY*distY);

                    const maxDist = Math.sqrt(centerX*centerX + centerY*centerY);

                    // Base random index for rainbow effect
                    let randIndex = Math.floor(Math.random() * palette.length);

                    // Shift the color based on distance
                    const shift = Math.floor((dist / maxDist) * palette.length);
                    const colorIndex = (randIndex + shift) % palette.length;

                    const chosenTile = palette[colorIndex];

                    this.mapHolder.addObject(new GameObject(chosenTile.type, tileWidth, tileHeight, screenX, screenY));
                }
            }
        }
    }


    buildBoarder(name, width, height) 
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

    createBorderCache(device) 
    {
        const boarderCanvas = document.createElement("canvas");
        boarderCanvas.width = this.canvasWidth;
        boarderCanvas.height = this.canvasHeight;
        const ctx = boarderCanvas.getContext("2d");

        // Draw all border sprites once
        for (let i = 0; i < this.boarderHolder.getSize(); i++) 
        {
            const obj = this.boarderHolder.getIndex(i);
            const brick_img = device.images.getImage(obj.name);
            if (!brick_img) continue;

            ctx.drawImage(brick_img, obj.posX, obj.posY, obj.width, obj.height);
        }

        this.cachedBorder = boarderCanvas;
        this.cachedBorderReady = true;
    }

    createMapCache(device) 
    {
        const mapCanvas = document.createElement("canvas");
        mapCanvas.width = this.canvasWidth;
        mapCanvas.height = this.canvasHeight;
        const ctx = mapCanvas.getContext("2d");

        // Draw all border sprites once
        for (let i = 0; i < this.mapHolder.getSize(); i++) 
        {
            const obj = this.mapHolder.getIndex(i);
            const brick_img = device.images.getImage(obj.name);
            if (!brick_img) continue;

            ctx.drawImage(brick_img, obj.posX, obj.posY, obj.width, obj.height);
        }

        this.cachedMap = mapCanvas;
        this.cachedMapReady = true;
    }

}
