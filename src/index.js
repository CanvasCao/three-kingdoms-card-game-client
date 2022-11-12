import './style.css'
import './socket/index'
import Phaser from 'phaser';
import 'normalize.css'
import cardsUrl from './config/cardsUrl.json'
import gameConfig from './config/gameConfig.json'
import {socket} from "./socket";

const eventBus = {
    init: false,
    refreshStatus: false,
    gameStatus: null
};

// UI点击触发事件
$(document).click(() => {
    socket.emit('refreshStatus');
})

// 监听
socket.on('init', (data) => {
    eventBus.init = true;
    eventBus.gameStatus = data;
});

class Card {
    constructor(gamingScene, initX, initY, cardName) {
        this.initX = initX;
        this.initY = initY;
        const cardImgObj = gamingScene.add.image(
            initX,
            initY,
            cardName).setInteractive();

        cardImgObj.displayHeight = gameConfig.card.height;
        cardImgObj.displayWidth = gameConfig.card.width;

        cardImgObj.on('pointerdown', () => {
            gamingScene.tweens.add({
                targets: cardImgObj,
                y: {
                    value: gameConfig.background.height - gameConfig.card.height,
                    duration: 200,
                    delay: 0
                }
            });
        });
    }
}

class Gaming extends Phaser.Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.setBaseURL(cardsUrl.baseUrl);
        for (const cardName in cardsUrl.game) {
            this.load.image(cardName, cardsUrl.game[cardName]);
        }
    }

    create() {
        socket.emit('init');
    }

    update() {
        if (eventBus.init) {
            let initX = gameConfig.card.width / 2;
            eventBus.gameStatus.users[0].cards.forEach(() => {
                new Card(this, initX, gameConfig.background.height - gameConfig.card.height / 2, "sha");
                initX += gameConfig.card.width;
            });
            eventBus.init = false;
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: gameConfig.background.width,
    height: gameConfig.background.height,
    scene: [Gaming],
    backgroundColor: '#fff'
};
const game = new Phaser.Game(config);


