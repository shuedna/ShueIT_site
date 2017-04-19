var http = require("http");
var url = require("url");


function start(parse) {
http.createServer(function (request, response) {
	var postdata = [];

	console.log(request.method);
	var headers= request.headers
	console.log(headers.referer);

	request.setEncoding("utf8");

	request.on('data', function(chunk) {
		//console.log("data listener" );  
		postdata.push(chunk)
		//console.log(chunk);
		//console.log(postdata);
	});

	request.on('end', function() { 
		console.log("Request for " + url.parse(request.url).pathname + " received");
		parse(url.parse(request.url).pathname, url.parse(request.url).query, response, postdata );

	});	

	
}).listen(8082); 
}
 
// Console will print the message  
console.log('Server running at http://127.0.0.1:8082/');

exports.start = start;