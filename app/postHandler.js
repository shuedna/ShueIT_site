"use script"
// handle data posted to page

var reply = require('./reply.js');
var req = require('request');

var db = 'https://cdb.shueit.net';
var msgDb = 'https://cdb.shueit.net/messages/';
var auth ={"user":"node","pass":"node"}
var consoleLogsOn = true;

function handle (request, response, body) {
	
	if (request.url == "/post/email") {
		postMessage()	
	}
	
	function postMessage () {
		consolelogs(body)
		var recaptcha = {}
		recaptcha.uri = 'https://www.google.com/recaptcha/api/siteverify'
		recaptcha.method = 'POST'
		var jsonbody = JSON.parse(body)
		recaptcha.form = {
			'secret':'6Ld0ohUUAAAAAL2LlCxES6hagcjkMGNswugFm6Ah',
			'response':jsonbody.resp
		}
		req (recaptcha, function (error, res, replybody) {
			var jsonreplybody = JSON.parse(replybody)
			if (jsonreplybody.success == true) {
				var json = {"RecaptchaStatus": true}
				req({
					"uri":msgDb,
					"method":"POST",
					"auth": {"user":"node","pass":"node"},
					"json": jsonbody
				},function (err, couchReply) {
					if(err){
						json.err = err
						consolelogs(err)
					}else{
						//consolelogs(couchReply)
						//json.fullReply = couchReply
						try {
							json.couchReply = couchReply.body
							consolelogs(json.couchReply)
						}catch(e){
							consolelogs(e)
							var body = {}
						}	
					}
					write(json)
				})

			}else{
				var json = {"RecaptchaStatus": false}
				write(json)
			}
			
			function write (json) {
				response.writeHead(200,{"Content-Type":"application/json"})
				consolelogs(json)
				response.end(JSON.stringify(json))
			}
		})
	} 
	consolelogs(body)
}

function consolelogs(string) {
	if (consoleLogsOn){
		console.log(string)
	}
};

module.exports.handle = handle