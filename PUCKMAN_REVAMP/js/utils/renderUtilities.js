//***************************************************************
// Rendering Functions for Game
//***************************************************************

function renderClipSprite(device, sprite, imageKey, stateKey)
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
            sprite[stateKey]
        );

        if (DRAW_DEBUG_HITBOXES) renderHitBoxs(device, sprite);
    }
    catch (e)
    {
        console.error("Error in renderClipSprite:", e);
    }
}

function renderPlayer(device, game)
{
    renderClipSprite(
        device,
        game.player,
        playerSpriteTypes.PLAYER.type,
        "playerState"
    );
}
function renderStateSprite(device, sprite)
{
    renderClipSprite(
        device,
        sprite,
        sprite.name,
        "state"
    );
}

function renderBorder(device, game)
{
    // build cache if needed
    if (!game.cachedBorderReady)
    {
        createRenderCache(device, game, game.borderHolder, "cachedBorder", "cachedBorderReady");
    }

    // draw the cached border as one image
    device.ctx.drawImage(game.cachedBorder, 0, 0);
}

function renderMap(device, game)
{
    // build cache if needed
    if (!game.cachedMapReady)
    {
        createRenderCache(device, game, game.mapHolder, "cachedMap", "cachedMapReady");
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

// ---------------------------------------------------
// Render Cache
// ---------------------------------------------------
function createRenderCache(device, game, holder, cacheKey, readyKey)
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
}

