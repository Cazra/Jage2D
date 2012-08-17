/* *
	main
	This function is called when all the elements of the document are ready. 
    It initializes all the objects for our application and then starts up the update loop.
* */

var testImg = new Image();
testImg.src = 'http://fc06.deviantart.net/fs70/f/2012/228/d/9/vacation_to_earth_by_cazra-d5bdt6n.png'; // Have some artwork of mine to test out image rendering with!

$(document).ready(function () {
	// obtain our graphics context from the canvas object.
	var c = document.getElementById("canvas");
    var c2 = document.getElementById("canvas2");
    
    var myApp = new JageApp(c,"app1");
    myApp.start();   
    
    var myApp2 = new JageApp(c2,"app2");
    myApp2.start();

});


