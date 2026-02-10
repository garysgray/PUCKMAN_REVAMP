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
    #justHit;
    #isDying;

    constructor(width, height, x, y, speed) 
    {
        super(playerSpriteTypes.PLAYER, width, height, x, y, speed);

        this.#playerState = playStates.RIGHT;
        this.speed = speed;

        this.#justHit = false;
        this.#isDying = false;
    }
    get playerState() { return this.#playerState; }
    set playerState(v) { this.#playerState = v; }

    get justHit() { return this.#justHit; }
    get isDying() { return this.#isDying; }

    set justHit(v) { this.#justHit = v; }
    set isDying(v) { this.#isDying = v; }

    // Update player each frame


    update(device, game, delta, sound, screenWidth, screenHeight, hudBuff)
    {
        try 
        {
            this.enforceBorderBounds(game.borderHorizontalBuffer, game.borderVerticalBuffer, screenWidth, screenHeight, hudBuff);

            const moved = this.checkForMoveInput(device, game, delta);

            const moveSound = device.audio.getSound(sound.name);
            if (moveSound && moved) {
                // Only play if not already playing
                if (!moveSound.isPlaying()) {
                    moveSound.play();
                }
            }
            else
            {
                moveSound.stopAll();
            }

            if (this.state !== game.playState) {
                this.state = game.playState;
            }

        } catch (e) {
            console.error("Player update error:", e);
        }
    }

    checkForMoveInput(device, game, delta) 
    {
        const { dx, dy } = device.keys.getMovementVector();

        if (dx === 0 && dy === 0)
            return false;

        // Player state (animation / facing)
        if (dx === 0 && dy < 0) this.playerState = playStates.UP;
        else if (dx === 0 && dy > 0) this.playerState = playStates.DOWN;
        else if (dx > 0 && dy === 0) this.playerState = playStates.RIGHT;
        else if (dx < 0 && dy === 0) this.playerState = playStates.LEFT;
        else if (dx > 0 && dy < 0) this.playerState = playStates.UP_RIGHT;
        else if (dx < 0 && dy < 0) this.playerState = playStates.UP_LEFT;
        else if (dx > 0 && dy > 0) this.playerState = playStates.DOWN_RIGHT;
        else if (dx < 0 && dy > 0) this.playerState = playStates.DOWN_LEFT;

        // Normalize
        const len = Math.hypot(dx, dy);
        const nx = dx / len;
        const ny = dy / len;

        this.tryMoveWithCollision(
            game.mapHolder,
            nx * this.speed * delta,
            ny * this.speed * delta
        );

        return true;
    }
    reset()
    {
        this.#justHit = false;
        this.#isDying = false;
    }


    static buildPlayer(screenWidth, borderVerticalBuffer, mapBufferY)
    {
        try 
        {
            const player = new Player(
                playerSpriteTypes.PLAYER.w,
                playerSpriteTypes.PLAYER.h,
                screenWidth * 0.5,
                borderVerticalBuffer + mapBufferY,
                playerSpriteTypes.PLAYER.s
            );
            return player;
        } 
        catch (err) 
        {
            console.error("Failed to initialize player:", err);
        }
        
    }
}