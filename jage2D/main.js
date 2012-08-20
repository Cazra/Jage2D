/* *
	main
	This function is called when all the elements of the document are ready. 
    It initializes all the objects for our application and then starts up the update loop.
* */

var testImg = new Image();
testImg.src = 'http://fc06.deviantart.net/fs70/f/2012/228/d/9/vacation_to_earth_by_cazra-d5bdt6n.png'; // Have some artwork of mine to test out image rendering with!



function testApp(pen,id) {
    var self = new JageApp(pen,id);
    
    self.fpsSprite = new TestSprite(0,30, self);
    
    self.logic = function() { 
        self.fpsSprite.move();
    };
    
    self.render = function(pen) {
        pen.clear("white");
        pen.setFill("black");
        pen.pen.font = "16px sans-serif";
        self.fpsSprite.render(pen);
        pen.drawString("Preferred frame rate: " + self.timer.preferredFrameRate, 20, 50, null, pen.ONLYFILL);
    }
    
    return self;
}

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
	var c = document.getElementById("canvas");
    var c2 = document.getElementById("canvas2");
    
    var myApp = new testApp(c,"app1");
    myApp.start();   
    
    var myApp2 = new testApp(c2,"app2");
    myApp2.start();

});


