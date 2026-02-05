// =======================================================
// RENDER UTILITIES
// =======================================================

const Render = 
{
    // Sprite rendering
    renderClipSprite(device, sprite, imageKey, frame)
    {
        try
        {
            const image = device.images.getImage(imageKey);
            if (!image)
            {
                console.warn("Sprite image missing:", imageKey);
            }
            device.renderClip(
                image,
                sprite.posX,
                sprite.posY,
                sprite.width,
                sprite.height,
                frame
            );
            if (Debug.DRAW_DEBUG_HITBOXES) this.renderHitBoxs(device, sprite);
        }
        catch (e)
        {
            console.error("Error in renderClipSprite:", e);
        }
    },
    
    renderPlayer(device, game)
    {
        this.renderClipSprite(
            device,
            game.player,
            playerSpriteTypes.PLAYER.type,
            game.player.playerState
        );
    },
    
    renderStateSprite(device, sprite)
    {
        this.renderClipSprite(
            device,
            sprite,
            sprite.name,
            sprite.state
        );
    },
    
    renderBorder(device, game)
    {
        if (!game.cachedBorderReady)
        {
            this.createRenderCache(device, game, game.borderHolder, "cachedBorder", "cachedBorderReady");
        }
        device.ctx.drawImage(game.cachedBorder, 0, 0);
    },
    
    renderMap(device, game)
    {
        if (!game.cachedMapReady)
        {
            this.createRenderCache(device, game, game.mapHolder, "cachedMap", "cachedMapReady");
        }
        device.ctx.drawImage(game.cachedMap, 0, 0);
    },
    
    // Debug hitboxes
    renderHitBoxs(device, tempObj) 
    {
        try 
        {
            const x = tempObj.posX - tempObj.halfWidth;
            const y = tempObj.posY - tempObj.halfHeight;
            const w = tempObj.width;
            const h = tempObj.height;
            device.ctx.strokeStyle = "lime";
            device.ctx.strokeRect(x, y, w, h);
        } 
        catch (e)
        {
            console.error("Error in renderHitBoxs:", e);
        }
    },
    
    // Render cache
    createRenderCache(device, game, holder, cacheKey, readyKey)
    {
        const canvas = document.createElement("canvas");
        canvas.width  = game.gameConsts.SCREEN_WIDTH;
        canvas.height = game.gameConsts.SCREEN_HEIGHT;
        const ctx = canvas.getContext("2d");
        
        for (let i = 0; i < holder.getSize(); i++)
        {
            const obj = holder.getIndex(i);
            const img = device.images.getImage(obj.name);
            if (!img) continue;
            ctx.drawImage(img, obj.posX, obj.posY, obj.width, obj.height);
        }
        
        game[cacheKey] = canvas;
        game[readyKey] = true;
    },

    renderHud(device, game)
    {
        const cw = game.gameConsts.SCREEN_WIDTH;
        const ch = game.gameConsts.SCREEN_HEIGHT;
        const hudY = ch * 0.05;
        
        // HUD element positions - evenly spaced
        const scoreX = cw * 0.15;
        const livesX = cw * 0.38;
        const clockX = cw * 0.62;
        const levelX = cw * 0.85;
        
        const scoreText = gameTexts.HUD.SCORE + game.score;
        const livesText = gameTexts.HUD.LIVES + game.lives;
        const levelText = gameTexts.HUD.LEVEL + game.gameLevel;
        const timer = game.gameTimers.getObjectByName(timerTypes.GAME_CLOCK.name);
        const timeText = timer.timeLeft === 0 ? "Time: 0:00" : `Time: ${timer.formatted}`;
        
        // Center-align all HUD text
        device.ctx.textAlign = "center";
        device.putText(scoreText, scoreX, hudY);
        device.putText(livesText, livesX, hudY);
        device.putText(timeText, clockX, hudY);
        device.putText(levelText, levelX, hudY);
    }
};