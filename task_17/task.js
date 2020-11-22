/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}

function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = ''
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: -1,
    nowGraTime: "day"
}

function getWeekData(cityData) {
    let weekData = {};
    let weekIndex = 1;
    let accuNum = 0;
    let accuDay = 0;

    for (let key in cityData) {
        let dat = new Date(key);
        let datDay = dat.getDay();

        accuNum += cityData[key];
        accuDay += 1;
        if (datDay === 6) {
            weekData[weekIndex] = Math.ceil(accuNum / accuDay);
            accuNum = 0;
            accuDay = 0;
            weekIndex += 1;
        }

    }

    //如果最后一天不是周日，还有数据没有添加
    if (accuDay !== 0) {
        weekData[weekIndex] = Math.ceil(accuNum / accuDay);
    }
    return weekData;
}

function getMonthData(cityData) {
    let monthData = {};
    let currentMonth = null;
    let accuNum = 0;
    let accuDay = 0;

    for (let key in cityData) {
        let dat = new Date(key);
        let datMonth = dat.getMonth();
        if (currentMonth == null) {
            currentMonth = datMonth;
        }

        //新的一月，结算月份，清零数据
        if (datMonth !== currentMonth) {
            monthData[currentMonth] = Math.ceil(accuNum / accuDay);
            currentMonth = datMonth;
            accuNum = 0;
            accuDay = 0;
        }
        accuNum += cityData[key]
        accuDay += 1;
    }

    //出现新月份才会清零，但是新月份出现会加入第一天的数据，所以0/0的情况永远不会出现
    monthData[currentMonth] = Math.ceil(accuNum / accuDay);
    return monthData;
}

/**
 * 渲染图表
 */
var colors = ['#16324a', '#24385e', '#393f65', '#4e4a67', '#5a4563', '#b38e95',
    '#edae9e', '#c1b9c2', '#bec3cb', '#9ea7bb', '#99b4ce', '#d7f0f8'];

function renderChart() {
    let container = document.querySelector(".aqi-chart-wrap");
    container.innerHTML = "";

    let count = 0;
    for (let key in chartData) {
        let newElement = document.createElement("div");
        newElement.style.title = chartData[key];
        newElement.style.height = `${chartData[key]}px`;
        newElement.style.backgroundColor = `${colors[count % 12]}`;

        container.appendChild(newElement);
        count++;
    }

    let children = container.childNodes
    let containerWidth = container.clientWidth;
    for (let i = 0; i < children.length; i++) {
        let marginRight = containerWidth / (2 * count - 1);
        console.log(marginRight);

        if(i!==children.length-1){
            children[i].style.marginRight = `${marginRight}px`;
        }

    }
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
    // 确定是否选项发生了变化
    let curChoice = getRadioValue();
    if (curChoice === pageState["nowGraTime"]) {
        return;
    }
    pageState["nowGraTime"] = curChoice;

    // 设置对应数据
    resetData()

    // 调用图表渲染函数
    renderChart();
}

function getRadioValue() {
    let currentChoice = null;
    let radioArray = document.getElementsByName("gra-time");
    for (let i = 0; i < radioArray.length; i++) {
        if (radioArray[i].checked === true) {
            currentChoice = radioArray[i].value;
        }
    }

    return currentChoice;
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
    // 确定是否选项发生了变化
    let citySelect = document.querySelector("#city-select");
    let option = citySelect.selectedIndex;
    if (option === pageState["nowSelectCity"]) {
        return;
    }
    pageState["nowSelectCity"] = option;

    // 设置对应数据
    resetData();

    // 调用图表渲染函数
    renderChart();
}

//根据pageState更新数据
function resetData() {
    let cityNames = [];
    let options = document.querySelector("#city-select").options;
    for (let i = 0; i < options.length; i++) {
        cityNames.push(options[i].text);
    }

    let cityName = cityNames[pageState["nowSelectCity"]];
    let cityData = aqiSourceData[cityName];
    let timeChoice = pageState["nowGraTime"];

    if (timeChoice === "day") {
        chartData = cityData;
    } else if (timeChoice === "week") {
        chartData = getWeekData(cityData);
    } else {
        chartData = getMonthData(cityData);
    }
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    let radioArray = document.getElementsByName("gra-time");

    for (let i = 0; i < radioArray.length; i++) {
        radioArray[i].onclick = graTimeChange;
    }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    let htmlStr = "";
    for (let key in aqiSourceData) {
        let optHtml = `<option>${key}</option>`;
        htmlStr += optHtml;
    }

    let citySelect = document.querySelector("#city-select");
    citySelect.innerHTML = htmlStr;

    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    citySelect.onchange = citySelectChange;
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    let option = document.querySelector("#city-select").selectedIndex;
    pageState["nowSelectCity"] = option;

    let radios = document.getElementsByName("gra-time");
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            pageState["nowGraTime"] = radios[i].value;
        }
    }

    resetData();
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm()
    initCitySelector();
    initAqiChartData();

    renderChart();
}

window.onload = () => {
    init();
}
