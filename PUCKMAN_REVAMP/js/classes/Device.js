// ============================================================================
//  DEVICE CLASS - Manages canvas, rendering, input tools (mouse/keyboard)
// ============================================================================

class Device 
{
    #canvas;
    #ctx;

    #images;
    #audio;
    #keys;

    constructor(width, height, canvasEl = null) 
    {
        try
        {
            // Use passed canvas element or fallback to document.getElementById
            this.#canvas = canvasEl || document.getElementById("canvas");

            if (!this.#canvas) 
            {
                console.warn("Canvas element not found; using dummy canvas for test.");
                // dummy canvas for testing
                this.#canvas = { width, height, getContext: () => ({ 
                    drawImage: () => {}, fillText: () => {}, measureText: () => ({ width: 0 }), 
                    save: () => {}, restore: () => {}, strokeRect: () => {}, fillRect: () => {} 
                })};
            }

            this.#ctx = this.#canvas.getContext("2d") || {};
            this.#canvas.width = width;
            this.#canvas.height = height;

            //this.#mouseDown = false;
            this.#images = (typeof ObjHolder !== "undefined") ? new ObjHolder() : { addObject: () => {} };
            this.#audio = (typeof AudioPlayer !== "undefined") ? new AudioPlayer() : { addSound: () => {} };
            this.#keys = (typeof KeyManager !== "undefined") ? new KeyManager() : { clearFrameKeys: () => {} };

        } 
        catch (err) 
        {
            console.error("Device initialization failed:", err.message);
            throw err;
        }
    }

    // -----------------------------
    // Getters
    // -----------------------------
    get canvas() { return this.#canvas; }
    get ctx() { return this.#ctx; }
    get images() { return this.#images; }
    get audio() { return this.#audio; }
    get keys() { return this.#keys; }


    renderImage(aImageOrSprite, aX = 0, aY = 0, w, h) 
    {
        try 
        {
            if (!aImageOrSprite) return;
            const img = aImageOrSprite.image ?? aImageOrSprite;
            if (typeof w === "number" && typeof h === "number") 
            {
                this.#ctx.drawImage(img, aX, aY, w, h);
            }
            else 
            {
                this.#ctx.drawImage(img, aX, aY);
            }
        } 
        catch (err) 
        {
            console.warn("renderImage failed:", err.message);
        }
    }

    renderClip(aClip, aPosX, aPosY, aWidth, aHeight, aState = 0) 
    {
        try 
        {
            this.#ctx.drawImage(
                aClip,
                aState * aWidth,
                0,
                aWidth,
                aHeight,
                aPosX - aWidth * 0.5,
                aPosY - aHeight * 0.5,
                aWidth,
                aHeight
            );
        } 
        catch (err) 
        {
            console.warn("renderClip failed:", err.message);
        }
    }
    
    centerImage(aImage, aPosX, aPosY) 
    {
        try 
        {
            const img = aImage.image ?? aImage;
            if (!img) return;
            this.#ctx.drawImage(img, aPosX - img.width * 0.5, aPosY - img.height * 0.5);
        }
         catch (err) 
        {
            console.warn("centerImage failed:", err.message);
        }
    }

    putText(aString, x, y) 
    {
        try { this.#ctx.fillText(aString, x, y); } 
        catch { /* ignore */ }
    }

    centerTextOnY(text, posY) 
    {
        try 
        {
            const textWidth = this.#ctx.measureText(text).width;
            const centerX = (this.#canvas.width - textWidth) * 0.5;
            this.#ctx.fillText(text, centerX, posY);
        } 
        catch 
        { /* ignore */ }
    }

    colorText(color) 
    {
        try { this.#ctx.fillStyle = color.toString(); } 
        catch { /* ignore */ }
    }

    setFont(font) 
    {
        try { this.#ctx.font = font.toString(); } 
        catch { /* ignore */ }
    }

    debugText(text, posX, posY, color = "white") 
    {
        try 
        {
            this.setFont("24px Arial Black");
            this.colorText(color);
            this.putText(text.toString() ?? "", posX, posY);
        } 
        catch
        { /* ignore */ }
    }
}