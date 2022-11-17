import './style.css'
import './socket/index'
import Phaser from 'phaser';
import 'normalize.css'
import elementsUrl from './config/elementsUrl.json'
import sizeConfig from './config/sizeConfig.json'
import {socket} from "./socket";
import {ControlCardsManager} from "./class/ControlCardsManager";
import {ControlPlayer} from "./class/ControlPlayer";
import {GameStatusObserved} from "./class/GameStatusObserved";
import {getMyUserId} from "./utils/utils";
import {Player} from "./class/Player";

const myUserId = getMyUserId();

const eventBus = {
    needInit: false,
    needRefreshStatus: false,
    gameStatus: null,
};


// UI点击触发事件
$("#GoNextStage").click(() => {
    socket.emit('goNextStage');
})
socket.on('goNextStage', (data) => {
    // $("#StageInfo").text(JSON.stringify(data, null, "\t"))
    // console.log(JSON.stringify(data, null, "\t"))
    game.scene.keys.default.gameStatusObserved.setGameStatus(data);
});

// 监听
socket.on('init', (data) => {
    eventBus.needInit = true;
    eventBus.gameStatus = data;
});

socket.on('refreshStatus', (data) => {
    eventBus.needRefreshStatus = true;
    eventBus.gameStatus = data;
});


class Gaming extends Phaser.Scene {
    constructor() {
        super();
        this.controlCards = [];
        this.controlPlayer = null;
        this.players = [];
        this.controlCardsManager =null;
        this.gameStatusObserved = new GameStatusObserved();
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
        // 人到齐 开始选将
        // socket.emit('start');

        // 选将完成开始游戏
        socket.emit(
            'init',
            {userId: getMyUserId()}
        );
    }

    update() {
        if (eventBus.needInit) {
            eventBus.needInit = false;
            const gameStatus = eventBus.gameStatus;

            this.controlPlayer = new ControlPlayer(this, eventBus.gameStatus.users.find((user) => user.userId === getMyUserId()));
            this.players = gameStatus.users.map((user) => {
                return new Player(this, user)
            });
            this.controlCardsManager = new ControlCardsManager(this);

            this.gameStatusObserved.setGameStatus(eventBus.gameStatus);
        } else if (eventBus.needRefreshStatus) {
            eventBus.needRefreshStatus = false;
            this.gameStatusObserved.setGameStatus(eventBus.gameStatus);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: sizeConfig.background.width,
    height: sizeConfig.background.height,
    scene: [Gaming],
    backgroundColor: '#ccc'
};
const game = new Phaser.Game(config);


