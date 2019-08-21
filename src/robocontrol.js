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
        return this.executeCommand(2, 1);
    }
    right() {
        return this.executeCommand(1, -1);
    }
    forward() {
        return this.executeCommand(2, -1)
            .then(this.executeCommand(1, 1));
    }
    backward() {
        return this.executeCommand(2, 1)
            .then(this.executeCommand(1, -1));
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
        setTimeout(() => this.executeCommand(4, 0), 2000);
        return this.executeCommand(4, 1);
    }
    gripperClose() {
        setTimeout(() => this.executeCommand(4, 0), 2000);
        return this.executeCommand(4, -1);
    }
    exit() {
        //console.log('Killing Python process');
        this.stop();
        //this.child.kill(this.child.pid);
        console.log('Done! Bye!');
    }
}