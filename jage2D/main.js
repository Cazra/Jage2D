/* *
	main
	This function is called when all the elements of the document are ready. 
    It initializes all the objects for our application and then starts up the update loop.
* */

var testImg = new Image();
testImg.src = 'http://fc06.deviantart.net/fs70/f/2012/228/d/9/vacation_to_earth_by_cazra-d5bdt6n.png'; // Have some artwork of mine to test out image rendering with!


/** A very simple Jage2D application that displays the frame rate as a moving sprite. */
function TestApp(canvas,id) {
    var self = new JageApp(canvas,id);
    
    self.mouse = new JageMouse(canvas);
    self.fpsSprite = new TestSprite(0,30, self);
    
    self.logic = function() { 
        self.mouse.poll();
        self.fpsSprite.move();
    };
    
    self.render = function(pen) {
        pen.clear("white");
        pen.setFill("black");
        pen.pen.font = "16px sans-serif";
        self.fpsSprite.render(pen);
        pen.drawString("Preferred frame rate: " + self.timer.preferredFrameRate, 20, 50, null, pen.ONLYFILL);
        pen.drawString(document.getElementById(self.id).offsetTop, 20, 70, null, pen.ONLYFILL);
        
        // draw the mouse pointer
        if(self.mouse.isLeftPressed) pen.setFill("red");
        if(self.mouse.isRightPressed) pen.setFill("green");
        if(self.mouse.isMiddlePressed) pen.setFill("blue");
        
        var mouseX = self.mouse.position.x;
        var mouseY = self.mouse.position.y;
        
        pen.drawCircle(mouseX, mouseY, 10);
        
        
        if(self.mouse.wheel < 0) pen.drawLine(mouseX, mouseY, mouseX, mouseY-30);
        if(self.mouse.wheel > 0) pen.drawLine(mouseX, mouseY, mouseX, mouseY+30);
    }
    
    return self;
}

/** A test sprite for that displays an application's frame rate. */
function TestSprite(x,y,app) {
    var self = new JageSprite(x,y);
    
    self.app = app;
    self.dx = Math.random()*5 + 0.1;
    
    self.focalX = 10;
    self.focalY = -8;
    
    self.scale(5.0,3.0);
    self.opacity = 0.5;
    
    self.move = function() {
        self.x += self.dx;
        if(self.x > 640) 
            self.x = 0;
            
        self.y += 1;
        if(self.y > 480)
            self.y = 0;
        
        self.rotate(self.angle + 3);
    }
    
    self.draw = function(pen) {
        pen.drawString(self.app.timer.frameRate, 0, 0, null, pen.ONLYFILL);
        pen.drawCircle(self.focalX,self.focalY,2);
    }
    
    return self;
}



$(document).ready(function () {
	// obtain our graphics context from the canvas object.
	var c1 = document.getElementById("app1");
    var c2 = document.getElementById("app2");
    
    var myApp = new TestApp(c1,c1.id);
    myApp.start();   
    
    var myApp2 = new TestApp(c2,c2.id);
    myApp2.start();

});


