import Phaser from 'phaser';
import 'normalize.css'
import {HERO_INDEXES, HERO_URL_PREFIX, URL_CONFIG} from './config/urlConfig'
import {sizeConfig} from './config/sizeConfig'
import {socket} from "./socket";
import {ControlCardsManager} from "./class/Manager/ControlCardsManager";
import {EquipmentmentCardsManager} from "./class/Manager/EquipmentCardsManager";
import {ControlButtons} from "./class/Button/ControlButtons";
import {GameStatusObserved} from "./class/Observed/GameStatusObserved";
import {GameFEStatusObserved} from "./class/Observed/GameFEStatusObserved";
import {BoardPlayer} from "./class/Player/BoardPlayer";
import {EMIT_TYPE} from "./config/emitConfig";
import "./jsoneditor/jsoneditor.min.css";
import {NofityAnimationManager} from "./class/Manager/NofityAnimationManager";
import {Socket} from "./socket/socket.io.esm.min";
import {GameStatus} from './types/gameStatus';
import {PlayerCardsBoard} from './class/Board/PlayerCardsBoard';
import {getPlayersWithPosition} from './utils/position/playerPositionUtils';
import {
    EmitNotifyAddLinesData,
    EmitNotifyAddToPublicCardData,
    EmitNotifyAddToPlayerCardData
} from "./types/emit";
import {WuGuFengDengBoard} from './class/Board/WuGuFengDengBoard';
import {HeroSelectBoard} from './class/Board/HeroSelectBoard';
import {bindPageEvent, tryRejoinRoom} from './bindPageEvent';
import {setI18nLan} from './i18n/i18nUtils';
import {setPageByFeatureToggle} from "./utils/toggle/toggle";
import {OperateHint} from "./class/OperateHint/OperateHint";
import {Card} from "./types/card";
import {BoardPlayerThinkingHint} from './class/Player/BoardPlayerThinkingHint';

setI18nLan();
setPageByFeatureToggle();
bindPageEvent();

class Gaming extends Phaser.Scene {
    socket: Socket;
    init: boolean;
    controlCards: Card[];
    boardPlayers: BoardPlayer[];
    boardPlayerThinkHints: BoardPlayerThinkingHint[];
    gameStatusObserved: GameStatusObserved;
    gameFEStatusObserved: GameFEStatusObserved;
    playerCardsBoard: PlayerCardsBoard | undefined;
    wuGuFengDengBoard: WuGuFengDengBoard | undefined;
    heroSelectBoard: HeroSelectBoard | undefined;
    operateHint: OperateHint | undefined;
    controlButtons: ControlButtons | undefined;
    controlCardsManager: ControlCardsManager | undefined;
    equipmentmentCardsManager: EquipmentmentCardsManager | undefined;
    notifyAnimationManager: NofityAnimationManager | undefined;

    constructor() {
        // @ts-ignore
        super();

        this.socket = socket;
        this.init = false;

        this.controlCards = [];
        this.boardPlayers = [];
        this.boardPlayerThinkHints = [];

        this.gameStatusObserved = new GameStatusObserved(this);
        this.gameFEStatusObserved = new GameFEStatusObserved(this);
    }

    preload() {
        this.load.setBaseURL(URL_CONFIG.baseUrl);
        for (const key in URL_CONFIG.card) {
            this.load.image(key, (URL_CONFIG.card as any)[key]);
        }

        for (const key in URL_CONFIG.other) {
            this.load.image(key, (URL_CONFIG.other as any)[key]);
        }

        HERO_INDEXES.forEach((i) => {
            this.load.image(i, HERO_URL_PREFIX + i + ".png");
        })
    }

    create() {
        const bg = this.add.image(0, 0, 'bg');
        bg.setOrigin(0, 0)
        bg.displayWidth = sizeConfig.background.width;
        bg.displayHeight = sizeConfig.background.height;

        // 监听只可能有一次
        socket.on(EMIT_TYPE.INIT, (data: GameStatus) => {
            if (this.init) {
                return
            }
            this.init = true;

            $(".page").hide();
            $("#canvas").css('display', 'flex');

            this.playerCardsBoard = new PlayerCardsBoard(this);
            this.wuGuFengDengBoard = new WuGuFengDengBoard(this);
            this.heroSelectBoard = new HeroSelectBoard(this);

            this.operateHint = new OperateHint(this);
            this.controlButtons = new ControlButtons(this);
            this.controlCardsManager = new ControlCardsManager(this);
            this.equipmentmentCardsManager = new EquipmentmentCardsManager(this);
            this.notifyAnimationManager = new NofityAnimationManager(this);

            const players = getPlayersWithPosition(data.players);
            this.boardPlayerThinkHints = players.map((player) => new BoardPlayerThinkingHint(this, player));
            this.boardPlayers = players.map((player) => new BoardPlayer(this, player));

            this.gameStatusObserved.setGameStatus(data);
        });

        socket.on(EMIT_TYPE.REFRESH_STATUS, (data: GameStatus) => {
            this.gameStatusObserved.setGameStatus(data);
        });

        socket.on(EMIT_TYPE.GO_NEXT_STAGE, (data: GameStatus) => {
            this.gameStatusObserved.setGameStatus(data);
        });

        // Notify FE
        socket.on(EMIT_TYPE.NOTIFY_ADD_TO_PUBLIC_CARD, (data: EmitNotifyAddToPublicCardData) => {
            this.notifyAnimationManager!.addToPublicCard(data)
        });

        socket.on(EMIT_TYPE.NOTIFY_ADD_TO_PLAYER_CARD, (data: EmitNotifyAddToPlayerCardData) => {
            this.notifyAnimationManager!.addToPlayerCard(data)
        });

        socket.on(EMIT_TYPE.NOTIFY_ADD_LINES, (data: EmitNotifyAddLinesData) => {
            this.notifyAnimationManager!.addLines(data)
        });

        tryRejoinRoom();
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
            // width: 2048,
            // height: 1152
            width: 1366,
            height: 768
        },
        zoom: 1,  // Size of game canvas = game size * zoom
    },
    autoRound: false,
    transparent: true
};
const game = new Phaser.Game(config);


