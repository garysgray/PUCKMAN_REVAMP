// ============================================================================
// COLLISION UTILITIES
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

function roughNear(a, b, pad = 0) 
{
    if (!a || !b) return false;
    const dx = a.posX - b.posX;
    const dy = a.posY - b.posY;
    const r  = a.getRoughRadius() + b.getRoughRadius() + pad;
    return (dx * dx + dy * dy) <= (r * r);
}

// Used only during gameplay for player collisions
function checkPlayerCollisions(holder, player) 
{
    for (let i = holder.getSize() - 1; i >= 0; i--) 
    {
        const obj = holder.getIndex(i);
        if (roughNear(player, obj) && rectsCollide(player.getHitbox(), obj.getHitbox())) 
        {
            return i;
        }
    }
    return false;
}

// Used only during map/goal spawning
function overlapsAny(obj, holder) 
{
    const objBox = obj.getHitbox(1.0, 0);
    for (let i = 0; i < holder.getSize(); i++) 
    {
        const other = holder.getIndex(i);
        if (other.getHitbox && rectsCollide(objBox, other.getHitbox(1.0, 0))) return true;
    }
    return false;
}
