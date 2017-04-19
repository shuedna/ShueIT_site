"use strict";

(function  (){
	function menu () {
		
	};
	
	console.log("script");
	

	$('#menubtn').on('click',function () {
		console.log('click')
		if ($('.flexcont').css('display') == "block") {
			if ($('#menudiv').css('display') == "none") {
				$('#menudiv').css('display','block')
			}else{
				$('#menudiv').css('display','none')
			}
		}else{
			$('#menudiv').css('display','block')
		}
	})
	
})()