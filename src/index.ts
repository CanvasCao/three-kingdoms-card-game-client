import Phaser from 'phaser';
import 'normalize.css'
import elementsUrl from './config/elementsUrl.json'
import {sizeConfig} from './config/sizeConfig'
import {socket} from "./socket";
import {ControlCardsManager} from "./class/Manager/ControlCardsManager";
import {ControlButtons} from "./class/Button/ControlButtons";
import {GameStatusObserved} from "./class/Observed/GameStatusObserved";
import {GameFEStatusObserved} from "./class/Observed/GameFEStatusObserved";
import {BoardPlayer} from "./class/Player/BoardPlayer";
import emitMap from "./config/emitMap.json";
import "./jsoneditor/jsoneditor.min.css";
import {NofityAnimationManager} from "./class/Manager/NofityAnimationManager";
import {Socket} from "./socket/socket.io.esm.min";
import {Card, GameStatus} from './types/gameStatus';
import {ElementsUrlJson} from './types/config';
import {PlayerCardsBoard} from './class/Board/PlayerCardsBoard';
import {getPlayersWithPosition} from './utils/playerPositionUtils';
import {
    EmitNotifyAddLinesData,
    EmitNotifyAddToPublicCardData,
    EmitNotifyAddToPlayerCardData
} from "./types/emit";
import {WuGuFengDengBoard} from './class/Board/WuGuFengDengBoard';
import {bindPageEvent} from './bindPageEvent';
import {i18nUtils} from './i18n/i18nUtils';
import {setPageByFeatureToggle} from "./toggle/toggle";
import {OperateHint} from "./class/OperateHint/OperateHint";

i18nUtils();
setPageByFeatureToggle();
bindPageEvent();

class Gaming extends Phaser.Scene {
    socket: Socket;
    controlCards: Card[];
    boardPlayers: BoardPlayer[];
    gameStatusObserved: GameStatusObserved;
    gameFEStatusObserved: GameFEStatusObserved;
    playerCardsBoard: PlayerCardsBoard | undefined;
    wuGuFengDengBoard: WuGuFengDengBoard | undefined;
    operateHint: OperateHint | undefined;
    controlButtons: ControlButtons | undefined;
    controlCardsManager: ControlCardsManager | undefined;
    notifyAnimationManager: NofityAnimationManager | undefined;

    constructor() {
        // @ts-ignore
        super();

        this.socket = socket;

        this.controlCards = [];
        this.boardPlayers = [];

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

        // 监听只可能有一次
        socket.on(emitMap.INIT, (data: GameStatus) => {
            this.playerCardsBoard = new PlayerCardsBoard(this);
            this.wuGuFengDengBoard = new WuGuFengDengBoard(this);
            this.operateHint = new OperateHint(this);
            this.controlButtons = new ControlButtons(this);
            this.controlCardsManager = new ControlCardsManager(this);
            this.notifyAnimationManager = new NofityAnimationManager(this);

            const players = getPlayersWithPosition(data.players);
            this.boardPlayers = players.map((player) => new BoardPlayer(this, player));

            this.gameStatusObserved.setGameStatus(data);
        });

        socket.on(emitMap.REFRESH_STATUS, (data: GameStatus) => {
            this.gameStatusObserved.setGameStatus(data);
        });

        socket.on(emitMap.GO_NEXT_STAGE, (data: GameStatus) => {
            this.gameStatusObserved.setGameStatus(data);
        });

        // Notify FE
        socket.on(emitMap.NOTIFY_ADD_TO_PUBLIC_CARD, (data: EmitNotifyAddToPublicCardData) => {
            this.notifyAnimationManager!.addToPublicCard(data)
        });

        socket.on(emitMap.NOTIFY_ADD_TO_PLAYER_CARD, (data: EmitNotifyAddToPlayerCardData) => {
            this.notifyAnimationManager!.addToPlayerCard(data)
        });

        socket.on(emitMap.NOTIFY_ADD_LINES, (data: EmitNotifyAddLinesData) => {
            this.notifyAnimationManager!.addLines(data)
        });
    }

    update() {
    }
}

const config = {
    type: Phaser.AUTO,
    width: sizeConfig.background.width,
    height: sizeConfig.background.height,
    parent: 'canvas',
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
            width: 1366,
            height: 768
        },
        zoom: 1,  // Size of game canvas = game size * zoom
    },
    autoRound: false,
    transparent: true
};
const game = new Phaser.Game(config);


