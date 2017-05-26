var five = require("johnny-five");
var board  = new five.Board({
	port : "/dev/tty.usbmodem1421",
	repl : false
});
board.on("ready", function() {


  var relay = new five.Relay(8);

  relay.on();
});
