// ============================================================================
// SPRITE CLASS - Holds the image so canvas can use it
// ============================================================================

class Sprite
{
    #image;
    #name;
	#loaded;

    constructor(src, name, x = 0, y = 0, width = null, height = null) 
	{
        this.#name = name;
		this.#loaded = false;

        try
        {
            this.#image = new Image();
            if(!this.#image) throw new Error("Image did not load");
            if (!src) throw new Error("Sprite source missing");
            this.#image.src = src;
            if (width) this.#image.width = width;
            if (height) this.#image.height = height;
            this.#image.onload = () => this.#loaded = true;
        }
        catch (err)
        {
             console.warn("Sprite init failed:", err.message); 
        }
    }

    // --- Getters ---
    get name() { return this.#name; }
    get image() { return this.#image; }
    get width() { return this.#image.width; }
    get height() { return this.#image.height; }
    get loaded() { return this.#loaded; }
}
