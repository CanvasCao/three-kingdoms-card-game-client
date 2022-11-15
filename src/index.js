import './style.css'
import './socket/index'
import Phaser from 'phaser';
import 'normalize.css'
import elementsUrl from './config/elementsUrl.json'
import sizeConfig from './config/sizeConfig.json'
import {socket} from "./socket";
import {ControlCard} from "./class/ControlCard";
import {ControlPlayer} from "./class/ControlPlayer";
import {getMyUserId} from "./utils/utils";
import {Player} from "./class/Player";

const myUserId = getMyUserId();

const eventBus = {
    needInit: false,
    needRefreshStatus: false,
    gameStatus: null,

    needDrawCards: false,
    drawCardsData: [],
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

socket.on('drawCards', (data) => {
    eventBus.needDrawCards = true;
    eventBus.drawCardsData = data;
});

socket.on('message', (data) => {
    console.log(data);
});

class Gaming extends Phaser.Scene {
    constructor() {
        super();
        this.controlCards = [];
        this.controlPlayer = null;
        this.players = [];
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
            this.controlPlayer = new ControlPlayer(this, gameStatus.users[0]);

            this.players = gameStatus.users.map((user) => {
                const player = new Player(this, user)
                return player;
            });

        } else if (eventBus.needDrawCards) {
            eventBus.needDrawCards = false;
            const thisTurnPlayer = this.players.find((player) => player.user.userId == eventBus.drawCardsData.userId)
            thisTurnPlayer.addCards(eventBus.drawCardsData.cards);


            if (eventBus.drawCardsData.userId == myUserId) {
                eventBus.drawCardsData.cards.forEach((_card) => {
                    const card = new ControlCard(this, _card);
                    this.controlCards.push(card);
                });
            }
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: sizeConfig.background.width,
    height: sizeConfig.background.height,
    scene: [Gaming],
    backgroundColor: '#eee'
};
const game = new Phaser.Game(config);


