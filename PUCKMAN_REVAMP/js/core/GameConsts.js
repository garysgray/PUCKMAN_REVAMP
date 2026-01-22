// -----------------------------
// GameConsts.js
// -----------------------------
// Purpose:
// Global game constants exposed safely via getters.
// -----------------------------

class GameConsts 
{
    // ---- Private fields ----

    // Screen dimensions
    #SCREEN_WIDTH = 1000
    #SCREEN_HEIGHT = 600

    // Timing
    #SHOOT_COOLDOWN = 0.2       // seconds (~200ms)

    // Game amounts
    #GAME_LIVES_START_AMOUNT = 3
    #HUD_BUFFER = 0.045

    // UI settings
    #DEBUG_TEXT_COLOR = "yellow"
    #FONT_COLOR = "hsla(49, 100%, 50%, 0.965)"
    #FONT_SETTINGS = "bold 20pt VT323"

    // Sound
    #POOLSIZE = 5
    #VOLUME = 1.0

    // Map / Level
    #MAP_BUFFER_X = 60
    #MAP_BUFFER_Y = 70
    #NUM_MAP_X_TILES = 36
    #NUM_MAP_Y_TILES = 20
    #MAP_TILE_WIDTH = MAP_TILE_SIZE.w
    #MAP_TILE_HEIGHT = MAP_TILE_SIZE.h
    #LEVEL_MAX_TIME = 60

    // ---- Getters ----

    get SCREEN_WIDTH() { return this.#SCREEN_WIDTH }
    get SCREEN_HEIGHT() { return this.#SCREEN_HEIGHT }

    get GAME_LIVES_START_AMOUNT() { return this.#GAME_LIVES_START_AMOUNT }
    get HUD_BUFFER() { return this.#HUD_BUFFER }

    get SHOOT_COOLDOWN() { return this.#SHOOT_COOLDOWN }
    get DEBUG_TEXT_COLOR() { return this.#DEBUG_TEXT_COLOR }
    get FONT_SETTINGS() { return this.#FONT_SETTINGS }
    get FONT_COLOR() { return this.#FONT_COLOR }

    get POOLSIZE() { return this.#POOLSIZE }
    get VOLUME() { return this.#VOLUME }

    get MAP_BUFFER_X() { return this.#MAP_BUFFER_X }
    get MAP_BUFFER_Y() { return this.#MAP_BUFFER_Y }

    get NUM_MAP_X_TILES() { return this.#NUM_MAP_X_TILES }
    get NUM_MAP_Y_TILES() { return this.#NUM_MAP_Y_TILES }

    get MAP_TILE_WIDTH() { return this.#MAP_TILE_WIDTH }
    get MAP_TILE_HEIGHT() { return this.#MAP_TILE_HEIGHT }

    get LEVEL_MAX_TIME() { return this.#LEVEL_MAX_TIME }
}
