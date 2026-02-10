// -----------------------------------------------------------------------------
// Input mode helper
// -----------------------------------------------------------------------------

const TextUtil = 
{
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
    renderHighScores(device, game, chw, ch, cw, layout)
    {
        device.setFont(game.gameConsts.SCORE_TITLE_FONT);
        device.putText(gameTexts.HIGH_SCORE.TOP_SCORE_TITLE, chw, ch * layout.highScores.titleY);

        device.setFont(game.gameConsts.SCORE_LIST_FONT);
        const topScores = game.scoreManager.topScores.slice(0, layout.highScores.maxDisplay);

        topScores.forEach((score, idx) => 
        {
            const rank = idx + 1;
            const rankText = rank < 10 ? ` ${rank}.` : `${rank}.`;
            const name = score.name;
            const scoreValue = score.score;

            const isLeftColumn = idx < layout.highScores.splitAt;
            const baseX = cw * (isLeftColumn ? layout.highScores.leftColumnX : layout.highScores.rightColumnX);
            const x = baseX + layout.highScores.columnOffset;
            const y = ch * (layout.highScores.startY + (idx % layout.highScores.splitAt) * layout.highScores.lineHeight);

            device.ctx.textAlign = "left";
            device.putText(`${rankText} ${name}`, x, y);

            device.ctx.textAlign = "right";
            device.putText(scoreValue, x + cw * layout.highScores.scoreOffset, y);
        });

        device.ctx.textAlign = "center";
    },

};
