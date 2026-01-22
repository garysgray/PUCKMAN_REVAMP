// ============================================================================
// Base GameObject + Child Classes (Player, Projectile, NPC, BackDrop)
// ============================================================================
// --------------------------------------------
// GameObject is the base class for all in-game entities
// - Tracks position, size, speed, and state
// - Provides movement and collision functions
//
// Enemy extends GameObject
// - has diffrent gameStates/behavior
//
// BillBoard extends GameObject
// - Used for static/scrolling backgrounds or decorative elements
// --------------------------------------------

class GameObject 
{
    #name;
    #width;
    #height;
    #posX;
    #posY;
    #speed;
    #state;
    #alive = true;

    #halfWidth; #halfHeight;

    #holdPosX = 0;
    #holdPosY = 0;

    constructor(name, width, height, posX, posY, speed) 
    {
        try
        {
            this.#name = name;
            this.#width = width;
            this.#height = height;
            this.#posX = posX;
            this.#posY = posY;
            this.#speed = speed;
            this.#state = 0;

            this.#halfWidth = width * 0.5;
            this.#halfHeight = height * 0.5;
        } 
        catch (e) 
        {
            console.error("GameObject constructor error:", e);
        }
    }

    // ---- Getters ----
    get name() { return this.#name; }
    get width() { return this.#width; }
    get height() { return this.#height; }
    get posX() { return this.#posX; }
    get posY() { return this.#posY; }
    get speed() { return this.#speed; }

    get state() { return this.#state; }
    get alive() { return this.#alive; }

    get halfWidth() { return this.#halfWidth; }
    get halfHeight() { return this.#halfHeight; }

    get holdPosX() { return this.#holdPosX; }
    get holdPosY() { return this.#holdPosY; }

    // ---- Setters ----
    set name(v) { this.#name = v; }
    set width(v) { this.#width = v; }
    set height(v) { this.#height = v; }
    set posX(v) { this.#posX = v; }
    set posY(v) { this.#posY = v; }
    set speed(v) { this.#speed = v; }

    set state(v) { this.#state = v; }
    set alive(v) { this.#alive = Boolean(v); }

    set holdPosX(v) { this.#holdPosX = v; }
    set holdPosY(v) { this.#holdPosY = v; }

    kill() { this.#alive = false; }

    // ---- Core Methods ----
    // Placeholder update (to be overridden by child classes if needed)
    update(device, delta) {}

    // Move object down based on its speed
    moveDown(delta) 
    {
        try
         {
            this.#posY += this.#speed * delta;
        } 
        catch (e) 
        {
            console.error(`moveDown error for ${this.#name}:`, e);
        }
    }

    movePos(newX, newY) 
    {
        try 
        {
            this.#posX = newX;
            this.#posY = newY;
        } 
        catch (e) 
        {
            console.error(`movePos error for ${this.#name}:`, e);
        }
    }

    // Save player position so it can be restored on resume
    savePos(x, y)
    {
         this.#holdPosX = x;             
         this.#holdPosY = y;             
    }

    restoreSavedPos()
    {
         this.#posX =  this.#holdPosX; 
         this.#posY =  this.#holdPosY ;
    }

    // Return an axis-aligned hitbox for this object.
    // scale lets you make the box a bit smaller (e.g., 0.9 for friendlier hits).
    // buffer shrinks it further by pixels on each side.
    // Both are clamped so they can’t go negative.
    getHitbox(scale = 1.0, buffer = 0) 
    {
        try 
        {
            const hw = Math.max(0, this.#halfWidth * scale - buffer);
            const hh = Math.max(0, this.#halfHeight * scale - buffer);
            return {
                left: this.#posX - hw,
                right: this.#posX + hw,
                top: this.#posY - hh,
                bottom: this.#posY + hh
            };
        } 
        catch (e) 
        {
            console.error(`getHitbox error for ${this.#name}:`, e);
            return { left: 0, right: 0, top: 0, bottom: 0 };
        }
    }

    getRoughRadius() 
    {
        return Math.max(this.#halfWidth, this.#halfHeight);
    }

    tryMoveWithCollision(holder, dx, dy) 
    {
        // --- X axis ---
        this.posX += dx;

        if (this.collidesWith(holder)) 
        {
            this.posX -= dx;
        }

        // --- Y axis ---
        this.posY += dy;

        if (this.collidesWith(holder)) 
        {
            this.posY -= dy;
        }
    }

    collidesWith(holder)
    {
        for (let i = 0; i < holder.getSize(); i++)
        {
            const obj = holder.getIndex(i);
            if (!obj || obj === this) continue;

        const SKIN = 2;

        if (this.posX - this.halfWidth + SKIN < obj.posX + obj.width &&
            this.posX + this.halfWidth - SKIN > obj.posX &&
            this.posY - this.halfHeight + SKIN < obj.posY + obj.height &&
            this.posY + this.halfHeight - SKIN > obj.posY)
            {
                return true;
            }
        }
        return false;
    }


    enforceBorderBounds(game) 
    {
        try 
        {
            const hudBuffer = game.gameConsts.SCREEN_HEIGHT * game.gameConsts.HUD_BUFFER;
            const leftSide = this.width + game.borderHorizontalBuffer;
            const rightSide = this.width + game.borderHorizontalBuffer;
            const topSide = this.height + game.borderVerticalBuffer + hudBuffer
            const bottomSide = this.height + game.borderVerticalBuffer;

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
            console.error("gameobject enforceBounds error:", e);
        }
    }
}

class Enemy extends GameObject
{
    #behaveState;

    constructor(name, width, height, x, y, speed) 
    {
        super(name, width, height, x, y, speed);
        this.behaveState = behaveStates.ROAM;
        this.roamTimer = 0;
        this.roamDirection = { x: 0, y: 0 };
    }

    get behaveState() { return this.#behaveState; }
    set behaveState(v) { this.#behaveState = v; }

    update(delta, game, target) 
    {
        try 
        {
            switch (this.behaveState) 
            {
                case behaveStates.ROAM:
                    this.roam(delta, game, target, 100);
                    break;
                case behaveStates.FOLLOW:
                    this.follow(delta, game, target, 200);
                    break;
                case behaveStates.RUN:
                    break;
                case behaveStates.STOP:
                    this.stop(target, 1);
                    break;
            }

            this.enforceBorderBounds(game);

        } 
        catch (e) 
        {
            console.error("Enemy update error:", e);
        }
    }

    follow(delta, game, target, stopFollowDistance = 300) 
    {
        if (!target || !target.alive) {
            this.behaveState = behaveStates.ROAM;
            return;
        }

        let dx = target.posX - this.posX;
        let dy = target.posY - this.posY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 1) 
        {
            this.behaveState = behaveStates.STOP;
            return;
        }

        if (dist > stopFollowDistance) 
        {
            this.behaveState = behaveStates.ROAM;
            return;
        }

        dx /= dist;
        dy /= dist;

        const moveX = dx * this.speed * delta;
        const moveY = dy * this.speed * delta;

        // Move with collision
        this.tryMoveWithCollision(game.mapHolder, moveX, moveY);

        // Update sprite direction
        if (Math.abs(dx) > Math.abs(dy)) 
        {
            this.state = dx > 0 ? enemyPlayStates.RIGHT : enemyPlayStates.LEFT;
        } else 
        {
            this.state = dy > 0 ? enemyPlayStates.DOWN : enemyPlayStates.UP;
        }
    }

    roam(delta, game, target, followDistance = 200) 
    {
        if (this.roamTimer <= 0) 
        {
            const angle = Math.random() * Math.PI * 2;
            this.roamDirection = { x: Math.cos(angle), y: Math.sin(angle) };
            this.roamTimer = 1 + Math.random() * 2;
        }

        this.roamTimer -= delta;

        const moveX = this.roamDirection.x * this.speed * delta;
        const moveY = this.roamDirection.y * this.speed * delta;

        // Move with collision
        this.tryMoveWithCollision(game.mapHolder, moveX, moveY);

        // Update sprite direction
        if (Math.abs(this.roamDirection.x) > Math.abs(this.roamDirection.y)) 
        {
            this.state = this.roamDirection.x > 0 ? enemyPlayStates.RIGHT : enemyPlayStates.LEFT;
        } else 
        {
            this.state = this.roamDirection.y > 0 ? enemyPlayStates.DOWN : enemyPlayStates.UP;
        }

        // Switch to follow if target is close
        if (target) 
        {
            const distX = target.posX - this.posX;
            const distY = target.posY - this.posY;
            if (Math.sqrt(distX * distX + distY * distY) <= followDistance) 
            {
                this.behaveState = behaveStates.FOLLOW;
            }
        }
    }

    stop(target, aDist)
    {
        if (!target) return;
        const dx = target.posX - this.posX;
        const dy = target.posY - this.posY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > aDist) this.behaveState = behaveStates.FOLLOW;
    }
}

// --------------------------------------------
// BillBoard
// --------------------------------------------
// Static or decorative background object
// Currently does nothing, but could support parallax or animation
// --------------------------------------------
class BillBoard extends GameObject 
{
    #isCenter = true;

    constructor(name, width, height, x, y, speed, isCenter = true) 
    {
        super(name, width, height, x, y, speed);

        this.#isCenter = isCenter;
    }

    get isCenter() { return this.#isCenter; }

    centerObjectInWorld(screenW, screenH) 
    {
        if (this.#isCenter)
        {
            try 
            {
                this.posX = (screenW - this.width) * 0.5;
                this.posY = (screenH - this.height) * 0.5;
            } 
            catch (e) 
            {
                console.error("BillBoard centerObjectInWorld error:", e);
            }
        }
        
    }
    update(device, delta) 
    {
        // Optional: BillBoard scrolling/animation
    }
    render(device, image, yBuff)
    {
        device.renderImage(image, this.posX, this.posY - yBuff);
    }
}

