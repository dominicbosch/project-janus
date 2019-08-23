$(document).ready(function(){
	setInterval(function() {
		let src = "http://" + location.host + "/html/cam_pic.php?pDelay=40000&time=" + (new Date()).getTime();
		document.getElementById("livestream").setAttribute("src", src);
    }, 30);
    
    let socket = new WebSocket("ws://" + location.host + "/ws/james");

    socket.onopen = function(e) {
        console.log("[open] Connection established");
    };

    socket.onmessage = function(event) {
        console.log(`[message] Data received from server: ${event.data}`);
    };

    socket.onclose = function(event) {
        if (event.wasClean) {
        console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log('[close] Connection died');
        }
    };

    socket.onerror = function(error) {
        console.log(`[error] ${error.message}`);
    };


    var joystickView = new JoystickView(150, function(callbackView){
        $("#joystickContent").append(callbackView.render().el);
        setTimeout(function() {
            callbackView.renderSprite();
        }, 0);
    });
    joystickView.bind("verticalMove", function(y){
        socket.send('{"action": "move", "axis": "y", "value": "' + y + '"}');
        console.log(y);
    });
    joystickView.bind("horizontalMove", function(x){
        socket.send('{"action": "move", "axis": "x", "value": "' + x + '"}');
            console.log(x);
    });
    $( "#top" ).mousedown(function() {
        socket.send('{"action": "arm", "direction": "top", "value": "started"}');
            console.log("top started");
    });
    $( "#top" ).mouseup(function() {
        socket.send('{"action": "arm", "direction": "top", "value": "stopped"}');
            console.log("top stopped");
    });
    $( "#down" ).mousedown(function() {
        socket.send('{"action": "arm", "direction": "down", "value": "started"}');
            console.log("down started");
    });
    $( "#down" ).mouseup(function() {
        socket.send('{"action": "arm", "direction": "down", "value": "stopped"}');
            console.log("down stopped");
    });
    $( "#open" ).mousedown(function() {
        socket.send('{"action": "gripper", "direction": "open", "value": "started"}');
            console.log("open started");
    });
    $( "#open" ).mouseup(function() {
        socket.send('{"action": "gripper", "direction": "open", "value": "stopped"}');
            console.log("open stopped");
    });
    $( "#close" ).mousedown(function() {
        socket.send('{"action": "gripper", "direction": "close", "value": "started"}');
            console.log("close started");
    });
    $( "#close" ).mouseup(function() {
        socket.send('{"action": "gripper", "direction": "close", "value": "stopped"}');
            console.log("close stopped");
    });
});