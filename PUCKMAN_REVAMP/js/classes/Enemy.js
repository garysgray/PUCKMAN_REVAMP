// ============================================================================
// ENEMY CLASS  -  extends GameObject
// ============================================================================

class Enemy extends GameObject
{
    #behaveState;
    #deltaX;
    #deltaY;

    constructor(name, width, height, x, y, speed) 
    {
        super(name, width, height, x, y, speed);
        this.behaveState = behaveStates.ROAM;
        this.roamTimer = 0;
        this.roamDirection = { x: 0, y: 0 };
        this.deltaX = 0;
        this.deltaY = 0;
    }

    get behaveState() { return this.#behaveState; }
    set behaveState(v) { this.#behaveState = v; }

    get deltaX() { return this.#deltaX; }
    set deltaX(v) { this.#deltaX = v; }

    get deltaY() { return this.#deltaY; }
    set deltaY(v) { this.#deltaY = v; }

    update(delta, game, target) 
    {
        try 
        {
            // Reset deltas
            this.deltaX = 0;
            this.deltaY = 0;

            // Execute behavior (calculates deltaX/deltaY)
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
        } 
        catch (e) 
        {
            console.error("Enemy update error:", e);
        }
    }

    follow(delta, game, target, stopFollowDistance = 900) 
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

        // Calculate desired movement (don't apply yet)
        this.deltaX = dx * this.speed * delta;
        this.deltaY = dy * this.speed * delta;

        // Update sprite direction
        if (Math.abs(dx) > Math.abs(dy)) 
        {
            this.state = dx > 0 ? enemyPlayStates.RIGHT : enemyPlayStates.LEFT;
        } 
        else 
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

        // Calculate desired movement (don't apply yet)
        this.deltaX = this.roamDirection.x * this.speed * delta;
        this.deltaY = this.roamDirection.y * this.speed * delta;

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

    static spawnEnemies(types, holder, screenWidth, screenHeight)
    {
        Object.values(types).forEach(spriteDef =>
        {
            const enemy = new Enemy(
                spriteDef.type,
                spriteDef.w,
                spriteDef.h,        
                screenWidth * 0.5,
                screenHeight * 0.5,
                spriteDef.s
            );

            holder.addObject(enemy);
        });

    }
    
}