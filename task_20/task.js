window.onload = () => {

    let arrData = [];

    $ = function (el) {
        return document.querySelector(el);
    }

    $('#insert').addEventListener("click", () => {
        console.log("insert!");
        let inputTxt = $('textarea').value.trim();
        let arrwords = inputTxt.split(/[^0-9a-zA-Z\u4e00-\u9fa5]+/).filter((cur) => {
            return !(cur == null || cur.length === 0);
        })
        arrData = arrData.concat(arrwords);
        render();
    }, false)

    function render(str) {
        $('#result').innerHTML = arrData.map((cur) => {
            if (str != null && str.length !== 0) {
                cur = cur.replace(str, "<span>" + str + "</span>")
            }
            return "<div>" + cur + "</div>"
        }).join("");
    }

    $('#search').addEventListener("click", () => {
        let str = $('#input').value.trim();
        render(str);
    }, false)
}