import Phaser from "phaser";
import {Socket} from "../socket/socket.io.esm.min";
import {BoardPlayer} from "../class/Player/BoardPlayer";
import {GameStatusObserved} from "../class/Observed/GameStatusObserved";
import {GameFEStatusObserved} from "../class/Observed/GameFEStatusObserved";
import {ControlButtons} from "../class/Button/ControlButtons";
import {ControlCardsManager} from "../class/Manager/ControlCardsManager";
import {NofityAnimationManager} from "../class/Manager/NofityAnimationManager";
import {Card} from "./card";
import {PlayerCardsBoard} from "../class/Board/PlayerCardsBoard";
import {OperateHint} from "../class/OperateHint/OperateHint";
import {HeroSelectBoard} from "../class/Board/HeroSelectBoard";
import {WuGuFengDengBoard} from "../class/Board/WuGuFengDengBoard";
import {ToolTip} from "../class/ToolTip/ToolTip";
import {PandingBoard} from "../class/Board/PandingBoard";

export type BtnGroup = {
    img?: Phaser.GameObjects.Image,
    text?: Phaser.GameObjects.Text,
}

export type GamingScene = Phaser.Scene & {
    socket: Socket;
    initialized: boolean;
    controlCards: Card[];
    boardPlayers: BoardPlayer[];
    gameStatusObserved: GameStatusObserved;
    gameFEStatusObserved: GameFEStatusObserved;
    playerCardsBoard: PlayerCardsBoard | undefined;
    wuGuFengDengBoard: WuGuFengDengBoard | undefined;
    heroSelectBoard: HeroSelectBoard | undefined;
    pandingBoard: PandingBoard | undefined;
    toolTip: ToolTip | undefined;
    operateHint: OperateHint | undefined;
    controlButtons: ControlButtons | undefined;
    controlCardsManager: ControlCardsManager | undefined;
    notifyAnimationManager: NofityAnimationManager | undefined;
}

export type PhaserGameObject = (Phaser.GameObjects.Text | Phaser.GameObjects.Rectangle | Phaser.GameObjects.Graphics | Phaser.GameObjects.Image)

