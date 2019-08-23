const RoboControl = require('./robocontrol');
const rob = new RoboControl();

function waitAsec(sec) {
    return new Promise(res => setTimeout(res, sec * 1000));
}

module.exports = function(RED) {
    function RoboControl(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        node.on('input', function(msg) {
// socket.send('{"action": "move", "axis": "y", "value": "' + y + '"}');
// socket.send('{"action": "move", "axis": "y", "value": "' + x + '"}');
// socket.send('{"action": "arm", "direction": "top", "value": "started"}');
// socket.send('{"action": "arm", "direction": "top", "value": "stopped"}');
// socket.send('{"action": "arm", "direction": "down", "value": "started"}');
// socket.send('{"action": "arm", "direction": "down", "value": "stopped"}');
// socket.send('{"action": "arm", "direction": "open", "value": "started"}');
// socket.send('{"action": "arm", "direction": "open", "value": "stopped"}');
// socket.send('{"action": "arm", "direction": "close", "value": "started"}');
// socket.send('{"action": "arm", "direction": "close", "value": "stopped"}');

            // if (key && key.name) {
            //     // console.log(str, key, key.name);
            //     switch (key.name.toLowerCase()) {
            //         case 'c':
            //             if(key.ctrl) {
            //                 rob.exit()
            //                     .then(() => process.exit())
            //                     .catch((err) => {
            //                         console.error(err);
            //                         process.exit();
            //                     });
            //             }
            //         case 's':
            //             rob.stop().catch(console.error);
            //             break;
            //         case 'left':
            //             rob.left().catch(console.error);
            //             break;
            //         case 'right':
            //             rob.right().catch(console.error);
            //             break;
            //         case 'up':
            //             rob.forward().catch(console.error);
            //             break;
            //         case 'down':
            //             rob.backward().catch(console.error);
            //             break;
            //         case 'pageup':
            //             rob.armUp().catch(console.error);
            //             break;
            //         case 'pagedown':
            //             rob.armDown().catch(console.error);
            //             break;
            //         case 'end':
            //             rob.gripperOpen()
            //                 .then(() => waitAsec(1))
            //                 .then(() => rob.gripperStop())
            //                 .catch(console.error);
            //             break;
            //         case 'home':
            //             rob.gripperClose()
            //                 .then(() => waitAsec(3))
            //                 .then(() => rob.gripperStop())
            //                 .catch(console.error);
            //             break;
            //         default:
            //             console.log('not doing anything!');
            //     }
            // } else {
            //     // console.log('weird input');
            // }



            msg.payload = msg.payload.toString().toLowerCase();
            node.send(msg);
        });
    }
    RED.nodes.registerType("RoboControl", RoboControl);
}
