// ============================================================================
//  OBJECT CLASS 
// ============================================================================

class ObjHolder 
{
	#objects;       // main container
    #orderedList;   // keeps objects in order

    constructor() 
	{
        this.#objects = [];        // main container
        this.#orderedList = [];    // keeps objects in a specific order if needed
    }

    // --- Add / remove objects ---
    addObject(obj, addToOrder = true)
	{
        this.#objects.push(obj);
        if (addToOrder) this.#orderedList.push(obj);
    }

    subObject(index) 
    {
        try 
        {
            const obj = this.#objects[index];
            if (!obj) return;
            this.#objects.splice(index, 1);
            const i = this.#orderedList.indexOf(obj);
            if (i >= 0) this.#orderedList.splice(i, 1);
        } 
        catch (err)
        { 
            console.warn("subObject failed:", err.message); 
        }
    }

    clearObjects() { this.#objects = []; this.#orderedList = []; }
    getIndex(index) { return this.#objects[index]; }
    getSize() { return this.#objects.length; }

    getObjectByName(name) { return this.#objects.find(o => o.name === name); }
    getImage(name) { return this.getObjectByName(name).image ?? null; }

    setOrder(newOrderArray) 
    {
        if (!Array.isArray(newOrderArray)) return;
        this.#orderedList = newOrderArray.filter(o => this.#objects.includes(o));
    }

    forEach(cb) 
    { 
        if (typeof cb === "function") this.#objects.forEach(cb); 
    }
}