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
    #gameSprites;

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

    #randValue;

    #cachedBorder;
    #cachedBorderReady;

    constructor() 
    {
        try 
        {
            this.#gameConsts = new GameConsts();
            this.#billBoards = new ObjHolder();
            this.#gameTimers = new ObjHolder();
            this.#enemyHolder = new ObjHolder();
            this.#gameSprites = new ObjHolder();
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
        this.#randValue = 0;

        this.cachedBorder = null;
        this.cachedBorderReady = false;

        // FIXX give player a default start pos
        try 
        {
            this.#player = new Player(
                GameDefs.spriteTypes.PLAYER.w,
                GameDefs.spriteTypes.PLAYER.h,
                0,
                0,
                this.#gameConsts.PLAYER_SPEED
            );
        } catch (err) 
        {
            console.error("Failed to initialize player:", err);
        }
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
    get boarderHorizontalBuffer() { return this.#boarderHorizontalBuffer; }
    get boarderVerticleBuffer() { return this.#boarderVerticleBuffer; }
    get randValue() { return this.#randValue; }

    get cachedBorder () { return this.#cachedBorder ; }
    get cachedBorderReady () { return this.#cachedBorderReady ; }

    set gameState(v) { this.#gameState = v; }
    set score(v) { this.#score = v; }
    set boarderHorizontalBuffer(v) { this.#boarderHorizontalBuffer = v; }
    set boarderVerticleBuffer(v) { this.#boarderVerticleBuffer = v; }
    set randValue(v) { this.#randValue = v; }

    set cachedBorder (v) { this.#cachedBorder  = v; }
    set cachedBorderReady (v) { this.#cachedBorderReady  = v; }

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
        this.gameSprites.clearObjects();
        this.billBoards.clearObjects();
        this.gameTimers.clearObjects();

        // Clear only the Sprite instances in device.images, keep the preloaded images intact
        device.images.clearObjects();
        
        try 
        {
            this.randValue = 6 + Math.floor(Math.random() * (Object.values(GameDefs.spriteTypes).length - 6));
            device.keys.initKeys();

            // Load sprites
            Object.values(GameDefs.spriteTypes).forEach(spriteDef => 
            {
                if (spriteDef.path ) 
                {
                    const sprite = new Sprite(spriteDef.path, spriteDef.type);
                    device.images.addObject(sprite);
                }
            });

            Object.values(GameDefs.billBoardTypes).forEach(boardDef => 
            {
                if (boardDef.path ) 
                {
                    const boardSprite = new Sprite(boardDef.path, boardDef.type);
                    device.images.addObject(boardSprite);
                }
            });

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

            // Billboards init
            const boards = [
                GameDefs.billBoardTypes.SPLASH,
                GameDefs.billBoardTypes.PAUSE,
                GameDefs.billBoardTypes.WIN,
                GameDefs.billBoardTypes.LOSE
            ];

            boards.forEach(def =>
            {
                const board = new BillBoard(def.type, def.w, def.h, 0, 0, 0, def.isCenter);
                if (board.isCenter) board.centerObjectInWorld(this.canvasWidth, this.canvasHeight);
                this.billBoards.addObject(board);
            });

            // Timer
            const timer = new Timer(GameDefs.timerTypes.GAME_CLOCK, 0, GameDefs.timerModes.COUNTUP);
            this.gameTimers.addObject(timer);

            // Enemies
            const enemyDefs = [
                GameDefs.spriteTypes.BLUE_GHOST,
                GameDefs.spriteTypes.GREEN_GHOST,
                GameDefs.spriteTypes.ORANGE_GHOST,
                GameDefs.spriteTypes.PINK_GHOST,
                GameDefs.spriteTypes.RED_GHOST
            ];
            let count = 0;
            
            enemyDefs.forEach((def, index) => 
            {
                count++;
                const speed = def === GameDefs.spriteTypes.RED_GHOST ? this.gameConsts.ENEMY_SPEED : [100, 140, 75, 120][index];
                this.enemyHolder.addObject(new Enemy(def.type, def.w, def.h, this.canvasHalfW, this.canvasHalfH, speed));
            });

        } catch (err) {
            console.error("Error initializing game:", err);
        }
    }

    setGame(device) 
    {
        this.score = 0;
        this.lives = this.gameConsts.GAME_LIVES_START_AMOUNT;
        const gameClock = this.gameTimers.getObjectByName(GameDefs.timerTypes.GAME_CLOCK);
        if (gameClock) gameClock.start();

        const randSprite = Object.values(GameDefs.spriteTypes)[this.randValue];
        this.buildBoarder(randSprite.type, randSprite.w, randSprite.h);
    }

    buildBoarder(name, width, height) 
    {
        let maxWidth = Math.floor(this.canvasWidth / width);
        let maxHeight = Math.floor((this.canvasHeight - this.canvasHeight * this.gameConsts.HUD_BUFFER) / height);

        if (maxWidth % 2 !== 0) maxWidth--;
        if (maxHeight % 2 !== 0) maxHeight--;

        this.boarderHorizontalBuffer = (this.canvasWidth - maxWidth * width) * 0.5;
        this.boarderVerticleBuffer =
            (this.canvasHeight -
                (this.canvasHeight * this.gameConsts.HUD_BUFFER + maxHeight * height)) * 0.5;

        // Top & Bottom
        for (let i = 0; i < maxWidth; i++) 
        {
            this.gameSprites.addObject(
                new GameObject(name, width, height, i * width + this.boarderHorizontalBuffer, this.boarderVerticleBuffer + this.canvasHeight * this.gameConsts.HUD_BUFFER)
            );
            this.gameSprites.addObject(
                new GameObject(name, width, height, i * width + this.#boarderHorizontalBuffer, this.canvasHeight - (this.boarderVerticleBuffer + height))
            );
        }

        // Left & Right
        for (let i = 0; i < maxHeight; i++) 
        {
            this.gameSprites.addObject(
                new GameObject(name, width, height, this.boarderHorizontalBuffer, i * width + this.boarderVerticleBuffer + this.canvasHeight * this.gameConsts.HUD_BUFFER)
            );
            this.gameSprites.addObject(
                new GameObject(name, width, height, this.canvasWidth - (this.boarderHorizontalBuffer + width), i * width + this.boarderVerticleBuffer + this.canvasHeight * this.gameConsts.HUD_BUFFER)
            );
        }

        // tell renderer to rebuild cached border
        this.cachedBorderReady = false;
    }

    createBorderCache(device) 
    {
        const canvas = document.createElement("canvas");
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasHeight;

        const ctx = canvas.getContext("2d");
        

        // Draw all border sprites once
        for (let i = 0; i < this.gameSprites.getSize(); i++) 
        {
            const obj = this.gameSprites.getIndex(i);
            const brick_img = device.images.getImage(obj.name);
            if (!brick_img) continue;

            ctx.drawImage(brick_img, obj.posX, obj.posY, obj.width, obj.height);
        }

        this.cachedBorder = canvas;
        this.cachedBorderReady = true;
    }

}
