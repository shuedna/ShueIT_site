/*
 * This function is called on the window's onload event.
 */
window.onload = function() {
	// get HTML elements
	var body    = document.getElementById('body');
	var winSize = document.getElementById('winSize');
	var w = window.outerWidth;
	var h = window.outerHeight;
	var txt = "Window size: " + w + "px wide X " + h + "px high.";
	winSize.innerHTML = txt;

	// bind onsize event to body element
	body.onresize = function() {
		w = window.outerWidth;
		h = window.outerHeight;
		txt = "Window size: " + w + "px wide X " + h + "px high.";
		winSize.innerHTML = txt;		
	}
	
}