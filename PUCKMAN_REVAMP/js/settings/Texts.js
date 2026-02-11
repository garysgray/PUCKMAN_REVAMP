
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
        KEYBOARD_INSTRUCTIONS: 
        [
            "USE ARROW KEYS TO MOVE", 
            "PRESS SPACE-BAR TO START",
            "PRESS CTRL TO PAUSE",
        ],

        GAMEPAD_INSTRUCTIONS: 
        [
            "USE LEFT ANALOG TO MOVE", 
            "PRESS START BUTTON TO BEGIN",
            "PRESS SELECT BUTTON TO PAUSE",
        ],

        DEFAULT_INSTRUCTIONS:
        [
            "GET ALL THE FRUIT ",
            "DON'T RUN OUT OF TIME",
            "PRESS F FOR FULLSCREEN",
            "10 POINTS FOR EVERY FRUIT",
            "100 POINTS TO CLEAR LEVEL",
            "5 POINTS FOR EVERY SECOND LEFT ON CLOCK",
            "1000 POINTS = NEW LIFE",
        ],  

        HTML_DEFAULT_INSTRUCTIONS: "PRESS Q TO ENABLE GAMEPAD",

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
    },

    HIGH_SCORE: 
    {
        KEYBOARD_INSTRUCTIONS: 
        [ 
                "UP & DOWN ARROWS TO CHANGE INITIALS",
                "LEFT & RIGHT ARROWS TO CHANGE POSITION",
                "ENTER KEY TO SUBMIT, SPACE-BAR TO SKIP",
        ],

        GAMEPAD_INSTRUCTIONS: 
        [
                "UP & DOWN ANALOG TO CHANGE INITIALS",
                "LEFT & RIGHT ANALOG TO CHANGE POSITION",
                "ACTION BUTTON TO SUBMIT, START TO SKIP"
        ],

        TOP_SCORE_TITLE: "TOP SCORES  ",
    
    }
};

Object.freeze(gameTexts);



