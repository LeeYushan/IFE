window.onload = () => {
    function addHandler(ele, event, func) {
        ele.addEventListener(event, func, false);
    }

    function getKeyCode(event) {
        keyCode = event.keyCode;
        if (!keyCode) {
            alert("Key code do no exist!");
        }
        return event.keyCode;
    }

    let dataManager = {
        tag: [],
        hobby: []
    }

    let tagInput = document.getElementById("tag-input");
    let hobbyInput = document.getElementById("hobby-input")
    let btn = document.getElementsByTagName("button")[0]

    function render(selector) {
        let targetArr = dataManager[selector];

        let container = document.querySelector("." + selector);
        container.innerHTML = "";

        for (let i = 0; i < targetArr.length; i++) {
            let newEle = document.createElement("li");

            newEle.innerHTML = targetArr[i];
            addHandler(newEle, "click", function () {
                removeTag(selector, targetArr[i]);
            })
            container.appendChild(newEle);
        }

    }

    function addTag(selector, arr) {
        let targetArr = dataManager[selector];
        for (let i = 0; i < arr.length; i++) {
            let notalreadyIn = targetArr.every((cur) => {
                return cur !== arr[i];
            })

            if (notalreadyIn) {
                if (targetArr.length >= 10) {
                    targetArr.shift();
                }
                targetArr.push(arr[i]);
            }
        }
        render(selector);
    }

    function removeTag(selector, target) {

        let arr = dataManager[selector];

        //这里应该是开辟了新的内存
        arr = arr.filter((cur) => {
            return cur !== target;
        })
        dataManager[selector]=arr;

        render(selector);
    }

    function tagHangler(event) {
        let keyCode = getKeyCode(event);
        if (keyCode === 32 || keyCode === 44 || keyCode === 13) {
            let arr = tagInput.value.split(/[^0-9a-zA-Z\u4E00-\u9FFF]+/).filter(function (cur) {
                return cur !== null && cur.length !== 0;
            });
            addTag("tag", arr);
        }
    }

    function hobbyHandler() {
        let arr = hobbyInput.value.split(/[^0-9a-zA-Z\u4E00-\u9FFF]+/);
        addTag("hobby", arr);
    }

    function init() {
        addHandler(tagInput, "keypress", tagHangler);
        addHandler(btn, "click", hobbyHandler);
    }

    init();
}