/*======================================================================
 * 
 * JAGE 2D : Javascript-Accelerated 2D Game Engine
 * 
 * Copyright (c) 2012 by Stephen Lindberg (sllindberg21@students.tntech.edu)
 * All rights reserved.
 * 
 * See README file for license.
======================================================================*/

/* *
 * JageSprite 
 * A renderable Jage2D object with its own 2D coordinates and internal state.
 * Sprites are used to represent basically any sort of game object.
 * Input: The starting x,y coordinates of the sprite.
 * */
 
function JageSprite(x, y) {
    if(!x && !y) {
        // default parameters: The sprite is located at the origin.
        x = 0;
        y = 0;
    }
    
    // DATA
    
    // The x,y location of this sprite in world coordinates.
    this.x = x;
    this.y = y;
    
    // The x,y location of this sprite in relation to its current image.
    this.focalX = 0;
    this.focalY = 0;
    
    // The scale of the sprite's image on its x/y axis.
    this.scaleX = 1.0;
    this.scaleY = 1.0;
    
    // The rotation in degrees of this sprite's image.
    this.angle = 0.0;
    
    // The current rotate-scale affine transform for this sprite's image.
    this.trans = null;
    
    // The complete affine transform for this sprite's image.
    this.curTrans = JageAffTrans.id();
    
    // flag for letting the sprite to update its transform before rendering.
    this.transNeedsUpdate = true;
    
    // the uniform opacity for this sprite. 
    this.opacity = 1.0;
    
    // flag for setting this sprite's visibility. The sprite will not be rendered if this flag is false.
    
    this.isVisible = true;
    
    // flag for letting everyone know that this Sprite is destroyed and should be ignored. 
    this.isDestroyed = false;
    
    
    // METHODS
    
    /** Marks this sprite as "destroyed" and calls this.onDestroyed(). */
    this.destroy = function() {
        this.isDestroyed = true;
        this.onDestroy();
    }
    
    /** A method for doing post-destruction processing on this sprite. For example, perhaps you might want to create an explosion special effect when this sprite is destroyed? By default, this does nothing. */
    this.onDestroy = function() {
        // does nothing by default. Override this method if you want it to do something.
    }
    
    
    /** Renders this sprite using its current transform. 
    Input: pen is the JagePen being used to draw this sprite. */
    this.render = function(pen) {
        if(!pen || this.isDestroyed || !this.isVisible || this.opacity == 0.0) {
            return;
        }

        // update the current transform to reflect this sprite's scale and rotation if necessary.
        if(this.transNeedsUpdate) {
            this.updateTransform();
        }
        
        var origTrans = pen.getTransform();
        
        // set the transform for rendering this sprite.
        var curTrans = origTrans.clone();
        curTrans.translate(this.x, this.y);
        curTrans.cat(this.trans);
        curTrans.translate(0-this.focalX, 0-this.focalY);
        this.curTrans = curTrans;
        pen.setTransform(curTrans);
        
        // change globalAlpha to account for this sprite's opacity.
        var origAlpha = pen.pen.globalAlpha;
        pen.pen.globalAlpha *= this.opacity;
        
        // draw this sprite using the transform we just constructed.
        this.draw(pen);
        
        // restore the old transform and globalAlpha.
        pen.setTransform(origTrans);
        pen.pen.globalAlpha = origAlpha;
        
    }
    
    /** Draws the image for this sprite. This is called by this.render() which sets up the rendering transform for this sprite first. The user is expected to override this method to draw the sprite how they want. */
    this.draw = function(pen) {
        // by default, this does nothing.
    }
    
    /** Updates this sprite's rotation-scale transform. */
    this.updateTransform = function() {
        this.trans = JageAffTrans.id();
        this.trans.rotate(0-this.angle);
        this.trans.scale(this.scaleX, this.scaleY);
        
        this.transNeedsUpdate = false;
    }
    
    /** Sets the sprite's scale and changes this.transNeedsUpdate to true. */
    this.scale = function(sx, sy) {
        if(!sy) {
            // if sy is not provided, it is assumed that scaleX and scaleY are uniform.
            sy = sx;
        }
        this.scaleX = sx;
        this.scaleY = sy;
        this.transNeedsUpdate = true;
    }
    
    /** Sets the sprite's rotation angle and changes this.transNeedsUpdate to true. */
    this.rotate = function(degrees) {
        this.angle = degrees;
        this.transNeedsUpdate = true;
    }
}


