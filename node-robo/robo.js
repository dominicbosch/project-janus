const RoboControl = require('./robocontrol');
const rob = new RoboControl();

function waitAsec(sec) {
    return new Promise(res => setTimeout(res, sec * 1000));
}

function handleRoboResult(node, msg, prom) {
    prom.then(dat => {
        msg.payload.robo = dat;
        node.send(msg);
    })
    .catch(node.error);
}

module.exports = function(RED) {
    function RoboControl(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        let currX = 0;
        let currY = 0;
        node.on('input', function(msg) {
            let data = msg.payload;
            if (data.action) {
                if (data.action === 'move') {
                    if (data.axis === 'x') {
                        currX = parseFloat(data.value);
                    } else {
                        currY = parseFloat(data.value);
                    }
                    handleRoboResult(node, msg, rob.steer(currX, currY));
                } else if (data.action === 'arm' && data.value) {
                    if (data.value === 'stopped') {
                        handleRoboResult(node, msg, rob.armStop());
                    } else {
                        if (data.direction === 'top') {
                            handleRoboResult(node, msg, rob.armUp());
                        } else {
                            handleRoboResult(node, msg, rob.armDown());
                        }
                    }
                } else if (data.action === 'gripper' && data.value) {
                    if (data.value === 'stopped') {
                        handleRoboResult(node, msg, rob.gripperStop());
                    } else {
                        if (data.direction === 'open') {
                            handleRoboResult(node, msg, rob.gripperOpen());
                        } else {
                            handleRoboResult(node, msg, rob.gripperClose());
                        }
                    }
                }
            }
            node.send(msg);
        });
    }
    RED.nodes.registerType("RoboControl", RoboControl);
}
