'use strict';

const cp = require('child_process');
const MAX_SPEED = 0.6;

module.exports = class RoboControl {
    constructor() {
        this.initPython();
    }

    initPython() {
        console.log('Killing Existing Python processes!');
        cp.exec("kill $(pgrep -f 'python3')", () => {
            console.log('Starting controls!');
            // We use cmdID to identify distinct commands and fulfill the promise
            this.cmdID = 0;
            // We store executing promises under their command ID
            this.executingCommands = {};

            this.child = cp.spawn('python3', ['-u', '-i', '/home/pi/projects/project-janus/src/robocmd.py']); // , { detached: true });
            this.child.on('error', function(err) {
                console.error(err);
            });

            setTimeout(function() {this.stop().catch(console.error)}, 1500);

            this.child.stdin.setEncoding('utf-8');
            this.child.stdout.on('data', data => {
                let arr = data.toString().trim().split('\n');
                for (let i = 0; i < arr.length; i++) {
                    this.processCommand(arr[i]);
                }
            });

            this.child.on('exit', code => {
                console.log(`this.Child Exit code is: ${code}... Restarting...`);
                this.initPython();
            });
        });
    }

    processCommand(str) {
        let arr = str.split(',');
        let signal = arr[0];
        if (signal === 'DONE' && arr[1] !== undefined) {
            let id = arr[1];
            if (id !== undefined && this.executingCommands[id] !== undefined) {
                this.executingCommands[id].resolve('Robo says DONE: "'+str+'", SIGNAL="'+signal+'", id="'+id+'"');
            } else {
                this.executingCommands[id].reject('something went wrong with #'+arr[1]);
            }
            delete this.executingCommands[id];
        } else {
            // console.log('Skipping Robo output');
        }
    }

    executeCommand(motor, val) {
        let id = this.cmdID++;
        // console.log('Put on stack: id="'+id+'", motor="'+motor+'", val="'+val+'"');
        let oProm = {};
        oProm.promise = new Promise((res, rej) => {
            // console.log('Executing: id="'+id+'", motor="'+motor+'", val="'+val+'"');
            try {
                this.child.stdin.write(id+','+motor+','+val+'\n');
            } catch(e) {
                rej(e);
            }
            oProm.resolve = res;
            oProm.reject = rej;
        });
        this.executingCommands[id] = oProm;
        return oProm.promise;
    }
    left() {
        return Promise.all([
            this.executeCommand(1, MAX_SPEED/5),
            this.executeCommand(2, MAX_SPEED/5)
        ]);
    }
    right() {
        return Promise.all([
            this.executeCommand(1, -MAX_SPEED/5),
            this.executeCommand(2, -MAX_SPEED/5)
        ]);
    }
    forward() {
        return Promise.all([
            this.executeCommand(2, -MAX_SPEED),
            this.executeCommand(1, MAX_SPEED)
        ]);
    }
    backward() {
        return Promise.all([
            this.executeCommand(2, MAX_SPEED),
            this.executeCommand(1, -MAX_SPEED)
        ]);
    }
    moveStop() {
        return Promise.all([
            this.executeCommand(2, 0),
            this.executeCommand(1, 0)
        ]);
    }
    stop() {
        return Promise.all([
            this.executeCommand(1, 0),
            this.executeCommand(2, 0),
            this.executeCommand(3, 0),
            this.executeCommand(4, 0)
        ]);
    }
    /**
     * Moves the robot in the appropriate direction
     * x = -1 => left
     * x = 1 => right
     * y = -1 => backward
     * y = 1 => forward
     * 
     * @param {float} x left / right [-1, 1]
     * @param {float} y forward / backward [-1, 1]
     */
    steer(x, y) {
        // Forward :
        // this.executeCommand(1, 1)
        // this.executeCommand(2, -1)

        // Backward:
        // this.executeCommand(1, -1)
        // this.executeCommand(2, 1)

        // Left:
        // this.executeCommand(1, 1/5)
        // this.executeCommand(2, 1/5)

        // Right:
        // this.executeCommand(1, -1/5)
        // this.executeCommand(2, -1/5)

        // With Variables:
        // this.executeCommand(1, -x/5 + y)
        // this.executeCommand(2, -x/5 - y)
        let xSpeed = x * (-1/5) * MAX_SPEED;
        let ySpeed = y * (4/5) * MAX_SPEED;
        return Promise.all([
            this.executeCommand(1, xSpeed + ySpeed),
            this.executeCommand(2, xSpeed - ySpeed)
        ]);
    }
    armUp() {
        return this.executeCommand(3, -MAX_SPEED/2);
    }
    armDown() {
        return this.executeCommand(3, MAX_SPEED/2);
    }
    armStop() {
        return this.executeCommand(3, 0);
    }
    gripperOpen() {
        return this.executeCommand(4, MAX_SPEED);
    }
    gripperClose() {
        return this.executeCommand(4, -MAX_SPEED/8);
    }
    gripperStop() {
        return this.executeCommand(4, 0);
    }
    exit() {
        //console.log('Killing Python process');
        return this.stop()
            .then(() => setTimeout(() => this.child.kill('SIGINT'), 2000))
            .then(() => console.log('Done! Bye!'));
    }
}