window.onload = () => {
    // let container = document.getElementsByTagName("ul")[0];
    let container = document.querySelector("ul");
    let inputs = document.getElementsByTagName("input");

    let input = inputs[0],
        leftInBtn = inputs[1],
        rightInBtn = inputs[2],
        leftOutBtn = inputs[3],
        rightOunBtn = inputs[4],
        messBtn = inputs[5],
        bubbleBtn = inputs[6]
    ;

    addEvent(leftInBtn, "click", leftIn);
    addEvent(rightInBtn, "click", rightIn);
    addEvent(leftOutBtn, "click", leftOut);
    addEvent(rightOunBtn, "click", rightOut);
    addEvent(bubbleBtn, "click", bubble);

    function addEvent(element, event, func) {
        element.addEventListener(event, func, false);
    }

    function getTarget(event) {
        return event.target;
    }

    function checkInteger(str) {
        let patt = /^[0-9]+$/;
        return patt.test(str);
    }

    function checkQueueLen() {
        return container.childNodes.length < 60;
    }

    function isEmpty() {
        return container.childElementCount === 0;
    }

    function checkQualify(str) {
        if (!checkInteger(str)) {
            alert("Please enter an integer!");
            return false;
        }

        num = parseInt(str);
        if (num < 10 || num > 100) {
            alert("Invalid number!")
            return false
        }

        if (!checkQueueLen()) {
            alert("Too much num!");
            return false
        }

        return true;
    }

    function swap(ele1, ele2) {
        let tmp = ele1.style.height;
        ele1.style.height = ele2.style.height;
        ele2.style.height = tmp;
    }

    function bubble() {
        // elements = container.childNodes;
        elements = container.children;
        let i = elements.length - 1;
        let timer = setInterval(() => {
            if (i < 1) {
                clearInterval(timer);
            }
            for (let j = 0; j < i; j++) {
                if (elements[j].style.height > elements[j + 1].style.height) {
                    swap(elements[j], elements[j + 1]);
                }
            }
            i--;
        }, 500)
    }

    function leftIn() {
        let str = input.value;
        let num;

        num = parseInt(str);
        if (!checkQualify(str)) {
            return;
        }

        let newEle = document.createElement("li");
        newEle.style.height = num + "px";
        let firstNode = container.childNodes[0];
        container.insertBefore(newEle, firstNode);

    }

    function rightIn() {
        let str = input.value;
        let num;

        if (!checkQualify(str)) {
            return;
        }
        num = parseInt(str);
        let newEle = document.createElement("li");
        newEle.style.height = num + "px";
        // container.appendChild(newEle);
        container.append(newEle);
    }

    function leftOut() {
        if (isEmpty()) {
            alert("Queue is already empty!");
            return;
        }

        // let firstNode = container.childNodes[0];
        let firstNode = container.firstElementChild;
        container.removeChild(firstNode)
        alert(parseInt(firstNode.style.height))
    }

    function rightOut() {
        if (isEmpty()) {
            alert("Queue is already empty!");
            return;
        }

        // let lastNode=container.lastChild;
        let lastNode = container.lastElementChild;
        alert(parseInt(lastNode.style.height));
        container.removeChild(lastNode)
    }

}