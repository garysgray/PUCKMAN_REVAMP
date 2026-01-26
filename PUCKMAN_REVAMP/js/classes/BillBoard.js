// --------------------------------------------
// BILLBOARD CLASS
// --------------------------------------------
// Static or decorative background object
// Currently does nothing, but could support parallax or animation
// --------------------------------------------

class BillBoard extends GameObject 
{
    #isCenter = true;

    constructor(name, width, height, x, y, speed, isCenter = true) 
    {
        super(name, width, height, x, y, speed);

        this.#isCenter = isCenter;
    }

    get isCenter() { return this.#isCenter; }

    centerObjectInWorld(screenW, screenH) 
    {
        if (this.#isCenter)
        {
            try 
            {
                this.posX = (screenW - this.width) * 0.5;
                this.posY = (screenH - this.height) * 0.5;
            } 
            catch (e) 
            {
                console.error("BillBoard centerObjectInWorld error:", e);
            }
        }
        
    }
    update(device, delta) 
    {
        // Optional: BillBoard scrolling/animation
    }
    render(device, image, yBuff)
    {
        device.renderImage(image, this.posX, this.posY - yBuff);
    }
}
