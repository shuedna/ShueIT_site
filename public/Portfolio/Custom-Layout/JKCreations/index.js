"use strict"

var parse = require ('./parse');
var http = require ('./nodehttp')
//var dym = require ('./dym.js');

http.start(parse.parse);



