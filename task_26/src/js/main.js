import {World} from "./canvas";
import {PlanetElement, SatelliteElement} from "./element";
import {center1} from "./controlCenter1";

//创建场景
let world =new World(window.body,document.getElementById('canvas'));

//创建星球
let planet=new PlanetElement(50)
world.append(planet)
world.on('resize',()=>{
    planet.moveToCenter()
})
planet.moveToCenter();

//创建卫星
let satellite=new SatelliteElement(planet,290,4)
world.append(satellite);
satellite.run();

//新建控制中心在星球上
center1(planet)

//启动场景
window.addEventListener('resize',()=>{
    world.resize()
})
world.run()