/* *
	main
	This function is called when all the elements of the document are ready. 
    It initializes all the objects for our application and then starts up the update loop.
* */

$(document).ready(function () {
	// obtain our graphics context from the canvas object.
	var c = document.getElementById("canvas");
	var gfx = c.getContext("2d");
    var pen = new JagePen(gfx);
    
    var testImg = new Image();
    testImg.src =     'http://fc06.deviantart.net/fs70/f/2012/228/d/9/vacation_to_earth_by_cazra-d5bdt6n.png';

});


