/* *
	main
	This function is called when all the elements of the document are ready. 
    It initializes all the objects for our application and then starts up the update loop.
* */


/** A very simple Jage2D application that displays the frame rate as a moving sprite. */
function TestApp(canvas,id) {
    var self = new JageApp(canvas,id);

    // our JagePanes. pane3 is nested in pane2 which is nested in pane1.
    self.pane1 = new TestPane(100,200,640,480, canvas);
    
    // We'll use some of my artwork as a really big test image to demonstrate the camera object with.
    // In this example, this is really just to show that pane1 is clipping properly.
    self.testImg = new Image();
    self.testImg.src = '../bigExampleImg.png'; 
    
    // Here we're adding the images to our app's JageImageLoader so that we can wait for it to finish loading.
    HUDImages.load(self.imageLoader);
    
    
    self.logic = function() { 
        // do nothing if our test image is still loading.
        if(self.imageLoader.isLoading) return;
        
        // prepare the cropped images used by our HUD components.
        if(HUDImages.buttonsImg.justFinishedLoading) {
            HUDImages.buttonsImg.justFinishedLoading = false;
            HUDImages.prepareCroppedImages();
            
        }
        
        self.mouse.poll();
        self.keyboard.poll();
        
        self.pane1.logic(self.mouse, self.keyboard);
    };
    
    
    
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
            // draw our pane.
            self.pane1.render(pen);
            
            // instructional text
            pen.drawString("Use the scrollbars or mouse wheel to scroll the image in its pane. ",20,20);
            pen.drawString("Use the Page Up/Page Down to scroll the image a lot. ",20,40);
            pen.drawString("Hold Up or Down to scale the image.", 20, 60);
            pen.drawString("That dot uses the mouse's world coordinates inside the scrollable JagePane.", 20,80);

            
        }
        pen.drawString(self.timer.frameRate, 480,20);
    }
    
    return self;
}


/** A pane with a pane in it. */
function TestPane(x,y,w,h,par) {
    var self = new JagePane(x,y,w,h,par);
    
    // the vertical scrollbar
    self.vScrollbar = new JageVScrollbar(self);
    self.vScrollbar.btnDec = new UpScrollBtn(self.vScrollbar);
    self.vScrollbar.btnInc = new DownScrollBtn(self.vScrollbar);
    
    // the vertical scrollbar
    self.hScrollbar = new JageHScrollbar(self);
    self.hScrollbar.btnDec = new LeftScrollBtn(self.hScrollbar);
    self.hScrollbar.btnInc = new RightScrollBtn(self.hScrollbar);
    
    // The test image displayed in our scrollable pane.
    self.testImg = new Image();
    self.testImg.src = '../bigExampleImg.png'; 
    
    // The scale for the image.
    self.zoom = 1.0;
    
    // a local stolen reference to our application's mouse.
    self.mouse = false;
    
    self.logic = function(mouse, keyboard) {
        // steal our mouse reference.
        if(!self.mouse)
            self.mouse = mouse;
            
        // update the scrollbars' mouse state
        self.updateState(mouse);
        
        // keyboard controls for scaling the image.
        if(keyboard.isPressed[Keys.Up])
            self.zoom *= 1.05;
        if(keyboard.isPressed[Keys.Down])
            self.zoom *= 0.95;
        
        
        // mouse wheel can be used to scroll up the image
        if(mouse.wheel < 0)
            self.vScrollbar.setScrollPos(self.vScrollbar.scrollPos + self.vScrollbar.scrollInc*4);
        if(mouse.wheel > 0)
            self.vScrollbar.setScrollPos(self.vScrollbar.scrollPos - self.vScrollbar.scrollInc*4);
        
        // Page Up/Down keys scroll vertically by the pane's height.
        if(keyboard.justPressedRep[Keys.PageUp])
            self.vScrollbar.setScrollPos(self.vScrollbar.scrollPos - self.vScrollbar.height);
        if(keyboard.justPressedRep[Keys.PageDown])
            self.vScrollbar.setScrollPos(self.vScrollbar.scrollPos + self.vScrollbar.height);
        
        // update the content dimensions of our pane's scrollbars.
        self.vScrollbar.setContentHeight(self.testImg.height * self.zoom);
        self.hScrollbar.setContentWidth(self.testImg.width * self.zoom);
    }
    
    /** Draws the pane with its label, a red circle, and its contents. */
    var superdrawComponents = self.drawComponents;
    self.drawComponents = function(pen) {
        var origTrans = pen.getTransform();
        
        // apply our zoom. Be sure to update the scrollTransform too. Although it's already been applied, we
        // need to use the zoomed version to correctly compute the mouse's world coordinates.
        var zoomTrans = JageAffTrans.scale(self.zoom,self.zoom);
        pen.transform(zoomTrans);
        self.scrollTransform.cat(zoomTrans);
        
        // Draw our large image.
        pen.drawImage(self.testImg,0,0);
        
        // draw the contents of this pane.
        superdrawComponents(pen);
        
        // Draw a small circle at the mouse's world coordinates inside the scrollable area. 
        var mouseWorld = self.screen2ScrollCoords(self.mouse.position);
        pen.pen.lineWidth = 1;
        pen.setStroke("black");
        pen.setFill("black");
        pen.drawCircle(mouseWorld.x, mouseWorld.y, 2);
        
        
        pen.setTransform(origTrans);
    }
    
    /** 
     * draw an empty button thing in the corner where the scrollbars meet just to make the corner prettier.
     * Without it, there would be sort of a hole there where you can see part of the image that is supposed to be "offscreen"
     * in the scrolling area. 
     */
    self.drawScrollCorner = function(pen) {
        pen.drawImage(HUDImages.sbtnNotPressImg, 0, 0);
    }
    
    return self;
}


// custom buttons for our scrollbars:
function UpScrollBtn (scrollbar) {
    var self = new JageButton(0,0,scrollbar);
    
    self.width = 16;
    self.height = 16;
    
    self.draw = function(pen) {
        if(self.isPressed && self.parent.isDragged)
            pen.drawImage(HUDImages.sbtnPressImg,0,0);
        else
            pen.drawImage(HUDImages.sbtnNotPressImg,0,0);
        
        if(self.isDisabled)
            pen.drawImage(HUDImages.scrollUpGreyImg,0,0);
        else
            pen.drawImage(HUDImages.scrollUpImg,0,0);
    }
    
    return self;
}


function DownScrollBtn (scrollbar) {
    var self = new JageButton(0,0,scrollbar);
    
    self.width = 16;
    self.height = 16;
    
    self.draw = function(pen) {
        if(self.isPressed && self.parent.isDragged)
            pen.drawImage(HUDImages.sbtnPressImg,0,0);
        else
            pen.drawImage(HUDImages.sbtnNotPressImg,0,0);
        
        if(self.isDisabled)
            pen.drawImage(HUDImages.scrollDownGreyImg,0,0);
        else
            pen.drawImage(HUDImages.scrollDownImg,0,0);
    }
    
    return self;
}

function LeftScrollBtn (scrollbar) {
    var self = new JageButton(0,0,scrollbar);
    
    self.width = 16;
    self.height = 16;
    
    self.draw = function(pen) {
        if(self.isPressed && self.parent.isDragged)
            pen.drawImage(HUDImages.sbtnPressImg,0,0);
        else
            pen.drawImage(HUDImages.sbtnNotPressImg,0,0);
        
        if(self.isDisabled)
            pen.drawImage(HUDImages.scrollLeftGreyImg,0,0);
        else
            pen.drawImage(HUDImages.scrollLeftImg,0,0);
    }
    
    return self;
}


function RightScrollBtn (scrollbar) {
    var self = new JageButton(0,0,scrollbar);
    
    self.width = 16;
    self.height = 16;
    
    self.draw = function(pen) {
        if(self.isPressed && self.parent.isDragged)
            pen.drawImage(HUDImages.sbtnPressImg,0,0);
        else
            pen.drawImage(HUDImages.sbtnNotPressImg,0,0);
        
        if(self.isDisabled)
            pen.drawImage(HUDImages.scrollRightGreyImg,0,0);
        else
            pen.drawImage(HUDImages.scrollRightImg,0,0);
    }
    
    return self;
}



/** A static library for the images used by the HUD. */
function HUDImages() {}

/** Gets the big image containing the images for all the HUD sprites and loads it. */
HUDImages.load = function(imageLoader) {
    HUDImages.buttonsImg = new Image();
    HUDImages.buttonsImg.src = "hudButtons.png";
    
    imageLoader.addImage(HUDImages.buttonsImg);
}

/** Prepares the cropped images for all the HUD sprites and stores references to those images in the HUD library. */
HUDImages.prepareCroppedImages = function() {
    // small buttons press/unpress
    HUDImages.sbtnNotPressImg = JagePen.cropImage(HUDImages.buttonsImg, 16, 0, 16, 16);
    HUDImages.sbtnPressImg = JagePen.cropImage(HUDImages.buttonsImg, 32, 0, 16, 16);
    
    HUDImages.scrollUpImg = JageImgEffects.transparentColor(JagePen.cropImage(HUDImages.buttonsImg,48,0,16,16), 255,200,255);
    HUDImages.scrollDownImg = JageImgEffects.transparentColor(JagePen.cropImage(HUDImages.buttonsImg,64,0,16,16), 255,200,255);
    HUDImages.scrollUpGreyImg = JageImgEffects.transparentColor(JagePen.cropImage(HUDImages.buttonsImg,80,0,16,16), 255,200,255);
    HUDImages.scrollDownGreyImg = JageImgEffects.transparentColor(JagePen.cropImage(HUDImages.buttonsImg,96,0,16,16), 255,200,255);
    
    HUDImages.scrollLeftImg = JageImgEffects.transparentColor(JagePen.cropImage(HUDImages.buttonsImg,112,0,16,16), 255,200,255);
    HUDImages.scrollRightImg = JageImgEffects.transparentColor(JagePen.cropImage(HUDImages.buttonsImg,128,0,16,16), 255,200,255);
    HUDImages.scrollLeftGreyImg = JageImgEffects.transparentColor(JagePen.cropImage(HUDImages.buttonsImg,144,0,16,16), 255,200,255);
    HUDImages.scrollRightGreyImg = JageImgEffects.transparentColor(JagePen.cropImage(HUDImages.buttonsImg,160,0,16,16), 255,200,255);
}




$(document).ready(function () {
	// obtain our graphics context from the canvas object.
	var c1 = document.getElementById("app1");
    
    var myApp = new TestApp(c1,c1.id);
    myApp.start();   


});


