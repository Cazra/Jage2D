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

 /** 
 * JageImageLoader
 * A datastructure that maintains a list of Image elements waiting to be loaded.
 * The JageApp class comes with one of these bound to its imageLoader property.
 */
function JageImageLoader() {
    // our list of images waiting to finish loading.
    this.images = [];
    
    // a flag that is true iff images is empty - that is, there are no more images waiting to load.
    this.isLoading = false;
    
    /** Adds an image to our list of images waiting to finish loading. */
    this.addImage = function (image) {
        this.images.push(image);
        this.isLoading = true;
    }
    
    /** Updates the list of images by removing the ones that have finished loading. 
    Returns a flag that is true iff images is not empty. */
    this.update = function() {
        var newList = [];
        
        for(key in this.images) {
            var img = this.images[key];
            if(!img.complete) {
                newList.push(img);
            }
            else {
                // we'll hack a flag onto our image to tell the user that it just finished
                // loading, in case they want to apply any filters to the image before 
                // actually using it. Just remember to set this to false when you're done with it.
                img.justFinishedLoading = true;
            }
        }
        
        this.images = newList;
        
        // set isLoading to true iff the updated list is not empty. Else false.
        this.isLoading = (newList.length > 0);
    }
    
    
}
 
 
/* *
 * JagePen 
 * A wrapper for CanvasRenderingContext2D, providing functions that make
 * it a little easier to use and transparently portable.
 * Many of its methods are similar to those of java.awt.Graphics2D in Java.
 * Inputs: pen is a CanvasRenderingContext2D.
 * */
 
function JagePen(pen) {
    // DATA
    
    /** A reference to the CanvasRenderingContext2D wrapped by this. */
    this.pen = pen;
    
    /** A reference to the current Affine Transform used by this. */
    this.trans = JageAffTrans.id();
    
    /** A constant used by some methods to tell the pen to only stroke a shape and not fill it. */
    this.STROKE = 0x00000001;
    
    /** A constant used by some methods to tell the pen to only fill a shape and not stroke it. */
    this.FILL = 0x00000010;
    
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
        if((opts & this.FILL) != 0) 
            this.pen.fill();
        if((opts & this.STROKE) != 0)
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
        if((opts & this.FILL) != 0) 
            this.pen.fill();
        if((opts & this.STROKE) != 0)
            this.pen.stroke();
    }
    
    /** Draws a rectangle using the current fill and stroke style. */
    this.drawRect = function (x,y,w,h, opts) {
        if(!opts)
            opts = 0x11;
        if((opts & this.FILL) != 0) 
            this.pen.fillRect(x,y,w,h);
        if((opts & this.STROKE) != 0)
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
        if((opts & this.FILL) != 0) 
            this.pen.fill();
        if((opts & this.STROKE) != 0)
            this.pen.stroke();
    }
    
    /** Draws a line using the current stroke style. */
    this.drawLine = function (x1, y1, x2, y2) {
        if(x2 == undefined) {
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
        if(cy == undefined) {
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
        if(cx2 == undefined) {
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
        if(maxWid == undefined)
            maxWid = this.pen.measureText(txt).width;
        
        if(!opts)
            opts = 0x11;
        if((opts & this.FILL) != 0) 
            this.pen.fillText(txt,x,y,maxWid);
        if((opts & this.STROKE) != 0)
            this.pen.strokeText(txt,x,y,maxWid);
    }
    
    /** Draws an image from an image element or another canvas. */
    this.drawImage = function(img, x, y, w, h, sx, sy, sw, sh) {
        if(w == undefined) {
            // just draw the image as-is.
            this.pen.drawImage(img, x, y);
        }
        else if(sh == undefined) {
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


/** Static helper method that produces a new empty Canvas 
 that can be used as an image.*/
JagePen.createImage = function (w,h) {
    var result = document.createElement("canvas");
    result.width = w;
    result.height = h;
    return result;
}


/** Creates a canvas image of a string. */
JagePen.createStringImage = function(string, font, color, w, h) {
    var textMCan = document.createElement("canvas").getContext("2d");
    textMCan.font = font;
    var textWidth = textMCan.measureText(string).width;
    var textHeight = textMCan.measureText("m").width * 1.3; // the length of lowercase m is usually a good approximation.
    
    var result = document.createElement("canvas");
    var ctx = result.getContext("2d");
    
    if(!w)
        w = textWidth;
    if(w == 0)
        w = 1;
    result.width = w;
    
    if(!h)
        h = textHeight; 
    if(h == 0)
        h = 1;
    result.height = h*1.3;
    
    ctx.fillStyle = color;
    ctx.font = font;
    
    ctx.fillText(string,0, h - 1);
    //ctx.strokeText(string,0, result.height-1);
    return result;
}

/** 
 * Converts a color from the HSB/HSV model to the RGB model. 
 * All inputs are in the range [0,1], although h can be any floating point number. 
 * It will be wrapped to a value in [0,1] by subtracting its floor. 
 * The output is an array containing the RGB values of the converted color, each are integers in the range [0,255]. 
 */
JagePen.hsb2rgb = function(h,s,b) {
    var hp = (h-Math.floor(h))*6.0;
    var chroma = s*b;
    var x = chroma*(1-Math.abs(hp % 2 - 1));
    var m = b-chroma;
    
    // convert chroma and x to be in our color byte range [0,255]
    chroma = Math.floor(chroma*255);
    x = Math.floor(x*255);
    m = Math.floor(m*255);
    
    if(hp >= 0 && hp < 1)
        return [chroma + m, x + m, m];
    else if(hp >= 1 && hp < 2)
        return [x + m, chroma + m, m];
    else if(hp >= 2 && hp < 3)
        return [m, chroma + m, x + m];
    else if(hp >= 3 && hp < 4)
        return [m, x + m, chroma + m];
    else if(hp >= 4 && hp < 5)
        return [x + m, m, chroma + m];
    else if(hp >= 5 && hp < 6)
        return [chroma + m, m, x + m];
    else
        return [m, m, m];
}

/** 
 * Converts a color from the RGB model to the HSB/HSV model. 
 * All inputs are integers in the range [0,255]. 
 * The output is an array containing the HSB values of the converted color, each in the range [0,1].
 */

JagePen.rgb2hsb = function(r, g, b) {
    var max = Math.max(r,g,b);
    var min = Math.min(r,g,b);
    var chroma = max-min;
    
    // compute the hue
    var hue = 0;
    if(chroma == 0) 
        hue = 0;
    else if(max == r)
        hue = ((g - b)/chroma) % 6;
    else if(max = g)
        hue = ((b-r)/chroma) + 2;
    else
        hue = ((r-g)/chroma) + 4;
    hue /= 6.0;
    
    // compute the brightness/value
    var brightness = max;
    
    // compute the saturation
    var saturation = 0;
    if(chroma != 0)
        saturation = chroma/brightness;
        
    return [hue, saturation, brightness/255.0];
}

 
/** A helper method that converts an Image object into a Canvas object. */
JagePen.convertImg2Canvas = function(image) {
    var result = JagePen.createImage(image.width,image.height);
    var context = result.getContext("2d");
    context.drawImage(image, 0,0);
    
    return result;
}


/** 
 * Static method that returns a cropped portion of an image. 
 * Input: 
 *      image - our source image
 *      x - the left border of our cropping area.
 *      y - the top border of our cropping area.
 *      w - the width of our cropping area.
 *      h - the height of our cropping area.
 */
JagePen.cropImage = function (image, x, y, w, h) {
    var result = JagePen.createImage(w,h);
    var context = result.getContext("2d");
    context.drawImage(image, x, y, w, h, 0,0,w,h);
    
    return result;
}


/** 
 * Static method that returns the array of RGBA pixels for an image or canvas. 
 * This array will also has width and height properties that store the source image's 
 * width, height, and a reference to the ImageData object the pixel array is bound to.
 */
JagePen.getPixels = function(image) {
    // if our image is not a Canvas, turn it into a Canvas.
    if(image instanceof Image) {
        image = JagePen.convertImg2Canvas(image);
    }
    
    var imgData = null;
    var pixels = null;
    try {
        imgData = image.getContext("2d").getImageData(0,0,image.width, image.height);
        pixels = imgData.data;
    }
    catch (err) {
        // Most browsers make it so that Canvas can't manipulate pixels in images from other foreign origins. 
        // I think that's pretty lame, but they say it's for security reasons...
        // If this happens, produce a new error image to work with with the same dimensions as the source image.
        image = JagePen.createImage(image.width, image.height);
        var context = image.getContext("2d");
        context.fillStyle = "black";
        context.strokeStyle = "red";
        context.fillRect(0,0,image.width, image.height);
        context.strokeRect(0,0,image.width, image.height);
        var errStr = "Could not get pixels of cross-origin image";
        context.fillText(errStr,20,20);
        context.strokeText(errStr,20,20);
        context.fillStyle = "blue";
        context.fillRect(image.width*0.3,image.height*0.3,image.width*0.5, image.height*0.5);
        
        imgData = image.getContext("2d").getImageData(0,0,image.width, image.height);
        pixels = imgData.data;
    }
    
    // hack on some other information to our pixel array object.
    pixels.width = image.width;
    pixels.height = image.height;
    pixels.imgData = imgData;
    
    return pixels;
}



/** A library of image filtering effects. */
function JageImgEffects() {
}

/**
 * Static method that returns a copy of an image with all pixels of one color made 
 * transparent.
 */
JageImgEffects.transparentColor = function (img, r, g, b)  {
    var pixels = JagePen.getPixels(img);
    var result = JagePen.createImage(img.width, img.height);
    var context = result.getContext("2d");
    
    for(var i = 0; i< pixels.length; i += 4) {
        var sr = pixels[i];
        var sg = pixels[i+1];
        var sb = pixels[i+2];
        
        // if this pixel's colors match our transparent color, set its alpha value to 0.
        if(r == sr && g == sg && b == sb) {
            pixels[i+3] = 0.0;
        }
    }
    
    // put our pixels into the resulting image.
    context.putImageData(pixels.imgData,0,0);
    return result;
}


/**
 * Static method that returns a copy of an image with an alpha map applied for transparency.
 * The red value of the alpha map's pixels is used to determine that pixel's transparency with
 * 255 being opaque and 0 being transparent. It is assumed that img and alphaImg are the same 
 * size.
 */
JageImgEffects.alphaMap = function (img, alphaImg)  {
    var pixels = JagePen.getPixels(img);
    var result = JagePen.createImage(img.width, img.height);
    var context = result.getContext("2d");
    
    var alphaPixels = JagePen.getPixels(alphaImg);
    
    for(var i = 0; i< pixels.length; i += 4) {
        pixels[i+3] = alphaPixels[i];
    }
    
    // put our pixels into the resulting image.
    context.putImageData(pixels.imgData,0,0);
    return result;
}


/**
 * Static method that returns a copy of an image with the rgb values of its pixels inverted.
 */
JageImgEffects.invert = function (img)  {
    var pixels = JagePen.getPixels(img);
    var result = JagePen.createImage(img.width, img.height);
    var context = result.getContext("2d");
    
    for(var i = 0; i< pixels.length; i += 4) {
        pixels[i] = (255 - pixels[i]);
        pixels[i+1] = (255 - pixels[i+1]);
        pixels[i+2] = (255 - pixels[i+2]);
    }
    
    // put our pixels into the resulting image.
    context.putImageData(pixels.imgData,0,0);
    return result;
}

/**
 * Static method that returns a copy of an image that adds a color to its pixels.
 */
JageImgEffects.add = function (img, r, g, b)  {
    var pixels = JagePen.getPixels(img);
    var result = JagePen.createImage(img.width, img.height);
    var context = result.getContext("2d");
    
    for(var i = 0; i< pixels.length; i += 4) {
        pixels[i] = pixels[i] + r;
        pixels[i+1] = pixels[i+1] + g;
        pixels[i+2] = pixels[i+2] + b;
    }
    
    // put our pixels into the resulting image.
    context.putImageData(pixels.imgData,0,0);
    return result;
}


/**
 * Static method that returns a copy of an image that subtracts a color to its pixels.
 */
JageImgEffects.sub = function (img, r, g, b)  {
    var pixels = JagePen.getPixels(img);
    var result = JagePen.createImage(img.width, img.height);
    var context = result.getContext("2d");
    
    for(var i = 0; i< pixels.length; i += 4) {
        pixels[i] = pixels[i] - r;
        pixels[i+1] = pixels[i+1] - g;
        pixels[i+2] = pixels[i+2] - b;
    }
    
    // put our pixels into the resulting image.
    context.putImageData(pixels.imgData,0,0);
    return result;
}

 
 