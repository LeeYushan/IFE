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
            this.ctx.reload();
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

