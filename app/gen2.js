//Generator - create html page from parts per requested url.

"use strict";

var dot = require('dot');
var reply = require('./reply.js');
var fs = require('fs');
var req = require('request');


var db = 'https://cdb.shueit.net';
var consoleLogsOn = true;

function handle (request, response, type) {
	var data = {};
	data.type = 'text/html';
	data.head = 200;

	function BaseTemplate () {
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
					consolelogs(baseTemplateFn({page:'test'}))
				}
			}
		})
	}

	function sendFile (data){
		consolelogs('Send Page')
		consolelogs(data.type)
		reply.send(response, data)
	}

	BaseTemplate()
	
};

function consolelogs(string) {
	if (consoleLogsOn){
		console.log(string)
	}
}

module.exports.handle = handle