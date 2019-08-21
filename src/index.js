const RoboControl = require('./robocontrol');
const rob = new RoboControl();

function waitAsec() {
    return new Promise(res => setTimeout(res, 2000));
} 

rob.left()
    .then(waitAsec)
    .then(() => rob.stop())
    .then(() => rob.forward())
    .then(waitAsec)
    .then(() => rob.stop())
    .then(() => rob.right())
    .then(waitAsec)
    .then(() => rob.stop())
    .then(() => rob.backward())
    .then(waitAsec)
    .then(() => rob.stop())
    .then(() => rob.armUp())
    .then(waitAsec)
    .then(() => rob.stop())
    .then(() => rob.armDown())
    .then(waitAsec)
    .then(() => rob.stop())
    .then(() => rob.gripperClose())
    .then(waitAsec)
    .then(() => rob.stop())
    .then(() => rob.gripperOpen())
    .then(waitAsec)
    .then(() => {
        console.log(' --> End of command chain');
        rob.exit();
    })
    .catch(err => {
        console.error('err!');
        console.error(err);
    });