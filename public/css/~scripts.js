"use strict";

(function () {
	
	function menu () {
		if($('#menuBody').css('display') == "") {
			$('#menuBody').css('display','flex')				
		}else if($('#menuBody').css('display') == "none") {
			$('#menuBody').css('display','flex')	
		}else if($('#menuBody').css('display') == "flex") {
			$('#menuBody').css('display','none')			
		}
	}
	
	$('#menubtn').on('click',function () {
		menu()
		console.log('click')
	})
	
	console.log('script')
	
})()