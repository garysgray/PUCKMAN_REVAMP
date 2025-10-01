// --------------------------------------------
// Player
// --------------------------------------------
// - The main controllable entity
// - Player extends GameObject
// - Enforces screen boundaries

// --------------------------------------------
class Player extends GameObject 
{
    #coolDownTimer;
    #playerState; 
    #savedPlayerState;

    constructor(width, height, x, y, speed) 
    {
        super(GameDefs.spriteTypes.PLAYER, width, height, x, y, speed);

        this.#playerState = GameDefs.playStates.RIGHT;
        this.#savedPlayerState = GameDefs.playStates.RIGHT;

        this.#coolDownTimer =  new Timer(GameDefs.timerTypes.SHOOT_COOL_DOWN_TIMER, 0, GameDefs.timerModes.COUNTDOWN);
        this.speed = speed;
    }
 
    get coolDownTimer() { return this.#coolDownTimer; }
    get playerState() { return this.#playerState; }
    get savedPlayerState() { return this.#savedPlayerState; }

    set playerState(v) { this.#playerState = v; }
    set savedPlayerState(v) { this.#savedPlayerState = v; }

    savePlayerState(state)    { this.#savedPlayerState = state; }
    restorePlayerState()      { this.#playerState = this.#savedPlayerState; }
    setPlayerState(playerState) { this.#playerState = playerState; }

    // Update player each frame
    update(device, game, delta) 
    {
        try 
        {
            // Enforce screen bounds
           //this.enforceScreenBounds(game);

            this.enforceBoarderBounds(game, GameDefs.spriteTypes.RED_BRICK.w, GameDefs.spriteTypes.RED_BRICK.h) 

            // See if player used shoot button 
            if(this.checkforShoot(device, game, delta)) 
            {
                // Play the correct audio file for player shooting
                device.audio.playSound(GameDefs.soundTypes.SHOOT.name);
            }

            this.checkForKeyBoardMoveInput(device, delta);

            // Sync player state with current playState
            if (this.state !== game.playState) 
            {
                this.state = game.playState;
            }   
        } 
        catch (e) 
        {
            console.error("Player update error:", e);
        }
    }

    // Prevents player from leaving visible play area
    enforceScreenBounds(game) 
    {
        try 
        {
            const hudBuffer = game.gameConsts.SCREEN_HEIGHT * game.gameConsts.HUD_BUFFER;
            if (this.posX - this.halfWidth < 0) this.posX = this.halfWidth;
            if (this.posX + this.halfWidth > game.gameConsts.SCREEN_WIDTH) this.posX = game.gameConsts.SCREEN_WIDTH - this.halfWidth;
            if (this.posY - this.halfHeight < 0 + hudBuffer) this.posY = this.halfHeight + hudBuffer;
            if (this.posY + this.halfHeight > game.gameConsts.SCREEN_HEIGHT) 
            {
                this.posY = (game.gameConsts.SCREEN_HEIGHT) - this.halfHeight;
            }
        }  
        catch (e) 
        { 
            console.error("Player enforceBounds error:", e);
        }
    }

    enforceBoarderBounds(game, width, height) 
    {
        try 
        {
            const hudBuffer = game.gameConsts.SCREEN_HEIGHT * game.gameConsts.HUD_BUFFER;
            const leftSide = width + game.boarderHorizontalBuffer;
            const rightSide = width + game.boarderHorizontalBuffer;
            const topSide = height + game.boarderVerticleBuffer + hudBuffer
            const bottomSide = height + game.boarderVerticleBuffer;

            if (this.posX - this.halfWidth < leftSide) 
            {
                this.posX = leftSide + this.halfWidth;
            }

            if (this.posX + this.halfWidth > game.gameConsts.SCREEN_WIDTH - rightSide) 
            {
                this.posX = game.gameConsts.SCREEN_WIDTH - (this.halfWidth + rightSide);
            }

            if (this.posY - this.halfHeight < topSide)
            {
                 this.posY = this.halfHeight + topSide;
            }

            if (this.posY + this.halfHeight > game.gameConsts.SCREEN_HEIGHT - bottomSide) 
            {
                this.posY = (game.gameConsts.SCREEN_HEIGHT) - (this.halfHeight + bottomSide);
            }
        }  
        catch (e) 
        { 
            console.error("Player enforceBounds error:", e);
        }
    }


    // Uses the coolDownTimer to make sure audio does not spam audio file when checking for user shoot input
    checkforShoot(device, game, delta )
    {
        // Update the timer
        this.coolDownTimer.update(delta);

        // If its active we check fro user input
        if (this.coolDownTimer.active) return false;

        const firePressed = device.mouseDown || device.keys.isKeyPressed(GameDefs.keyTypes.PLAY_KEY);

        // If player used the shoot button on keyboard or mouse
        if (!firePressed) return false;

        // Reset timer
        this.coolDownTimer.reset(game.gameConsts.SHOOT_COOLDOWN, GameDefs.timerModes.COUNTDOWN, false);   

        return true;
    }

    // checkForKeyBoardMoveInput(device, delta)
    // {
    //     let dx = 0;
    //     let dy = 0;

        
    //     if (device.keys.isKeyDown(GameDefs.keyTypes.DOWN)  || device.keys.isKeyDown(GameDefs.keyTypes.S)) {
    //         dy += 1;
    //         this.playerState = GameDefs.playStates.DOWN;
    //     }
       
    //     if (device.keys.isKeyDown(GameDefs.keyTypes.RIGHT) || device.keys.isKeyDown(GameDefs.keyTypes.D)) 
    //     {
    //         dx += 1;
    //         this.playerState = GameDefs.playStates.RIGHT;
    //     }

    //     if (device.keys.isKeyDown(GameDefs.keyTypes.LEFT)  || device.keys.isKeyDown(GameDefs.keyTypes.A)) 
    //     {
    //         dx -= 1;
    //         this.playerState = GameDefs.playStates.LEFT;
    //     }

    //     if (device.keys.isKeyDown(GameDefs.keyTypes.UP)    || device.keys.isKeyDown(GameDefs.keyTypes.W))
    //     {
    //         dy -= 1;
    //         this.playerState = GameDefs.playStates.UP;
    //     } 

    //     // normalize diagonal movement
    //     if (dx !== 0 || dy !== 0) 
    //     {
    //         const length = Math.sqrt(dx * dx + dy * dy);
    //         dx /= length;
    //         dy /= length;

    //         this.movePos(
    //             this.posX + dx * this.speed * delta,
    //             this.posY + dy * this.speed * delta
    //         );
    //     }
    // }

    checkForKeyBoardMoveInput(device, delta)
    {
        let dx = 0;
        let dy = 0;
        
        if (device.keys.isKeyDown(GameDefs.keyTypes.DOWN)  || device.keys.isKeyDown(GameDefs.keyTypes.S)) dy += 1;
        if (device.keys.isKeyDown(GameDefs.keyTypes.UP)    || device.keys.isKeyDown(GameDefs.keyTypes.W)) dy -= 1;
        if (device.keys.isKeyDown(GameDefs.keyTypes.RIGHT) || device.keys.isKeyDown(GameDefs.keyTypes.D)) dx += 1;
        if (device.keys.isKeyDown(GameDefs.keyTypes.LEFT)  || device.keys.isKeyDown(GameDefs.keyTypes.A)) dx -= 1;

        // set state BEFORE normalization
        if (dx === 0 && dy < 0) this.playerState = GameDefs.playStates.UP;
        else if (dx === 0 && dy > 0) this.playerState = GameDefs.playStates.DOWN;
        else if (dx > 0 && dy === 0) this.playerState = GameDefs.playStates.RIGHT;
        else if (dx < 0 && dy === 0) this.playerState = GameDefs.playStates.LEFT;
        else if (dx > 0 && dy < 0) this.playerState = GameDefs.playStates.UP_RIGHT;
        else if (dx < 0 && dy < 0) this.playerState = GameDefs.playStates.UP_LEFT;
        else if (dx > 0 && dy > 0) this.playerState = GameDefs.playStates.DOWN_RIGHT;
        else if (dx < 0 && dy > 0) this.playerState = GameDefs.playStates.DOWN_LEFT;


            // normalize diagonal movement
        if (dx !== 0 || dy !== 0) 
        {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;

            this.movePos(
                this.posX + dx * this.speed * delta,
                this.posY + dy * this.speed * delta
            );
        }
    }

    // -----------------------------
    // Player Mouse Input Binding
    // If you want mouse to control player, call this functinin in setGame
    // -----------------------------
    setMouseToPlayer(device) 
    {
        device.setupMouse(this, device);
    } 
}