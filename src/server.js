const http = require('http');
const RoboControl = require('./robocontrol');
const WebSocketServer = require('websocket').server;

const rob = new RoboControl();
const server = http.createServer(httpHandler);

function httpHandler(request, response) {
    // process HTTP request. Since we're writing just WebSockets
    // server we don't have to implement anything.
}
server.listen(1337, function() {
    console.log('listening')
});

// create the server
const wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // process WebSocket message
        }
    });

    connection.on('close', function(connection) {
        // close user connection
    });
});
