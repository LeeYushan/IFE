/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData(cityName, num) {
    aqiData[cityName] = num;
    renderAqiList();
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    let table = document.querySelector("#aqi-table");
    let str = "<tr>\n" +
        "        <td>城市</td><td>空气质量</td><td>操作</td>\n" +
        "      </tr>";
    for (let key in aqiData) {
        str += `<tr>
        <td>${key}</td><td>${aqiData[key]}</td><td><button>删除</button></td>
      </tr>`
    }
    table.innerHTML = str;
    addAllDelBtnHandle();
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    let aqiCityInput=document.querySelector("#aqi-city-input").value.trim();
    let aqiValueInput=document.querySelector("#aqi-value-input").value.trim();
    if(!aqiCityInput.match(/^[A-Za-z\u4E00-\u9FA5]+$/)){
        alert("城市名称请输入英文或汉字");
        return;
    }
    if(!aqiValueInput.match(/^\d+/)){
        alert("空气质量指数请输入数字");
        return;
    }

    addAqiData(aqiCityInput,aqiValueInput);
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(ev) {
    // do sth.
    let targetElement = ev.target;
    let trElement=targetElement.parentElement.parentElement;
    const cityName=trElement.getElementsByTagName("td")[0].innerHTML;
    delete aqiData[cityName];
    console.log(aqiData);

    renderAqiList();
}

function addAllDelBtnHandle() {
    let table = document.querySelector("#aqi-table");
    let btnArray = table.getElementsByTagName("button");
    for (i = 0; i < btnArray.length; i++) {
        btnArray[i].onclick = delBtnHandle;
    }
}

function init() {

    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    let addBtn = document.querySelector("#add-btn");
    addBtn.onclick = addBtnHandle;

    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
    addAllDelBtnHandle()

}

document.addEventListener("DOMContentLoaded",()=>{
    init();
})


