const RoboControl = require('./robocontrol');
const rob = new RoboControl();

rob.left()
    .then(rob.right())
    .catch(console.error);