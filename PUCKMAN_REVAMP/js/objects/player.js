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
        super(GameDefs.playerSpriteTypes.PLAYER, width, height, x, y, speed);

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
            this.enforceBorderBounds(game); 

            this.checkForKeyBoardMoveInput(device, game, delta);

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
    
   checkForKeyBoardMoveInput(device, game, delta) 
   {
        let dx = 0;
        let dy = 0;

        // ==========================
        //  Keyboard Input
        // ==========================
        if (device.keys.isKeyDown(GameDefs.keyTypes.DOWN)  || device.keys.isKeyDown(GameDefs.keyTypes.S)) dy += 1;
        if (device.keys.isKeyDown(GameDefs.keyTypes.UP)    || device.keys.isKeyDown(GameDefs.keyTypes.W)) dy -= 1;
        if (device.keys.isKeyDown(GameDefs.keyTypes.RIGHT) || device.keys.isKeyDown(GameDefs.keyTypes.D)) dx += 1;
        if (device.keys.isKeyDown(GameDefs.keyTypes.LEFT)  || device.keys.isKeyDown(GameDefs.keyTypes.A)) dx -= 1;

        // ==========================
        // Gamepad Input
        // ==========================
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        const gp = gamepads[0]; // support only the first gamepad for now

        if (gp) 
        {
            // Apply deadzone to joystick axes
            const deadzone = 0.2;
            const axisX = Math.abs(gp.axes[0]) > deadzone ? gp.axes[0] : 0;
            const axisY = Math.abs(gp.axes[1]) > deadzone ? gp.axes[1] : 0;

            dx += axisX;
            dy += axisY;
        }

        // ==========================
        // Determine Player State
        // ==========================
        if (dx === 0 && dy < 0) this.playerState = GameDefs.playStates.UP;
        else if (dx === 0 && dy > 0) this.playerState = GameDefs.playStates.DOWN;
        else if (dx > 0 && dy === 0) this.playerState = GameDefs.playStates.RIGHT;
        else if (dx < 0 && dy === 0) this.playerState = GameDefs.playStates.LEFT;
        else if (dx > 0 && dy < 0) this.playerState = GameDefs.playStates.UP_RIGHT;
        else if (dx < 0 && dy < 0) this.playerState = GameDefs.playStates.UP_LEFT;
        else if (dx > 0 && dy > 0) this.playerState = GameDefs.playStates.DOWN_RIGHT;
        else if (dx < 0 && dy > 0) this.playerState = GameDefs.playStates.DOWN_LEFT;

        // ==========================
        // Normalize & Move
        // ==========================
        if (dx !== 0 || dy !== 0) 
        {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx /= length;
            dy /= length;

            this.tryMoveWithCollision(game.mapHolder, dx * this.speed * delta, dy * this.speed * delta);
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