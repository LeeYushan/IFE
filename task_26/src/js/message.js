import {log} from "./utils";

class Sender {
    constructor(medium) {
        this.medium = medium;
    }

    send(msg) {
        log(msg);
        this.medium.send(msg);
    }
}

class Accepter {
    listeners = [];

    constructor(medium) {
        this.medium = medium;
        medium.add(this);
    }

    emit(msg) {
        this.listeners.forEach((listener) => {
            listener(msg);
        })
    }

    add(cb) {
        this.listeners.push(cb);
        return () => {
            this.remove(cb);
        }
    }

    remove(target) {
        this.listeners.splice(this.listeners.indexOf(target), 1);
    }
}