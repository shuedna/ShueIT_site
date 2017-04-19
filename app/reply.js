"use strict"
// send http reply

var consoleLogsOn = false;

function send (response, data) {
	consolelogs(data.head +':'+ data.type)
	response.writeHead(data.head, {"Content-Type":data.type})
	response.end(data.contents)
}


function consolelogs(string) {
	if (consoleLogsOn){
		console.log(string)
	}
}

module.exports.send = send