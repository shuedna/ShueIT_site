"use strict";
//http server

var http = require('http');
var router = require('./router.js');
var port = "3000";

var consoleLogsOn = false;

var server = http.createServer(function(request, response){
	consolelogs(request)
	var body = "";
	request.on('data',function(chunk){
		body += chunk
	})
	request.on('end',function(){
		consolelogs('send to router')
		router.route(request, response, body)
	})
})
	
server.listen(port, function() {
	consolelogs('Server started, listening to port ' + port) 	
})
	
function consolelogs(string) {
	if (consoleLogsOn){
		console.log(string)
	}
};