"use strict";

(function () {
	
	$('input').on('blur', function () {
		var input = {}
		input.name = $('#name').val()
		input.email = $('#email').val()
		input.subject = $('#subject').val()
		input.msg = $('#message').val()
		//console.log(input)
		if(input.name != "" && input.email != "" && input.subject != "") {
			//console.log('activatebutton')
			$('#sendEmail').removeAttr('disabled').css('color','black')
			$('#fillIn >').remove()
		}		
	})
	
	$('#sendEmail').on('click',function () {
		var input = {}
		input.name = $('#name').val()
		input.email = $('#email').val()
		input.subject = $('#subject').val()
		input.msg = $('#message').val()
		//console.log('click')
		$('#sendEmail').css('color','grey').attr('disabled','disabled')
		sendEmail(input) 
	})
	
	
	function sendEmail (data) {
		data.resp = grecaptcha.getResponse()
		var json = JSON.stringify(data)
		$.post('/email', json, function (response) {
			console.log(response)
			if (response.RecaptchaStatus == true) {
				$('#fillIn >').remove()
				$('<h3>Email Sent</h3>').appendTo('#fillIn');
			}else {
				$('#fillIn >').remove()
				$('<h3>Error Try again</h3>').appendTo('#fillIn');
			}
		})
		
	}
})()