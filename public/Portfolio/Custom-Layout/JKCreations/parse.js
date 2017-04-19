"use strict"

var fs = require('fs');
var path = require('path');
var qs= require('querystring');

//load acl

var acl = { 'acl' : [], 'check' : function (file) {
		//check the acl list for file passed
		}}
fs.readFile('./acl.txt','utf8', function(err, data) {
	if (err === null) {
		acl.acl.push(data);
	} else {
		console.log('Error: ACL not found')
	}
	console.log(acl.acl[0]);
})




function parse(file, query, response, postdata) {
		if (file == "/") {
			file = "/index.html"
		}

		var types = { ".html" : "text/html", ".css" : "text/css", ".js" : "text/javascript", ".json" : "application/json", ".svg": "image/svg+xml" }
		//console.log(types[path.extname(file)])

		if (file == "/submit") {
			response.writeHead(200, {'Content-Type': 'text/html'});  
			response.write("<h1>Submited " + postdata + " </h1>");
			response.end();
			console.log("Submited" + postdata) ;
		} else {
			fs.readFile("."+file,function(err ,data) {
			if (err === null) {
				response.writeHead(200, {'Content-Type': types[path.extname(file)]});  
				response.write(data);
				response.end();
				console.log("served "+file)
			} else {
				response.writeHead(404, {'Content-Type': 'text/html'});  
				response.write("<h2>File"+file+" Not Found, Error: 404</h2>");
				response.end();
				console.log("404 File not found");
			}
	})
		}
}

exports.parse = parse;

