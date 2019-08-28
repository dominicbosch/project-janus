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
        console.log('User left! Stopping...');
        handlePromise(rob.stop());
    });
});

function waitAsec(sec) {
    return new Promise(res => setTimeout(res, sec * 1000));
}

function handlePromise(prom) {
    prom
        // .then(console.log)
        .catch(console.error);
}
let currX = 0;
let currY = 0;
function processCommand(data) {
    if (data.action) {
        if (data.action === 'stop') {
            handlePromise(rob.stop());
        } else if (data.action === 'move') {
            if (data.axis === 'stopped') {
                handlePromise(rob.moveStop());
            } else {
                if (data.axis === 'x') {
                    currX = parseFloat(data.value);
                } else {
                    currY = parseFloat(data.value);
                }
                // console.log('MOVE x='+currX+', y='+currY);
                handlePromise(rob.steer(currX, currY));
            }
        } else if (data.action === 'arm' && data.value) {
            if (data.value === 'stopped') {
                // console.log('ARM STOP');
                handlePromise(rob.armStop());
            } else {
                if (data.direction === 'top') {
                    // console.log('ARM UP');
                    handlePromise(rob.armUp());
                } else {
                    // console.log('ARM DOWN');
                    handlePromise(rob.armDown());
                }
            }
        } else if (data.action === 'gripper' && data.value) {
            if (data.value === 'stopped') {
                // console.log('GRIPPER STOP');
                handlePromise(rob.gripperStop());
            } else {
                if (data.direction === 'open') {
                    // console.log('GRIPPER OPEN');
                    handlePromise(rob.gripperOpen().then(waitAsec(3)).then(() => rob.gripperStop()));
                } else {
                    // console.log('GRIPPER CLOSE');
                    handlePromise(rob.gripperClose().then(waitAsec(3)).then(() => rob.gripperStop()));
                }
            }
        }
    }
}

function handleExit() {
    handlePromise(rob.exit().then(() => setTimeout(process.exit, 2000)));
}

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);