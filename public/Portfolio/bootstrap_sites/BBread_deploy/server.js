"use strict"

var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var req = require('request');
var cache = {};
var recaptcha = {}

recaptcha.uri = 'https://www.google.com/recaptcha/api/siteverify'
recaptcha.method = 'POST'

console.log(process.argv[3])

function send404 (response) {
  //console.log("send404");
  response.writeHead(404, 
{"Content-Type":"text/plain"});
  response.write("Error 404: resource not found");
  response.end();
}

function sendFile (response, filePath, fileContents) {
  //console.log("sendFile " + filePath)
  response.writeHead(
    200,
    {"Content-Type":mime.lookup(path.basename(filePath))}
  )
  response.end(fileContents);
}

function serveStatic (response, cache, absPath) {
  //console.log("serveStatic " + absPath)
  if (cache[absPath]) {
   sendFile (response, absPath, cache[absPath])
  }else{
   fs.exists(absPath, function (exists) {
    if (exists) {
     fs.readFile(absPath, function (err, data) {
      if (err) {
       send404(response);
      }else{
       cache[absPath] = data;
       sendFile(response, absPath, cache[absPath]);
      }
     });
    }else{
     send404(response);
    }
   });
  }
}

var server = http.createServer(function(request, response) {
	var body =""
	request.on('data',function (chunk) {
		body += chunk
	})
	request.on('end',function () {
		//console.log(body)
		//console.log("request");
		if (request.url == "/email") {
			email(request, response, body)	
		}else{
			var filePath = false;
  			if (request.url == "/") {
   				filePath = "public/index.html"
  			}else{
 	 			filePath = "public" + request.url
 	 		}
  			var absPath = "./" + filePath
  			serveStatic(response, cache, absPath);
		}
	})
});

function email (request, response, body) {
	//console.log('email')
	var jsonbody = JSON.parse(body)
	//console.log(body)
	recaptcha.form = {
		'secret':'6Ld0ohUUAAAAAL2LlCxES6hagcjkMGNswugFm6Ah',
		'response':jsonbody.resp
	}
	//console.log(recaptcha)
	req (recaptcha, function (error, res, replybody) {
		var jsonreplybody = JSON.parse(replybody)
		//console.log(replybody)
		if (jsonreplybody.success == true) {
			var json = {"RecaptchaStatus": true}
			var mail = {'to':'shuedna@gmail.com','from':'nodeserver@shueit.net','subject':jsonbody.subject}
			mail.html = ('<p>' + jsonbody.email + '</p></br><p>' + jsonbody.msg  + '</p>')
			json.mail = mail
			//console.log(mail)
			var d = new Date();
			var n = d.getTime();
			var file = '/home/fedora/breadSite/email/'+ n +'.json'
			fs.writeFile(file, JSON.stringify(mail), (err) => {
			 	if (err) throw err;
			 	//console.log('It\'s saved!');
			});
		}else{
			var json = {"RecaptchaStatus": false}
		}
		//console.log(response)
		response.writeHead(200,{"Content-Type":"application/json"})
		response.end(JSON.stringify(json))
	})
}

server.listen(80, function() {
  console.log("Server listening on port 80");
});
