// =======================================================
// GameEnums.js
// -------------------------------------------------------
// Purpose:
// Immutable enumerations
// =======================================================

// These are typical game states
const gameStates = 
{
    INIT: 0,
    PLAY: 1,
    PAUSE: 2,
    WIN: 3,
    LOSE: 4
};

 // These are to help enemy render the right clip for current direction
const enemyPlayStates = 
{ 
    RIGHT:0, 
    DOWN:1, 
    LEFT:2, 
    UP:3 
};

// These are to help the player render the right clip for current direction
const playStates = 
{ 
    UP:0,
    UP_RIGHT: 1,
    RIGHT:2,  
    DOWN_RIGHT: 3, 
    DOWN: 4,
    DOWN_LEFT: 5,
    LEFT: 6,
    UP_LEFT: 7
};

// These are enemy behavior states
const behaveStates = 
{ 
    ROAM:0, 
    FOLLOW:1, 
    RUN:2, 
    STOP:3 
};

// These are 2 diff modes a timer can be
const timerModes = 
{
     COUNTDOWN:"countdown", 
     COUNTUP:"countup" 
};

// Only clock used in game at this time
// const timerTypes = 
// { 
//      GAME_CLOCK:"gameClock" 
     
// };

const timerTypes = 
{ 
     GAME_CLOCK:  { name: "gameClock", duration: 60, timerMode: timerModes.COUNTDOWN },  
     PLAY_DELAY:  { name: "playDelay", duration: .5, timerMode: timerModes.COUNTDOWN },     
};

Object.freeze(gameStates);
Object.freeze(enemyPlayStates);
Object.freeze(playStates);
Object.freeze(behaveStates);
Object.freeze(timerModes);
Object.freeze(timerTypes);


// const soundTypes = 
// {
//     GAME_CLOCK:     { name: "gameClock", timerMode: COUNTDOWN },
//     HURT:    { name: "hurt",    path: "assets/sounds/hurt.wav" },
// };

