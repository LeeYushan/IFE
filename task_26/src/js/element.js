import {Element} from "./canvas";
import satelliteImgUrl from "../imgs/satellite.png"
import planetImgUrl from "../imgs/planet.png"
import spaceshipImgUrl from "../imgs/spaceship.png"
import spaceshipFireImgUrl from "../imgs/spaceship-fire.png.png"

export class PlanetElement extends Element {
    constructor(size) {
        super();
        this.width = this.height = this._size = size * 2;
        this.img = new Image();
        this.img.src = planetImgUrl;
    }

    moveToCenter() {
        super.moveTo(this.world.width / 2, this, world.height / 2, this.r, 500);
    }

    draw() {
        this.ctx.translate(-this._size / 2, -this._size / 2);
        this.ctx.drawImage(this.img, 0, 0, this.width, this.height);
    }
}

export class SatelliteElement extends PlanetElement {
    runTimer = null;

    constructor(planet, radius, speed) {
        super(30);
        this.planet = planet;
        this.radius = radius;
        this.speed = speed;
        this.x = this.planet.x;
        this.y = this.planet.y;
        this.r = 0;

        this.img = new Image()
        this.img.src = satelliteImgUrl;

        this.planet.on('move', (pos) => {
            this.moveTo(pos.x, pos.y, this.r);
        })
    }

    draw() {
        this.ctx.rotate(this.r);
        this.ctx.translate(0, this.radius);
        this.ctx.translate(-this.width / 2, -this.height / 2);
        this.ctx.drawImage(this.img, 0, 0, this.width, this.height);
    }

    run() {
        let run = () => {
            this.runAroundTheSun(this.speed);
        }
        setInterval(run, 1000);
    }

    runAroundTheSun(speed) {
        let diffR = speed / this.radius;
        this.moveTo(this.x, this.y, this.r + diffR, 1000);
    }

    stop() {
        if (this.runTimer) {
            clearInterval(this.runTimer);
            this.runTimer = null;
        }
    }
}

export class SpaceplaneElement extends Element {
    framePerSecond = 10;
    runTimer = null;
    width = 70;
    height = 25;

    constructor(planet, name, radius, speed) {
        super();
        this.name = name;
        this.planet = planet;
        this.speed = speed;
        this.realSpeed = 0;//????这是干嘛的
        this.accel = this.speed / 12;
        this.radius = radius;

        this.x = this.planet.x;
        this.y = this.planet.y;
        this.r = 0;

        this.setPower(100);

        this.img = new Image();
        this.img.src = spaceshipImgUrl;
        this.imgFire = new Image();
        this.imgFire.src = spaceshipFireImgUrl;

        this.planet.on('move', (pos) => {
            this.moveTo(pos.x, pos.y, this.r);
        })
    }

    draw() {
        this.ctx.rotate(this.r);
        this.ctx.translate(0, -this.y);
        this.ctx.translate(-this.width / 2, -this.height / 2);
        if (this.runTimer) {
            this.ctx.drawImage(this.imgFire, 0, 0, this.width, this.height);
        } else {
            this.ctx.drawImage(this.img, 0, 0, this.width, this.height);
        }
        this.ctx.translate(5, 0);
        this.ctx.textBaseline('bottom');
        this.ctx.textAlign('center');
        this.ctx.fillStyle('white');
        this.ctx.fillText(`${this.name}-${this._power.toFixed()}%`, this, this.width / 2, 0);
    }

    run() {
        this.emit('run.start');
        this.clearRunTimer();
        let index = 0;
        this.accel = Math.abs(this.accel);

        let run = () => {
            if (index++ % this.framePerSecond === 0) {
                this.emit('run.step');
            }

            if (this.realSpeed + this.accel < this.speed) {
                this.realSpeed += this.accel;
            } else {
                this.realSpeed = this.speed;
            }

            if (this.realSpeed <= 0) {
                this.stop();
                return;
            }

            this.aroundSun(this.realSpeed / this.framePerSecond, 1000 / this.framePerSecond);
        }

        setInterval(run, 1000 / this.framePerSecond);
    }

    aroundSun(diff, time) {
        let diffR = diff / this.radius;
        this.moveTo(this.x, this.y, this.r + diffR, time);
    }

    speedCut() {
        this.accel = -Math.abs(this.accel);
    }

    setPower(power) {
        this._power = power;
        this.emit('update.power', power);
    }

    getPower() {
        return this._power
    }

    clearRunTimer() {
        if (this.runTimer) {
            clearInterval(this.runTimer);
            this.runTimer = null;
            this.clearAnimate();
        }
    }

    stop() {
        this.emit('stop');
        this.clearRunTimer();
    }

    remove() {
        super.remove();
        this.clearRunTimer()
    }
}