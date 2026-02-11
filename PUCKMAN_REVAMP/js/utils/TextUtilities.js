// -----------------------------------------------------------------------------
// Input mode helper
// -----------------------------------------------------------------------------

const TextUtil = 
{
    // Generates a shimmer color for arcade-style effect
    getShimmerColor(baseColor, idx, time) 
    {
        // Option 1: Yellow-gold shimmer
        // const flicker = Math.sin(time + idx) * 55; // brightness swing
        // const r = Math.min(255, parseInt(baseColor.slice(1,3),16) + flicker);
        // const g = Math.min(255, parseInt(baseColor.slice(3,5),16) + flicker);
        // const b = Math.min(255, parseInt(baseColor.slice(5,7),16) + flicker);
        // return `rgb(${r},${g},${b})`;

        // Option 2: Rainbow shimmer
        const hue = (time * 50 + idx * 20) % 360; // cycles through hues over time
        return `hsl(${hue}, 100%, 60%)`;
    },


    getInputMode(device)
    {
        if (device.keys.gamePadConnected)
            return device.keys.gamePadEnabled ? "GAMEPAD" : "GAMEPAD_DISABLED";
            return "KEYBOARD";
    },

    // -----------------------------------------------------------------------------
    // Returns the correct message for PAUSE, WIN, or LOSE
    // -----------------------------------------------------------------------------
    getStateMessage(game, mode)
    {
        switch (game.gameState)
        {
            case gameStates.PAUSE:
                return mode === "GAMEPAD" ? gameTexts.PAUSE.GAMEPAD_MESSAGE : gameTexts.PAUSE.MESSAGE;

            case gameStates.WIN:
                return mode === "GAMEPAD" ? gameTexts.WIN.GAMEPAD_MESSAGE : gameTexts.WIN.MESSAGE;

            case gameStates.LOSE:
                if (game.highScoreAchived) return gameTexts.LOSE.HIGH_SCORE;

                const gameClock = game.gameTimers.getObjectByName(timerTypes.GAME_CLOCK.name);
                if (game.lives <= 0)
                    return mode === "GAMEPAD" ? gameTexts.LOSE.GAMEPAD_LOSE_MESSAGE : gameTexts.LOSE.LOSE_MESSAGE;

                if (gameClock.timeLeft === 0)
                    return mode === "GAMEPAD" ? gameTexts.LOSE.GAMEPAD_OUT_OF_TIME : gameTexts.LOSE.OUT_OF_TIME;

                return mode === "GAMEPAD" ? gameTexts.LOSE.GAMEPAD_DIE_MESSAGE : gameTexts.LOSE.DIE_MESSAGE;
        }

        return null;
    },

    // -----------------------------------------------------------------------------
    // Builds INIT instructions
    // -----------------------------------------------------------------------------
    buildInitInstructions(device)
    {
        const mode = this.getInputMode(device);
        const instructions = [...gameTexts.INIT.DEFAULT_INSTRUCTIONS];

        switch (mode)
        {
            case "GAMEPAD":
                instructions.splice(2, 0, ...gameTexts.INIT.GAMEPAD_INSTRUCTIONS);
                break;
            case "GAMEPAD_DISABLED":
                instructions.unshift(gameTexts.INIT.HTML_DEFAULT_INSTRUCTIONS);
                instructions.splice(2, 0, ...gameTexts.INIT.GAMEPAD_INSTRUCTIONS);
                break;
            case "KEYBOARD":
            default:
                instructions.splice(2, 0, ...gameTexts.INIT.KEYBOARD_INSTRUCTIONS);
                break;
        }

        return instructions;
    },

    // -----------------------------------------------------------------------------
    // Builds HIGH SCORE instructions
    // -----------------------------------------------------------------------------
    buildHighScoreInstructions(device)
    {
        return this.getInputMode(device) === "GAMEPAD"
            ? gameTexts.HIGH_SCORE.GAMEPAD_INSTRUCTIONS
            : gameTexts.HIGH_SCORE.KEYBOARD_INSTRUCTIONS;
    },

    // -----------------------------------------------------------------------------
    // Render instructions array
    // -----------------------------------------------------------------------------
    renderInstructions(device, chw, ch, layout, instructions)
    {
        layout.initTextY.forEach((pct, idx) => {
            if (instructions[idx])
                device.putText(instructions[idx], chw, ch * pct);
        });
    },

    // -----------------------------------------------------------------------------
    // Render top scores leaderboard
    // -----------------------------------------------------------------------------
    // -----------------------------------------------------------------------------
    renderHighScores(device, game, chw, ch, cw, layout)
    {
        // -------------------------------
        // Configurable shimmer & layout constants
        // -------------------------------
        const TITLE_SHIMMER_SPEED = 50;        // how fast the rainbow title cycles
        const LIST_SHIMMER_SPEED  = 2.5;       // speed of shimmer flowing down the list
        const LIST_SHIMMER_AMPLITUDE = 150;    // brightness swing for yellow
        const LIST_LINE_OFFSET = 0.8;          // phase offset between lines
        const BASE_YELLOW = { r: 255, g: 255, b: 0 }; // base color for high score list

        // -------------------------------
        // Draw the high score title
        // -------------------------------
        device.setFont(game.gameConsts.SCORE_TITLE_FONT);

        const shimmerTime = performance.now() * 0.002; // unified time for both title & list

        // Rainbow shimmer for the title
        const titleHue = (shimmerTime * TITLE_SHIMMER_SPEED) % 360;
        device.setTextColor(`hsl(${titleHue}, 100%, 60%)`);
        device.putText(gameTexts.HIGH_SCORE.TOP_SCORE_TITLE, chw, ch * layout.highScores.titleY);

        // -------------------------------
        // Draw the high score list
        // -------------------------------
        device.setFont(game.gameConsts.SCORE_LIST_FONT);
        const topScores = game.scoreManager.topScores.slice(0, layout.highScores.maxDisplay);

        topScores.forEach((score, idx) => 
        {
            const rank = idx + 1;
            const rankText = rank < 10 ? ` ${rank}.` : `${rank}.`;
            const name = score.name;
            const scoreValue = score.score;

            // Determine column and position
            const isLeftColumn = idx < layout.highScores.splitAt;
            const baseX = cw * (isLeftColumn ? layout.highScores.leftColumnX : layout.highScores.rightColumnX);
            const x = baseX + layout.highScores.columnOffset;
            const y = ch * (layout.highScores.startY + (idx % layout.highScores.splitAt) * layout.highScores.lineHeight);

            // -------------------------------
            // Flowing shimmer effect
            // -------------------------------
            const flicker = Math.sin(shimmerTime * LIST_SHIMMER_SPEED + idx * LIST_LINE_OFFSET) * LIST_SHIMMER_AMPLITUDE;

            // Apply flicker to base yellow
            const r = Math.min(255, Math.max(0, BASE_YELLOW.r + flicker));
            const g = Math.min(255, Math.max(0, BASE_YELLOW.g + flicker));
            const b = Math.min(255, Math.max(0, BASE_YELLOW.b + flicker));

            device.setTextColor(`rgb(${r},${g},${b})`);

            // -------------------------------
            // Draw name and score
            // -------------------------------
            device.ctx.textAlign = "left";
            device.putText(`${rankText} ${name}`, x, y);

            device.ctx.textAlign = "right";
            device.putText(scoreValue, x + cw * layout.highScores.scoreOffset, y);
        });

        device.ctx.textAlign = "center"; // restore default alignment
    },


};
