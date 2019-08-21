const RoboControl = require('./robocontrol');
const rob = new RoboControl();

function waitAsec(sec) {
    return new Promise(res => setTimeout(res, sec * 1000));
} 

rob.left()
    .then(() => waitAsec(2))
    .then(() => rob.stop())
    .then(() => rob.forward())
    .then(() => waitAsec(2))
    .then(() => rob.stop())
    .then(() => rob.right())
    .then(() => waitAsec(2))
    .then(() => rob.stop())
    .then(() => rob.backward())
    .then(() => waitAsec(2))
    .then(() => rob.stop())
    .then(() => rob.armUp())
    .then(() => waitAsec(2))
    .then(() => rob.stop())
    .then(() => rob.armDown())
    .then(() => waitAsec(2))
    .then(() => rob.stop())
    .then(() => rob.gripperClose())
    .then(() => waitAsec(0.5))
    .then(() => rob.stop())
    .then(() => rob.gripperOpen())
    .then(() => waitAsec(0.5))
    .then(() => {
        console.log(' --> End of command chain');
        rob.exit();
    })
    .catch(err => {
        console.error('err!');
        console.error(err);
    });