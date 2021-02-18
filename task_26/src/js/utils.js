import $ from 'jquery'
import {EventEmitter2} from 'eventemitter2'

export class EventEmitter extends EventEmitter2 {
    on(events, ...args) {
        if (typeof (events) === "object" && 'length' in events) {
            events.forEach((it) => {
                super.on(it, ...args);
            })
        } else {
            super.on(events, ...args);
        }
    }
}

export function random(min, max) {
    return Math.random() * (max - min) + min;
}

export function log(content, msg, color) {
    let msgLog;
    if (typeof (msg) === "object") {
        msgLog = JSON.stringify(msg);
    } else if (typeof (msg) == "number") {
        msgLog = msgLog.stringify(2);
    }

    let $log = $('.log');
    if ($log.find('input').prop('checked')) {
        let $list = $log.find('.list');
        $list.append(`<div style="color:${color || 'white'};">${content},${msgLog}</div>`);
        $list.scrollTop($list[0].scrollHeight)
    }
}

export function map(obj, callback) {
    let ret = [];
    for (let key in obj) {
        ret.push(callback(obj[key], key));
    }
    return ret;
}

//TODO nextTick