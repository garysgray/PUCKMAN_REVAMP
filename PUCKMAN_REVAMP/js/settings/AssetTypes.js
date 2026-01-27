// =======================================================
// GameAssetTypes.js
// -------------------------------------------------------
// Purpose:
// Immutable spites, billboards, and sounds settings
// =======================================================

const MAP_TILE_SIZE = { w: 24, h: 24 };
const BILLBOARD_SIZE = { w: 400, h: 100 };

const playerSpriteTypes = 
{
    PLAYER:       { type: "player",  ...MAP_TILE_SIZE, s: 200, path: "assets/sprites/pacs.png" },
};

const characterSpriteTypes =  
{
    RED_GHOST:    { type: "red_ghost",       ...MAP_TILE_SIZE, s: 150, path: "assets/sprites/ghosts/red_ghosts.png" },
    BLUE_GHOST:    { type: "blue_ghost",     ...MAP_TILE_SIZE, s: 140,  path: "assets/sprites/ghosts/blue_ghosts.png" },
    GREEN_GHOST:    { type: "green_ghost",   ...MAP_TILE_SIZE, s: 130, path: "assets/sprites/ghosts/green_ghosts.png" },
    ORANGE_GHOST:    { type: "orange_ghost", ...MAP_TILE_SIZE, s: 120, path: "assets/sprites/ghosts/orange_ghosts.png" },
    PINK_GHOST:    { type: "pink_ghost",     ...MAP_TILE_SIZE, s: 100, path: "assets/sprites/ghosts/pink_ghosts.png" },
};

const mapSpriteTypes = 
{
    RED_BRICK:    { type: "red_brick",       ...MAP_TILE_SIZE, path: "assets/sprites/bricks/red_brick.png" },
    BLUE_BRICK:    { type: "blue_brick",     ...MAP_TILE_SIZE, path: "assets/sprites/bricks/blue_brick.png" },
    GREEN_BRICK:    { type: "green_brick",   ...MAP_TILE_SIZE, path: "assets/sprites/bricks/green_brick.png" },
    PURPLE_BRICK:    { type: "purple_brick", ...MAP_TILE_SIZE, path: "assets/sprites/bricks/purple_brick.png" },
    YELLOW_BRICK:    { type: "yellow_brick", ...MAP_TILE_SIZE, path: "assets/sprites/bricks/yellow_brick.png" },
};

const goalsSpriteTypes = 
{
    APPLE:     { type: "apple",    ...MAP_TILE_SIZE, path: "assets/sprites/fruits/apple.png" },
    BANANA:   { type: "banana",    ...MAP_TILE_SIZE, path: "assets/sprites/fruits/banana.png" },
    CHERRIES:  { type: "cherries", ...MAP_TILE_SIZE, path: "assets/sprites/fruits/cherries.png" },
    LEMON:     { type: "lemon",    ...MAP_TILE_SIZE, path: "assets/sprites/fruits/lemon.png" },
    ORANGE:    { type: "orange",   ...MAP_TILE_SIZE, path: "assets/sprites/fruits/orange.png" },
};

const billBoardTypes = 
{
    SPLASH:     { type: "splash",  ...BILLBOARD_SIZE, path: "assets/sprites/billBoards/gameSplash.png" , isCenter: true },
    PAUSE:      { type: "pause",   ...BILLBOARD_SIZE, path: "assets/sprites/billBoards/pause.png" , isCenter: true },
    WIN:        { type: "win",     ...BILLBOARD_SIZE, path: "assets/sprites/billBoards/win.png" , isCenter: true },
    LOSE:       { type: "lose",    ...BILLBOARD_SIZE, path: "assets/sprites/billBoards/lose.png" , isCenter: true },
    FAIL:       { type: "fail",    ...BILLBOARD_SIZE, path: "assets/sprites/billBoards/fail.png" , isCenter: true },
};

const soundTypes = 
{
    GET:     { name: "get",     path: "assets/sounds/get.wav" },
    HURT:    { name: "hurt",    path: "assets/sounds/hurt.wav" },
};

const timerTypes = 
{ 
     GAME_CLOCK:  { name: "gameClock", timerMode: timerModes.COUNTDOWN },  
     PLAY_DELAY:  { name: "playDelay", timerMode: timerModes.COUNTDOWN },     
};

Object.freeze(playerSpriteTypes);
Object.freeze(characterSpriteTypes);
Object.freeze(mapSpriteTypes);
Object.freeze(goalsSpriteTypes);
Object.freeze(billBoardTypes);
Object.freeze(soundTypes);
Object.freeze(timerTypes);