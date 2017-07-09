"use strict";

(function () {
	
	var remotedb = new PouchDB('https://cdb.shueit.net/blog', {skip_setup: true})
	var remoteimagedb = new PouchDB('https://cdb.shueit.net/images', {skip_setup: true})

	var db = new PouchDB('blog')
	var imagedb = new PouchDB('images')
	
	var filelist = {};
	
	function menu () {
		if($('#login').val() == "") {
			$('#login').removeClass('mobilehide')
			$('#login').val('flex')
		}else if($('#login').val() == "none") {
			$('#login').removeClass('mobilehide')
			$('#login').val('flex')
		}else if($('#login').val() == "flex") {
			$('#login').addClass('mobilehide')
			$('#login').val('none')
		}
	}
	
	function login (){
		remotedb.login($('#user').val(),$('#pass').val(),function (err,response) {
			if (err) {
				console.log(err)
				alert(err)
				return
			}
			console.log(response)
			cmsBodyToggle('show');
			$('#login >').addClass('hide');
			$('#menubtn').addClass('hide')
			$('#logoutbtn').removeClass('hide')
			$('#user').val("")
			$('#pass').val("")
		})
	}
	
	function cmsBodyToggle(action){
		if (action == 'show') {
			$('#cmsbody').removeClass('hide')
		}else if (action == 'hide'){
			$('#cmsbody').addClass('hide')
		}
	}
	
	function dropdown(item) {
		console.log($(item).attr('id'))
		var id = '#' + $(item).attr('id') + ' > img'
		var div = '.' + $(item).attr('id')
		console.log()
		if ($(id).last().hasClass('hide')) {
			$(id).first().addClass('hide')
			$(id).last().removeClass('hide')
			$(div).removeClass('hide')
		}else{
			$(id).first().removeClass('hide')
			$(id).last().addClass('hide')
			$(div).addClass('hide')
		}	
	}
	
	function fileHandler (files) {

		function makeReader(file, num) {
			var reader = new FileReader
			reader.name = file.name 
			reader.fileNum = num
			reader.type = file.type
			reader.onload = function () {
				console.log(reader.result.substring(reader.result.indexOf(',') + 1))
				putData(reader)
			}
			return reader						
		}

		function putData (reader) {
			imagedb.putAttachment(reader.name, reader.name,reader.result.substring(reader.result.indexOf(',') + 1),reader.type,function (err, response){
				if (err) {
					console.log(err)
					console.log(response)
					var num = reader.fileNum + 2 
					var id = '#dropzone :nth-child('+ num +')'
					console.log(id)
					var txt = $(id).text()
					txt += '..Error:' + err.message
					$(id).text(txt)
				}else{
					console.log(response)
					var num = reader.fileNum + 2 
					var id = '#dropzone :nth-child('+ num +')'
					console.log(id)
					var txt = $(id).text()
					txt += '..Done'
					$(id).text(txt)
				}
			})
			
		}

		$('#dropzone :first-child').text("Dropped Files")
		for(var i=0; files.length > i; i++) {
			$('<p>').text(files[i].name).appendTo('#dropzone')
		}
		$('<button>').text('Upload').addClass('button').on('click', function () {
			for(var i=0; files.length > i; i++) {
				var reader = makeReader(files[i], i)
				reader.readAsDataURL(files[i])
			}
		}).appendTo('#dropzone')
		$('<button>').text('Clear').addClass('button').on('click', function () {
			$('#dropzone').removeClass('hasFiles').css('border','dotted')
			$('#dropzone >').remove()
			$('<p>').text('drop files here').appendTo('#dropzone')
		}).appendTo('#dropzone')
	}
	
	function sendBlog() {
		db.put({
			"_id":$('#bloglink').val(),
			"descrpt" : $('#descrpt').val(),
			"imageUrl" : $('#imageUrl').val(),
			"link" : '/blog/' + $('#bloglink').val(),
			"templateUrl": "http://cdb.shueit.net/templates/Template1/template.html",
			"time":Date.now(),
			"date":dateFormat(),
			"section":{
				"title": $('#title').val(),
				"body": tinyMCE.activeEditor.getContent()
			}
		}).then(function(response) {
			console.log(response)
		}).catch(function(err) {
			console.log(err)
		})
	}
	
	function dateFormat() {
		var tempDate = new Date();
		var month = tempDate.getMonth() + 1;
		var date = tempDate.getDate();
		var year = tempDate.getFullYear()
		return (month + '/' + date + '/' + year)
	}
	
	
	// even listeners for menu btn
	$('#menubtn').on('click',function () {
		menu()
		console.log('click')
	})

	//file selector
	$('#fileSel').on('change',function(event) {
		var files = event
		fileHandler(files)
	})
	
	//event listeners for dropbox
	$('#dropzone').on('drop',function(event) {
		event.preventDefault()
		if ( $('#dropzone').hasClass('hasFiles') ) {
			alert ('complete previous transaction or Clear before dropping more files')
		}else{
			$('#dropzone').addClass('hasFiles')
			var files = event.originalEvent.dataTransfer.files
			fileHandler(files)
		}
	})
	
	$('#dropzone').on('dragover',function() {
		event.preventDefault()
		$('#dropzone').css('border','solid')
	})
	
	$('#dropzone').on('dragleave',function() {
		$('#dropzone').css('border','dotted')
	})
	
	//event listeners for list/grid view btns
	$('#listbtn').on('click',function () {
		$('#cmsbody > div').removeClass('row')
	})

	$('#syncbtn').on('click',function () {
		db.replicate.to('https://cdb.shueit.net/blog', function (err,result) {
			if (err) {console.log(err)}
			console.log(result)
		});
		imagedb.replicate.to('https://cdb.shueit.net/images', function (err,result) {
			if (err) {console.log(err)}
			console.log(result)
		});
	})
	
	$('#gridbtn').on('click',function () {
		$('#cmsbody > div').addClass('row')
	})
	
	//login listeners btn
	$('#login > .submit').on('click',function () {
		login()
	})
	
	//dropdown listeners
	$('.dropbtn').on('click',function () {
		dropdown(this)
	})
	
	//submit blog listener
	$('#blogSubmit').on('click', function () {
		sendBlog()
	})

	$('#logoutbtn').on('click', function () {
		remotedb.logout(function (err, response) {
  			if (err) {
    		console.log(err)
  			}
  			cmsBodyToggle('hide');
			$('#login >').removeClass('hide');
			$('#menubtn').removeClass('hide')
			$('#logoutbtn').addClass('hide')
		})
	})
	
	console.log('script')
	
	
})()

