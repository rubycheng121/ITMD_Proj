var app = require('express')();
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var five = require("johnny-five");
var board  = new five.Board({
	port : "/dev/cu.usbmodem1421",
	repl : false
});

var engineRelay;
var renter;
var socketForuse;
//var isTimeout=true;

var status=false;

server.listen(process.env.PORT || 1336, function(){
	console.log('listening on *:1336');
});

/*app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});*/
board.on("ready", function() {
	console.log ("board ready");

	engineRelay = new five.Relay(8);

	// init
	engineRelay.off();
	status=false;

	io.on('connection', function (socket) {
		socketForuse = socket;
		socket.emit('news', 'hi');
		socket.on('event_turnOnRelay', function (data) {
			var command = data["command"];
			var mSec = 5000;//啟動時間
			console.log(command);
			console.log(mSec);
			if (command) { //如果command是true
				socket.emit('news', 'TRUE'); //ACK
				//可以收到時間要做甚麼

				//啟動馬達
				engineRelay.on();
				status=true;

					setTimeout(function() {
						//時間到要做甚麼
						console.log("Timeout")
						engineRelay.off();
						status=false;
						commandClose(socketForuse,status);
					}, parseInt(mSec));
			} else {
				socket.emit('news', 'FALSE'); //ACK
			}
		});
	});
});

function commandClose(socket,status) {

	socket.emit('closeRelay', {relayStatus:status});

	console.log("func_retun");
}
