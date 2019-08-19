const RoboControl = require('./robocontrol');
const rob = new RoboControl();

rob.left()
    .then(() => rob.right())
    .then(() => {
        console.log('exiting');
        rob.exit();
    })
    .catch(err => {
        console.error('err!');
        console.error(err);
    });