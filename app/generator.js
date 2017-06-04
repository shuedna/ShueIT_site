//Generator - create html page from parts per requested url.

"use strict";

var dot = require('dot');
var reply = require('./reply.js');
var fs = require('fs');
var req = require('request');


var db = 'https://cdb.shueit.net';
var consoleLogsOn = false

function handle (request, response, type) {
	var data = {};
	data.type = 'text/html';
	data.head = 200;
	
	(function processRequest () {
		consolelogs(request.url)
		if(type == 'send404'){
			send404()
		}else if(request.url == '/blog.html') {
			blogList()
		}else if(request.url == '/index.html'||request.url == '/') {
			index()
		}else if(request.url == '/about.html') {
			about()
		}else{
			collectData()
		}
	})();

	function index () {	
		var listUrl = (db + '/blog/_design/blogList/_view/blogList')
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
					var section = {}
					section.rows = body.rows
					section.title = "Shue IT Home"
					section.description = "Shue Information Technology Small Business SMB Small Office Home Office SOHO Tech services. Web Development, Networking LAN Wifi, Client and Server systems. Utica Rome Oneida Lewis Herkimer Counties New York"
					consolelogs(section.description)
					var templateUrl = (db + '/templates/index/index2.html')
					getTemplate(templateUrl, section, function (templateFn, section) { 
						buildPage (templateFn, section)
					})
				}
			}
		})
	}

	function about () {
		var section = {}
		section.title = "Shue IT About"
		var templateUrl = (db + '/templates/about/about.html')
		getTemplate(templateUrl, section, function (templateFn, section) { 
			buildPage (templateFn, section)
		})
	}
	
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
					var templateUrl = (db + '/templates/Template1/template1.html')//body.templateUrl
					consolelogs(templateUrl)
					section = body.section
					getTemplate(templateUrl, section, function (templateFn, section) { 
						buildPage (templateFn, section)
					})
				}
			}
		})	
	};
	
	function blogList() {
		consolelogs('==blogList')
		var listUrl = (db + '/blog/_design/blogList/_view/blogList')
		var templateUrl = (db + '/templates/TemplateBlogList/blogList-template.html')
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
					var section = {}
					section.title = "Shue IT Blog"
					section.rows = body.rows
					getTemplate(templateUrl, section, function (templateFn, section) { 
						buildPage (templateFn, section)
					})
				}
			}
		})
	}
	
	function buildPage (templateFn, section) {
		consolelogs('build page');

		(function getbase () {
			var templateUrl = (db + '/templates/BaseTemplate/base-template.html')
			req.get(templateUrl, function (err, data) {
				consolelogs('getting base template')
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
						var baseTemplateFn = dot.template(data.body)
						finalBuild(baseTemplateFn)
					}
				}
			})
		})()

		function finalBuild(baseTemplateFn) {
			var contents = {};
			contents.title = section.title
			contents.description = section.description
			contents.page = templateFn(section)
			data.contents = baseTemplateFn(contents)
			sendFile(data)
		}
	};
	
	function send404() {
		data.head = 404
		var templateUrl = (db + '/templates/Template1/template1.html')
		var section = {}
		section.title = 404
		section.body = 'Reqested page ' + request.url + ' not found'
		getTemplate(templateUrl, section, function (templateFn, section) { 
			buildPage (templateFn, section)
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
		reply.send(request, response, data)
	}
 
	function getTemplate (templateUrl, section, nextAction) {
			req.get(templateUrl, function (err, data) {
			consolelogs('getting template:' + templateUrl)
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
					nextAction(templateFn, section)
				}
			}
		})

	}
	
};

function consolelogs(string) {
	if (consoleLogsOn){
		console.log(string)
	}
}

module.exports.handle = handle