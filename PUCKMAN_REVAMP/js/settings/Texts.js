
// =======================================================
// GameTexts.js
// -------------------------------------------------------
// Purpose:
// Immutable  game texts
// =======================================================

gameTexts = 
{
    INIT: 
    {
        INSTRUCTIONS: 
        [
                "GET ALL THE FRUIT ",
                "DON'T RUN OUT OF TIME",
                "USE ARROW KEYS TO MOVE", 
                "PRESS SPACE-BAR TO START",
                "PRESS CTRL TO PAUSE",
        ],

        GAMEPAD_INSTRUCTIONS: 
        [
                "GET ALL THE FRUIT ",
                "DON'T RUN OUT OF TIME",
                "USE LEFT ANALOG TO MOVE", 
                "PRESS START BUTTON TO BEGIN",
                "PRESS SELECT BUTTON TO PAUSE",
        ],

        HTML_DEFAULT_INSTRUCTIONS: "PRESS Q TO ENABLE/DISABLE GAMEPAD",
    },

    HUD: 
    {
        SCORE: "Score: ",
        LIVES: "Lives: ",
        LEVEL: "Level: ",
    },

    PAUSE: 
    {
        MESSAGE: "PRESS  CTRL  TO  RESUME  GAME",
        GAMEPAD_MESSAGE: "PRESS  SELECT  BUTTON TO  RESUME  GAME"
    },

    WIN: 
    {
        MESSAGE: "PRESS  SPACE-BAR  TO  CONTINUE",
        GAMEPAD_MESSAGE: "PRESS  SELECT BUTTON  TO  CONTINUE",
    },

    LOSE: 
    {
        LOSE_MESSAGE: "YOU  LOST,  SPACE-BAR  TO  RETRY",
        DIE_MESSAGE: "YOU  DIED,  SPACE-BAR  TO  REVIVE  ",
        OUT_OF_TIME: "OUT OF TIME,  SPACE-BAR  TO  REVIVE  ",
        
        GAMEPAD_LOSE_MESSAGE: "YOU  LOST,  SELECT BUTTON TO GO BACK TO START",
        GAMEPAD_DIE_MESSAGE: "YOU  DIED,  START BUTTON  TO  REVIVE  ",
        GAMEPAD_OUT_OF_TIME: "OUT OF TIME,  START BUTTON  TO  REVIVE  ",

        HIGH_SCORE: "NEW HIGH SCORE!!!",
        INITIALS_REQUEST:   "ENTER YOUR INITIALS",
    }
};

Object.freeze(gameTexts);