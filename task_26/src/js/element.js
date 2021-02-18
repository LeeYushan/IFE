import {Element} from "./canvas";
import satelliteImgUrl from "../imgs/satellite.png"
import planetImgUrl from "../imgs/planet.png"

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
        this.moveTo(this.x, this.y, this.r + diffR,1000);
    }

    stop(){
        if(this.runTimer){
            clearInterval(this.runTimer);
            this.runTimer=null;
        }
    }
}

//TODO SpaceplaneElement