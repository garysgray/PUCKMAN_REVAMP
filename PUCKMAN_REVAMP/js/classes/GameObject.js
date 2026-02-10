// ============================================================================
// BASE GAMEOBJECT CLASS
// ============================================================================
// --------------------------------------------
// GameObject is the base class for all in-game entities
// - Tracks position, size, speed, and state
// - Provides movement and collision functions

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

    enforceBorderBounds(horizonBuffer, vertBuff, screenWidth, screenHeight, aHudBuffer ) 
    {
        try 
        {
            const hudBuffer = screenHeight * aHudBuffer;
            const leftSide = this.width + horizonBuffer;
            const rightSide = this.width + horizonBuffer;
            const topSide = this.height + horizonBuffer + hudBuffer
            const bottomSide = this.height + vertBuff;

            if (this.posX - this.halfWidth < leftSide) 
            {
                this.posX = leftSide + this.halfWidth;
            }

            if (this.posX + this.halfWidth > screenWidth - rightSide) 
            {
                this.posX = screenWidth - (this.halfWidth + rightSide);
            }

            if (this.posY - this.halfHeight < topSide)
            {
                 this.posY = this.halfHeight + topSide;
            }

            if (this.posY + this.halfHeight > screenHeight - bottomSide) 
            {
                this.posY = (screenHeight) - (this.halfHeight + bottomSide);
            }
        }  
        catch (e) 
        { 
            console.error("gameobject enforceBounds error:", e);
        }
    }
}


