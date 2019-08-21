'use strict';
const MAX_SPEED = 0.6;

module.exports = class RoboControl {
    constructor() {
        // We use cmdID to identify distinct commands and fulfill the promise
        this.cmdID = 0;
        // We store executing promises under their command ID
        this.executingCommands = {};

        var spawn = require('child_process').spawn;
        this.child = spawn('python3', ['-u', '-i', 'robocmd.py'], { detached: true });
        this.child.on('error', function(err) {
            console.error(err);
        });

        this.child.stdin.setEncoding('utf-8');
        this.child.stdout.on('data', data => {
            let arr = data.toString().trim().split('\n');
            for (let i = 0; i < arr.length; i++) {
                this.processCommand(arr[i]);
            }
        });

        this.child.on('exit', code => {
            console.log(`this.Child Exit code is: ${code}`);
        });
    }

    processCommand(str) {
        let arr = str.split(',');
        let signal = arr[0];
        if (signal === 'DONE' && arr[1] !== undefined) {
            let id = arr[1];
            console.log('Robo says: "'+str+'", SIGNAL="'+signal+'", id="'+id+'"');
            if (id !== undefined && this.executingCommands[id] !== undefined) {
                this.executingCommands[id].resolve();
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
        console.log('Put on stack: id="'+id+'", motor="'+motor+'", val="'+val+'"');
        let oProm = {};
        oProm.promise = new Promise((res, rej) => {
            console.log('Executing: id="'+id+'", motor="'+motor+'", val="'+val+'"');
            this.child.stdin.write(id+','+motor+','+val+'\n');
            oProm.resolve = res;
            oProm.reject = rej;
        });
        this.executingCommands[id] = oProm;
        return oProm.promise;
    }
    left() {
        return Promise.all([
            this.executeCommand(1, MAX_SPEED),
            this.executeCommand(2, MAX_SPEED)
        ]);
    }
    right() {
        return Promise.all([
            this.executeCommand(1, -MAX_SPEED),
            this.executeCommand(2, -MAX_SPEED)
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
    stop() {
        return Promise.all([
            this.executeCommand(1, 0),
            this.executeCommand(2, 0),
            this.executeCommand(3, 0),
            this.executeCommand(4, 0)
        ]);
    }
    steer(x, y) {

    }
    armUp() {
        return this.executeCommand(3, -MAX_SPEED/2);
    }
    armDown() {
        return this.executeCommand(3, MAX_SPEED/2);
    }
    gripperOpen() {
        setTimeout(() => this.executeCommand(4, 0), 2000);
        return this.executeCommand(4, MAX_SPEED);
    }
    gripperClose() {
        setTimeout(() => this.executeCommand(4, 0), 2000);
        return this.executeCommand(4, -MAX_SPEED/5);
    }
    exit() {
        //console.log('Killing Python process');
        return this.stop()
            .then(() => setTimeout(() => this.child.kill('SIGINT'), 2000))
            .then(() => console.log('Done! Bye!'));
    }
}