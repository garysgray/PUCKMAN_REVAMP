// ============================================================================
// Text Rendering Layer
// ----------------------------------------------------------------------------
// Handles all on-screen text rendering (instructions, pause/win/lose messages,
// high scores, etc). Purely visual, no game logic.
// ============================================================================
function renderTextLayer(device, game) 
{
    try 
    {
        const cw = game.gameConsts.SCREEN_WIDTH;
        const ch = game.gameConsts.SCREEN_HEIGHT;
        const chw = cw / 2;

        // Layout positions
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

        // Default text settings
        device.setFont(game.gameConsts.NORM_FONT_SETTINGS);
        device.setTextColor(game.gameConsts.FONT_COLOR);
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
                break; // No text during gameplay

            case gameStates.PAUSE:
            {
                const msg = TextUtil.getStateMessage(game, mode);
                if (msg) device.putText(msg, chw, ch * layout.winLoseY);

                // Render high scores for PAUSE / LOSE
                if (game.gameState !== gameStates.WIN)
                    TextUtil.renderHighScores(device, game, chw, ch, cw, layout);
                break;
            }
            
            case gameStates.WIN:
            case gameStates.LOSE:
                const msg = TextUtil.getStateMessage(game, mode);
                if (msg) device.putText(msg, chw, ch * layout.winLoseY);
                break;
            

            case gameStates.TOP_SCORE:
            {
                // Score display
                device.setFont(game.gameConsts.MID_FONT_SETTINGS);
                device.putText(game.score, chw, ch * layout.topScoreEntry.scoreY);

                // Player initials
                device.setFont(game.gameConsts.BIG_FONT_SETTINGS);
                const initials = game.scoreManager.playerInitials;
                const sampleMetrics = device.ctx.measureText(initials.letters[0]);
                const textWidth = sampleMetrics.width;
                const textHeight = sampleMetrics.actualBoundingBoxAscent + sampleMetrics.actualBoundingBoxDescent;
                const baseY = ch * layout.topScoreEntry.initialsY + textHeight * layout.topScoreEntry.initialsOffset;

                for (let i = 0; i < initials.letters.length; i++) 
                {
                    device.setTextColor(i === initials.position ? game.gameConsts.HIGHLIGHT_COLOR : game.gameConsts.FONT_COLOR);
                    const x = chw + (i - 1) * textWidth;
                    device.putText(initials.letters[i], x, baseY);
                }

                // Instructions
                device.setFont(game.gameConsts.NORM_FONT_SETTINGS);
                device.setTextColor(game.gameConsts.FONT_COLOR);
                const instructions = TextUtil.buildHighScoreInstructions(device);
                TextUtil.renderInstructions(device, chw, ch, layout, instructions);
                break;
            }

            default:
                console.warn("Unknown game state in text layer:", game.gameState);
        }
    } 
    catch (e) 
    {
        console.error("Unexpected error in renderTextLayer:", e);
    }
}
// Wrap in Layer object for controller integration
const textRenderLayer = new Layer("HUD/Text", renderTextLayer);

