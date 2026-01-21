// ============================================================================
// COLLISION UTILS 
// -----------------------------------------------------------------------------
// ============================================================================

function rectsCollide(a, b)
{
    if (!a || !b) return false;
    return !(
        a.right  < b.left  ||
        a.left   > b.right ||
        a.bottom < b.top   ||
        a.top    > b.bottom
    );
}

function overlapsAny(npc, holder) 
{
    try 
    {
        const count = holder.getSize();
        const npcBox = npc.getHitbox(1.0, 0); 

        for (let i = 0; i < count; i++) 
        {
            const other = holder.getIndex(i);
            const otherBox = other.getHitbox(1.0, 0);

            if (otherBox && rectsCollide(npcBox, otherBox)) return true;
        }
    } 
    catch (e) 
    {
        console.error("overlapsAny error:", e);
    }
    return false;
}

function roughNear(a, b, pad = 0) {
    try 
    {
        if (!a || !b) return false;
        const dx = a.posX - b.posX;
        const dy = a.posY - b.posY;
        const r  = a.getRoughRadius()  + b.getRoughRadius() + pad;
        return (dx * dx + dy * dy) <= (r * r);
    } 
    catch (e) 
    {
        console.error("roughNear error:", e);
        return false;
    }
}

function checkPlayerGameObjCollisions( holder, player) 
{
    for (let i = holder.getSize() - 1; i >= 0; i--) 
    {
        const obj = holder.getIndex(i);

        if (roughNear(player, obj) && rectsCollide(player.getHitbox(), obj.getHitbox())) 
        {
            return i
        }  
    }
    return false;
}

