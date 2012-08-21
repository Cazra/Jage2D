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
 * Camera.js
 * Provides a camera class that produces an affine transform for panning/zooming/rotating
 * the contents of a Canvas.
 */


/* *
 * JageCamera
 * Used to create a 2D camera affine transform and provide functions for 
 * converting back and forth from world to canvas coordinates with this transform.
 *
 * The camera will start with no tilt nor zoom with its focus in the center of the 
 * parent canvas at world coordinates 0,0.
 *
 * Inputs: canvas is a Canvas element.
 * Depends on: JageMath.js
 * */

function JageCamera(canvas) {
    // DATA
    
    /** A reference to the Canvas's rendering context. */
    this.painter = canvas.getContext("2d");
    this.canvas = canvas;
    
    /** The width and height of the parent Canvas. */
    this.width = this.painter.canvas.width;
    this.height = this.painter.canvas.height;

    /** The x,y position of the camera's focal center in world coordinates */
    this.x = 0.0;
    this.y = 0.0;

    /** The current x,y position of the camera's focal center in screen coordinates. */
    this.cx = this.width/2.0;
    this.cy = this.height/2.0;

    /** Controls the camera's zoom. This can be any number in the range (0,+Infinity). 
    It is zoomed in closer to +Infinity and zoomed out closer to 0. */
    this.zoom = 1.0;

    /** The camera's tilt angle in degrees. */
    this.angle = 0.0;

    /** The position of the parent Canvas's edges in world coordinates. (These values are only accurate when this.angle is 0) */
    this.xLeft = 0-this.cx;
    this.xRight = this.cx;
    this.yTop = 0-this.cy;
    this.yBottom = this.cy;
    
    /** The camera's current affine transform and its inverse. */
    this.trans = null;
    this.inv = null;
    
    // METHODS
    
    /** Resets the camera's to its default state. */
	this.reset = function () {
        this.width = this.painter.canvas.width;
        this.height = this.painter.canvas.height;
        this.x = 0.0;
        this.y = 0.0;
        this.cx = this.width/2.0;
        this.cy = this.height/2.0;
        this.zoom = 1.0;
        this.angle = 0.0;
        this.xLeft = 0-this.cx;
        this.xRight = this.cx;
        this.yTop = 0-this.cy;
        this.yBottom = this.cy;
        this.updateTransform();
    }
    
    /** Updates the Camera's transform using its current state values. */
    this.updateTransform = function () {
        // compute the camera's affine transform
        this.trans = JageAffTrans.id();
        this.trans.translate(this.cx, this.cy);
        this.trans.scale(this.zoom, this.zoom);
        this.trans.rotate(this.angle);
        this.trans.translate(0-this.x, 0-this.y);
        
        // compute the transform's inverse
        this.inv = this.trans.inv();
        
        // compute the world coordinates of the parent Canvas's 
        // upperleft and lower right corners.
        var ul = this.inv.apply(new JagePoint(0,0));
        var lr = this.inv.apply(new JagePoint(this.width, this.height));
        
        // compute the world positions of the parent Canvas's edges.
        this.xLeft = ul.x;
        this.xRight = lr.x;
        this.yTop = ul.y;
        this.yBottom = lr.y;
    }
    
    
    /** Returns a point transformed from screen to world coordinates. 
    The original point is unchanged. */
    this.screenToWorld = function (pt) {
        return this.inv.apply(pt);
    }
    
    this.s2w = this.screenToWorld;
    
    /** Returns a point transformed from world to screen coordinates.
    The original point is unchanged. */
    this.worldToScreen = function (pt) {
        return this.trans.apply(pt);
    }
    
    this.w2s = this.worldToScreen;
    
    
    /** Moves the camer's focal center without altering the current camera transform. */
    this.moveCenter = function (cx, cy) {
        if(!cy) {
            // single argument: cx is actually a point in screen coordinates.
            cy = cx.y
            cx = cx.x
        }
        
        var dcx = cx - this.cx;
        var dcy = cy - this.cy;
        
        // move the focal center.
        this.cx = cx;
        this.cy = cy;
        
        // change the focal center's world position without 
        // altering the camera's current tranform.
        var dc = new JagePoint(dcx,dcy);
        var sr = JageAffTrans.id().scale(this.zoom, this.zoom).rotate(this.angle);
        var srInv = sr.inv();
        dc = srInv.apply(dc);
        
        this.x += dc.x;
        this.y += dc.y;
        
        this.updateTransform();
    }
    
    /** Used to move the camera by dragging it with the mouse or some other object with screen coordinates. */
    this.drag = function(screenPt) {
        if(!this.dragTimer) this.dragTimer = 0;
        if(this.dragTimer == 0) this.updateDrag(screenPt);
        
        // Update the camera focal point's screen and world coordinates relative to the anchor point.
        var worldPt = this.s2w(screenPt);
        var vector = new JagePoint(this.dragAnchor.x - worldPt.x, this.dragAnchor.y - worldPt.y);
        
        this.x = this.dragStartPt.x + vector.x;
        this.y = this.dragStartPt.y + vector.y;
        
        this.moveCenter(screenPt);
        
        this.updateDrag(screenPt);
        this.dragTimer++;
    }
    
    /** Helper method: Updates the camera drag anchor state. */
    this.updateDrag = function(screenPt) {
        // Obtain the anchor point for the drag, the focus's starting world coords, and our starting inverse.
        this.dragAnchor = this.s2w(screenPt);
        this.dragStartPt = new JagePoint(this.x, this.y);
        this.dragInv = this.inv.clone();
    }
    
    /** Used to end the camera drag. You'll get some weird results next time you try to drag the camera if you don't call this when
        you're done dragging! */
    this.endDrag = function() {
        this.dragTimer = 0;
    }
    
    
    /** Zooms in (or out) on a point in screen coordinates. */
    this.zoomAtScr = function (zoomMult, screenPt, y) {
        this.moveCenter(screenPt,y);
        this.zoom *= zoomMult;
        
        this.updateTransform();
    }
    
    /** Zooms in (or out) on a point in world coordinates. */
    this.zoomAtWor = function (zoomMult, worldPt) {
        var screenPt = this.trans.apply(worldPt);
        this.zoomAtScr(zoomMult, screenPt);
    }
    
    // initialize Camera's affine transform from its initial values.
    this.updateTransform();
    this.dragTimer = 0;
}


 
