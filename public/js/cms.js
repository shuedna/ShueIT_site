"use strict";

(function () {
	
	var db = new PouchDB('http://127.0.0.1:5984/blog')
	var imagedb = new PouchDB('http://127.0.0.1:5984/images')
	
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
		cmsBodyToggle('show');
		$('#login >').addClass('hide');
		$('#menubtn').addClass('hide')
		$('#logoutbtn').removeClass('hide')
	}
	
	function cmsBodyToggle(action){
		if (action == 'show') {
			$('#cmsbody').removeClass('hide')
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
			"templateUrl": "http://localhost:5984/templates/Template1/template.html",
			"time":Date.now(),
			"date":dateFormat(Date.now),
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
	
	function dateFormat(secs) {
		var tempDate = new Date(secs);
		var month = tempDate.getMonth + 1;
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
	
	console.log('script')
	
	
})()

