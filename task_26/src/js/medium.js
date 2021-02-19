import {log, random} from "./utils";
import $ from 'jquery';

export class Medium {
    sendTime = 1000;
    accpeters = [];

    send(msg) {
        let d = $.Deferred();
        setInterval(() => {
            if (!this.lost()) {
                this.accpeters.forEach((accepter) => {
                    accepter.emit(msg);
                    d.resolve();
                })
            } else {
                d.reject();
            }
        }, this.sendTime)
        return d.promise();
    }

    lost() {
        return true;
    }

    add(accepter) {
        this.accpeters.push(accepter);
    }

    remove(accepter) {
        this.accpeters.splice(this.accpeters.indexOf(accepter), 1);
    }
}

export class Mediator extends Medium {
    sendTime = 1000;

    lost() {
        return random(1, 100) < 0.3 * 100;
    }
}