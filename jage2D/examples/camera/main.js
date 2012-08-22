/* *
	main
	This function is called when all the elements of the document are ready. 
    It initializes all the objects for our application and then starts up the update loop.
* */


/** A very simple Jage2D application that displays the frame rate as a moving sprite. */
function TestApp(canvas,id) {
    var self = new JageApp(canvas,id);
    
    // our camera object.
    self.camera = new JageCamera(canvas);
    
    // We'll use some of my artwork as a really big test image to demonstrate the camera object with.
    self.testImg = new Image();
    self.testImg.src = 'http://fc06.deviantart.net/fs70/f/2012/228/d/9/vacation_to_earth_by_cazra-d5bdt6n.png';
    
    self.logic = function() { 
        self.mouse.poll();
        self.keyboard.poll();
        
        // drag the left mouse button to pan.
        if(self.mouse.isLeftPressed) {
            self.camera.drag(self.mouse.position);
        }
        
        // stop the drag when we release the left mouse button.
        if(self.mouse.justLeftClicked) {
            self.camera.endDrag();
        }
        
        // zoom in and out with mouse wheel
        if(self.mouse.wheel != 0) {
            self.camera.zoomAtScr(1.0 + (0.25*self.mouse.wheel), self.mouse.position);
        }
        
        // rotate the camera around the last point you clicked by pressing Q
        if(self.keyboard.isPressed[Keys.Q]) {
            self.camera.angle += 5;
            
            // update the camera's transform (in this example, the code for rotation is all that would be updated by this since
            // drag and zoomAtScr update the transform automatically.
            self.camera.updateTransform();
        }
        
        // reset the camera by pressing R
        if(self.keyboard.isPressed[Keys.R]) {
            self.camera.reset();
        }
        
        
        
    };
    
    self.render = function(pen) {
        pen.clear("white");
        pen.setFill("black");
        pen.pen.font = "12px sans-serif";
        
        // Use the camera's transform, but save our original transform first.
        var origTrans = pen.getTransform();
        pen.setTransform(self.camera.trans);
        
        // draw our test image.
        pen.drawImage(self.testImg,0,0);
        
        // restore our original transform.
        pen.setTransform(origTrans);
        
        // instructional text
        pen.drawString("Drag with mouse to pan the camera. ",20,20);
        pen.drawString("Use mouse wheel to zoom in and out.", 20, 40);
        pen.drawString("Hold Q to rotate the camera.", 20, 60);
        pen.drawString("Press R to reset the camera.", 20, 80);
        pen.drawString(self.timer.frameRate, 480,20);
    }
    
    return self;
}


$(document).ready(function () {
	// obtain our graphics context from the canvas object.
	var c1 = document.getElementById("app1");
    
    var myApp = new TestApp(c1,c1.id);
    myApp.start();   


});


