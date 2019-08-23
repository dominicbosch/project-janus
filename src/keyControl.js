const RoboControl = require('./robocontrol');
const rob = new RoboControl();

function waitAsec(sec) {
    return new Promise(res => setTimeout(res, sec * 1000));
}

const readline = require('readline');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
    if (key && key.name) {
        // console.log(str, key, key.name);
        switch (key.name.toLowerCase()) {
            case 'c':
                if(key.ctrl) {
                    rob.exit()
                        .then(() => process.exit())
                        .catch((err) => {
                            console.error(err);
                            process.exit();
                        });
                }
            case 's':
                rob.stop().catch(console.error);
                break;
            case 'left':
                rob.left().catch(console.error);
                break;
            case 'right':
                rob.right().catch(console.error);
                break;
            case 'up':
                rob.forward().catch(console.error);
                break;
            case 'down':
                rob.backward().catch(console.error);
                break;
            case 'pageup':
                rob.armUp().catch(console.error);
                break;
            case 'pagedown':
                rob.armDown().catch(console.error);
                break;
            case 'end':
                rob.gripperOpen()
                    .then(waitAsec(2))
                    .then(rob.gripperStop())
                    .catch(console.error);
                break;
            case 'home':
                rob.gripperClose()
                    .then(waitAsec(2))
                    .then(rob.gripperStop())
                    .catch(console.error);
                break;
            default:
                console.log('not doing anything!');
        }
    } else {
        // console.log('weird input');
    }
});

waitAsec(2).then(() => console.log('Robo ready! Use: Arrows, PageUp, PageDown, +, -, s, CTRL+C'));
