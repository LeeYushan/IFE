import {map, EventEmitter} from './utils'

export class World extends EventEmitter {
    elements = {};

    constructor(viewport, canvas) {
        super();
        this.viewport = viewport;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize()
    }

    prepend(element) {
        if (!this.has(element)) {
            element.world = this;
            element.ctx = this.ctx;
            elements[element.id] = element;
        }
    }

    append(element) {
        if (!this.has(element)) {
            element.world = this;
            element.ctx = this.ctx;
            elements[element.id] = element;
        }
    }

    remove(element) {
        if (this.has(element)) {
            delete this.elements[element.id];
        }
    }

    run() {
        this.render();
        this.fresh();
    }

    fresh() {
        window.requestAnimationFrame(this.run.bind(this));
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        map(this.elements, (it) => {
            this.ctx.save();
            it.render();
            this.ctx.restore();
        })
    }

    has(element) {
        return element.id in elements;
    }

    resize() {
        this.width = this.canvas.width = this.viewport.clientWidth;
        this.height = this.canvas.height = this.viewport.clientHeight;
        this.emit('resize')
    }
}

export class Element extends EventEmitter {
    static ID = 0;
    x = 0;
    y = 0;
    r = 0;
    width = 1;
    height = 1;
    animateTimer = [];
    children = []

    constructor() {
        super();
        this.id = ++Element.ID;
    }

    draw() {

    }

    renderChildren() {
        this.children.forEach((it) => {
            this.ctx.save();
            it.render();
            this.ctx.restore();
        })
    }

    render() {
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.r);
        this.ctx.save();
        this.draw();
        this.ctx.restore();
        this.renderChildren();
    }

    clearAnimate() {
        while (this.animateTimer.length) {
            let timer = this.animateTimer.shift();
            clearTimeout(timer);
        }
    }

    moveTo(x, y, r = this.r, time = 0) {
        if (time) {
            this.emit('move', {x: x, y: y, r: r, time: time});
            this.clearAnimate();

            let count = Math.ceil(time / 30);
            let perTime = time / count;
            let diffX = x / count;
            let diffY = y / count;
            let diffR = r / count;

            for (let i = 1; i <= count; i++) {
                let _x = this.x + diffX * i;
                let _y = this.y + diffY * i;
                let _r = this.r + diffR * i;

                this.animateTimer.push(
                    setTimeout(() => {
                        this.x = _x;
                        this.y = _y;
                        this.r = _r;
                        if (i === count) {
                            this.emit('moved', {x: x, y: y, r: r, time: time})
                        }
                    }, perTime * i)
                )
            }
        } else {
            this.x = x;
            this.y = y;
            this.r = r;
        }
    }

    remove() {
        this.world.remove(this);
    }

    prepend(element) {
        this.children.unshift(element);
    }

    append(element) {
        this.children.push(element);
    }

    prependTo(target) {
        target.prepend(this);
    }

    appendTo(target) {
        target.append(this);
    }
}

