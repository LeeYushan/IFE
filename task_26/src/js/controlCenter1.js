import {log} from "./utils";
import $ from 'jquery'
import {Spaceship} from "./spaceship";
import {Sender, Accepter} from "./message"

let spaceplaneList = [
    1, 2, 3, 4
]

let $ctrList = $('.spaceplane-list');
$ctrList.html(`
    <ul>
    ${spaceplaneList.map((id) => `
        <li data-id=${id}>对${id}号下达命令
            <button data-command="run">开始飞行</button>
            <button data-command="stop">停止飞行</button>
            <button data-command="destory">销毁</button>
        </li>
    `).join("")}
    </ul>
`)

function launchCenter(planet, accepter) {
    accepter.accept((msg) => {
        if (msg.id === 0) {
            log("发生中心接收命令", msg, 'blue');
            let id = msg.id;
            let spaceplane = new Spaceship(id, {accepter});
            spaceplane.launch(planet, 30 + 50 * id);
        }
    })
}

export function center1(planet) {
    let medium = new Mediator();
    let sender = new Sender(medium);
    let accepter = new Accepter(medium);
    launchCenter(planet, accepter);

    $('.creater').html(`<button class="create">新飞船起飞</button>`)

    $('.creater .create').on('click', () => {
        if(spaceplaneList.length){
            let id = spaceplaneList.shift();
            sender.send({
                type: 0,
                id: id
            })
            $ctrList.find(`[data-id]=${id}`).show();
        }
    })

    spaceplaneList.forEach((id) => {
        $ctrList.find(`[data-id=${id}]`).on('click', (event) => {
            let target = event.target;
            let command = target.dataset.command;
            sender.send({
                type: 1,
                id: id,
                command: command
            })

            if (command === 'destory') {
                $(this).hide();
                spaceplaneList.push(id)
            }
        })
    })
}