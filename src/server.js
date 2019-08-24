const http = require('http');
const RoboControl = require('./robocontrol');
const WebSocketServer = require('websocket').server;

const rob = new RoboControl();
const server = http.createServer(httpHandler);

function httpHandler(request, response) {
    // process HTTP request
}
server.listen(1337, function() {
    console.log('listening')
});

const wsServer = new WebSocketServer({ httpServer: server });

wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            try {
                processCommand(JSON.parse(message.utf8Data));
            } catch(err) {
                console.error(err);
            }
        }
    });

    connection.on('close', function(connection) {
        console.log('User left!');
    });
});

function processCommand(data) {
    if (data.action) {
        if (data.action === 'move') {
            if (data.axis === 'x') {
                currX = parseFloat(data.value);
            } else {
                currY = parseFloat(data.value);
            }
            console.log('MOVE x='+currX+', y='+currY);
            handleRoboResult(node, msg, rob.steer(currX, currY));
        } else if (data.action === 'arm' && data.value) {
            if (data.value === 'stopped') {
                console.log('ARM STOP');
                handleRoboResult(node, msg, rob.armStop());
            } else {
                if (data.direction === 'top') {
                    console.log('ARM UP');
                    handleRoboResult(node, msg, rob.armUp());
                } else {
                    console.log('ARM DOWN');
                    handleRoboResult(node, msg, rob.armDown());
                }
            }
        } else if (data.action === 'gripper' && data.value) {
            if (data.value === 'stopped') {
                console.log('GRIPPER STOP');
                handleRoboResult(node, msg, rob.gripperStop());
            } else {
                if (data.direction === 'open') {
                    console.log('GRIPPER OPEN');
                    handleRoboResult(node, msg, rob.gripperOpen());
                } else {
                    console.log('GRIPPER CLOSE');
                    handleRoboResult(node, msg, rob.gripperClose());
                }
            }
        }
    }
}