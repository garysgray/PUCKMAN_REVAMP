// =======================================================
// GameDefs.js
// -------------------------------------------------------
// Purpose:
// Immutable enumerations, texts, billboard & sprite configs.
// =======================================================

const GameDefs = Object.freeze({
    gameStates: {
        INIT: 0,
        PLAY: 1,
        PAUSE: 2,
        WIN: 3,
        LOSE: 4
    },

    // These are to help enemy render the right clip for current direction
    enemyPlayStates: {
        RIGHT: 0,
        DOWN: 1,
        LEFT: 2,
        UP: 3,
    },

    // These are to help the player render the right clip for current direction
    playStates: {
        UP: 0,
        UP_RIGHT: 1,
        RIGHT: 2,
        DOWN_RIGHT: 3,
        DOWN: 4,
        DOWN_LEFT: 5,
        LEFT: 6,
        UP_LEFT: 7
    },

    // FIX use dif sprite holders for bricks, ghosts, fruit
    spriteTypes: {
        PLAYER:       { type: "player",   w: 24, h: 24, path: "assets/sprites/pacs.png" },
        RED_GHOST:    { type: "red_ghost",     w: 24, h: 24, path: "assets/sprites/ghosts/red_ghosts.png" },
        BLUE_GHOST:    { type: "blue_ghost",     w: 24, h: 24, path: "assets/sprites/ghosts/blue_ghosts.png" },
        GREEN_GHOST:    { type: "green_ghost",     w: 24, h: 24, path: "assets/sprites/ghosts/green_ghosts.png" },
        ORANGE_GHOST:    { type: "orange_ghost",     w: 24, h: 24, path: "assets/sprites/ghosts/orange_ghosts.png" },
        PINK_GHOST:    { type: "pink_ghost",     w: 24, h: 24, path: "assets/sprites/ghosts/pink_ghosts.png" },

        RED_BRICK:    { type: "red_brick",    w: 24, h: 24, path: "assets/sprites/bricks/red_brick.png" },
        BLUE_BRICK:    { type: "blue_brick",    w: 24, h: 24, path: "assets/sprites/bricks/blue_brick.png" },
        GREEN_BRICK:    { type: "green_brick",    w: 24, h: 24, path: "assets/sprites/bricks/green_brick.png" },
        PURPLE_BRICK:    { type: "purple_brick",    w: 24, h: 24, path: "assets/sprites/bricks/purple_brick.png" },
        YELLOW_BRICK:    { type: "yellow_brick",    w: 24, h: 24, path: "assets/sprites/bricks/yellow_brick.png" },
    },

    billBoardTypes: {
        BACKGROUND: { type: "background", w: 600, h: 600, path: "assets/sprites/billBoards/stars.png", isCenter: false },
        HUD:        { type: "hud",        w: 850, h: 200, path: "assets/sprites/billBoards/hud.png" , isCenter: false },
        SPLASH:     { type: "splash",     w: 400, h: 100, path: "assets/sprites/billBoards/gameSplash.png" , isCenter: true },
        PAUSE:      { type: "pause",      w: 400, h: 100, path: "assets/sprites/billBoards/pause.png" , isCenter: true },
        WIN:        { type: "win",        w: 400, h: 100, path: "assets/sprites/billBoards/win.png" , isCenter: true },
        LOSE:       { type: "lose",       w: 400, h: 100, path: "assets/sprites/billBoards/lose.png" , isCenter: true },
    },

    soundTypes: {
        SHOOT:   { name: "shoot",   path: "assets/sounds/shoot.wav" },
    },

    keyTypes: {
        PLAY_KEY: "Space",
        RESET_KEY: "Space",
        PAUSE_KEY_L: "ControlLeft",
        UP: "ArrowUp",
        DOWN: "ArrowDown",
        LEFT: "ArrowLeft",
        RIGHT: "ArrowRight",
        W: "KeyW",
        S: "KeyS",
        A: "KeyA",
        D: "KeyD"
    },

    gameTexts: {
        INIT: {
            INSTRUCTIONS: [
                "Some Init Text for show",
                "the text allignment layout array ",
                "is located in the:",
                "textRenderLayer.js"
            ]
        },
        HUD: {
            SCORE: "Score: ",
            LIVES: "Lives: "
        },
        PAUSE: {
            MESSAGE: "PRESS  CTRL  TO  RESUME  GAME"
        },
        WIN: {
            MESSAGE: "PRESS  ENTER  TO  PLAY  AGAIN"
        },
        LOSE: {
            LOSE_MESSAGE: "YOU  LOST,  SPACE-BAR  TO  RETRY",
            DIE_MESSAGE: "YOU  DIED,  SPACE-BAR  TO  REVIVE"
        }
    },

    timerModes: {
        COUNTDOWN: "countdown",
        COUNTUP: "countup",
    },

    timerTypes: {
        SHOOT_COOL_DOWN_TIMER: "shootCooldownTimer",
        GAME_CLOCK: "gameClock",
    },

    parallexType: {
        HORIZONTAL: 1,
        VERTICLE:   2
    }

});

// -----------------------------
// Global Constants
// -----------------------------
class GameConsts 
{
    // ---- Private fields ----
    //sizes
    #SCREEN_WIDTH = 1000;
    #SCREEN_HEIGHT = 600;

    //times
    #FALLBACK_DELTA = 16; // fallback ~60fps
    #SHOOT_COOLDOWN = 0.2; // 200ms

    //amounts
    #GAME_LIVES_START_AMOUNT = 3;
    #HUD_BUFFER = .045;

    //settings
    #DEBUG_TEXT_COLOR = "yellow";
    #FONT_COLOR = 'white'
    #FONT_SETTINGS = `bold 17pt Century Gothic`

    //sound 
    #POOLSIZE = 5;
    #VOLUME = 1.0;

    //speed
    #PLAYER_SPEED = 200;
    #ENEMY_SPEED  = 150;

    // //times
    // #SHIELD_TIME = 3;
    // #NPC_SPEED_INCREASE_INTERVALS = 10;
    // #NPC_SPEED_INCREASE_AMOUNT = 0.2;
    // //amounts
    // #AMMO_AMOUNT = 3; 
    // #SCORE_INCREASE = 10;
    // #SPAWN_ATTEMPTS = 5;
    // //settings
    // #BILLBOARDS_OFFSET_BUFF = 0;
    
    // ---- Getters (expose constants safely) ----
    get SCREEN_WIDTH(){ return this.#SCREEN_WIDTH; }
    get SCREEN_HEIGHT(){ return this.#SCREEN_HEIGHT; }
    get GAME_LIVES_START_AMOUNT(){ return this.#GAME_LIVES_START_AMOUNT; }
    get HUD_BUFFER(){ return this.#HUD_BUFFER; }
    get FALLBACK_DELTA(){ return this.#FALLBACK_DELTA; }
    get SHOOT_COOLDOWN(){ return this.#SHOOT_COOLDOWN; }
    get DEBUG_TEXT_COLOR(){ return this.#DEBUG_TEXT_COLOR; }
    get FONT_SETTINGS(){ return this.#FONT_SETTINGS; }
    get FONT_COLOR(){ return this.#FONT_COLOR; }
    get POOLSIZE(){ return this.#POOLSIZE; }
    get VOLUME(){ return this.#VOLUME; }
    get PLAYER_SPEED(){ return this.#PLAYER_SPEED; }
    get ENEMY_SPEED(){ return this.#ENEMY_SPEED; }
    
    // get SHIELD_TIME(){ return this.#SHIELD_TIME; }
    // get AMMO_AMOUNT(){ return this.#AMMO_AMOUNT; }
    // get SCORE_INCREASE(){ return this.#SCORE_INCREASE; }
    // get SPAWN_ATTEMPTS(){ return this.#SPAWN_ATTEMPTS; }   
    // get NPC_SPEED_INCREASE_INTERVALS(){ return this.#NPC_SPEED_INCREASE_INTERVALS; }
    // get NPC_SPEED_INCREASE_AMOUNT(){ return this.#NPC_SPEED_INCREASE_AMOUNT; }
    // get BILLBOARDS_OFFSET_BUFF(){ return this.#BILLBOARDS_OFFSET_BUFF; }

}