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
            rob.steer(currX, currY).catch(console.error);
        } else if (data.action === 'arm' && data.value) {
            if (data.value === 'stopped') {
                console.log('ARM STOP');
                rob.armStop().catch(console.error);
            } else {
                if (data.direction === 'top') {
                    console.log('ARM UP');
                    rob.armUp().catch(console.error);
                } else {
                    console.log('ARM DOWN');
                    rob.armDown().catch(console.error);
                }
            }
        } else if (data.action === 'gripper' && data.value) {
            if (data.value === 'stopped') {
                console.log('GRIPPER STOP');
                rob.gripperStop().catch(console.error);
            } else {
                if (data.direction === 'open') {
                    console.log('GRIPPER OPEN');
                    rob.gripperOpen().catch(console.error);
                } else {
                    console.log('GRIPPER CLOSE');
                    rob.gripperClose().catch(console.error);
                }
            }
        }
    }
}