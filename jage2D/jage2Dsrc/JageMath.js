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
    this.x = x
    this.y = y
}

/* *
 * JageTransform
 * A class for representing affine transform matrices.
 * */

 





