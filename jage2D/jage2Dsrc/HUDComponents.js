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
 * some convenient methods for canvas screen coordinate to component coordinate geometry, and members that keep track of its mouse-event
 * state using the updateState method.
 */
function JageHUDComponent(x,y,parent) {
    var self = new JageSprite(x,y);
    
    // trait flags
    self.trait_hudComponent = true;
    
    /** A reference to the parent component. */
    self.parent = parent;
    
    // flag for if this is currently being pressed with any mouse button.
    self.isPressed = false;
    
    // flag for if this is currently being pressed with the left mouse button. 
    self.isLeftPressed = false;
    
    // flag for if this is currently being pressed with the right mouse button. 
    self.isRightPressed = false;
    
    // flag for if this was just pressed with any mouse button.
    self.justPressed = false;
    
    // flag for if this was just pressed with the left mouse button. 
    self.justLeftPressed = false;
    
    // flag for if this was just pressed with the right mouse button. 
    self.justRightPressed = false;
    
    // flag for if this was just pressed with any mouse button repeating.
    self.justPressedRep = false;
    
    // flag for if this was just pressed with the left mouse button repeating. 
    self.justLeftPressedRep = false;
    
    // flag for if this was just pressed with the right mouse button repeating. 
    self.justRightPressedRep = false;
    
    // flag for if this was just clicked with any mouse button
    self.justClicked = false;
    
    // flag for if this was just clicked with the left mouse button. 
    self.justLeftClicked = false;
    
    // flag for if this was just clicked with the right mouse button. 
    self.justRightClicked = false;
    
    // flag for if any mouse continues to be held after this was just pressed, 
    // even if the mouse no longer hovers over this. 
    self.isDragged = false;
    
    // flag for if the left mouse continues to be held after this was just pressed, 
    // even if the mouse no longer hovers over this. 
    self.isLeftDragged = false;
    
    // flag for if the right mouse continues to be held after this was just pressed, 
    // even if the mouse no longer hovers over this. 
    self.isRightDragged = false;
    
    // counter for how long the mouse has been hovering over this
    self.hoverCounter = 0;
    
    
    
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
    
    /** Checks to see if this component contains a screen point in its area */
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
    
    /** Updates the mouse state of this button. */
    self.updateState = function(mouse) {
        self.justPressed = false;
        self.justLeftPressed = false;
        self.justRightPressed = false;    
        
        self.justClicked = false;
        self.justLeftClicked = false;
        self.justRightClicked = false;
        
        
        if(self.isMouseOver(mouse)) {
            self.hoverCounter++;
            
            if(mouse.isLeftPressed) 
                self.isLeftPressed = true;
            if(mouse.isRightPressed) 
                self.isRightPressed = true;
                
            if(mouse.justLeftPressed) {
                self.justLeftPressed = true;
                self.isLeftDragged = true;
            }
            if(mouse.justRightPressed) {
                self.justRightPressed = true;
                self.isRightDragged = true;
            }
            
            if(mouse.justLeftClicked) 
                self.justLeftClicked = true;
            if(mouse.justRightClicked)
                self.justRightClicked = true;
        }
        else {
            self.hoverCounter = 0;
            self.isLeftPressed = false;
            self.isRightPressed = false;
        }
        
        if(!mouse.isLeftPressed) {
            self.isLeftPressed = false;
            self.isLeftDragged = false;
        }
        if(!mouse.isRightPressed) {
            self.isRightPressed = false;
            self.isRightDragged = false;
        }
        
        self.isPressed = (self.isLeftPressed || self.isRightPressed);
        self.justPressed = (self.justLeftPressed || self.justRightPressed);
        self.justClicked = (self.justLeftClicked || self.justRightClicked);
        self.isDragged = (self.isLeftDragged || self.isRightDragged);
    }
    
    /** Returns true only if the mouse is inside the button's rectangular area. */
    self.isMouseOver = function (mouse) {
        return self.containsScreenPt(mouse.position);
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
    self.hasBorder = true;
    
    /** The color of the border if hasBorder is true. */
    self.borderColor = "#000";
    
    /** The width of the border if hasBorder is true. */
    self.borderWidth = 1;
    
    /** Flag for telling if this pane currently has input focus. Input focus is generally obtained by clicking in the pane's area. */
    self.hasFocus = false;
    
    
    /** Draws the pane and its components in its clipped area. */
    self.draw = function(pen) {
        // save our transform
        var origTrans = pen.getTransform();
        
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
        if(self.hasBorder) {
            pen.pen.save();
            pen.setStroke(self.borderColor);
            pen.pen.lineWidth = self.borderWidth;
            pen.drawRect(0, 0, self.width, self.height, pen.STROKE);
            pen.pen.restore();
        }
        
        // restore our transform.
        pen.setTransform(origTrans);
    }
    
    return self;
}



/** 
 * A generic button sprite that can be used to create custom clickable buttons. 
 */
function JageButton(x,y,parent) {
    var self = new JageHUDComponent(x,y,parent);

    // tooltip text
    self.tooltip = "";
    
    // The width and height of the button. The user is expected to provide these 
    // based on the dimensions of the images they're using for this button.
    self.width = 0;
    self.height = 0;
    
    // flag is true when this button is disabled.
    self.isDisabled = false;
    
    /** 
     * Draws this button's tooltip if the its tooltip isn't the empty string and its hover counter is high enough. 
     * This default implementation draws the tooltip in a small, bordered grey box. 
     * Override this if you want your tooltips to look different.
     */
    self.drawTooltip = function (pen) {
        if(self.tooltip == "" || self.hoverCounter < 30)
            return;
        
        pen.pen.save();
        pen.pen.font = "10px sans-serif";
        pen.pen.lineWidth = 1;
        var textMCan = pen.pen;
        var textWidth = textMCan.measureText(self.tooltip).width;
        if(textWidth == 0) 
            textWidth = 1;
        pen.pen.translate(self.x, self.y + 32);
        pen.setStroke("rgb(220,220,220)");
        pen.setFill("white");
        pen.drawRect(0, 0, textWidth + 20, 16);
        pen.setStroke("rgba(0,0,0,0)");
        pen.setFill("rgb(150,150,150)");
        pen.drawString(self.tooltip, 10, 12);
        pen.pen.restore();
    }
    
    return self;
}

 
/** 
 * Abstract parent class for a vertical scrollbar or horizontal scrollbar 
 * (or other types of weird scrollbars if you're silly).
 * All scrollbars have a trait_scrollable member set to true.
 */
function JageScrollbar(parent) {
    var self = new JageButton(0,0,parent);
    
    // traits
    parent.trait_scrollable = true;
    
    /** The decremental scroll JageButton. The user is expected to provide this. */
    self.btnDec = false;
    
    /** The incremental scroll JageButton. The user is expected to provide this. */
    self.btnInc = false;
    
    /** timer for how long the scrollbar has been held by the mouse's left button. */
    self.leftClickTimer = 0;
    
    /** The color of the scrollbar's background */
    self.bgColor = "#EEE";
    
    /** If this is true, then the scrollbar will have a border. Default border is #AAA with 1px width. */
    self.hasBorder = true;
    
    /** The color of the border if hasBorder is true. */
    self.borderColor = "#AAA";
    
    /** The width of the border if hasBorder is true. */
    self.borderWidth = 1;
    
    /** Flag for greying out the scrollbar (disables it). */
    self.isDisabled = true;
    
    /** 
     * The current scrolling position of this scrollbar. This is the distance from the top/left of its 
     * contents to the top/left edge of the pane using the scrollbar. 
     */
    self.scrollPos = 0;
    
    /** The amount to scroll when the decremental or incremental scroll buttons are pressed. */
    self.scrollInc = 16;
    
    /** The maximum value allowed for self.scrollPos. */
    self.maxScrollPos = 0;
    
    /** The scroll handle JageButton. The user is expected to provide this. */
    self.btnHandle = false;
    
    /** Safely sets scrollPos so that we don't scroll out of bounds in our pane. */
    self.setScrollPos = function(y) {
        
        if(y > self.maxScrollPos)
            y = self.maxScrollPos;
        if(y < 0)
            y = 0;
        
        self.scrollPos = y;
    }
    
    
    /** Updates the mouse state of this scrollbar and its components. */
    self.superUpdateState = self.updateState;
    self.updateState = function(mouse) {
        self.superUpdateState(mouse);
        
        if(self.isDisabled)
            return;
        
        self.btnDec.updateState(mouse);
        self.btnInc.updateState(mouse);
        self.btnHandle.updateState(mouse);
        
        // count how long the user has been holding the left-click after clicking a button.
        if(self.isLeftDragged)
            self.leftClickTimer++;
        else
            self.leftClickTimer = 0;
        
        // interaction with the scrollbar
        if(self.btnDec.justLeftPressed  || (self.leftClickTimer > 10 && self.btnDec.isLeftPressed)) {
            self.setScrollPos(self.scrollPos - self.scrollInc);
        }
        if(self.btnInc.justLeftPressed || (self.leftClickTimer > 10 && self.btnInc.isLeftPressed)) {
            self.setScrollPos(self.scrollPos + self.scrollInc);
        }
    }
    
    
    /** Updates the scrollbar's metrics, then draws it. */
    self.draw = function(pen) {
        // update the metrics of the scrollbar's components. 
        // The user is expected to provide an implementation for the updateMetrics method.
        self.updateMetrics();
        
        // disable the scrollbar iff its contents are smaller than itself.
        self.isDisabled = (self.maxScrollPos <= 0);
        self.btnDec.isDisabled = self.isDisabled;
        self.btnInc.isDisabled = self.isDisabled;
        
        // draw it!
        pen.pen.save();
        pen.setFill(self.bgColor);
        if(self.hasBorder) {
            pen.lineWidth = self.borderWidth;
            pen.setStroke(self.borderColor);
            pen.drawRect(0, 0, self.width, self.height);
        }
        else
            pen.drawRect(0, 0, self.width, self.height, pen.FILL);
        pen.pen.restore();
        
        if(!self.isDisabled) {
            self.btnHandle.render(pen);
        }
        self.btnDec.render(pen);
        self.btnInc.render(pen);
    }
    
    
    return self;
}



/**
 * A vertical scrollbar that can be used in a JagePane. When used in a JagePane, 
 * it docks itself on the right edge of the pane and automatically adjusts its height to 
 * fit its pane. 
 * parent will gain the flag trait_hasVerticalScrollbar
 * The user is expected to provide graphics for the up/down scroll buttons.
 * The graphics for the scroll buttons are expected to be the same dimensions.
 */
function JageVScrollbar(parent) {
    var self = new JageScrollbar(parent);
    
    self.parent.trait_hasVerticalScrollbar = true;
    self.parent.trait_vScrollbarWidth = 0;
    
    /** The width of the scrollbar. This is automatically obtained from the up scroll button's width. */
    self.width = 0;
    
    /** The height of the scrollbar. This is automatically set to the height of its parent pane. */
    self.height = 0;
    
    /** The height of the contents scrolled by this scrollbar. The user is expected to set this. */
    self.contentHeight = 0;

    /** 
     * The scroll handle JageButton. A default implementation is provided, but it is still  
     * recommended that the user use their own to suit their app's look and feel. 
     */
    self.btnHandle = new VScrollbarDefaultHandle(self);
    
    
    /** Sets the contentHeight and updates maxScrollPos */
    self.setContentHeight = function(height) {
        self.contentHeight = height;
        self.maxScrollPos = Math.max(self.contentHeight - self.height, 0);
        self.setScrollPos(self.scrollPos);
    }
    
    /** Updates the metrics of the scrollbar and its components. */
    self.updateMetrics = function() {
        // scrollbar metrics.
        self.width = self.btnDec.width;
        self.parent.trait_vScrollbarWidth = self.width;
        self.height = self.parent.height;
        if(self.parent.trait_hasHorizontalScrollbar)
            self.height -= self.parent.trait_hScrollbarHeight;
        self.x = self.parent.width - self.width;
        self.y = 0;
        self.maxScrollPos = Math.max(self.contentHeight - self.height, 0);

        // button metrics
        self.btnDec.x = 0;
        self.btnDec.y = 0;
        self.btnInc.x = 0;
        self.btnInc.y = self.height - self.btnInc.height;
        
        // scroll handle metrics
        self.btnHandle.updateMetrics();
    }
    
    /** Applies the transform for the scrolling. */
    self.scroll = function(pen) {
        pen.transform(JageAffTrans.tran(0, 0-self.scrollPos));
    }
    
    return self;
}


function VScrollbarDefaultHandle(scrollbar) {
    var self = new JageButton(0,0,scrollbar);
    
    /** The current height of the scroll handle. This is dependent on the parent scrollbar's height and content height.*/
    self.height = 0;
    
    /** This is the amount of space between the parent scrollbar's up and down scroll buttons. */
    self.maxHeight = 0;
    
    /** Used for dragging the handle with the mouse */
    self.mouseDy = 0;
    
    /** Updates the height and position of the scroll handle in its scrollbar. */
    self.updateMetrics = function() {
        self.maxHeight = self.parent.btnInc.y - self.parent.btnDec.height;
        self.height = self.maxHeight * self.parent.height/self.parent.contentHeight;
        self.width = self.parent.width;
        if(self.height < 10)
            self.height = 10;
        if(self.height > self.maxHeight)
            self.height = self.maxHeight;
        
        self.y = (self.maxHeight - self.height) * (self.parent.scrollPos / self.parent.maxScrollPos);
        self.y += self.parent.btnDec.height;
    }
    
    
    self.superUpdateState = self.updateState;
    self.updateState = function(mouse) {
        self.superUpdateState(mouse);
        
        var mouseYRelative = self.parent.screen2CompCoords(mouse.position).y;
        
        if(self.justLeftPressed) {
            self.mouseDy =  self.y - mouseYRelative;
        }
        
        if(self.isLeftDragged) {
            var destY = self.mouseDy + mouseYRelative - self.parent.btnDec.height;
            self.parent.setScrollPos((destY * self.parent.maxScrollPos) / (self.maxHeight - self.height));
        }
        else if((self.parent.justLeftPressed || (self.parent.leftClickTimer > 10 && self.parent.isLeftPressed)) && !self.isPressed && !self.parent.btnDec.isLeftDragged && !self.parent.btnInc.isLeftDragged) {
            // Pressing the mouse button in the non-handle/non-button region of the scrollbar 
            // will cause it to Page Up/Page Down.
            
            if(mouseYRelative < self.y)
                self.parent.setScrollPos(self.parent.scrollPos - self.parent.height);
            else
                self.parent.setScrollPos(self.parent.scrollPos + self.parent.height);
                
        }
    }
    
    
    self.draw = function(pen) {
        pen.setFill("#CCC");
        pen.setStroke("#888");
        pen.drawRect(0, 0, self.width, self.height);
        pen.setFill("#EEE");
        
        if(self.isLeftDragged)
            pen.setFill("#DDD");
        
        pen.drawRect(1, 1, self.width/2, self.height - 2, pen.FILL);
    }
    
    return self;
} 
 
 

 /**
 * A horizontal scrollbar that can be used in a JagePane. When used in a JagePane, 
 * it docks itself on the bottom edge of the pane and automatically adjusts its width to 
 * fit its pane. 
 * parent will gain the flag trait_hasHorizontalScrollbar
 * The user is expected to provide graphics for the left/right scroll buttons.
 * The graphics for the scroll buttons are expected to be the same dimensions.
 */
function JageHScrollbar(parent) {
    var self = new JageScrollbar(parent);
    
    self.parent.trait_hasHorizontalScrollbar = true;
    self.parent.trait_hScrollbarHeight = 0;
    
    /** The width of the scrollbar. This is automatically obtained from the up scroll button's width. */
    self.width = 0;
    
    /** The height of the scrollbar. This is automatically set to the height of its parent pane. */
    self.height = 0;
    
    /** The height of the contents scrolled by this scrollbar. The user is expected to set this. */
    self.contentWidth = 0;

    /** 
     * The scroll handle JageButton. A default implementation is provided, but it is still  
     * recommended that the user use their own to suit their app's look and feel. 
     */
    self.btnHandle = new HScrollbarDefaultHandle(self);
    
    
    /** Sets the contentWidth and updates maxScrollPos */
    self.setContentWidth = function(width) {
        self.contentWidth = width;
        self.maxScrollPos = Math.max(self.contentWidth - self.width, 0);
        self.setScrollPos(self.scrollPos);
    }
    
    /** Updates the metrics of the scrollbar and its components. */
    self.updateMetrics = function() {
        // scrollbar metrics.
        self.width = self.parent.width;
        if(self.parent.trait_hasVerticalScrollbar)
            self.width -= self.parent.trait_vScrollbarWidth;
        self.height = self.btnDec.height
        self.parent.trait_hScrollbarHeight = self.height;
        self.x = 0;
        self.y = self.parent.height - self.height;
        self.maxScrollPos = Math.max(self.contentWidth - self.width, 0);

        // button metrics
        self.btnDec.x = 0;
        self.btnDec.y = 0;
        self.btnInc.x = self.width - self.btnInc.width;
        self.btnInc.y = 0;
        
        // scroll handle metrics
        self.btnHandle.updateMetrics();
    }
    
    /** Applies the transform for the scrolling. */
    self.scroll = function(pen) {
        pen.transform(JageAffTrans.tran(0-self.scrollPos, 0));
    }
    
    return self;
}
 


 function HScrollbarDefaultHandle(scrollbar) {
    var self = new JageButton(0,0,scrollbar);
    
    /** The current width of the scroll handle. This is dependent on the parent scrollbar's width and content width.*/
    self.width = 0;
    
    /** This is the amount of space between the parent scrollbar's up and down scroll buttons. */
    self.maxWidth = 0;
    
    /** Used for dragging the handle with the mouse */
    self.mouseDx = 0;
    
    /** Updates the width and position of the scroll handle in its scrollbar. */
    self.updateMetrics = function() {
        self.maxWidth = self.parent.btnInc.x - self.parent.btnDec.width;
        self.width = self.maxWidth * self.parent.width/self.parent.contentWidth;
        self.height = self.parent.height;
        if(self.width < 10)
            self.width = 10;
        if(self.width > self.maxWidth)
            self.width = self.maxWidth;
        
        self.x = (self.maxWidth - self.width) * (self.parent.scrollPos / self.parent.maxScrollPos);
        self.x += self.parent.btnDec.width;
    }
    
    
    self.superUpdateState = self.updateState;
    self.updateState = function(mouse) {
        self.superUpdateState(mouse);
        
        var mouseXRelative = self.parent.screen2CompCoords(mouse.position).x;
        
        if(self.justLeftPressed) {
            self.mouseDx =  self.x - mouseXRelative;
        }
        if(self.isLeftDragged) {
            var destX = self.mouseDx + mouseXRelative - self.parent.btnDec.width;
            self.parent.setScrollPos((destX * self.parent.maxScrollPos) / (self.maxWidth - self.width));
        }
        else if((self.parent.justLeftPressed || (self.parent.leftClickTimer > 10 && self.parent.isLeftPressed)) && !self.isPressed && !self.parent.btnDec.isLeftDragged && !self.parent.btnInc.isLeftDragged) {
            // Pressing the mouse button in the non-handle/non-button region of the scrollbar 
            // will cause it to Page Up/Page Down.
            
            if(mouseXRelative < self.x)
                self.parent.setScrollPos(self.parent.scrollPos - self.parent.width);
            else
                self.parent.setScrollPos(self.parent.scrollPos + self.parent.width);
                
        }
    }
    
    
    self.draw = function(pen) {
        pen.setFill("#CCC");
        pen.setStroke("#888");
        pen.drawRect(0, 0, self.width, self.height);
        pen.setFill("#EEE");
        
        if(self.isLeftDragged)
            pen.setFill("#DDD");
        
        pen.drawRect(1, 1, self.width - 2, self.height/2, pen.FILL);
    }
    
    return self;
} 
 
 


