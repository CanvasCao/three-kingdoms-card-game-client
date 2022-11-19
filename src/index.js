import './style.css'
import './socket/index'
import Phaser from 'phaser';
import 'normalize.css'
import elementsUrl from './config/elementsUrl.json'
import sizeConfig from './config/sizeConfig.json'
import {socket} from "./socket";
import {ControlCardsManager} from "./class/ControlCardsManager";
import {ControlPlayer} from "./class/ControlPlayer";
import {ControlButtons} from "./class/ControlButtons";
import {GameStatusObserved} from "./class/GameStatusObserved";
import {GameFEStatusObserved} from "./class/GameFEStatusObserved";
import {getMyUserId} from "./utils/utils";
import {Player} from "./class/Player";
import emitMap from "./config/emitMap.json";

const eventBus = {
    needInit: false,
    needRefreshStatus: false,
    gameStatus: null,
};


// UI点击触发事件
$("#GoNextStage").click(() => {
    socket.emit(emitMap.GO_NEXT_STAGE);
})

socket.on(emitMap.GO_NEXT_STAGE, (data) => {
    //$("#StageInfo").text(JSON.stringify(data, null, "\t"))
    // console.log(JSON.stringify(data, null, "\t"))
    game.scene.keys.default.gameStatusObserved.setGameStatus(data);
});

// 监听只可能有一次
socket.on(emitMap.INIT, (data) => {
    if (eventBus.inited) {
        return
    }
    //console.log("INIT",data)
    eventBus.needInit = true;
    eventBus.gameStatus = data;
    eventBus.inited = true
});

socket.on(emitMap.REFRESH_STATUS, (data) => {
    //console.log("REFRESH_STATUS", data)
    eventBus.needRefreshStatus = true;
    eventBus.gameStatus = data;
});


class Gaming extends Phaser.Scene {
    constructor() {
        super();

        this.socket = socket;

        this.controlCards = [];
        this.controlPlayer = null;
        this.players = [];
        this.controlCardsManager = null;

        this.gameStatusObserved = new GameStatusObserved();
        this.gameFEStatusObserved = new GameFEStatusObserved();
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
        const bg = this.add.image(0, 0, 'bg');
        bg.setOrigin(0, 0)
        bg.displayWidth = sizeConfig.background.width;
        bg.displayHeight = sizeConfig.background.height;

        // 人到齐 开始选将
        // socket.emit();

        // 选将完成开始游戏
        socket.emit(
            emitMap.INIT,
            {userId: getMyUserId()}
        );
    }

    update() {
        if (eventBus.needInit) {
            eventBus.needInit = false;
            const gameStatus = eventBus.gameStatus;

            this.controlButtons = new ControlButtons(this);
            this.controlCardsManager = new ControlCardsManager(this);

            this.controlPlayer = new ControlPlayer(this, eventBus.gameStatus.users[getMyUserId()]);
            this.players = Object.values(gameStatus.users).map((user) => new Player(this, user));

            this.gameStatusObserved.setGameStatus(eventBus.gameStatus);
        }
        if (eventBus.needRefreshStatus) {
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


