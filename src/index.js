const RoboControl = require('./robocontrol');
const rob = new RoboControl();

rob.left()
    .then(rob.right())
    .then(() => rob.exit())
    .catch(console.error);