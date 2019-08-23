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
                    msg.payload.handler = 'MOVE x='+currX+', y='+currY;
                    handleRoboResult(node, msg, rob.steer(currX, currY));
                } else if (data.action === 'arm' && data.value) {
                    if (data.value === 'stopped') {
                        msg.payload.handler = 'ARM STOP';
                        handleRoboResult(node, msg, rob.armStop());
                    } else {
                        if (data.direction === 'top') {
                            msg.payload.handler = 'ARM UP';
                            handleRoboResult(node, msg, rob.armUp());
                        } else {
                            msg.payload.handler = 'ARM DOWN';
                            handleRoboResult(node, msg, rob.armDown());
                        }
                    }
                } else if (data.action === 'gripper' && data.value) {
                    if (data.value === 'stopped') {
                        msg.payload.handler = 'GRIPPER STOP';
                        handleRoboResult(node, msg, rob.gripperStop());
                    } else {
                        if (data.direction === 'open') {
                            msg.payload.handler = 'GRIPPER OPEN';
                            handleRoboResult(node, msg, rob.gripperOpen());
                        } else {
                            msg.payload.handler = 'GRIPPER CLOSE';
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
