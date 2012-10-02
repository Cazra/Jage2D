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
    
    // our JagePanes. pane3 is nested in pane2 which is nested in pane1.
    self.pane1 = new TestPane(100,200,640,480, canvas);
    self.pane1.paneNumber = 1;
    
    self.pane2 = new TestPane(160, 100, 640, 480, self.pane1);
    self.pane2.rotate(45);
    self.pane2.scale(2,1);
    self.pane2.paneNumber = 2;
    
    self.pane3 = new TestPane(50, 50, 320, 200, self);
    self.pane3.rotate(-45);
    self.pane3.paneNumber = 3;
    
    // nest the panes inside each other.
    self.pane1.addComponent(self.pane2);
    self.pane2.addComponent(self.pane3);
    
    
    
    // We'll use some of my artwork as a really big test image to demonstrate the camera object with.
    // In this example, this is really just to show that pane1 is clipping properly.
    self.testImg = new Image();
    self.testImg.src = '../bigExampleImg.png'; 
    
    // Here we're adding the testImg to our app's JageImageLoader so that we can wait for it to finish loading.
    self.imageLoader.addImage(self.testImg);
    
    
    
    self.logic = function() { 
        // do nothing if our test image is still loading.
        if(self.imageLoader.isLoading) return;
        
        self.mouse.poll();
        self.keyboard.poll();
        
        // camera-controlled background. This isn't important for this example except for demonstrating that the top pane is clipping properly.
        self.bgCameraControls();
       
        // see if our mouse is over any of the panes!
        self.pane1.isMouseOvered = false;
        self.pane2.isMouseOvered = false;
        self.pane3.isMouseOvered = false;
        
        if(self.pane3.containsScreenPt(self.mouse.position))
            self.pane3.isMouseOvered = true;
        else if(self.pane2.containsScreenPt(self.mouse.position))
            self.pane2.isMouseOvered = true;
        else if(self.pane1.containsScreenPt(self.mouse.position))
            self.pane1.isMouseOvered = true;
        
        
    };
    
    
    // Does the camera control stuff from the Camera example. This isn't the important part of this example.
    self.bgCameraControls = function() {
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
    }
    
    
    self.render = function(pen) {
        pen.clear("white");
        pen.setFill("black");
        pen.pen.font = "12px sans-serif";
        
        if(self.imageLoader.isLoading) {
            // while our test image is still loading, display some big text 
            // to let the user know that it is loading.
            pen.pen.font = "28px sans-serif";
            pen.drawString("Loading test image... ",300,340);
        }
        else {
            // Use the camera's transform, but save our original transform first.
            var origTrans = pen.getTransform();
            pen.setTransform(self.camera.trans);
            
            // draw our test image.
            pen.drawImage(self.testImg,0,0);
            
            // restore our original transform.
            pen.setTransform(origTrans);
            
            // draw our pane.
            self.pane1.render(pen);
            
            // instructional text
            pen.drawString("Drag with mouse to pan the camera. ",20,20);
            pen.drawString("Use mouse wheel to zoom in and out.", 20, 40);
            pen.drawString("Hold Q to rotate the camera.", 20, 60);
            pen.drawString("Press R to reset the camera.", 20, 80);
            
            var pane1mousePos = self.pane1.screen2CompCoords(self.mouse.position);
            var pane2mousePos = self.pane2.screen2CompCoords(self.mouse.position);
            var pane3mousePos = self.pane3.screen2CompCoords(self.mouse.position);
            pen.drawString("Mouse position in pane1: " + pane1mousePos.toString(), 20, 120);
            pen.drawString("Mouse position in pane2: " + pane2mousePos.toString(), 20, 140);
            pen.drawString("Mouse position in pane3: " + pane3mousePos.toString(), 20, 160);
        }
        pen.drawString(self.timer.frameRate, 480,20);
    }
    
    return self;
}


/** A pane with a pane in it. */
function TestPane(x,y,w,h,par) {
    var self = new JagePane(x,y,w,h,par);
    
    self.paneNumber = 0;
    
    // highlights this pane if true
    self.isMouseOvered = false;
    
    /** Draws the pane with its label, a red circle, and its contents. */
    self.superdrawComponents = self.drawComponents;
    self.drawComponents = function(pen) {
        if(self.isMouseOvered)
            pen.clear("#AFA");
        else
            pen.clear("#FFF");
        
        pen.setFill("red");
        pen.drawString("Pane" + self.paneNumber, 10,20);
        pen.drawCircle(160,100,20);
        
        // draw the contents of this pane.
        self.superdrawComponents(pen);
    }

    
    return self;
}


$(document).ready(function () {
	// obtain our graphics context from the canvas object.
	var c1 = document.getElementById("app1");
    
    var myApp = new TestApp(c1,c1.id);
    myApp.start();   


});


