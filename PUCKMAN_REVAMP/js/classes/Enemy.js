// ============================================================================
// ENEMY CLASS  -  extends GameObject
// ============================================================================

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

    static spawnEnemies(game, types, holder)
    {
        Object.values(types).forEach(spriteDef =>
        {
            const enemy = new Enemy(
                spriteDef.type,
                spriteDef.w,
                spriteDef.h,        
                game.gameConsts.SCREEN_WIDTH * 0.5,
                game.gameConsts.SCREEN_HEIGHT * 0.5,
                spriteDef.s
            );

            holder.addObject(enemy);
        });

    }
    
}