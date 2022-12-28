import './style.css'
import './socket'
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
import {getMyUserId} from "./utils/gameStatusUtils";
import {Player} from "./class/Player";
import emitMap from "./config/emitMap.json";
import JSONEditor from "./jsoneditor/jsoneditor.min.js";
import "./jsoneditor/jsoneditor.min.css";
import {PublicControlCardsManager} from "./class/PublicCardsManager";
import {Socket} from "./socket/socket.io.esm.min";
import {Card, GameStatus} from './types/gameStatus';
import {ElementsUrlJson} from './types/config';
import {EmitPlayPublicCardData} from './types/emit';
import {PlayerCardsBoard} from './class/PlayerCardsBoard';
import {getPlayersWithPosition} from './utils/locationUtils';

// create the editor
const container = document.getElementById('jsoneditor')
export const editor = new JSONEditor(container, {})
export const editor2 = new JSONEditor(container, {})

// UI点击触发事件
$("#GoNextStage").click(() => {
    socket.emit(emitMap.GO_NEXT_STAGE);
})

class Gaming extends Phaser.Scene {
    socket: Socket;
    inited: boolean;
    controlCards: Card[];
    controlPlayer: ControlPlayer | undefined;
    players: Player[];
    gameStatusObserved: GameStatusObserved;
    gameFEStatusObserved: GameFEStatusObserved;
    playerCardsBoard: PlayerCardsBoard | undefined;
    controlButtons: ControlButtons | undefined;
    controlCardsManager: ControlCardsManager | undefined;
    publicControlCardsManager: PublicControlCardsManager | undefined;

    constructor() {
        // @ts-ignore
        super();

        this.socket = socket;
        this.inited = false;

        this.controlCards = [];
        this.players = [];

        this.gameStatusObserved = new GameStatusObserved();
        this.gameFEStatusObserved = new GameFEStatusObserved();
    }

    preload() {
        const elementsUrlJson = elementsUrl as unknown as ElementsUrlJson;
        this.load.setBaseURL(elementsUrl.baseUrl);
        for (const key in elementsUrl.card) {
            this.load.image(key, elementsUrlJson.card[key]);
        }
        for (const playerId in elementsUrl.player) {
            this.load.image(playerId, elementsUrlJson.player[playerId]);
        }
        for (const key in elementsUrl.other) {
            this.load.image(key, elementsUrlJson.other[key]);
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

        // 监听只可能有一次
        socket.on(emitMap.INIT, (data: GameStatus) => {
            if (this.inited) {
                return
            }

            this.playerCardsBoard = new PlayerCardsBoard(this);
            this.controlButtons = new ControlButtons(this);
            this.controlCardsManager = new ControlCardsManager(this);
            this.publicControlCardsManager = new PublicControlCardsManager(this);
            this.controlPlayer = new ControlPlayer(this, data.users[getMyUserId()]);

            const players = getPlayersWithPosition(data.users);
            this.players = players.map((user) => new Player(this, user));

            this.gameStatusObserved.setGameStatus(data);

            this.inited = true;
        });

        socket.on(emitMap.REFRESH_STATUS, (data: GameStatus) => {
            // console.log("REFRESH_STATUS", data)
            this.gameStatusObserved.setGameStatus(data);
        });

        socket.on(emitMap.GO_NEXT_STAGE, (data: GameStatus) => {
            this.gameStatusObserved.setGameStatus(data);
        });

        socket.on(emitMap.PLAY_PUBLIC_CARD, (data: EmitPlayPublicCardData) => {
            this.publicControlCardsManager!.add(data)
        });
    }

    update() {
    }
}

const config = {
    type: Phaser.AUTO,
    width: sizeConfig.background.width,
    height: sizeConfig.background.height,
    scene: [Gaming],
    scale: {
        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scalemanager/
        // Or set parent divId here
        // parent: divId,

        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,

        // Or put game size here
        // width: 1024,
        // height: 768,

        // Minimum size
        min: {
            width: 800,
            height: 600
        },
        max: {
            width: 1200,
            height: 675
        },
        zoom: 1,  // Size of game canvas = game size * zoom
    },
    autoRound: false,
    transparent: true
};
const game = new Phaser.Game(config);


