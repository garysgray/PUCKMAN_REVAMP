// =======================================================
// GameConsts.js
// -------------------------------------------------------
// Global game constants - all values are read-only
// =======================================================

class GameConsts 
{
    // =======================================================
    // SCREEN
    // =======================================================
    #SCREEN_WIDTH  = 1000;
    #SCREEN_HEIGHT = 600;
    #HUD_BUFFER    = 0.045;

    get SCREEN_WIDTH()  { return this.#SCREEN_WIDTH; }
    get SCREEN_HEIGHT() { return this.#SCREEN_HEIGHT; }
    get HUD_BUFFER()    { return this.#HUD_BUFFER; }

    // =======================================================
    // GAMEPLAY
    // =======================================================
    #GAME_LIVES_START_AMOUNT = 3;
    #LAST_LIFE = 1;
    #NO_LIVES  = 0;
    #NO_TIME   = 0;
    #NO_VALUE  = 0;
    #LEVEL_1   = 1;

    get GAME_LIVES_START_AMOUNT() { return this.#GAME_LIVES_START_AMOUNT; }
    get LAST_LIFE() { return this.#LAST_LIFE; }
    get NO_LIVES()  { return this.#NO_LIVES; }
    get NO_TIME()   { return this.#NO_TIME; }
    get NO_VALUE()  { return this.#NO_VALUE; }
    get LEVEL_1()  { return this.#LEVEL_1; }

    // =======================================================
    // TIMING
    // =======================================================
    #LEVEL_MAX_TIME        = 20;
    #STATE_DELAY_TIME      = 0.5;
    #HIGH_SCORE_DELAY_TIME = 2.0;
    #LOSE_SOUND_DELAY_TIME = 0.1;
    #HTML_MESS_DELAY_TIME  = 4.0;

    get LEVEL_MAX_TIME()        { return this.#LEVEL_MAX_TIME; }
    get STATE_DELAY_TIME()      { return this.#STATE_DELAY_TIME; }
    get HIGH_SCORE_DELAY_TIME() { return this.#HIGH_SCORE_DELAY_TIME; }
    get LOSE_SOUND_DELAY_TIME() { return this.#LOSE_SOUND_DELAY_TIME; }
    get HTML_MESS_DELAY_TIME() { return this.#HTML_MESS_DELAY_TIME; }

    // =======================================================
    // UI / FONTS
    // =======================================================
    #DEBUG_TEXT_COLOR  = "yellow";
    #FONT_COLOR        = "hsla(49, 100%, 50%, 0.965)";
    #HIGHLIGHT_COLOR   = "white";
    #NORM_FONT_SETTINGS = "bold 22pt VT323";
    #MID_FONT_SETTINGS  = "bold 92pt VT323";
    #BIG_FONT_SETTINGS  = "bold 102pt VT323";
    #SCORE_TITLE_FONT = "bold 32pt VT323";
    #SCORE_LIST_FONT =  "bold 20pt VT323";

    get DEBUG_TEXT_COLOR()   { return this.#DEBUG_TEXT_COLOR; }
    get FONT_COLOR()         { return this.#FONT_COLOR; }
    get HIGHLIGHT_COLOR()    { return this.#HIGHLIGHT_COLOR; }
    get NORM_FONT_SETTINGS() { return this.#NORM_FONT_SETTINGS; }
    get MID_FONT_SETTINGS()  { return this.#MID_FONT_SETTINGS; }
    get BIG_FONT_SETTINGS()  { return this.#BIG_FONT_SETTINGS; }

    get SCORE_TITLE_FONT()  { return this.#SCORE_TITLE_FONT; }
    get SCORE_LIST_FONT()  { return this.#SCORE_LIST_FONT; }

    // =======================================================
    // AUDIO
    // =======================================================
    #POOLSIZE = 5;
    #VOLUME   = 1.0;

    #PRIORITY_LOSE_DELAYED = 80;
    #PRIORITY_WIN          = 90;
    #PRIORITY_LOSE         = 90;
    #PRIORITY_TIMEOUT      = 95;
    #PRIORITY_LIFE         = 100;

    get POOLSIZE() { return this.#POOLSIZE; }
    get VOLUME()   { return this.#VOLUME; }

    get PRIORITY_LOSE_DELAYED() { return this.#PRIORITY_LOSE_DELAYED; }
    get PRIORITY_WIN()          { return this.#PRIORITY_WIN; }
    get PRIORITY_LOSE()         { return this.#PRIORITY_LOSE; }
    get PRIORITY_TIMEOUT()      { return this.#PRIORITY_TIMEOUT; }
    get PRIORITY_LIFE()         { return this.#PRIORITY_LIFE; }

    // =======================================================
    // MAP / LEVEL
    // =======================================================
    #MAP_BUFFER_X  = 60;
    #MAP_BUFFER_Y  = 70;
    #NUM_MAP_X_TILES = 36;
    #NUM_MAP_Y_TILES = 20;
    #MAP_TILE_WIDTH  = MAP_TILE_SIZE.w;
    #MAP_TILE_HEIGHT = MAP_TILE_SIZE.h;
    #MAX_GOAL_PLACEMENT_ATTEMPTS = 25;
    #EVEN_LEVEL_EMPTY_CHANCE_BONUS = 0.02;

    get MAP_BUFFER_X()  { return this.#MAP_BUFFER_X; }
    get MAP_BUFFER_Y()  { return this.#MAP_BUFFER_Y; }
    get NUM_MAP_X_TILES() { return this.#NUM_MAP_X_TILES; }
    get NUM_MAP_Y_TILES() { return this.#NUM_MAP_Y_TILES; }
    get MAP_TILE_WIDTH()  { return this.#MAP_TILE_WIDTH; }
    get MAP_TILE_HEIGHT() { return this.#MAP_TILE_HEIGHT; }
    get MAX_GOAL_PLACEMENT_ATTEMPTS() { return this.#MAX_GOAL_PLACEMENT_ATTEMPTS; }
    get EVEN_LEVEL_EMPTY_CHANCE_BONUS() { return this.#EVEN_LEVEL_EMPTY_CHANCE_BONUS; }

    // =======================================================
    // SCORING
    // =======================================================
    #VALUE_FOR_GETTING_GOAL      = 10;
    #VALUE_FOR_UNIT_OF_TIME_LEFT = 5;
    #VALUE_FOR_WINNING_LEVEL     = 100;
    #VALUE_WHEN_NEW_LIFE_AWARDED = 1000;

    get VALUE_FOR_GETTING_GOAL()      { return this.#VALUE_FOR_GETTING_GOAL; }
    get VALUE_FOR_UNIT_OF_TIME_LEFT() { return this.#VALUE_FOR_UNIT_OF_TIME_LEFT; }
    get VALUE_FOR_WINNING_LEVEL()     { return this.#VALUE_FOR_WINNING_LEVEL; }
    get VALUE_WHEN_NEW_LIFE_AWARDED() { return this.#VALUE_WHEN_NEW_LIFE_AWARDED; }
}