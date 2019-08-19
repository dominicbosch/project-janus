'use strict';

module.exports = class RoboControl {
    constructor() {
        // We use cmdID to identify distinct commands and fulfill the promise
        this.cmdID = 0;
        // We store executing promises under their command ID
        this.executingCommands = {};

        var spawn = require('child_process').spawn;
        this.child = spawn('python3', ['robocmd.py']);
        this.child.on('error', function(err) {
            console.error(err);
        });

        this.child.stdin.setEncoding('utf-8');
        // this.child.stdout.pipe(process.stdout);
        this.child.stdout.on('data', data => {
            console.log(`stdout from the child: ${data}`);
            let arr = data.split(',');
            let signal = arr[0];
            let id = arr[1];
            switch (signal) {
                case 'DONE':
                    this.executingCommands[id].resolve();
                    delete this.executingCommands[id];
                    break;
                default: console.error('something went wring with #'+arr[1]);
            }
        });

        this.child.on('exit', code => {
            console.log(`this.Child Exit code is: ${code}`);
        });
    }

    executeCommand(cmd) {
        let id = this.cmdID++;
        let p = new Promise((res, rej) => {
            this.child.stdin.write(id+','+cmd+'\n');
            this.child.stdin.end();
        });
        this.executingCommands[id] = p;
        return p;
    }
    left() {
        return this.executeCommand('left');
    }
    right() {
        return this.executeCommand('right');
    }
}