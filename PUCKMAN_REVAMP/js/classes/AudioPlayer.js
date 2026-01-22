// ============================================================================
// AUDIO PLAYER W/ SOUND CLASS
// ============================================================================

class Sound
{
    #name;
    #volume
    #src;
    #pool;
    #index;
    #poolSize;

    constructor(name, src, poolSize, volume)
    {
        this.#name = name;
        this.#src = src;
        this.#volume = volume;
        this.#pool = [];
        this.#index = 0;
        this.#poolSize = Math.max(1, poolSize); // never <1
     

        // preload audio pool
        try 
        {
            for (let i = 0; i < this.#poolSize; i++) 
            {
                const audio = new Audio(this.#src);
                audio.preload = "auto";
                audio.volume = this.#volume;
                this.#pool.push(audio);
            }
        } 
        catch (err) 
        { 
            console.warn("Sound pool creation failed:", name, err.message); 
        }
    }

    get name() { return this.#name; }
    
    play() 
    {
        try 
        {
            let audio = this.#pool[this.#index];
            if (!audio.paused) audio = audio.cloneNode(true);
            audio.volume = this.#volume;
            audio.currentTime = 0;
            audio.play();
            this.#index = (this.#index + 1) % this.#poolSize;
        } 
        catch {}
    }

    stopAll() 
    { 
        this.#pool.forEach(a => { try { a.pause(); a.currentTime = 0; } catch {} }); 
    }
}

class AudioPlayer
 {
    #sounds;

    constructor()
    {
        this.#sounds = new ObjHolder();
    }

    addSound(name, src, poolSize = 1, volume = 1) 
    {
        try { if (!name || !src) return; this.#sounds.addObject(new Sound(name, src, poolSize, volume)); } catch {}
    }

    getSound(name) 
    {
        return this.#sounds.getObjectByName(name);
    }

    playSound(name) 
    {
        const sound = this.getSound(name);
        if (!sound) {
            console.warn(`Sound "${name}" not found`);
            return;
        }

        try {
            sound.play();
        } 
        catch (e) 
        {
            console.error(`Failed to play sound "${name}":`, e);
        }
    }

    stopSound(name) 
    {
        const sound = this.getSound(name);
        if (sound) {
            try 
            {
                sound.stopAll();
            } 
            catch (e) 
            {
                console.error(`Failed to stop sound "${name}":`, e);
            }
        }
    }

    stopAll() 
    {
        this.#sounds.forEach(sound => {
            try 
            {
                sound.stopAll();
            } 
            catch (e) 
            {
                console.error(`Failed to stop a sound:`, e);
            }
        });
    }

    hasSound(name) { return !!this.getSound(name); }
 }
