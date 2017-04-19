"use strict";

(function () {
	
	$('.msg').on('blur', function () {
		var input = {}
		input.name = $('#messageName').val()
		input.email = $('#messageEmail').val()
		input.subject = $('#messageSubject').val()
		//console.log(input)
		if(input.name != "" && input.email != "" && input.subject != "") {
			//console.log('activatebutton')
			$('#sendMessage').removeAttr('disabled').css('color','white')
		}		
	})
	
	$('#sendMessage').on('click',function () {
		var input = {}
		input.name = $('#messageName').val()
		input.email = $('#messageEmail').val()
		input.subject = $('#messageSubject').val()
		input.msg = $('#messageBody').val()
		//console.log('click')
		$('#sendMessage').css('color','grey').attr('disabled','disabled')
		sendEmail(input) 
	})
	
	
	function sendEmail (data) {
		data.resp = grecaptcha.getResponse()
		var json = JSON.stringify(data)
		$.post('/post/email', json, function (response) {
			console.log(response)
			if (!response.RecaptchaStatus || response.err ) {
				$('.msg').text("")
				alertMsg('Error Try again')
			}else if (response.couchReply && response.couchReply.error){
				$('.msg').text("")
				alertMsg('Error Try again')
			}else{
				$('.msg').text("")
				alertMsg('Message Sent')
				$('#dim').remove()
				$('#messageBox').addClass('hide')
			}
		
		})	
	}
	
	function alertMsg (msg) {
		alert(msg)
	}
	
})()