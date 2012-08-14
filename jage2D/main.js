/* *
	main
	This function is called when all the elements of the document are ready. It initializes all the objects for our
		application and then starts up the update loop.
	Postconditions: The application is started and enters the update loop.
* */

$(document).ready(function () {
	// obtain our graphics context from the canvas object.
	var c = document.getElementById("canvas");
	var gfx = c.getContext("2d");
    var degrees = prompt("Input an angle as degrees: ", "");
    alert("you said " + degrees)
    alert("In radians: " + JageMath.d2r(degrees));
    alert("cos: " + JageMath.cos(degrees));
    alert("sin: " + JageMath.sin(degrees));

});


