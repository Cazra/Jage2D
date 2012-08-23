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
    self.testImg.src = '../bigExampleImg.png'; 
    
    self.imageLoader.addImage(self.testImg);
    
    self.logic = function() { 
        // do nothing if our test image is still loading.
        if(self.imageLoader.isLoading) return;
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
            // once the finish has just finished loading, replace it with the filtered version.
            if(self.testImg.justFinishedLoading) {
                self.testImg.justFinishedLoading = false;
                
                // draw a big black rectangle on our image
                self.testImg = JagePen.convertImg2Canvas(self.testImg);
                var testImgCtx = self.testImg.getContext("2d");
                testImgCtx.fillStyle = "black";
                testImgCtx.fillRect(self.testImg.width*0.3,self.testImg.height*0.3,self.testImg.width*0.5,self.testImg.height*0.5);
                
                // In this example, we make black (#000000) be our transparent color.
                self.testImg2 = JageImgEffects.transparentColor(self.testImg, 0,0,0);
            }
            
            // draw a long light-red rectangle under the images
            pen.setFill("rgb(255,200,200)");
            pen.drawRect(0,350,1028,100);
            
            // draw our test image.
            pen.drawImage(self.testImg,50,50, 400, 600);
            pen.drawImage(self.testImg2, 500,50, 400, 600);

        }
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


