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


    constructor(name, src, poolSize = 1, volume = 1 ) 
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


    //Play the sound
    //@param {number} volume Optional volume override (0-1)
    play(volume = this.#volume) 
    {
        try 
        {
            let audio = this.#pool[this.#index];

          
                //if (!audio.paused) return; //  key difference
            
                // If audio is still playing, clone a new one to allow overlap
                if (!audio.paused) audio = audio.cloneNode(true);
            

            audio.volume = volume;
            audio.currentTime = 0;
            audio.play();

            this.#index = (this.#index + 1) % this.#poolSize;
        } catch (err) 
        {
            console.error(`Failed to play sound "${this.#name}":`, err);
        }
    }

    isPlaying() 
    {
        return this.#pool.some(audio => !audio.paused && !audio.ended);
    }

    stop()
    {

    }
    stopAll() 
    {
        this.#pool.forEach(a =>         
        {
            try 
            {
                a.pause();
                a.currentTime = 0;
            } catch {}
        });
    }
}

class AudioPlayer 
{
    #sounds;

    constructor() 
    {
        this.#sounds = new ObjHolder();
    }

    // Add a sound to the player
    addSound(name, src,  poolSize = 1, volume = 1) 
    {
        if (!name || !src) return;
        try 
        {
            const sound = new Sound(name, src, poolSize, volume);
            this.#sounds.addObject(sound);
        } catch (err) 
        {
            console.error(`Failed to add sound "${name}":`, err);
        }
    }

    // Retrieve a sound by name
    getSound(name) 
    {
        return this.#sounds.getObjectByName(name);
    }

    // Play a sound by name, optionally overriding volume
    playSound(aSound, volume) 
    {
        const sound = this.getSound(aSound.name);
        if (!sound) 
        {
            console.warn(`Sound "${aSound.name}" not found`);
            return;
        }
        sound.play(volume);
    }

    // Stop a specific sound
    stopSound(aSound) 
    {
        const sound = this.getSound(aSound.name);
        if (sound) sound.stopAll();
    }

    // Stop all sounds in the audio player
    stopAll() 
    {
        this.#sounds.forEach(sound => 
        {
            try { sound.stopAll(); } catch {}
        });
    }

    //Check if a sound exists
    hasSound(name) 
    {
        return !!this.getSound(name);
    }

    // Remove a sound by name
    removeSound(name) 
    {
        const sound = this.getSound(name);
        if (sound) this.#sounds.subObjectByName(name);
    }

    // Reload a sound by name (recreates the pool)
    reloadSound(name, src, poolSize, volume) 
    {
        this.removeSound(name);
        this.addSound(name, src, poolSize, volume);
    }

    // Load a batch of sounds
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
                    game.gameConsts.VOLUME
                );
            }
        });
    }
}
