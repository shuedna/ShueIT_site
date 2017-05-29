"use strict"
//serve static files

var reply = require('./reply.js');
var generator = require('./generator.js');
var fs = require('fs');
var mime = require('mime');
var path = require('path');
var cache = {};

var cacheOn = true;
var staticPathRoot = './public';
var consoleLogsOn = false;

function handle (request, response) {
	
	var filePath = '';
	var fullPath = '';
	var data = {};
	consolelogs(cache);
	
	(function setPath () {
		if(request.url =='/') {
			filePath ='/index.html'
		}else{
			filePath = request.url
		}
		fullPath = staticPathRoot + filePath
		consolelogs(fullPath)
		retrieveFile(fullPath)
	})()
	
	function retrieveFile (fullpath) {
		if(cache[fullPath]) {
			data.contents = cache[fullPath]
			consolelogs('file was in cache')
		}else{
			fs.readFile(fullPath, function(err, fileData) {
				if(err){
					data.type = mime.lookup(path.basename(filePath))
					send404(data)
				}else{
					if(cacheOn){
						cache[fullPath] == fileData
						consolelogs('added to cache' + cache)
					}
					data.contents = fileData
					consolelogs(fileData)
					data.type = mime.lookup(path.basename(filePath))
					data.head = 200
					sendFile(data)
				}
			})
		}
	}
	
	function send404(data){
		generator.handle(request, response, 'send404')
	}
	
	function sendFile (data){
		consolelogs(data.type)
		reply.send(response, data)
	}
}

function consolelogs(string) {
	if (consoleLogsOn){
		console.log(string)
	}
}

module.exports.handle = handle;