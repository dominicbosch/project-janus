const RoboControl = require('./robocontrol');
const rob = new RoboControl();

function waitAsec() {
    return new Promise(res => setTimeout(res, 1000));
} 

rob.left()
    .then(waitAsec)
    .then(() => rob.forward())
    .then(waitAsec)
    .then(() => rob.right())
    .then(waitAsec)
    .then(() => rob.backward())
    .then(waitAsec)
    .then(() => rob.armUp())
    .then(waitAsec)
    .then(() => rob.armDown())
    .then(waitAsec)
    .then(() => rob.gripperClose())
    .then(waitAsec)
    .then(() => rob.gripperOpen())
    .then(waitAsec)
    .then(() => {
        console.log('exiting');
        rob.exit();
    })
    .catch(err => {
        console.error('err!');
        console.error(err);
    });