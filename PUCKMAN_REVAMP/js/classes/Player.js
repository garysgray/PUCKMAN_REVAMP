// --------------------------------------------
// Player
// --------------------------------------------
// - The main controllable entity
// - Player extends GameObject
// - Enforces screen boundaries

// --------------------------------------------
class Player extends GameObject 
{
    #playerState; 
    #savedPlayerState;

    constructor(width, height, x, y, speed) 
    {
        super(playerSpriteTypes.PLAYER, width, height, x, y, speed);

        this.#playerState = playStates.RIGHT;
        this.speed = speed;
    }
    get playerState() { return this.#playerState; }
    set playerState(v) { this.#playerState = v; }

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

   checkForKeyBoardMoveInput(device, game, delta) 
   {
        let dx = 0;
        let dy = 0;

        // ==========================
        //  Keyboard Input
        // ==========================
        if (device.keys.isKeyDown(keyTypes.DOWN)  || device.keys.isKeyDown(keyTypes.S)) dy += 1;
        if (device.keys.isKeyDown(keyTypes.UP)    || device.keys.isKeyDown(keyTypes.W)) dy -= 1;
        if (device.keys.isKeyDown(keyTypes.RIGHT) || device.keys.isKeyDown(keyTypes.D)) dx += 1;
        if (device.keys.isKeyDown(keyTypes.LEFT)  || device.keys.isKeyDown(keyTypes.A)) dx -= 1;

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
        if (dx === 0 && dy < 0) this.playerState = playStates.UP;
        else if (dx === 0 && dy > 0) this.playerState = playStates.DOWN;
        else if (dx > 0 && dy === 0) this.playerState = playStates.RIGHT;
        else if (dx < 0 && dy === 0) this.playerState = playStates.LEFT;
        else if (dx > 0 && dy < 0) this.playerState = playStates.UP_RIGHT;
        else if (dx < 0 && dy < 0) this.playerState = playStates.UP_LEFT;
        else if (dx > 0 && dy > 0) this.playerState = playStates.DOWN_RIGHT;
        else if (dx < 0 && dy > 0) this.playerState = playStates.DOWN_LEFT;

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

    static buildPlayer(game)
    {
        try 
        {
            game.player = new Player(
                playerSpriteTypes.PLAYER.w,
                playerSpriteTypes.PLAYER.h,
                game.canvasHalfW,
                game.borderVerticalBuffer + game.gameConsts.MAP_BUFFER_Y,
                playerSpriteTypes.PLAYER.s
            );
        } 
        catch (err) 
        {
            console.error("Failed to initialize player:", err);
        }
    }
}