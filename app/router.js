"use strict"
// Route server request to proper handler

var mime = require('mime');

var generator = require('./generator.js');
var sendStatic = require('./sendStatic.js');
var post = require('./postHandler.js');

var consoleLogsOn = false;

function route (request, response, body) {
	consolelogs('Route:' + request.url)
	if ((request.url).endsWith('.html')&&!(request.url).endsWith('cms.html')||(request.url).endsWith('/')) {
		generator.handle(request, response, 'page')
	}else if((request.url).startsWith('/post')){
		post.handle(request, response, body)
	}else{
		sendStatic.handle(request, response)
	}
}

function consolelogs(string) {
	if (consoleLogsOn){
		console.log(string)
	}
};

module.exports.route = route;