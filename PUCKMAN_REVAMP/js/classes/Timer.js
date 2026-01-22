// ============================================================================
// TIMER CLASS
// ============================================================================

class Timer
{
    #name
    #duration;     // seconds for one cycle
    #timeLeft;     // countdown mode: seconds remaining
    #elapsedTime;  // countup mode: seconds elapsed
    #active;       // is the timer running?
    #mode;         // timerModes.COUNTDOWN or COUNTUP
    #loop;         // true = auto restart after finish

    constructor(name, durationSeconds = 0, mode = timerModes.COUNTDOWN, loop = false) 
    {
        this.#name = name;
        this.#duration = durationSeconds;
        this.#timeLeft = durationSeconds;
        this.#elapsedTime = 0;
        this.#active = false;
        this.#mode = mode;
        this.#loop = loop;
    }

    // --- Getters ---
    get name() { return this.#name; }
    get active() { return this.#active; }
    get timeLeft() { return Math.max(0, this.#timeLeft); }
    get elapsedTime() { return this.#elapsedTime; }
    get progress() {
        return this.#mode === timerModes.COUNTDOWN
            ? 1 - (this.#timeLeft / (this.#duration || 1))
            : (this.#duration ? Math.min(1, this.#elapsedTime / this.#duration) : 0);
    }

    // --- Control ---
    start() 
    {
        if (this.#mode === timerModes.COUNTDOWN) 
        {
            this.#timeLeft = this.#duration;
        } 
        else 
        {
            this.#elapsedTime = 0;
        }
        this.#active = true;
    }

    stop() 
    {
        this.#active = false;
    }

    // reset now explicitly sets duration, mode, and loop
    reset(durationSeconds = this.#duration, mode = this.#mode, loop = this.#loop) 
    {
        this.#duration = durationSeconds;
        this.#mode = mode;
        this.#loop = loop;
        this.start();
    }

    // update returns true on a "tick/finish" moment
    update(delta) 
    {
        if (!this.#active) return false;

        if (this.#mode === timerModes.COUNTDOWN) 
        {
            this.#timeLeft -= delta;
            if (this.#timeLeft <= 0) {
                if (this.#loop) 
                {
                    // restart but preserve slight overflow
                    this.#timeLeft += this.#duration;
                } else {
                    this.#active = false;
                }
                return true;
            }
        } 
        else 
        { // COUNTUP
            this.#elapsedTime += delta;
            if (this.#loop && this.#duration > 0 && this.#elapsedTime >= this.#duration) 
            {
                this.#elapsedTime -= this.#duration;
                return true;
            }
        }
        return false;
    }

    // Formatted MM:SS
    get formatted() 
    {
        const total = Math.floor(this.#timeLeft);
        const minutes = Math.floor(total / 60);
        const seconds = total % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
}