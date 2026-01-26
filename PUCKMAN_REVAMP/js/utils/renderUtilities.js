//***************************************************************
// Rendering Functions for Game
//***************************************************************

//---------------------------------------------------------------
// Render Player (different clips based on playState)
//---------------------------------------------------------------
function renderPlayer(device, game) 
{
    try 
    {
        const tempObj = game.player;
        
        const playerImage = device.images.getImage(playerSpriteTypes.PLAYER.type);

        if (!playerImage) 
        {
            console.warn("Player image missing.");
        }

         // Always draw according to the internal state
        device.renderClip(
            playerImage,
            tempObj.posX,
            tempObj.posY,
            tempObj.width,
            tempObj.height,
            tempObj.playerState,
        );
        
        if (DRAW_DEBUG_HITBOXES) renderHitBoxs(device, tempObj);

    } 
    catch (e)
    {
        console.error("Error in renderPlayer:", e);
    }
}

//---------------------------------------------------------------
// Render spriteObj (different clips based on playState)
//---------------------------------------------------------------
function renderStateSprite(device, sprite ) 
{
    try 
    {
       const spriteImage = device.images.getImage(sprite.name);

        if (!spriteImage) 
        {
            console.warn("spriteObj image missing.");
        }

         //Always draw according to the internal state
        device.renderClip(
            spriteImage,
            sprite.posX,
            sprite.posY,
            sprite.width,
            sprite.height,
            sprite.state,
        );

        if (DRAW_DEBUG_HITBOXES) renderHitBoxs(device, sprite);
    } 
    catch (e)
    {
        console.error("Error in renderStateSprite:", e);
    }
}

function renderBorder(device, game)
{
    // build cache if needed
    if (!game.cachedBorderReady)
    {
        createCache(device, game, game.borderHolder, "cachedBorder", "cachedBorderReady");
    }

    // draw the cached border as one image
    device.ctx.drawImage(game.cachedBorder, 0, 0);
}

function renderMap(device, game)
{
    // build cache if needed
    if (!game.cachedMapReady)
    {
        createCache(device, game, game.mapHolder, "cachedMap", "cachedMapReady");
    }

    // draw the cached border as one image
    device.ctx.drawImage(game.cachedMap, 0, 0);
}


//---------------------------------------------------------------
// Render HITBOXES if DRAW_DEBUG_HITBOXES == true
//---------------------------------------------------------------
function renderHitBoxs(device, tempObj) 
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
}

// =======================================================
// HTML MESSAGE HANDLER
// =======================================================

function renderHTMLMessage(game) 
{
    const msg = document.getElementById("message");
    if (!msg) return;

    if (game.gameState != gameStates.INIT) 
    {
        if (game.gamePadEnabled) 
        {
            msg.innerHTML = `<p>${gameTexts.INIT.GAMEPAD_INSTRUCTIONS[4]}</p>`;
        } 
        else 
        {
            msg.innerHTML = `<p>${gameTexts.INIT.INSTRUCTIONS[4]}</p>`;
        }
    }
    else
    {
        if (game.gamePadConnected)
        {
            msg.innerHTML = `<p>${gameTexts.INIT.HTML_DEFAULT_INSTRUCTIONS}</p>`;
        }
        else 
        {
            msg.innerHTML = `<p>${gameTexts.INIT.INSTRUCTIONS[4]}</p>`;
        }
    }
}

// ------------------------------------------------------------------------
// Add a render layer
// ------------------------------------------------------------------------
function addRenderLayer(layer, holder) 
{
    try
    {
        if (!layer) throw new Error("Layer is undefined or null.");
        holder.push(layer);
    } 
    catch (error)
    {
        console.error("Error adding layer:", error.message);
        alert("An error occurred while adding a render layer.");
    }
}
