// ============================================================================
// AUDIO PLAYER & SOUND CLASS (Modern Robust Version)
// ============================================================================

class Sound 
{
    #name;
    #src;
    #volume;
    #pool;
    #index;
    #poolSize;

    constructor(name, src, poolSize = 1, volume = 1) 
    {
        this.#name = name;
        this.#src = src;
        this.#volume = volume;
        this.#index = 0;
        this.#poolSize = Math.max(1, poolSize);
        this.#pool = [];

        // Preload audio pool
        for (let i = 0; i < this.#poolSize; i++) 
        {
            const audio = new Audio(this.#src);
            audio.preload = "auto";
            audio.volume = this.#volume;
            this.#pool.push(audio);
        }
    }

    get name() { return this.#name; }

    // Play the sound
    play() 
    {
        try 
        {
            let audio = this.#pool[this.#index];

            // Allow overlap by cloning
            if (!audio.paused) 
            {
                audio = audio.cloneNode(true);
            }

            audio.volume = this.#volume;
            audio.currentTime = 0;

            audio.play().catch(() => {}); // <-- swallow aborts

            this.#index = (this.#index + 1) % this.#poolSize;
        } 
        catch (err) 
        {
            console.error(`Failed to play sound "${this.#name}":`, err);
        }
    }

    isPlaying() 
    {
        return this.#pool.some(audio => !audio.paused && !audio.ended);
    }

    stopAll() 
    {
        this.#pool.forEach(a =>         
        {
            try 
            {
                a.pause();
                a.currentTime = 0;
            } 
            catch {}
        });
    }
}

class AudioPlayer 
{
    #sounds;

    #gameState;
    #lastPlayTime;
    #currentPriority;

    #MIN_GAP_MS = 120;

    constructor() 
    {
        this.#sounds = new ObjHolder();

        this.#gameState = "PLAY";
        this.#lastPlayTime = 0;
        this.#currentPriority = -1;
    }

    setAudioGameState(state)
    {
        this.#gameState = state;
        this.#currentPriority = -1;
    }

    addSound(name, src, poolSize = 1, volume = 1) 
    {
        if (!name || !src) return;

        try 
        {
            const sound = new Sound(name, src, poolSize, volume);
            this.#sounds.addObject(sound);
        } 
        catch (err) 
        {
            console.error(`Failed to add sound "${name}":`, err);
        }
    }

    getSound(name) 
    {
        return this.#sounds.getObjectByName(name);
    }

    requestSound(aSound, priority = 0, allowedStates = ["PLAY"])
    {
        if (!allowedStates.includes(this.#gameState)) return;

        const now = performance.now();

        if (
            priority < this.#currentPriority &&
            now - this.#lastPlayTime < this.#MIN_GAP_MS
        ) 
        {
            return;
        }

        const sound = this.getSound(aSound.name);
        if (!sound) return;

        sound.play();

        this.#currentPriority = priority;
        this.#lastPlayTime = now;
    }

    stopSound(aSound) 
    {
        const sound = this.getSound(aSound.name);
        if (sound) sound.stopAll();
    }

    stopAll() 
    {
        this.#sounds.forEach(sound => 
        {
            try { sound.stopAll(); } catch {}
        });
    }

    hasSound(name) 
    {
        return !!this.getSound(name);
    }

    removeSound(name) 
    {
        const sound = this.getSound(name);
        if (sound) this.#sounds.subObjectByName(name);
    }

    reloadSound(name, src, poolSize, volume) 
    {
        this.removeSound(name);
        this.addSound(name, src, poolSize, volume);
    }

    static loadSounds(device, game, soundTypes) 
    {
        Object.values(soundTypes).forEach(sndDef => 
        {
            if (sndDef.path) 
            {
                
                device.audio.addSound(
                    sndDef.name,
                    sndDef.path,
                    game.gameConsts.POOLSIZE,
                    sndDef.volume ?? 1
                );
            }
        });
    }
}
