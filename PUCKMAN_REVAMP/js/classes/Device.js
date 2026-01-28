// ============================================================================
// DEVICE CLASS
// Manages canvas, rendering, audio, and input
// ============================================================================

class Device 
{
    #canvas;
    #ctx;

    #images;
    #audio;
    #keys;

    constructor(width, height) 
    {
        this.#canvas =  document.getElementById("canvas");

        this.#canvas.width  = width;
        this.#canvas.height = height;

        this.#ctx = this.#canvas.getContext("2d") || {};

        // Core subsystems 
        this.#images = new ObjHolder();
        this.#audio  = new AudioPlayer();
        this.#keys   = new KeyButtonManager();
    }

    // ------------------------------------------------------------------------
    // Getters
    // ------------------------------------------------------------------------
    get canvas() { return this.#canvas; }
    get ctx()    { return this.#ctx; }
    get images() { return this.#images; }
    get audio()  { return this.#audio; }
    get keys()   { return this.#keys; }

    // ------------------------------------------------------------------------
    // Rendering helpers
    // ------------------------------------------------------------------------
    renderImage(imageOrSprite, x = 0, y = 0, w, h) 
    {
        if (!imageOrSprite) return;

        const img = imageOrSprite.image ?? imageOrSprite;
        if (!img) return;

        if (Number.isFinite(w) && Number.isFinite(h)) 
        {
            this.#ctx.drawImage(img, x, y, w, h);
        } 
        else 
        {
            this.#ctx.drawImage(img, x, y);
        }
    }

    renderClip(clip, x, y, w, h, state = 0) 
    {
        if (!clip) return;

        this.#ctx.drawImage(
            clip,
            state * w,
            0,
            w,
            h,
            x - w * 0.5,
            y - h * 0.5,
            w,
            h
        );
    }

    centerImage(imageOrSprite, x, y) 
    {
        const img = imageOrSprite?.image ?? imageOrSprite;
        if (!img) return;

        this.#ctx.drawImage(
            img,
            x - img.width * 0.5,
            y - img.height * 0.5
        );
    }

    // ------------------------------------------------------------------------
    // Text helpers
    // ------------------------------------------------------------------------
    putText(text, x, y) 
    {
        this.#ctx.fillText(text, x, y);
    }

    centerTextOnY(text, y) 
    {
        const textWidth = this.#ctx.measureText(text).width;
        const x = (this.#canvas.width - textWidth) * 0.5;
        this.#ctx.fillText(text, x, y);
    }

    setTextColor(color) 
    {
        this.#ctx.fillStyle = color;
    }

    setFont(font) 
    {
        this.#ctx.font = font;
    }

    debugText(text, x, y, color = "white") 
    {
        this.setFont("24px Arial Black");
        this.setTextColor(color);
        this.putText(String(text), x, y);
    }

    // ------------------------------------------------------------------------
    // Asset loading
    // ------------------------------------------------------------------------
    setImagesForType(typeDefs, callback) 
    {
        Object.values(typeDefs).forEach(def => 
        {
            if (!def.path) return;

            const sprite = new Sprite(def.path, def.type);
            this.#images.addObject(sprite);

            if (typeof callback === "function") 
            {
                callback(def, sprite);
            }
        });
    }
}
