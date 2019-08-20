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
            console.log(`stdout from the child: ${data}`);
            let arr = data.toString().split(',');
            let signal = arr[0];
            let id = arr[1];
            if (id !== undefined && this.executingCommands[id] !== undefined) {
                switch (signal) {
                    case 'DONE':
                        this.executingCommands[id].resolve();
                    break;
                    default:
                        console.error('something went wring with #'+arr[1]);
                        this.executingCommands[id].reject('something went wring with #'+arr[1]);
                }
                delete this.executingCommands[id];
            }
        });

        this.child.on('exit', code => {
            console.log(`this.Child Exit code is: ${code}`);
        });
    }

    executeCommand(cmd) {
        let id = this.cmdID++;
        let oProm = {};
        oProm.promise = new Promise((res, rej) => {
            this.child.stdin.write(id+','+cmd+'\n');
            //this.child.stdin.end();
            oProm.resolve = res;
            oProm.reject = rej;
        });
        this.executingCommands[id] = oProm;
        return oProm.promise;
    }
    left() {
        return this.executeCommand('left');
    }
    right() {
        return this.executeCommand('right');
    }
    stop() {
        return this.executeCommand('stop');
    }
    exit() {
        console.log('Killing Python process');
        this.stop();
        this.child.kill(-this.child.pid);
        console.log('Done! Bye!');
    }
}