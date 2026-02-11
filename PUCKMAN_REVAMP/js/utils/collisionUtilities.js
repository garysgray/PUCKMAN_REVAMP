// ============================================================================
// COLLISION UTILITIES
// ============================================================================
const Collision =
{
     rectsCollide(a, b) 
    {
        if (!a || !b) return false;
        return !(
            a.right  < b.left  ||
            a.left   > b.right ||
            a.bottom < b.top   ||
            a.top    > b.bottom
        );
    },

     roughNear(a, b, pad = 0) 
    {
        if (!a || !b) return false;
        const dx = a.posX - b.posX;
        const dy = a.posY - b.posY;
        const r  = a.getRoughRadius() + b.getRoughRadius() + pad;
        return (dx * dx + dy * dy) <= (r * r);
    },

    // Used only during gameplay for player collisions
     checkPlayerCollisions(holder, player) 
    {
        for (let i = holder.getSize() - 1; i >= 0; i--) 
        {
            const obj = holder.getIndex(i);
            if (this.roughNear(player, obj) && this.rectsCollide(player.getHitbox(), obj.getHitbox())) 
            {
                return i;
            }
        }
        return false;
    },

    checkSingleCollisions(obj, player) 
    {
        if (this.roughNear(player, obj) && this.rectsCollide(player.getHitbox(), obj.getHitbox())) 
        {
            return obj;
        }
        
        return false;
    },


    // Used only during map/goal spawning
     overlapsAny(obj, holder) 
    {
        const objBox = obj.getHitbox(1.0, 0);
        for (let i = 0; i < holder.getSize(); i++) 
        {
            const other = holder.getIndex(i);
            if (other.getHitbox && this.rectsCollide(objBox, other.getHitbox(1.0, 0))) return true;
        }
        return false;
    },

};
