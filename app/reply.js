"use strict"
// send http reply

var zlib = require('zlib')

var consoleLogsOn = false;

function send (request, response, data) {
	consolelogs(request.headers['accept-encoding'])
	consolelogs(data.head +':'+ data.type)
	if (request.headers['accept-encoding'].includes('gzip')) {
		consolelogs('gzip')
		zlib.gzip(data.contents, function(error, result){
			if (error) {
				response.writeHead(data.head, {"Content-Type":data.type,"Cache-Control":"public","Cache-Control":"max-age=86400"})
				response.end(data.contents)
			}else{
				response.writeHead(data.head, {"Content-Type":data.type,"Cache-Control":"public","Cache-Control":"max-age=86400","Content-Encoding":"gzip"})
				response.end(result)
			}
		})	
	}else{
		response.writeHead(data.head, {"Content-Type":data.type,"Cache-Control":"public","Cache-Control":"max-age=86400"})
		response.end(data.contents)
	}
}


function consolelogs(string) {
	if (consoleLogsOn){
		console.log(string)
	}
}

module.exports.send = send