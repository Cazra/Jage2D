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
 * Graphics.js
 * Provides classes for easily doing neat graphical stuff with Canvas. 
 * Depends on:
 *      JageMath.js
 */

/* *
 * JagePen 
 * A wrapper for CanvasRenderingContext2D, providing functions that make
 * it a little easier to use and transparently portable.
 * Many of its methods are similar to those of java.awt.Graphics2D in Java.
 * Inputs: pen is a CanvasRenderingContext2D.
 * Depends on: JageMath.js
 * */
 
function JagePen(pen) {
    // DATA
    
    /** A reference to the CanvasRenderingContext2D wrapped by this. */
    this.pen = pen;
    
    /** A reference to the current Affine Transform used by this. */
    this.trans = JageAffTrans.id();
    
    /** A constant used by some methods to tell the pen to only stroke a shape and not fill it. */
    this.ONLYSTROKE = 0x00000001;
    
    /** A constant used by some methods to tell the pen to only fill a shape and not stroke it. */
    this.ONLYFILL = 0x00000010;
    
    // METHODS
    
    /** Clears the entire canvas, possibly with a color. */
    this.clear = function (color) {
        this.pen.save();
        this.pen.setTransform(1,0,0,1,0,0);
        if(color) {
            this.pen.fillStyle = color;
            this.pen.fillRect(0, 0, this.pen.canvas.width, this.pen.canvas.height);
        }
        else
            this.pen.clearRect(0, 0, this.pen.canvas.width, this.pen.canvas.height);
        this.pen.restore();
    }
    
    /** Draws a circle using the current fill and stroke style. */
    this.drawCircle = function (x,y,r, opts) {
        this.pen.beginPath();
        this.pen.arc(x,y,r,0, Math.PI*2);
        
        if(!opts)
            opts = 0x11;
        if((opts & this.ONLYFILL) != 0) 
            this.pen.fill();
        if((opts & this.ONLYSTROKE) != 0)
            this.pen.stroke();
    }
    
    /** Draws an ellipse using the current fill and stroke style. */
    this.drawEllipse = function (x,y,rx,ry, opts) {
        this.pen.beginPath();
        this.pen.save();
        this.pen.translate(x,y);
        this.pen.scale(1.0, ry/rx);
        this.pen.arc(0, 0, rx, 0, Math.PI*2);
        this.pen.closePath();
        this.pen.restore();
        
        if(!opts)
            opts = 0x11;
        if((opts & this.ONLYFILL) != 0) 
            this.pen.fill();
        if((opts & this.ONLYSTROKE) != 0)
            this.pen.stroke();
    }
    
    /** Draws a rectangle using the current fill and stroke style. */
    this.drawRect = function (x,y,w,h, opts) {
        if(!opts)
            opts = 0x11;
        if((opts & this.ONLYFILL) != 0) 
            this.pen.fillRect(x,y,w,h);
        if((opts & this.ONLYSTROKE) != 0)
            this.pen.strokeRect(x,y,w,h);
    }
    
    /** Draws a rectangle with rounded edges using the current fill and stroke style. */
    this.drawRoundedRect = function (x,y,w,h,r, opts) {
        this.pen.beginPath();
        this.pen.moveTo(x+r,y);
        this.pen.lineTo(x+w-r,y);
        this.pen.arc(x+w-r,y+r,r, Math.PI*1.5, 0);
        this.pen.lineTo(x+w,y+h-r);
        this.pen.arc(x+w-r,y+h-r,r, 0, Math.PI*0.5);
        this.pen.lineTo(x+r,y+h);
        this.pen.arc(x+r,y+h-r,r, Math.PI*0.5, Math.PI);
        this.pen.lineTo(x,y+r);
        this.pen.arc(x+r,y+r,r, Math.PI, Math.PI*1.5);
        
        if(!opts)
            opts = 0x11;
        if((opts & this.ONLYFILL) != 0) 
            this.pen.fill();
        if((opts & this.ONLYSTROKE) != 0)
            this.pen.stroke();
    }
    
    /** Draws a line using the current stroke style. */
    this.drawLine = function (x1, y1, x2, y2) {
        if(!x2) {
            // only 2 arguments: assume the args are points p1, p2.
            this.pen.beginPath();
            this.pen.moveTo(x1.x, x1.y);
            this.pen.lineTo(y1.x, y1.y);
            this.pen.stroke();
        }
        else {
            this.pen.beginPath();
            this.pen.moveTo(x1,y1);
            this.pen.lineTo(x2,y2);
            this.pen.stroke();
        }
    }
    
    /** Draws a quadratic curve using the current stroke style. */
    this.drawQuadCurve = function (x1,y1, cx, cy, x2, y2) {
        if(!cy) {
            // only 3 arguments: assume the args are points p1, control, p2.
            this.pen.beginPath();
            this.pen.moveTo(x1.x, x1.y);
            this.pen.quadraticCurveTo(y1.x, y1.y, cx.x, cx.y);
            this.pen.stroke();
        }
        else {
            this.pen.beginPath();
            this.pen.moveTo(x1, y1);
            this.pen.quadraticCurveTo(cx,cy,x2,y2);
            this.pen.stroke();
        }
    }
    
    /** Draws a cubic curve using the current stroke style. */
    this.drawCubicCurve = function (x1, y1, cx1, cy1, cx2, cy2, x2, y2) {
        if(!cx2) {
            // only 4 arguments:
            // assume the args are points p1, ctrl1, ctrl2, p2.
            this.pen.beginPath();
            this.pen.moveTo(x1.x, x1.y);
            this.pen.bezierCurveTo(y1.x, y1.y, cx1.x, cx1.y, cy1.x, cy1.y);
            this.pen.stroke();
        }
        else {
            this.pen.beginPath();
            this.pen.moveTo(x1, y1);
            this.pen.bezierCurveTo(cx1, cy1, cx2, cy2, x2, y2);
            this.pen.stroke();
        }
    }
    
    /** Draws text using the current fill and stroke style. */
    this.drawString = function (txt, x, y, maxWid, opts) {
        if(!maxWid)
            maxWid = this.pen.measureText(txt).width;
        
        if(!opts)
            opts = 0x11;
        if((opts & this.ONLYFILL) != 0) 
            this.pen.fillText(txt,x,y,maxWid);
        if((opts & this.ONLYSTROKE) != 0)
            this.pen.strokeText(txt,x,y,maxWid);
    }
    
    /** Draws an image from an image element or another canvas. */
    this.drawImage = function(img, x, y, w, h, sx, sy, sw, sh) {
        if(!w) {
            // just draw the image as-is.
            this.pen.drawImage(img, x, y);
        }
        else if(!sh) {
            // draw scaled image
            this.pen.drawImage(img, x, y, w, h);
        }
        else {
            // draw cropped image
            this.pen.drawImage(img, sx, sy, sw, sh, x, y, w, h);
        }
    }
    
    /** Returns a copy of the current transform matrix. It is highly recommended that you use JagePen's getTransform and setTransform methods instead of directly manipulating canvas's context's transform directly. Canvas currently has no method to obtain its context's current transform, so Jage has to keep track of it itself using its transform. */
    this.getTransform = function() {
        return this.trans.clone();
    }
    
    /** Sets the pen's current transform matrix using a JageAffTrans. */
    this.setTransform = function (at) {
        this.trans = at.clone();
        this.pen.setTransform(at.m00, at.m10, at.m01, at.m11, at.m02, at.m12);
    }
    
    /** Transforms the pen's current transform matrix using a JageAffTrans. */
    this.transform = function (at) {
        this.trans.cat(at);
        at = this.trans;
        this.pen.setTransform(at.m00, at.m10, at.m01, at.m11, at.m02, at.m12);
    }
    
    /** Resets the pen's transform, clipping area, fillStyle, and strokeStyle. */
    this.reset = function () {
        this.pen.transform(JageAffTrans.id());
        this.pen.beginPath();
        this.pen.rect(0, 0, this.pen.canvas.width, this.pen.canvas.height);
        this.pen.clip();
        this.pen.fillStyle = "black";
        this.pen.strokeStyle = "black";
    }
    
    /** Sets the pen's fill color. */
    this.setFill = function (color) {
        this.pen.fillStyle = color;
    }
    
    /** Sets the pen's stroke style. */
    this.setStroke = function (stroke) {
        this.pen.strokeStyle = stroke;
    }
}






 
 