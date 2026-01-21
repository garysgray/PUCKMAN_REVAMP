// =======================================================
// mapBuildingUtilities.js
// -------------------------------------------------------
// Functions neede to init and build map
// =======================================================

function getRandomMapSprite(spriteTypes) 
{
    const sprites = Object.values(spriteTypes);
    return sprites[Math.floor(Math.random() * sprites.length)];
} 

function buildBorder(game, name, width, height) 
{
    try 
    {
        let maxWidth = Math.floor(game.canvasWidth / width);
        let maxHeight = Math.floor((game.canvasHeight - game.canvasHeight * game.gameConsts.HUD_BUFFER) / height);

        if (maxWidth % 2 !== 0) maxWidth--;
        if (maxHeight % 2 !== 0) maxHeight--;

        game.borderHorizontalBuffer = (game.canvasWidth - maxWidth * width) * 0.5;
        game.borderVerticalBuffer = (game.canvasHeight - (game.canvasHeight * game.gameConsts.HUD_BUFFER + maxHeight * height)) * 0.5;

        // Top & Bottom
        for (let i = 0; i < maxWidth; i++) 
        {
            game.borderHolder.addObject(
                new GameObject(name, width, height, i * width + game.borderHorizontalBuffer, game.borderVerticalBuffer + game.canvasHeight * game.gameConsts.HUD_BUFFER)
            );
            game.borderHolder.addObject(
                new GameObject(name, width, height, i * width + game.borderHorizontalBuffer, game.canvasHeight - (game.borderVerticalBuffer + height))
            );
        }

        // Left & Right
        for (let i = 0; i < maxHeight; i++) 
        {
            game.borderHolder.addObject(
                new GameObject(name, width, height, game.borderHorizontalBuffer, i * width + game.borderVerticalBuffer + game.canvasHeight * game.gameConsts.HUD_BUFFER)
            );
            game.borderHolder.addObject(
                new GameObject(name, width, height, game.canvasWidth - (game.borderHorizontalBuffer + width), i * width + game.borderVerticalBuffer + game.canvasHeight * game.gameConsts.HUD_BUFFER)
            );
        }

        // tell renderer to rebuild cached border
        game.cachedBorderReady = false;
    }
    catch (err) 
    {
        console.error("Failed to build border:", err);
    }    
}

function buildMap(game) 
{
    try 
    {
        const tilesX = game.gameConsts.NUM_MAP_X_TILES;
        const tilesY = game.gameConsts.NUM_MAP_Y_TILES;
        const centerX = Math.floor(tilesX / 2);
        const centerY = Math.floor(tilesY / 2);

        const palette = Object.values(GameDefs.mapSpriteTypes);
        const goalsPalette = Object.values(GameDefs.goalsSpriteTypes);

        // 0 = walkable, 1 = wall
        const grid = Array.from({ length: tilesY }, () => Array(tilesX).fill(0));

        // --------------------------

        // Build wall grid
        for (let y = 0; y < tilesY; y++) 
        {
            for (let x = 0; x < tilesX; x++) 
            {
                // border exclusion & spawn safe zone
                if (x < game.mapSafeMargin ||
                    y < game.mapSafeMargin ||
                    x >= tilesX - game.mapSafeMargin ||
                    y >= tilesY - game.mapSafeMargin ||
                    (Math.abs(x - centerX) <= game.mapSpawnRadius &&
                    Math.abs(y - centerY) <= game.mapSpawnRadius))
                    continue;

                if (x % game.mapLaneSpacing === 0 ||
                    y % game.mapLaneSpacing === 0 ||
                    Math.random() > game.mapEmptyChance)
                    grid[y][x] = 1;
            }
        }

        // Place wall tiles
        for (let y = 0; y < tilesY; y++) 
        {
            for (let x = 0; x < tilesX; x++) 
            {
                if (grid[y][x] !== 1) continue;

                const screenX = game.gameConsts.MAP_BUFFER_X + x * game.gameConsts.MAP_TILE_WIDTH;
                const screenY = game.gameConsts.MAP_BUFFER_Y + y * game.gameConsts.MAP_TILE_HEIGHT;

                // rainbow effect
                const dx = Math.abs(x - centerX);
                const dy = Math.abs(y - centerY);
                const dist = Math.sqrt(dx*dx + dy*dy);
                const maxDist = Math.sqrt(centerX*centerX + centerY*centerY);
                const randIndex = Math.floor(Math.random() * palette.length);
                const shift = Math.floor((dist / maxDist) * palette.length);
                const colorIndex = (randIndex + shift) % palette.length;

                const tileDef = palette[colorIndex];

                game.mapHolder.addObject(new GameObject(
                    tileDef.type,
                    game.gameConsts.MAP_TILE_WIDTH,
                    game.gameConsts.MAP_TILE_HEIGHT, 
                    screenX,
                    screenY
                ));
            }
        }

        //  Place goals safely
        //  FIXX magic nums
        //const GOAL_COUNT = 5; // 10–20
        for (let g = 0; g < game.goalCount; g++) 
        {
            let placed = false;

            for (let attempt = 0; attempt < 500 && !placed; attempt++) 
            {
                const x = Math.floor(Math.random() * tilesX);
                const y = Math.floor(Math.random() * tilesY);

                // grid walkable + border + spawn zone
                if (grid[y][x] !== 0 ||
                    x < game.mapSafeMargin ||
                    y < game.mapSafeMargin ||
                    x >= tilesX - game.mapSafeMargin ||
                    y >= tilesY - game.mapSafeMargin ||
                    (Math.abs(x - centerX) <= game.mapSpawnRadius &&
                    Math.abs(y - centerY) <= game.mapSpawnRadius))
                    continue;

                const screenX = game.gameConsts.MAP_BUFFER_X + x * game.gameConsts.MAP_TILE_WIDTH;
                const screenY = game.gameConsts.MAP_BUFFER_Y + y * game.gameConsts.MAP_TILE_HEIGHT;

                const goalDef = goalsPalette[Math.floor(Math.random() * goalsPalette.length)];

                const tempGoal = new GameObject(
                    goalDef.type,
                    game.gameConsts.MAP_TILE_WIDTH,
                    game.gameConsts.MAP_TILE_HEIGHT,
                    screenX,
                    screenY
                );

                // world-space collision
                if (overlapsAny(tempGoal, game.mapHolder))  continue;
                if (overlapsAny(tempGoal, game.goalHolder)) continue;
                if (overlapsAny(tempGoal, game.enemyHolder)) continue;

                if (game.player) 
                {
                    const playerHolder = { getSize: () => 1, getIndex: () => game.player };
                    if (overlapsAny(tempGoal, playerHolder)) continue;
                }

                game.goalHolder.addObject(tempGoal);
                placed = true;
            }

            if (!placed) console.warn("Failed to place a goal:", g);
        }
        // tell renderer to rebuild cached border
        game.cachedMapReady = false;
    }
    catch (err) 
    {
        console.error("Failed to build map:", err);
    }    
}

function createCache(device, game, holder, cacheKey, readyKey) 
{
    const canvas = document.createElement("canvas");
    canvas.width = game.canvasWidth;
    canvas.height = game.canvasHeight;
    const ctx = canvas.getContext("2d");

    // Draw all sprites from the holder
    for (let i = 0; i < holder.getSize(); i++) 
    {
        const obj = holder.getIndex(i);
        const img = device.images.getImage(obj.name);
        if (!img) continue;

        ctx.drawImage(img, obj.posX, obj.posY, obj.width, obj.height);
    }

    // Dynamically set the class members
    game[cacheKey] = canvas;
    game[readyKey] = true;
}

function buildPlayer(game)
{
    try 
    {
        game.player = new Player(
            GameDefs.playerSpriteTypes.PLAYER.w,
            GameDefs.playerSpriteTypes.PLAYER.h,
            game.canvasHalfW,
            game.borderVerticalBuffer + game.gameConsts.MAP_BUFFER_Y,
            GameDefs.playerSpriteTypes.PLAYER.s
        );
    } 
    catch (err) 
    {
        console.error("Failed to initialize player:", err);
    }
}

function spawnEnemies(game, types, holder)
{
    Object.values(types).forEach(spriteDef =>
    {
        const enemy = new Enemy(
            spriteDef.type,
            spriteDef.w,
            spriteDef.h,        
            game.canvasHalfW,
            game.canvasHalfH,
            spriteDef.s
        );

        holder.addObject(enemy);
    });

}

function setMapValues(game) 
{
    // =======================================================
    // 1) LEVEL CONTROL
    // =======================================================
    const level = Math.min(game.gameLevel, MapDefs.MAX_DIFFICULTY_LEVEL);

    // Every 5 levels = new difficulty tier
    const tier = Math.floor((level - 1) / 5);

    // =======================================================
    // 2) BASE VALUES (LEVEL 1 FEEL)
    // =======================================================
    game.mapSafeMargin   = MapDefs.BASE_SAFE_MARGIN;
    game.mapLaneSpacing  = MapDefs.BASE_LANE_SPACING;
    game.mapEmptyChance  = MapDefs.BASE_EMPTY_CHANCE;
    game.mapSpawnRadius  = MapDefs.BASE_SPAWN_RADIUS;
    game.goalCount       = MapDefs.BASE_GOALS;

    // =======================================================
    // 3) DIFFICULTY PER TIER (BIG STEPS)
    // =======================================================
    game.mapSafeMargin  -= tier * MapDefs.SAFE_MARGIN_STEP;
    game.mapLaneSpacing -= tier * MapDefs.LANE_SPACING_STEP;
    game.mapEmptyChance -= tier * MapDefs.EMPTY_CHANCE_STEP;
    game.mapSpawnRadius -= tier * MapDefs.SPAWN_RADIUS_STEP;
    game.goalCount      += tier * MapDefs.GOALS_STEP;

    // =======================================================
    // 4) SMALL PER-LEVEL VARIATION (FLAVOR)
    // =======================================================
    if (level % 2 === 0)
    {
        game.mapEmptyChance += 0.02; // tiny random tweak (optional to move to MapDefs)
        game.goalCount += 1;          // occasional extra goal
    }

    // =======================================================
    // 5) HARD LIMITS (DESIGN SAFETY NET)
    // =======================================================
    game.mapSafeMargin  = Math.max(MapDefs.MIN_SAFE_MARGIN,  game.mapSafeMargin);
    game.mapLaneSpacing = Math.max(MapDefs.MIN_LANE_SPACING, game.mapLaneSpacing);
    game.mapSpawnRadius = Math.max(MapDefs.MIN_SPAWN_RADIUS, game.mapSpawnRadius);
    game.mapEmptyChance = Math.max(MapDefs.MIN_EMPTY_CHANCE, Math.min(MapDefs.MAX_EMPTY_CHANCE, game.mapEmptyChance));
    game.goalCount      = Math.max(MapDefs.MIN_GOALS, Math.min(MapDefs.MAX_GOALS, game.goalCount));

    // =======================================================
    // 6) DEBUG
    // =======================================================
    // console.log(
    //     `LEVEL: ${game.gameLevel} | TIER: ${tier}`,
    //     {
    //         safeMargin: game.mapSafeMargin,
    //         laneSpacing: game.mapLaneSpacing,
    //         emptyChance: game.mapEmptyChance.toFixed(2),
    //         spawnRadius: game.mapSpawnRadius,
    //         goalCount: game.goalCount
    //     }
    // );
}
