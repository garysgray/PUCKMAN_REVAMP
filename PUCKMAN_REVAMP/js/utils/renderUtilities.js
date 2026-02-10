// =======================================================
// RENDER UTILITIES
// =======================================================

const RenderUtil = 
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
            if (DebugUtil.DRAW_DEBUG_HITBOXES) this.renderHitBoxs(device, sprite);
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
    },

      renderHTMLMessage(game) 
{
    if (game.isGameFullscreen) return; // skip messages in fullscreen

    const msg = document.getElementById("message");
    if (!msg) return;

    let messages = [];

    // ---------------------------------------------------
    // Build messages FIRST
    // ---------------------------------------------------
    if (game.gameState === gameStates.INIT) 
    {
        if (game.gamePadEnabled && game.gamePadConnected)
        {
            messages.push(...gameTexts.INIT.GAMEPAD_INSTRUCTIONS);
        }
        else if (!game.gamePadEnabled && game.gamePadConnected)
        {
            messages.push(gameTexts.INIT.HTML_DEFAULT_INSTRUCTIONS);
        }
        else
        {
            messages.push(...gameTexts.INIT.INSTRUCTIONS);
        }
    }

    // ------------------------
    // PAUSE message (if player is paused)
    // ------------------------
    if (game.gameState === gameStates.PAUSE)
    {
        if (game.gamePadEnabled && game.gamePadConnected)
        {
            messages.push(gameTexts.PAUSE.GAMEPAD_MESSAGE);
        }
        else
        {
            messages.push(gameTexts.PAUSE.MESSAGE);
        }
    }

    // Filter out controller-only messages if controller is disconnected
    if (!game.gamePadConnected)
    {
        messages = messages.filter(msg =>
            !msg.toLowerCase().includes("gamepad") &&
            !msg.toLowerCase().includes("controller")
        );
    }

    // Timer / Random message
    if (game.htmlMessageIndex == null)
    {
        game.htmlMessageIndex = 0;
        game.htmlMessageTimer = 0;
    }

    game.htmlMessageTimer++;
    if (game.htmlMessageTimer > 180)
    {
        game.htmlMessageTimer = 0;
        game.htmlMessageIndex = Math.floor(Math.random() * messages.length);
    }

    const message = messages[game.htmlMessageIndex];
    msg.innerHTML = `<p>${message}</p>`;
}

};