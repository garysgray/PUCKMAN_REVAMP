// ============================================================================
// ScoreManager Class
// ----------------------------------------------------------------------------
// Handles all scoring logic including current score, high scores, extra lives,
// and player initial entry for the leaderboard.
// ============================================================================

class ScoreManager 
{
    #score;
    #nextExtraLifeScore;
    #highScoreAchieved;
    #topScores;
    #playerInitials;
    #gameConsts;

    constructor(gameConsts) 
    {
        this.#gameConsts = gameConsts;
        this.#score = 0;
        this.#nextExtraLifeScore = gameConsts.VALUE_WHEN_NEW_LIFE_AWARDED;
        this.#highScoreAchieved = false;
        
        // Load top scores from localStorage or use defaults
        this.#topScores = JSON.parse(localStorage.getItem("topScores")) ||
        [
            { name: "ACE", score: 10000 },
            { name: "MAX", score: 9000 },
            { name: "JET", score: 8000 },
            { name: "ZAP", score: 7000 },
            { name: "REX", score: 5000 },
            { name: "SKY", score: 3000 },
            { name: "FOX", score: 1000 },
            { name: "RAY", score: 900 },
            { name: "VIX", score: 700 },
            { name: "ROC", score: 200 }
        ];

        this.#playerInitials = 
        {
            letters: ['A', 'A', 'A'],
            position: 0
        };
    }

    // ========================================
    // Getters
    // ========================================
    get score() { return this.#score; }
    get highScoreAchieved() { return this.#highScoreAchieved; }
    get nextExtraLifeScore() { return this.#nextExtraLifeScore; }
    get topScores() { return this.#topScores; }
    get playerInitials() { return this.#playerInitials; }

    // ========================================
    // Setters
    // ========================================
    set score(v) { this.#score = v; }
    set highScoreAchieved(v) { this.#highScoreAchieved = v; }
    set nextExtraLifeScore(v) { this.#nextExtraLifeScore = v; }

    // ========================================
    // Score Management
    // ========================================

    increaseScore(amount) 
    {
        if (amount <= 0) return 0;

        this.#score += amount;
        
        // Count how many thresholds we crossed
        let livesEarned = 0;
        while (this.#score >= this.#nextExtraLifeScore) 
        {
            this.#nextExtraLifeScore += this.#gameConsts.VALUE_WHEN_NEW_LIFE_AWARDED;
            livesEarned++;
        }
        
        return livesEarned;
    }
    // Calculate bonus points based on time remaining
    calculateTimeBonus(timeLeft)
    {
        return Math.floor(timeLeft * this.#gameConsts.VALUE_FOR_UNIT_OF_TIME_LEFT);
    }

    // Reset score and related values for new game
    resetScore() 
    {
        this.#score = 0;
        this.#nextExtraLifeScore = this.#gameConsts.VALUE_WHEN_NEW_LIFE_AWARDED;
        this.#highScoreAchieved = false;
    }

    // ========================================
    // High Score Management
    // ========================================

    // Check if current score qualifies for top 10
    isHighScore() 
    {
        if (this.#topScores.length < 10) return true;
        return this.#score > this.#topScores[this.#topScores.length - 1].score;
    }

    // Add score to leaderboard and persist to localStorage
    addTopScore(name) 
    {
        this.#topScores.push({ name, score: this.#score });
        this.#topScores.sort((a, b) => b.score - a.score); // Sort descending
        
        if (this.#topScores.length > 10) 
        {
            this.#topScores.pop(); // Keep only top 10
        }
        
        localStorage.setItem("topScores", JSON.stringify(this.#topScores));
    }

    // Record current score with player initials
    recordScore() 
    {
        const playerName = this.#playerInitials.letters.join('');
        this.addTopScore(playerName);
    }

    // Print leaderboard to console (for debugging)
    printTopScores()
    {
        console.log("=== TOP SCORES ===");
        this.#topScores.forEach((entry, index) =>
        {
            console.log(`${index + 1}. ${entry.name} - ${entry.score}`);
        });
    }

    // ========================================
    // Player Initials Management
    // ========================================

    // Reset player initials to default
    resetInitials() 
    {
        this.#playerInitials.letters = ['A', 'A', 'A'];
        this.#playerInitials.position = 0;
    }

    // Cycle current letter up or down through alphabet
    cycleCurrentLetter(direction)
    {
        const pos = this.#playerInitials.position;
        const currentLetter = this.#playerInitials.letters[pos];
        this.#playerInitials.letters[pos] = this.cycleLetter(currentLetter, direction);
    }

    // Move to next initial position
    moveToNextPosition()
    {
        this.#playerInitials.position = (this.#playerInitials.position + 1) % 3;
    }

    // Move to previous initial position
    moveToPreviousPosition()
    {
        this.#playerInitials.position = (this.#playerInitials.position - 1 + 3) % 3;
    }

    // Cycle a letter through the alphabet
    cycleLetter(letter, direction)
    {
        const A = 'A'.charCodeAt(0);
        const Z = 'Z'.charCodeAt(0);

        let code = letter.charCodeAt(0) + direction;

        if (code > Z) code = A;
        if (code < A) code = Z;

        return String.fromCharCode(code);
    }
}