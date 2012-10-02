/*======================================================================
 * 
 * JAGE 2D : Javascript-Accelerated 2D Game Engine
 * 
 * Copyright (c) 2012 by Stephen Lindberg (sllindberg21@students.tntech.edu)
 * All rights reserved.
 * 
 * See README file for license.
======================================================================*/


/**
 * A JageSprite used as the top level class for a JAGE HUD component. All Jage HUD components are descendants of this class.
 * Notably, a HUD Component has a reference to a parent component, has a trait_hudComponent flag that is always true, 
 * some convenient methods for canvas screen coordinate to component coordinate geometry.
 */
function JageHUDComponent(x,y,parent) {
    var self = new JageSprite(x,y);
    
    self.trait_hudComponent = true;
    
    /** A reference to the parent component. */
    self.parent = parent;
    
    /** 
     * Gets the absolute position of this component in its containing JageApp's canvas.
     * before this component was rendered. 
     */
    self.getAbsolutePosition = function() {
        return self.curTrans.apply({x:0,y:0});
    }
    
    /**
     * Converts a point from canvas screen coordinates to coordinates in this component.
     */
    self.screen2CompCoords = function(pt) {
        var curTransInv = self.curTrans.inv();
        
        return curTransInv.apply(pt);
    }
    
    /** Checks to see if this component contains a screen point in its unclipped area */
    self.containsScreenPt = function(pt) {
        var comp = self;
        
        // return false if our point is outside this component or any of its ancestral components. 
        while(comp.trait_hudComponent) {
            // convert our screen point to component coordinates.
            var compPt = comp.screen2CompCoords(pt);
            
            if(compPt.x < 0 || compPt.x >= comp.width || compPt.y < 0 || compPt.y >= comp.height)
                return false;
            
            comp = comp.parent;
        }
        
        // Our point was inside this component and all its ancestors. So, return true.
        return true;
    }
    
    return self;
}

/**
 * A JageHUDComponent used as an ancestral class for HUD Components that contain other HUD Components.
 */

function JageHUDContainer(x,y,parent) {
    var self = new JageHUDComponent(x,y,parent);
    
    self.trait_container = true;
    
    /** This container's table of components that it contains. */
    self.contents = [];
    
    /** The uniqueID to be assigned to the next contained component. */
    self.nextContentID = 0;
    
    /** Adds a component to this container's contents table. */
    self.addComponent = function(comp) {
        if(!comp.componentID) {
            comp.componentID = "id" + self.nextContentID;
            self.nextContentID++;
        }
        
        self.contents[comp.componentID] = comp;
        comp.parent = self;
    }
    
    /** Renderes this container's contents in the scope of its transform without doing anything fancy. */
    self.drawComponents = function(pen) {
        for(var i in self.contents) {
            self.contents[i].render(pen);
        }
    }
    
    return self;
}
 

/**
 * A JageHUDComponent representing a java-swing-like pane container. 
 * Really, it's just a rectangular clipping area that may or may not have a border.
 * Input: The starting x,y coordinates of the sprite.
 */
 
function JagePane(x, y, width, height, parent) {
    var self = new JageHUDContainer(x,y, parent);
    
    /** HUD traits */
    
    self.trait_focusable = true;
    
    /** width and height */
    self.width = width;
    self.height = height;
    
    /** If this is true, then the pane will have a border. Default border is black with 1px width. */
    var hasBorder = true;
    
    /** The color of the border if hasBorder is true. */
    var borderColor = "#000";
    
    /** The width of the border if hasBorder is true. */
    var borderWidth = 1;
    
    /** Flag for telling if this pane currently has input focus. Input focus is generally obtained by clicking in the pane's area. */
    var hasFocus = false;
    
    
    /** Draws the pane and its components in its clipped area. */
    self.draw = function(pen) {
        // save our transform
        var origTrans = pen.getTransform();
        
        pen.drawRect(0, 0, self.width, self.height, pen.STROKE);
        
        // compute bounds for the pane's clipped area.
        var clipXLeft = 0; 
        var clipXRight = self.width;
        var clipYTop = 0;    
        var clipYBottom = self.height;
        
        // draw the pane's contents in its clipped area.
        pen.pen.save();
        pen.pen.beginPath();
        pen.pen.moveTo(clipXLeft, clipYTop);
        pen.pen.lineTo(clipXRight, clipYTop);
        pen.pen.lineTo(clipXRight, clipYBottom);
        pen.pen.lineTo(clipXLeft, clipYBottom);
        pen.pen.lineTo(clipXLeft, clipYTop);
        pen.pen.clip(); 
        self.drawComponents(pen);
        pen.pen.restore();
        
        // draw border
        pen.pen.save();
        pen.setStroke(borderColor);
        pen.drawRect(0, 0, self.width, self.height, pen.STROKE);
        pen.pen.restore();
        
        // restore our transform.
        pen.setTransform(origTrans);
    }
    
    return self;
}






