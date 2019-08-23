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
            let data = msg.payload;
            if (data.action) {
                if (data.action === 'move') {
                    
                } else if (data.action === 'arm' && data.value) {
                    if (data.value === 'stopped') {
                        rob.armStop().catch(console.error);
                    } else {
                        if (data.direction === 'top') {
                            rob.armUp().catch(console.error);
                        } else {
                            rob.armDown().catch(console.error);
                        }
                    }
                } else if (data.action === 'gripper' && data.value) {
                    if (data.value === 'stopped') {
                        rob.gripperStop().catch(console.error);
                    } else {
                        if (data.direction === 'open') {
                            rob.gripperOpen().catch(console.error);
                        } else {
                            rob.gripperClose().catch(console.error);
                        }
                    }
                }
            }
            msg.payload = msg.payload.toString().toLowerCase();
            node.send(msg);
        });
    }
    RED.nodes.registerType("RoboControl", RoboControl);
}
