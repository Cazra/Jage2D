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
 * JageMath
 * Provides some commonly used mathematical functions 
 * used in game programming.
 *
 * All trigonometric functions in JageMath assume that angles increase going 
 * counter-clockwise. Since y coordinates in canvas increase downward, this means that
 * unlike in highschool mathmatics, 90 degrees faces in the negative y direction and 270 
 * degrees faces in the positive y direction. Please keep this in mind. 
 * */
 
function JageMath() {
}
 
/** Converts from degrees to radians */
JageMath.d2r = function (degrees) {
    return Math.PI*degrees/180.0;
}

/** Converts from radians to degrees */
JageMath.r2d = function (radians) { 
    return 180.0*radians/Math.PI;
}

/** sin with degree input */
JageMath.sin = function (deg) {
    return Math.sin(JageMath.d2r(deg));
}

/** cos with degree input */
JageMath.cos = function (deg) {
    return Math.cos(JageMath.d2r(deg));
}

JageMath.tan = function (deg) {
    return Math.tan(JagmeMath.d2r(deg));
}

/** computes the angle, in degrees, of a ray from one point extending to another point. */
JageMath.angleTo = function (x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y1 - y2;
    
    var res = JageMath.r2d(Math.atan2(dy,dx));
    if(res < 0) res += 360;
    return res;
}


JageMath.angleToPt = function (p1, p2) {
    try {
        return JageMath.angleTo(p1.x, p1.y, p2.x, p2.y);
    } catch (err) {
        return -1; // error value for when p1 and p2 are not valid points.
    }
}


/** computes the distance between two points. */
JageMath.dist = function (x1, y1, x2, y2) {
    return Math.sqrt(JageMath.dist2(x1, y1, x2, y2));
}

JageMath.distPt = function (p1, p2) {
    try {
        return JageMath.dist(p1.x, p1.y, p2.x, p2.y);
    } catch (err) {
        return -1; // error value for when p1 and p2 are not valid points.
    } 
}

/** computes the square distance between two points */
JageMath.dist2 = function (x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    
    return dx*dx + dy*dy;
}

JageMath.dist2Pt = function (p1, p2) {
    try {
        return JageMath.dist2(p1.x, p1.y, p2.x, p2.y);
    } catch (err) {
        return -1; // error value for when p1 and p2 are not valid points.
    }
}



/* *
 * JagePoint
 * A lightweight class for representing a point in 2D space.
 * */
function JagePoint(x,y) {
    this.x = x;
    this.y = y;
    
    this.toString = function() {
        return "(" + this.x + ", " + this.y + ")";
    }
}

/* *
 * JageAffineTransform
 * A class for representing 3x3 affine transform matrices.
 * */
function JageAffTrans (scx, shy, shx, scy, dx, dy) {

    this.m00 = scx;
    this.m10 = shy;
    this.m01 = shx;
    this.m11 = scy;
    this.m02 = dx;
    this.m12 = dy;
    
    
    /** Applies a translation to this matrix. Returns this for chaining. */
    this.translate = function(x,y) {
        this.m02 += this.m00*x + this.m01*y;
        this.m12 += this.m10*x + this.m11*y;
        
        return this;
    }
    
    /** Applies a rotation to this matrix. Returns this for chaining. */
    this.rotate = function(degrees) {
        var cos = JageMath.cos(degrees);
        var sin = JageMath.sin(degrees);
        
        var m00 = this.m00*cos + this.m01*sin;
        var m01 = this.m01*cos - this.m00*sin;
        var m10 = this.m10*cos + this.m11*sin;
        var m11 = this.m11*cos - this.m10*sin;
        
        this.m00 = m00;
        this.m01 = m01;
        this.m10 = m10;
        this.m11 = m11;
        
        return this;
    }
    
    /** Applies a scale to this matrix. Returns this for chaining. */
    this.scale = function(x,y) {
        this.m00 *= x;
        this.m01 *= y;
        this.m10 *= x;
        this.m11 *= y;
        
        return this;
    }
    
    /** Applies a shear to this matrix. Returns this for chaining. */
    this.shear = function(x,y) {
        var m00 = this.m00 + this.m01*y;
        var m01 = this.m00*x + this.m01;
        var m10 = this.m10 + this.m11*y;
        var m11 = this.m10*x + this.m11;
        
        this.m00 = m00;
        this.m01 = m01;
        this.m10 = m10;
        this.m11 = m11;
        
        return this;
    }
    
    /** Concatenates this transform with another transform. As a matrix multiplication, 
     this is: this = this x other 
     Returns this for chaining. */
    this.cat = function(other) {
        var m00 = this.m00*other.m00 + this.m01*other.m10;
        var m01 = this.m00*other.m01 + this.m01*other.m11;
        var m02 = this.m00*other.m02 + this.m01*other.m12 + this.m02;
        var m10 = this.m10*other.m00 + this.m11*other.m10;
        var m11 = this.m10*other.m01 + this.m11*other.m11;
        var m12 = this.m10*other.m02 + this.m11*other.m12 + this.m12;
        
        this.m00 = m00;
        this.m01 = m01;
        this.m02 = m02;
        this.m10 = m10;
        this.m11 = m11;
        this.m12 = m12;
        
        return this;
    }
    
    /** Returns the inverse transform of this. */
    this.inv = function() {
        var detI = 1.0/(this.m00*this.m11 - this.m01*this.m10);
        
        var m00 = detI*this.m11;
        var m10 = 0-detI*this.m10;
        var m01 = 0-detI*this.m01;
        var m11 = detI*this.m00;
        
        var m02 = detI*(this.m01*this.m12 - this.m11*this.m02);
        var m12 = detI*(this.m10*this.m02 - this.m00*this.m12);
        
        return new JageAffTrans(m00,m10,m01,m11,m02,m12);
    }
    
    /** Applies this transform to a JagePoint and returns the new JagePoint. */
    this.apply = function(pt) {
        return new JagePoint(pt.x*this.m00 + pt.y*this.m01 + this.m02,
            pt.x*this.m10 + pt.y*this.m11 + this.m12);
    }
    
    /** Returns a string representation of this affine transform. */
    this.toString = function () {
        return "[" + this.m00 + " \t," + this.m01 + " \t ," + this.m02 + 
        "\n" + this.m10 + " \t," + this.m11 + " \t," + this.m12 + 
        "\n0 \t,0 \t,1 ]";
    }
    
    /** Returns a clone of this affine transform. */
    this.clone = function () {
        return new JageAffTrans(this.m00,this.m10,this.m01,this.m11,this.m02,this.m12);
    }
}

/** Creates an instance of an identity transform. */
JageAffTrans.id = function () {
    return new JageAffTrans(1,0,0,1,0,0);
}

/** Creates an instance of an affine transform for a translation. */
JageAffTrans.tran = function (x,y) {
    return new JageAffTrans(1,0,0,1,x,y);
}

/** Creates an instance of an affine transform for a rotation. */
JageAffTrans.rot = function (degrees) {
    var rads = JageMath.d2r(degrees);
    var cos = Math.cos(rads);
    var sin = Math.sin(rads);
    return new JageAffTrans(cos,sin,0-sin,cos,0,0);
}

/** Creates an instance of an affine transform for a scale. */
JageAffTrans.scale = function (x,y) {
    return new JageAffTrans(x,0,0,y,0,0);
}

/** Returns the result of multiplying two affine transforms. That is: m1 x m2*/
JageAffTrans.mul = function(m1, m2) {
    return (m1.clone()).cat(m2);
}


