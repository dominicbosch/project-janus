$(document).ready(function(){
	setInterval(function() {
		let src = "http://" + location.host + "/html/cam_pic.php?time=" + (new Date()).getTime();
		document.getElementById("livestream").setAttribute("src", src);
    }, 30);
    
    let socket = new WebSocket("ws://" + location.host + ":1337");

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
    });
    joystickView.bind("horizontalMove", function(x){
        socket.send('{"action": "move", "axis": "x", "value": "' + x + '"}');
    });
    $("body").keyup(function() {
        if ($(this).val().toLowerCase() === 's') {
            socket.send('{"action": "move", "axis": "stopped", "value": "stopped"}');
        }
    });
    // $('#joystickContent').mouseup(function() {
    //     socket.send('{"action": "move", "axis": "stopped", "value": "stopped"}');
    // });
    $( "#top" ).mousedown(function() {
        socket.send('{"action": "arm", "direction": "top", "value": "started"}');
    });
    $( "#top" ).mouseup(function() {
        socket.send('{"action": "arm", "direction": "top", "value": "stopped"}');
    });
    $( "#down" ).mousedown(function() {
        socket.send('{"action": "arm", "direction": "down", "value": "started"}');
    });
    $( "#down" ).mouseup(function() {
        socket.send('{"action": "arm", "direction": "down", "value": "stopped"}');
    });
    $( "#open" ).mousedown(function() {
        socket.send('{"action": "gripper", "direction": "open", "value": "started"}');
    });
    $( "#open" ).mouseup(function() {
        socket.send('{"action": "gripper", "direction": "open", "value": "stopped"}');
    });
    $( "#close" ).mousedown(function() {
        socket.send('{"action": "gripper", "direction": "close", "value": "started"}');
    });
    $( "#close" ).mouseup(function() {
        socket.send('{"action": "gripper", "direction": "close", "value": "stopped"}');
    });
});