//Generator - create html page from parts per requested url.

"use strict";

var dot = require('dot');
var reply = require('./reply.js');
var fs = require('fs');
var req = require('request');


var db = 'https://cdb.shueit.net';
var consoleLogsOn = false;

function handle (request, response, type) {
	var data = {};
	data.type = 'text/html';
	data.head = 200;
	
	(function processRequest () {
		consolelogs(request.url)
		if(type == 'send404'){
			send404()
		}else if(request.url == '/blog/') {
			blogList()
		}else{
			collectData()
		}
	})();
	
	function collectData () {
		var section = {}
		var blog = {}
		var blogPath = db + request.url
		req.get( blogPath, function (err, blogData){
			if (err) {
				consolelogs(err)
				send404()
			}else{
				try {
					var body = JSON.parse(blogData.body)
				}catch(e){
					var body = {}
				}
				if (body.error) {
					consolelogs('DB Error')
					//consolelogs(body)
					send404()
				}else{ 
					consolelogs(body)
					var templateUrl = body.templateUrl
					consolelogs(templateUrl)
					section = body.section
					req.get(templateUrl,function (err, data) {
						if (err) {
							consolelogs(err)
						}else{
							try {
								var dataObj = JSON.parse(data.body)
							}catch(e){
								var dataObj = {}
							}
							if (dataObj.error) {
								consolelogs('DB Error')
								//consolelogs(data.body)
								send404()
							}else{ 
								//consolelogs(data)
								var templateFn = dot.template(data.body)
								buildPage (templateFn, section)
							}
						}
					})
				}
			}
		})	
	};
	
	function blogList() {
		consolelogs('==blogList')
		var listUrl = (db + '/blog/_design/blogList/_view/blogList')
		var templateUrl = (db + '/templates/TemplateBlogList/template.html')
		req.get(listUrl, function (err,data) {
			consolelogs('getting blog list')
			if (err){
				consolelogs('Db request error' + listUrl)
				consolelogs(err)
				consolelogs('==send404')
				send404()
			}else{
				try {
					var body = JSON.parse(data.body)
				}catch(e){
					var body = {}
				}
				if (body.error) {
					consolelogs('DB Error')
					//consolelogs(body)
					send404()
				}else{ 
					consolelogs(body)
					req.get(templateUrl, function (err, data) {
						consolelogs('getting template')
						if (err) {
							consolelogs(err)
							send(404)
						}else{
							try {
								var dataObj = JSON.parse(data.body)
							}catch(e){
								var dataObj = {}
							}
							if (dataObj.error) {
								consolelogs('DB Error')
								//consolelogs(data.body)
								send404()
							}else{ 
								//consolelogs(data)
								var templateFn = dot.template(data.body)
								buildPage (templateFn, body.rows)
							}
						}
					})
				}
			}
		})
	}
	
	function buildPage (templateFn, section) {
		consolelogs('build page')
		data.contents = templateFn(section)
		sendFile(data)
	};
	
	function send404() {
		data.head = 404
		var templateUrl = (db + '/templates/Template1/template.html')
		var section = {}
		section.title = 404
		section.body = 'Reqested page ' + request.url + ' not found'
		req.get(templateUrl, function (err, data) {
			if (err) {
				consolelogs(err)
				sendFallback404()
			}else{
				try {
					var body = JSON.parse(data.body)
				}catch(e){
					var body = {}
				}
				if (body.error) {
					consolelogs('DB Error')
					consolelogs(data.body)
					sendFallback404()
				}else{
					//consolelogs(data)
					var templateFn = dot.template(data.body)
					buildPage (templateFn, section)
				}
			}
		})
		
		function sendFallback404 () {
			consolelogs('fallback404')
			data.head = 404
			data.contents = "404:Server has had a error"
			sendFile(data)
		}
	}
	
	function sendFile (data){
		consolelogs('Send Page')
		consolelogs(data.type)
		reply.send(response, data)
	}
	
};

function consolelogs(string) {
	if (consoleLogsOn){
		console.log(string)
	}
}

module.exports.handle = handle