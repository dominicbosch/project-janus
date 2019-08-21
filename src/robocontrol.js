'use strict';

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
        // this.child.stdout.pipe(process.stdout);
        this.child.stdout.on('data', data => {
            console.log(`Robo says: ${data}`);
            let arr = data.toString().split(',');
            let signal = arr[0];
            let id = arr[1];
            console.log('SIGNAL=', signal);
            console.log('id=', id);
            console.log(Object.keys(this.executingCommands));
            if (id !== undefined && this.executingCommands[id] !== undefined) {
                switch (signal) {
                    case 'DONE':
                        console.log('RESOLVING');
                        this.executingCommands[id].resolve();
                    break;
                    default:
                        console.error('something went wrong with #'+arr[1]);
                        this.executingCommands[id].reject('something went wring with #'+arr[1]);
                }
                delete this.executingCommands[id];
            }
        });

        this.child.on('exit', code => {
            console.log(`this.Child Exit code is: ${code}`);
        });
    }

    executeCommand(motor, val) {
        let id = this.cmdID++;
        let oProm = {};
        oProm.promise = new Promise((res, rej) => {
            this.child.stdin.write(id+','+motor+','+val+'\n');
            oProm.resolve = res;
            oProm.reject = rej;
        });
        this.executingCommands[id] = oProm;
        return oProm.promise;
    }
    left() {
        return this.executeCommand(2, 1);
    }
    right() {
        return this.executeCommand(1, -1);
    }
    run() {
        return this.executeCommand(2, -1)
            .then(this.executeCommand(1, 1));
    }
    stop() {
        return this.executeCommand(1, 0)
            .then(this.executeCommand(2, 0))
            .then(this.executeCommand(3, 0))
            .then(this.executeCommand(4, 0));
    }
    steer(x, y) {

    }
    armUp() {
        return this.executeCommand(3, -0.25);
    }
    armDown() {
        return this.executeCommand(3, 0.25);
    }
    gripperOpen() {
        setTimeout(() => this.executeCommand(4, 0), 500);
        return this.executeCommand(4, 1);
    }
    gripperClose() {
        setTimeout(() => this.executeCommand(4, 0), 500);
        return this.executeCommand(4, -1);
    }
    exit() {
        console.log('Killing Python process');
        this.stop();
        this.child.kill(-this.child.pid);
        console.log('Done! Bye!');
    }
}