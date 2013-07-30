var httpd = require('http').createServer(handler);
var io = require('socket.io').listen(httpd);
var fs = require('fs');
httpd.listen(4000);
function handler(req, res) {
fs.readFile(__dirname + '/index.html',
function(err, data) {
if (err) {
res.writeHead(500);
return res.end('Error loading index.html');
}
res.writeHead(200);
res.end(data);
}
);
}
io.sockets.on('connection', function (socket) {
	socket.on('clientMessage', function(content) {
		socket.emit('serverMessage', 'You said: ' + content);
		socket.broadcast.emit('serverMessage', socket.id + ' said: ' +
		content);
	});
	socket.on('login', function( username ){
		//save the username
		socket.set('username', username, function(err){
			if(err){
				throw err;
			}
			if (!username) {
			username = socket.id;
			}
			socket.emit('serverMessage', 'Currently logged in as ' + username);
			socket.broadcast.emit('serverMessage', 'User '+username+' logged in' );
		});
	});
	
	socket.on('disconnect', function() {
	socket.get('username', function(err, username) {
		if (! username) {
			username = socket.id;
		}
		socket.broadcast.emit('serverMessage', 'User ' + username +
		' disconnected');
		});
	});
	//after the server hooked up with all the events it is interested in
	//notify the client to log in
	socket.emit('login');

});