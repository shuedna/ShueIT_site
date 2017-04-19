"use strict"
// Route server request to proper handler

var generator = require('./generator.js');
var sendStatic = require('./sendStatic.js');
var post = require('./postHandler.js');

var consoleLogsOn = false;

function route (request, response, body) {
	consolelogs('Route:' + request.url)
	if ((request.url).startsWith('/blog')) {
		generator.handle(request, response, 'blog')
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