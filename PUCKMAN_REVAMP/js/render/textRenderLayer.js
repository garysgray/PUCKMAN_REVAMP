// ============================================================================
// Text Rendering Layer
// ----------------------------------------------------------------------------
// Handles all on-screen text rendering (instructions, pause/win/lose messages,
// high scores, etc). Purely visual; no game logic here.
// ============================================================================
function renderTextLayer(device, game, opts) 
{
    try 
    {
        // Destructure passed options
        const { screenWidth: cw, screenHeight: ch, hudBuff, normFont, midFont, bigFont, highlightColor, fontColor } = opts;
        const chw = cw / 2;

        // Layout positions for different text elements
        const layout = 
        {
            initTextY: [0.60, 0.67, 0.74, 0.81, 0.88],

            highScoreTextY: [0.74, 0.81, 0.88],

            highScores: 
            {
                titleY: 0.13,
                startY: 0.18,
                lineHeight: 0.04,
                leftColumnX: 0.25,
                rightColumnX: 0.65,
                columnOffset: -50,
                scoreOffset: 0.15,
                maxDisplay: 10,
                splitAt: 5
            },
            pauseY: 0.62,
            winLoseY: 0.62,
            topScoreEntry: { scoreY: 0.30, initialsY: 0.40, initialsOffset: 0.8 }
        };

        // Set default text style
        device.setFont(normFont);
        device.setTextColor(fontColor);
        device.ctx.textAlign = "center";

        const mode = TextUtil.getInputMode(device);

        switch (game.gameState) 
        {
            case gameStates.INIT: 
            {
                const instructions = TextUtil.buildInitInstructions(device);
                TextUtil.renderInstructions(device, chw, ch, layout, instructions);
                TextUtil.renderHighScores(device, game, chw, ch, cw, layout);
                break;
            }

            case gameStates.PLAY:
                // No text overlay during gameplay
                break;

            case gameStates.PAUSE: 
            {
                const msg = TextUtil.getStateMessage(game, mode);
                if (msg) device.putText(msg, chw, ch * layout.winLoseY);

                // Optional high scores display
                if (game.gameState !== gameStates.WIN) 
                {
                    TextUtil.renderHighScores(device, game, chw, ch, cw, layout);
                }
                break;
            }

            case gameStates.WIN:
            case gameStates.LOSE: {
                const msg = TextUtil.getStateMessage(game, mode);
                if (msg) device.putText(msg, chw, ch * layout.winLoseY);
                break;
            }

            case gameStates.TOP_SCORE: 
            {
                // Render score
                device.setFont(midFont);
                device.putText(game.score, chw, ch * layout.topScoreEntry.scoreY);

                // Render player initials
                device.setFont(bigFont);
                const initials = game.scoreManager.playerInitials;
                const sampleMetrics = device.ctx.measureText(initials.letters[0]);
                const textWidth = sampleMetrics.width;
                const textHeight = sampleMetrics.actualBoundingBoxAscent + sampleMetrics.actualBoundingBoxDescent;
                const baseY = ch * layout.topScoreEntry.initialsY + textHeight * layout.topScoreEntry.initialsOffset;

                for (let i = 0; i < initials.letters.length; i++) 
                {
                    device.setTextColor(i === initials.position ? highlightColor : fontColor);
                    const x = chw + (i - 1) * textWidth;
                    device.putText(initials.letters[i], x, baseY);
                }

                // Render high score instructions
                device.setFont(normFont);
                device.setTextColor(fontColor);
                const instructions = TextUtil.buildHighScoreInstructions(device);
                TextUtil.renderInstructions(device, chw, ch, layout, instructions);
                break;
            }

            default:
                console.warn("Unknown game state in text layer:", game.gameState);
        }

    } catch (e) {
        console.error("Unexpected error in renderTextLayer:", e);
    }
}

// === Layer Registration ===
const textRenderLayer = new Layer("HUD/Text", renderTextLayer);
