import './style.css'
import './socket/index'
import Phaser from 'phaser';
import 'normalize.css'
import elementsUrl from './config/elementsUrl.json'
import gameConfig from './config/gameConfig.json'
import {socket} from "./socket";
import {Card} from "./class/Card";
import {MyPlayer} from "./class/MyPlayer";

const eventBus = {
    needInit: false,
    needRefreshStatus: false,
    gameStatus: null
};

// UI点击触发事件
$(document).click(() => {
    socket.emit('refreshStatus');
})

// 监听
socket.on('init', (data) => {
    eventBus.needInit = true;
    eventBus.gameStatus = data;
});


class Gaming extends Phaser.Scene {
    constructor() {
        super();
        this.mycards = [];
        this.myPlayer = null;
    }

    preload() {
        this.load.setBaseURL(elementsUrl.baseUrl);
        for (const cardName in elementsUrl.game) {
            this.load.image(cardName, elementsUrl.game[cardName]);
        }
        for (const playerId in elementsUrl.player) {
            this.load.image(playerId, elementsUrl.player[playerId]);
        }
        for (const key in elementsUrl.other) {
            this.load.image(key, elementsUrl.other[key]);
        }
    }

    create() {
        socket.emit('init');
    }

    update() {
        if (eventBus.needInit) {
            let initX = gameConfig.card.width / 2;

            const gameStatus = eventBus.gameStatus;
            this.mycards = gameStatus.users[0].cards.map(() => {
                const card = new Card(this, initX, gameConfig.background.height - gameConfig.card.height / 2, "sha");
                initX += gameConfig.card.width;
                return card;
            });
            this.myPlayer = new MyPlayer(this, gameStatus.users[0]);

            eventBus.needInit = false;
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: gameConfig.background.width,
    height: gameConfig.background.height,
    scene: [Gaming],
    backgroundColor: '#eee'
};
const game = new Phaser.Game(config);


