"use script"
// handle data posted to page

var consoleLogsOn = true;

function handle (request, response, body) {
	consolelogs(body)
}

function consolelogs(string) {
	if (consoleLogsOn){
		console.log(string)
	}
};

module.exports.handle = handle