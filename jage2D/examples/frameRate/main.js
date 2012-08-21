

/** A very simple Jage2D application that displays the frame rate. */
function TestApp(canvas,id, fps) {
    var self = new JageApp(canvas,id ,fps);
    
    self.logic = function() { 
    };
    
    self.render = function(pen) {
        pen.clear("white");
        pen.setFill("black");
        pen.pen.font = "16px sans-serif";
        pen.drawString("Preferred frame rate: " + self.timer.preferredFrameRate, 20, 50, null, pen.ONLYFILL);
        pen.drawString("Actual frame rate: " + self.timer.frameRate, 20, 80, null, pen.ONLYFILL);
    }
    
    return self;
}


/** The "main" function for our program will be called when the document's components are ready. */
$(document).ready(function () {
	// obtain our graphics context from the canvas object.
	var c1 = document.getElementById("app1");
    
    // prompt the user to enter the frame rate for this example.
    var fps = prompt("Enter preferred frame ratein range [1,120].");
    if(fps <1) fps = 1;
    if(fps > 120) fps = 120;
    
    // create the example application and start it.
    var myApp = new TestApp(c1, c1.id, fps);
    myApp.start();   

});


