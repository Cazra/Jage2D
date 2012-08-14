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
 * JageCamera
 * Used to create a 2D camera affine transform and provide functions for 
 * converting back and forth from world to canvas coordinates with this transform.
 * Inputs: painter is a CanvasRenderingContext2D.
 * */

function JageCamera(painter) {
	// Require that the painter is a CanvasRenderingContext2D.
	if(painter instanceof CanvasRenderingContext2D) {
        this.painter = painter;
    
        this.x = 0.0;
        this.y = 0.0;
        this.cx = 0.0;
        this.cy = 0.0;
        this.zoom = 1.0;
        this.angle = 0.0;
		this.width = painter.canvas.width;
		this.height = painter.canvas.height;
		
		
	}
	else {
		alert("Caution: This camera doesn't have a graphics context.");
	}
	
}


 
