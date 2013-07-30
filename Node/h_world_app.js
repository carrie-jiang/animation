var connect = require('connect');
var writeHeader = require("./writeHeader");
var error = require("./error");
var errorHandler = require("./errorHandler");
var app = connect.createServer(
		error(),
		writeHeader("x-Powered-By","me"),
		errorHandler());
app.listen(8080);  