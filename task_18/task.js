function addEvent(element, event, listener) {
    element.addEventListener(event, listener);
}

window.onload = function () {
    let container = document.getElementById("container");
    let inputs = document.getElementsByTagName("input");

    var queue = {
        str: [],
        leftIn: function (num) {
            if(!this.checkInteger(num)){
                return;
            }
            this.str.unshift(num.toString());
            this.paint();
        },

        rightIn: function (num) {
            if(!this.checkInteger(num)){
                return;
            }
            this.str.push(num.toString());
            this.paint();
        },

        leftOut: function (num) {
            if (this.isEmpty()) {
                alert("Queue is already empty!");
            } else {
                alert(this.str.shift());
                this.paint();
            }
        },

        rightOut: function (num) {
            if (this.isEmpty()) {
                alert("Queue is already empty!");
            } else {
                alert(this.str.pop());
                this.paint();
            }
        },

        isEmpty: function () {
            return this.str.length <= 0;
        },

        checkInteger:function (){
            let patt=/^[0-9]+$/;
            if(!patt.test(num)){
                alert("Please enter an integer!");
                return false;
            }else {
                return true;
            }
        },

        deleteById: function (id) {
            this.str.splice(id, 1);
            this.paint();
        },

        paint: function () {
            let str = "";
            for (let i = 0; i < this.str.length; i++) {
                str += `<div>${parseInt(this.str[i])}</div>`;
            }
            container.innerHTML = str;
            addDeleteEvents();
        }

    }

    function addDeleteEvents() {
        for (let i = 0; i < container.childNodes.length; i++) {

            addEvent(container.childNodes[i],"click",function (){
                queue.deleteById(i);
            })
        }
    }

    addEvent(inputs[1], "click", () => {
        num = inputs[0].value;
        queue.leftIn(num);
    })

    addEvent(inputs[2], "click", () => {
        num = inputs[0].value;
        queue.rightIn(num);
    })

    addEvent(inputs[3], "click", () => {
        queue.leftOut();
    })

    addEvent(inputs[4], "click", () => {
        queue.rightOut();
    })

}