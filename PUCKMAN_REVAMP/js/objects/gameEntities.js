// ============================================================================
// Base GameObject + Child Classes (Player, Projectile, NPC, BackDrop)
// ============================================================================
// --------------------------------------------
// GameObject is the base class for all in-game entities
// - Tracks position, size, speed, and state
// - Provides movement and collision functions
//
// Projectile extends GameObject
// - Moves upward each frame until offscreen
// - Has alive flag for cleanup
//
// NPC extends GameObject
// - Moves downward each frame until offscreen
// - Has alive flag for cleanup
//
// BackDrop extends GameObject
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

        if (this._collidesWith(holder)) 
        {
            this.posX -= dx;
        }

        // --- Y axis ---
        this.posY += dy;

        if (this._collidesWith(holder)) 
        {
            this.posY -= dy;
        }
    }

    _collidesWith(holder)
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


    enforceBoarderBounds(game) 
    {
        try 
        {
            const hudBuffer = game.gameConsts.SCREEN_HEIGHT * game.gameConsts.HUD_BUFFER;
            const leftSide = this.width + game.boarderHorizontalBuffer;
            const rightSide = this.width + game.boarderHorizontalBuffer;
            const topSide = this.height + game.boarderVerticleBuffer + hudBuffer
            const bottomSide = this.height + game.boarderVerticleBuffer;

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
        this.behaveState = GameDefs.behaveStates.ROAM;
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
                case GameDefs.behaveStates.ROAM:
                    this.roam(delta, game, target, 100);
                    break;
                case GameDefs.behaveStates.FOLLOW:
                    this.follow(delta, game, target, 200);
                    break;
                case GameDefs.behaveStates.RUN:
                    break;
                case GameDefs.behaveStates.STOP:
                    this.stop(target, 1);
                    break;
            }

            this.enforceBoarderBounds(game);

        } 
        catch (e) 
        {
            console.error("Enemy update error:", e);
        }
    }

    follow(delta, game, target, stopFollowDistance = 300) 
    {
        if (!target || !target.alive) {
            this.behaveState = GameDefs.behaveStates.ROAM;
            return;
        }

        let dx = target.posX - this.posX;
        let dy = target.posY - this.posY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 1) 
        {
            this.behaveState = GameDefs.behaveStates.STOP;
            return;
        }

        if (dist > stopFollowDistance) 
        {
            this.behaveState = GameDefs.behaveStates.ROAM;
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
            this.state = dx > 0 ? GameDefs.enemyPlayStates.RIGHT : GameDefs.enemyPlayStates.LEFT;
        } else 
        {
            this.state = dy > 0 ? GameDefs.enemyPlayStates.DOWN : GameDefs.enemyPlayStates.UP;
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
            this.state = this.roamDirection.x > 0 ? GameDefs.enemyPlayStates.RIGHT : GameDefs.enemyPlayStates.LEFT;
        } else 
        {
            this.state = this.roamDirection.y > 0 ? GameDefs.enemyPlayStates.DOWN : GameDefs.enemyPlayStates.UP;
        }

        // Switch to follow if target is close
        if (target) 
        {
            const distX = target.posX - this.posX;
            const distY = target.posY - this.posY;
            if (Math.sqrt(distX * distX + distY * distY) <= followDistance) 
            {
                this.behaveState = GameDefs.behaveStates.FOLLOW;
            }
        }
    }

    stop(target, aDist)
    {
        if (!target) return;
        const dx = target.posX - this.posX;
        const dy = target.posY - this.posY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > aDist) this.behaveState = GameDefs.behaveStates.FOLLOW;
    }
}


// --------------------------------------------
// Projectile
// --------------------------------------------
// Fired by the player (or NPCs in the future)
// - Moves upward each frame
// - Becomes inactive if offscreen
// --------------------------------------------
class Projectile extends GameObject 
{
    constructor(name, width, height, posX, posY, speed) 
    {
        super(name, width, height, posX, posY, speed);
    }

    update(device, game, delta) 
    {
        try 
        {
            this.posY -= this.speed * delta;
            if (this.posY + this.halfHeight < 0) this.kill();
        } 
        catch (e) 
        {
            console.error("Projectile update error:", e);
        }
    }
}

// --------------------------------------------
// NPC (Enemy/Obstacle)
// --------------------------------------------
// Moves downward from top of screen
// Dies if it leaves the play area
// --------------------------------------------
class NPC extends GameObject 
{
    constructor(name, width, height, x, y, speed) 
    {
        super(name, width, height, x, y, speed);
    }

    update(device, game, delta) 
    {
        try 
        {
            const hud_buff = game.gameConsts.HUD_BUFFER  * game.gameConsts.SCREEN_HEIGHT;
            this.moveDown(game, delta);
            if (this.posY > game.gameConsts.SCREEN_HEIGHT  + hud_buff) this.kill();
        } 
        catch (e) 
        {
            console.error("NPC update error:", e);
        }
    }

    moveDown(game, delta) 
    {
        try 
        {
            if (game.npcSpeedMuliplyer > 0)
            {
                this.posY += (this.speed * game.npcSpeedMuliplyer)  * delta;
            }
            else
            {
                this.posY += this.speed  * delta;
            }
            
        } 
        catch (e) 
        {
            console.error(`moveDown error for ${this.name}:`, e);
        }
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

class ParallaxBillBoard extends BillBoard
{
    #parallexType;
    #posX2 = 0;
    #posY2 = 0;

    constructor(name, width, height, x, y, speed, isCenter, parallexType) 
    {
        super(name, width, height, x, y, speed, isCenter);
        this.#parallexType = parallexType;

        // start second copy right next to the first
        this.#posX2 = this.posX + this.width;
        this.#posY2 = this.posY;
    }

    get parallexType() { return this.#parallexType; }

    get posX2() { return this.#posX2; }
    get posY2() { return this.#posY2; }

    set posX2(v) { this.#posX2 = v; }
    set posY2(v) { this.#posY2 = v; }

 

    update(delta, game) 
    {
        // HORIZONTAL
        if (this.parallexType === GameDefs.parallexType.HORIZONTAL) 
        {
           this.posX -= this.speed * delta;

            // calculate scaled width for screen
            const scaledWidth = game.gameConsts.SCREEN_WIDTH; // or use image.width if you prefer
            if (this.posX <= -scaledWidth) this.posX += scaledWidth;

            // second copy always aligned
            this.posX2 = this.posX + scaledWidth;
            this.posY2 = this.posY;
        } 
        else 
        {
            // vertical unchanged
            this.posY -= this.speed * delta;
            if (this.posY <= -this.height) this.posY += this.height;
            this.posY2 = this.posY + this.height;
            this.posX2 = this.posX;
        }
    }

    render(device, game, image)
    {
        device.renderImage(image, this.posX, this.posY , game.gameConsts.SCREEN_WIDTH , game.gameConsts.SCREEN_HEIGHT);
        device.renderImage(image, this.posX2, this.posY2,  game.gameConsts.SCREEN_WIDTH , game.gameConsts.SCREEN_HEIGHT);
    }
}


// --------------------------------------------
// Enemy object
// --------------------------------------------
// class Enemy extends GameObject 
// {
//     #behaveState;

//     constructor(name, width, height, x, y, speed) 
//     {
//         super(name, width, height, x, y, speed);

//         this.#behaveState = GameDefs.behaveStates.ROAM;
//     }

//     get behaveState() { return this.#behaveState; }

//     set behaveState(v) { this.#behaveState = v; }

//     // All it does now is follow player
//     update(delta, game, target) 
//     {
//         try 
//         {
//             switch (this.behaveState) 
//             {
//                 case GameDefs.behaveStates.ROAM:
//                     this.roam(delta, target, 100); 
//                     break;
//                 case GameDefs.behaveStates.FOLLOW:
//                     this.follow(delta, target, 200);
//                     break;
//                 case GameDefs.behaveStates.RUN:
//                     break;
//                 case GameDefs.behaveStates.STOP:
//                     this.stop(target, 1);
//                     break;
//             } 

//             // FIXX need to replace red brick
//             this.enforceBoarderBounds(game, GameDefs.spriteTypes.RED_BRICK.w, GameDefs.spriteTypes.RED_BRICK.h) 
            

//         }
//         catch (e) 
//         {
//             console.error("Enemy update error:", e);
//         }
//     }

    

//     follow(delta, target, stopFollowDistance = 300) 
//     {
//         if (!target || !target.alive) {
//             this.behaveState = GameDefs.behaveStates.ROAM;
//             return;
//         }

//         // Calculate direction vector
//         let dx = target.posX - this.posX;
//         let dy = target.posY - this.posY;

//         // Distance to target
//         const dist = Math.sqrt(dx * dx + dy * dy);

//         // If target is too far, go back to roam
//         if (dist > stopFollowDistance) {
//             this.behaveState = GameDefs.behaveStates.ROAM;
//             return;
//         }

//         if (dist < 1) {
//             this.behaveState = GameDefs.behaveStates.STOP;
//             return;
//         }

        
//         // Normalize and move toward target
//         if (dist > 0) 
//         {
//             dx /= dist;
//             dy /= dist;

//             this.movePos(
//                 this.posX + dx * this.speed * delta,
//                 this.posY + dy * this.speed * delta
//             );

//             // --- Update sprite direction ---
//             if (Math.abs(dx) > Math.abs(dy)) 
//             {
//                 this.state = dx > 0 ? GameDefs.enemyPlayStates.RIGHT : GameDefs.enemyPlayStates.LEFT;
//             }
//             else
//             {
//                 this.state = dy > 0 ? GameDefs.enemyPlayStates.DOWN : GameDefs.enemyPlayStates.UP;
//             }
//         }
//     }


//     roam(delta, target, followDistance = 200) 
//     {
//         if (!target || !target.alive) target = null;

//         // --- Initialize roam timer and direction if not present ---
//         if (this.roamTimer === undefined || this.roamDirection === undefined) 
//         {
//             this.roamTimer = 0;
//             const angle = Math.random() * 2 * Math.PI;
//             this.roamDirection = { x: Math.cos(angle), y: Math.sin(angle) };
//         }

//         // --- Update timer ---
//         this.roamTimer -= delta;
//         if (this.roamTimer <= 0) 
//         {
//             // Pick a new random direction for 1–3 seconds
//             const angle = Math.random() * 2 * Math.PI;
//             this.roamDirection = { x: Math.cos(angle), y: Math.sin(angle) };
//             this.roamTimer = 1 + Math.random() * 2; // seconds
//         }

//         // --- Move enemy in current roam direction ---
//         this.movePos(
//             this.posX + this.roamDirection.x * this.speed * delta,
//             this.posY + this.roamDirection.y * this.speed * delta
//         );

//         // --- Update sprite direction ---
//         if (Math.abs(this.roamDirection.x) > Math.abs(this.roamDirection.y)) 
//         {
//             this.state = this.roamDirection.x > 0 ? GameDefs.enemyPlayStates.RIGHT : GameDefs.enemyPlayStates.LEFT;
//         } else 
//         {
//             this.state = this.roamDirection.y > 0 ? GameDefs.enemyPlayStates.DOWN : GameDefs.enemyPlayStates.UP;
//         }

//         // --- Check distance to target to switch to follow ---
//         // FIXX ?? make this a collison function or utilize one that exsists
//         if (target) 
//         {
//             const distX = target.posX - this.posX;
//             const distY = target.posY - this.posY;
//             const dist = Math.sqrt(distX * distX + distY * distY);
//             if (dist <= followDistance) 
//             {
//                 this.behaveState = GameDefs.behaveStates.FOLLOW;
//             }
//         }
//     }

//     stop(target, aDist )
//     {
//         // Calculate direction vector
//         let dx = target.posX - this.posX;
//         let dy = target.posY - this.posY;

//         // Distance to target
//         const dist = Math.sqrt(dx * dx + dy * dy);

//         // If target is too far, go back to roam
//         if (dist > aDist) 
//         {
//             this.behaveState = GameDefs.behaveStates.FOLLOW;
//             return;
//         }
//     }
// }
