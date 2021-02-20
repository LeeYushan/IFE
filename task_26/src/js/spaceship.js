import {log} from "./utils";
import {SpaceplaneElement} from "./element";
import $ from 'jquery';

export class spaceship {
    runTimer = null;

    constructor(id, config) {
        this.id = id;
        this.cfg = $.extend({
            speed: 20,
            addPower: 1,
            decPower: 5,
            sender: null,
            accepter: null
        }, config)

        this.accepterRemove = this.cfg.accepter.add((msg) => {
            if (msg.type === 1 && msg.id === this.id) {
                log(`${this.id}号飞船收到消息`, msg, 'blue')
                switch (msg.command) {
                    case 'run':
                        this.run();
                        break;
                    case 'stop':
                        this.stop();
                        break;
                    case 'break':
                        this.destory();
                        break;
                }
            }
        })
    }

    launch(planet, radius = 100) {
        this.power = 100;
        this.status = 'stop';
        this.el = new SpaceplaneElement(this.planet, `${this.id}号飞船`, radius, 20);
        this.world = this.planet.world;

        this.el.on('run.start', () => {
            this.status = 'run';
        })
        this.el.on('run.step', () => {
            if (this.power - this.cfg.decPower <= 0) {
                this.stop();
                this.power = 0;
                return;
            }
            this.power -= this.cfg.decPower;
            this.el.setPower(this.power)
        })
        this.el.on('stop', () => {
            this.status = 'stop';
        })
        this.world.append(this.el);

        this.runTimer = setInterval(() => {
            if (this.power + this.cfg.addPower < 100) {
                this.power += this.cfg.addPower;
            } else {
                this.power = 100;
            }
            this.el.setPower(this.power)
            this.sendStatus()
        }, 1000)
    }

    sendStatus() {
        if (this.cfg.sender) {
            this.cfg.sender.send({
                type: 2,
                id: this.id,
                power: this.power,
                status: this.status
            })
        }
    }

    run() {
        this.el.run();
    }

    stop() {
        this.el.speedCut()
    }

    destory() {
        this.status = 'destory';
        this.sendStatus();
        clearInterval(this.runTimer);
        this.el.remove();
        this.accepterRemove();
    }
}
