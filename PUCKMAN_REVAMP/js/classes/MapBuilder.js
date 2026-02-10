// // =======================================================
// // MapBuilder.js
// // -------------------------------------------------------
// // Responsible for:
// // - Difficulty tuning per level
// // - Procedural wall layout
// // - Goal placement
// // - Border construction
// // =======================================================

class MapBuilder
{
    constructor()
    {
        // Runtime map configuration (owned by MapBuilder)
        this.config =
        {
            safeMargin: 0,    // border buffer in tiles
            laneSpacing: 0,   // grid spacing for walls
            emptyChance: 0,   // chance a tile remains empty
            spawnRadius: 0,   // player safe zone radius
            goalCount: 0      // number of goals to spawn
        };
    }

    // ---------------------------------------------------
    // Difficulty / Tuning
    // ---------------------------------------------------
    // Computes map parameters based on game level
    setMapValues(game)
    {
        const level = Math.min(
            game.gameLevel,
            MapDefs.MAX_DIFFICULTY_LEVEL
        );

        const tier = Math.floor((level - 1) / MapDefs.DIFFICULTY_TIER_SIZE);
        const c    = this.config;

        // Base values (level 1 feel)
        c.safeMargin  = MapDefs.BASE_SAFE_MARGIN;
        c.laneSpacing = MapDefs.BASE_LANE_SPACING;
        c.emptyChance = MapDefs.BASE_EMPTY_CHANCE;
        c.spawnRadius = MapDefs.BASE_SPAWN_RADIUS;
        c.goalCount   = MapDefs.BASE_GOALS;

        // Scale every 5 levels
        c.safeMargin  -= tier * MapDefs.SAFE_MARGIN_STEP;
        c.laneSpacing -= tier * MapDefs.LANE_SPACING_STEP;
        c.emptyChance -= tier * MapDefs.EMPTY_CHANCE_STEP;
        c.spawnRadius -= tier * MapDefs.SPAWN_RADIUS_STEP;
        c.goalCount   += tier * MapDefs.GOALS_STEP;

        // Small per-level variation
        if (level % 2 === 0)
        {
            c.emptyChance += game.gameConsts.EVEN_LEVEL_EMPTY_CHANCE_BONUS;
            c.goalCount++;
        }

        // Clamp to safe limits
        c.safeMargin  = Math.max(MapDefs.MIN_SAFE_MARGIN, c.safeMargin);
        c.laneSpacing = Math.max(MapDefs.MIN_LANE_SPACING, c.laneSpacing);
        c.spawnRadius = Math.max(MapDefs.MIN_SPAWN_RADIUS, c.spawnRadius);

        c.emptyChance = Math.max(
            MapDefs.MIN_EMPTY_CHANCE,
            Math.min(MapDefs.MAX_EMPTY_CHANCE, c.emptyChance)
        );

        c.goalCount = Math.max(
            MapDefs.MIN_GOALS,
            Math.min(MapDefs.MAX_GOALS, c.goalCount)
        );
    }

    // ---------------------------------------------------
    // Border
    // ---------------------------------------------------
    // Builds outer wall frame around the playable area
    buildBorder(game, name, width, height)
    {
        try
        {
            let maxWidth = Math.floor(game.gameConsts.SCREEN_WIDTH / width);
            let maxHeight = Math.floor(
                (game.gameConsts.SCREEN_HEIGHT -
                 game.gameConsts.SCREEN_HEIGHT * game.gameConsts.HUD_BUFFER) / height
            );

            // Keep borders symmetrical
            if (maxWidth % 2 !== 0)  maxWidth--;
            if (maxHeight % 2 !== 0) maxHeight--;

            // Compute centering offsets
            game.borderHorizontalBuffer =
                (game.gameConsts.SCREEN_WIDTH - maxWidth * width) * 0.5;

            game.borderVerticalBuffer =
                (game.gameConsts.SCREEN_HEIGHT -
                (game.gameConsts.SCREEN_HEIGHT * game.gameConsts.HUD_BUFFER + maxHeight * height)) * 0.5;

            // Top & Bottom borders
            for (let i = 0; i < maxWidth; i++)
            {
                game.borderHolder.addObject(
                    new GameObject(
                        name, width, height,
                        i * width + game.borderHorizontalBuffer,
                        game.borderVerticalBuffer +
                        game.gameConsts.SCREEN_HEIGHT * game.gameConsts.HUD_BUFFER
                    )
                );

                game.borderHolder.addObject(
                    new GameObject(
                        name, width, height,
                        i * width + game.borderHorizontalBuffer,
                        game.gameConsts.SCREEN_HEIGHT - (game.borderVerticalBuffer + height)
                    )
                );
            }

            // Left & Right borders
            for (let i = 0; i < maxHeight; i++)
            {
                game.borderHolder.addObject(
                    new GameObject(
                        name, width, height,
                        game.borderHorizontalBuffer,
                        i * height +
                        game.borderVerticalBuffer +
                        game.gameConsts.SCREEN_HEIGHT * game.gameConsts.HUD_BUFFER
                    )
                );

                game.borderHolder.addObject(
                    new GameObject(
                        name, width, height,
                        game.gameConsts.SCREEN_WIDTH - (game.borderHorizontalBuffer + width),
                        i * height +
                        game.borderVerticalBuffer +
                        game.gameConsts.SCREEN_HEIGHT * game.gameConsts.HUD_BUFFER
                    )
                );
            }

            game.cachedBorderReady = false;
        }
        catch (err)
        {
            console.error("Failed to build border:", err);
        }
    }

    // ---------------------------------------------------
    // Map generation entry point
    // ---------------------------------------------------
    buildMap(game)
    {
        try
        {
            // Gather derived values once
            const ctx  = this.mapContext(game);

            // Generate logical wall grid
            const grid = this.buildWallGrid(ctx);

            // Convert grid into actual game objects
            this.spawnWalls(game, ctx, grid);
            this.spawnGoals(game, ctx, grid);

            game.cachedMapReady = false;
        }
        catch (err)
        {
            console.error("Failed to build map:", err);
        }
    }

    // ---------------------------------------------------
    // Shared map context
    // ---------------------------------------------------
    // Precomputed values reused across map steps
    mapContext(game)
    {
        const tilesX = game.gameConsts.NUM_MAP_X_TILES;
        const tilesY = game.gameConsts.NUM_MAP_Y_TILES;

        return {
            game,
            c: this.config,
            tilesX,
            tilesY,
            cx: Math.floor(tilesX / 2),
            cy: Math.floor(tilesY / 2),
            palette: Object.values(mapSpriteTypes),
            goals: Object.values(goalsSpriteTypes)
        };
    }

    // ---------------------------------------------------
    // Wall spawning
    // ---------------------------------------------------
    // Converts grid walls into rendered tiles
    spawnWalls(game, ctx, grid)
    {
        const { tilesX, tilesY, cx, cy, palette } = ctx;

        for (let y = 0; y < tilesY; y++)
        for (let x = 0; x < tilesX; x++)
        {
            if (grid[y][x] !== tileType.TILE_WALL) continue;

            const screenX =
                game.gameConsts.MAP_BUFFER_X +
                x * game.gameConsts.MAP_TILE_WIDTH;

            const screenY =
                game.gameConsts.MAP_BUFFER_Y +
                y * game.gameConsts.MAP_TILE_HEIGHT;

            // Color shift based on distance from center
            const dx = Math.abs(x - cx);
            const dy = Math.abs(y - cy);
            const dist = Math.sqrt(dx * dx + dy * dy);
            const max  = Math.sqrt(cx * cx + cy * cy);

            const i =
                (Math.floor(Math.random() * palette.length) +
                Math.floor((dist / max) * palette.length)) %
                palette.length;

            const tile = palette[i];

            game.mapHolder.addObject(
                new GameObject(
                    tile.type,
                    game.gameConsts.MAP_TILE_WIDTH,
                    game.gameConsts.MAP_TILE_HEIGHT,
                    screenX,
                    screenY
                )
            );
        }
    }

    // ---------------------------------------------------
    // Goal spawning
    // ---------------------------------------------------
    // Attempts safe placement with collision checks
    spawnGoals(game, ctx, grid)
    {
        const { tilesX, tilesY, cx, cy, goals, c } = ctx;

        for (let g = 0; g < c.goalCount; g++)
        {
            let placed = false;

            for (let i = 0; i < game.gameConsts.MAX_GOAL_PLACEMENT_ATTEMPTS && !placed; i++)
            {
                const x = Math.floor(Math.random() * tilesX);
                const y = Math.floor(Math.random() * tilesY);

                // Must be walkable and outside protected zones
                if (
                    grid[y][x] !== tileType.TILE_WALKABLE ||
                    x < c.safeMargin ||
                    y < c.safeMargin ||
                    x >= tilesX - c.safeMargin ||
                    y >= tilesY - c.safeMargin ||
                    (Math.abs(x - cx) <= c.spawnRadius &&
                     Math.abs(y - cy) <= c.spawnRadius)
                ) continue;

                const goal = new GameObject(
                    goals[Math.floor(Math.random() * goals.length)].type,
                    game.gameConsts.MAP_TILE_WIDTH,
                    game.gameConsts.MAP_TILE_HEIGHT,
                    game.gameConsts.MAP_BUFFER_X + x * game.gameConsts.MAP_TILE_WIDTH,
                    game.gameConsts.MAP_BUFFER_Y + y * game.gameConsts.MAP_TILE_HEIGHT
                );

                // Avoid overlaps
                if (
                    Collision.overlapsAny(goal, game.mapHolder) ||
                    Collision.overlapsAny(goal, game.goalHolder) ||
                    Collision.overlapsAny(goal, game.enemyHolder)
                ) continue;

                game.goalHolder.addObject(goal);
                placed = true;
            }
        }
    }

    // ---------------------------------------------------
    // Grid generation
    // ---------------------------------------------------
    // Creates a logical wall grid (0 = empty, 1 = wall)
    buildWallGrid(ctx)
    {
        const { tilesX, tilesY, cx, cy, c } = ctx;

        const grid = Array.from(
            { length: tilesY },
            () => Array(tilesX).fill(tileType.TILE_WALKABLE)
        );

        for (let y = 0; y < tilesY; y++)
        for (let x = 0; x < tilesX; x++)
        {
            // Skip protected areas
            if (
                x < c.safeMargin ||
                y < c.safeMargin ||
                x >= tilesX - c.safeMargin ||
                y >= tilesY - c.safeMargin ||
                (Math.abs(x - cx) <= c.spawnRadius &&
                 Math.abs(y - cy) <= c.spawnRadius)
            ) continue;

            // Lane-based structure + randomness
            if (
                x % c.laneSpacing === 0 ||
                y % c.laneSpacing === 0 ||
                Math.random() > c.emptyChance
            )
                grid[y][x] = tileType.TILE_WALL;
        }

        return grid;
    }

    // ---------------------------------------------------
    // grabs a random map sprite
    // ---------------------------------------------------
    getRandomMapSprite(spriteTypes) 
    {
        const sprites = Object.values(spriteTypes);
        return sprites[Math.floor(Math.random() * sprites.length)];
    }
}
