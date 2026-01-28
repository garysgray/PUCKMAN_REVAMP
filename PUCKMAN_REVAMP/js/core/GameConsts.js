// -----------------------------
// GameConsts.js
// -----------------------------
// Purpose:
// Global game constants exposed via getters
// -----------------------------
class GameConsts {
    // ---- Screen ----
    #SCREEN_WIDTH  = 1000;
    #SCREEN_HEIGHT = 600;
    #HUD_BUFFER    = 0.045;

    // ---- Gameplay ----
    #GAME_LIVES_START_AMOUNT     = 3;
    #LEVEL_MAX_TIME              = 20;
    #PLAY_PAUSE_DELAY_TIME       = 0.5;

    // ---- UI ----
    #DEBUG_TEXT_COLOR = "yellow";
    #FONT_COLOR       = "hsla(49, 100%, 50%, 0.965)";
    #FONT_SETTINGS    = "bold 20pt VT323";

    // ---- Sound ----
    #POOLSIZE = 5;
    #VOLUME   = 1.0;

    // ---- Map / Level ----
    #MAP_BUFFER_X                = 60;
    #MAP_BUFFER_Y                = 70;
    #NUM_MAP_X_TILES             = 36;
    #NUM_MAP_Y_TILES             = 20;
    #MAP_TILE_WIDTH              = MAP_TILE_SIZE.w;
    #MAP_TILE_HEIGHT             = MAP_TILE_SIZE.h;
    #MAX_GOAL_PLACEMENT_ATTEMPTS = 25;
    #EVEN_LEVEL_EMPTY_CHANCE_BONUS = 0.02;

    // ---Scoring------
    #VALUE_FOR_GETTING_GOAL = 10;
    #VALUE_FOR_UNIT_OF_TIME_LEFT = 5;
    #VALUE_FOR_WINNING_LEVEL = 100;
    #VALUE_WHEN_NEW_LIFE_AWARDED = 10000;

    // ---- Getters ----
    // Screen
    get SCREEN_WIDTH()  { return this.#SCREEN_WIDTH; }
    get SCREEN_HEIGHT() { return this.#SCREEN_HEIGHT; }
    get HUD_BUFFER()    { return this.#HUD_BUFFER; }

    // Gameplay
    get GAME_LIVES_START_AMOUNT() { return this.#GAME_LIVES_START_AMOUNT; }
    get LEVEL_MAX_TIME()          { return this.#LEVEL_MAX_TIME; }
    get PLAY_PAUSE_DELAY_TIME()   { return this.#PLAY_PAUSE_DELAY_TIME; }

    // UI
    get DEBUG_TEXT_COLOR() { return this.#DEBUG_TEXT_COLOR; }
    get FONT_COLOR()       { return this.#FONT_COLOR; }
    get FONT_SETTINGS()    { return this.#FONT_SETTINGS; }

    // Sound
    get POOLSIZE() { return this.#POOLSIZE; }
    get VOLUME()   { return this.#VOLUME; }

    // Map / Level
    get MAP_BUFFER_X()                { return this.#MAP_BUFFER_X; }
    get MAP_BUFFER_Y()                { return this.#MAP_BUFFER_Y; }
    get NUM_MAP_X_TILES()             { return this.#NUM_MAP_X_TILES; }
    get NUM_MAP_Y_TILES()             { return this.#NUM_MAP_Y_TILES; }
    get MAP_TILE_WIDTH()              { return this.#MAP_TILE_WIDTH; }
    get MAP_TILE_HEIGHT()             { return this.#MAP_TILE_HEIGHT; }
    get MAX_GOAL_PLACEMENT_ATTEMPTS() { return this.#MAX_GOAL_PLACEMENT_ATTEMPTS; }
    get EVEN_LEVEL_EMPTY_CHANCE_BONUS() { return this.#EVEN_LEVEL_EMPTY_CHANCE_BONUS; }

    // ---Scoring------
    get VALUE_FOR_GETTING_GOAL() { return this.#VALUE_FOR_GETTING_GOAL; }
    get VALUE_FOR_UNIT_OF_TIME_LEFT() { return this.#VALUE_FOR_UNIT_OF_TIME_LEFT; }
    get VALUE_WHEN_NEW_LIFE_AWARDED() { return this.#VALUE_WHEN_NEW_LIFE_AWARDED; }
    get VALUE_FOR_WINNING_LEVEL() { return this.#VALUE_FOR_WINNING_LEVEL; }
}
