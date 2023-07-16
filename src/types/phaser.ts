import Phaser from "phaser";
import {Socket} from "../socket/socket.io.esm.min";
import {BoardPlayer} from "../class/Player/BoardPlayer";
import {GameStatusObserved} from "../class/Observed/GameStatusObserved";
import {GameFEStatusObserved} from "../class/Observed/GameFEStatusObserved";
import {ControlButtons} from "../class/Button/ControlButtons";
import {ControlCardsManager} from "../class/Manager/ControlCardsManager";
import {NofityAnimationManager} from "../class/Manager/NofityAnimationManager";
import {Card} from "./card";
import {PlayerCardsBoard } from "../class/Board/PlayerCardsBoard";
import { OperateHint } from "../class/OperateHint/OperateHint";
import { HeroSelectBoard } from "../class/Board/HeroSelectBoard";
import { WuGuFengDengBoard } from "../class/Board/WuGuFengDengBoard";

export type BtnGroup = {
    img?: Phaser.GameObjects.Image,
    text?: Phaser.GameObjects.Text,
}

export type GamingScene = Phaser.Scene &
    {
        socket: Socket;
        controlCards: Card[];
        boardPlayers: BoardPlayer[];
        gameStatusObserved: GameStatusObserved;
        gameFEStatusObserved: GameFEStatusObserved;
        playerCardsBoard: PlayerCardsBoard | undefined;
        wuGuFengDengBoard: WuGuFengDengBoard | undefined;
        heroSelectBoard: HeroSelectBoard | undefined;
        operateHint: OperateHint | undefined;
        controlButtons: ControlButtons | undefined;
        controlCardsManager: ControlCardsManager | undefined;
        notifyAnimationManager: NofityAnimationManager | undefined;
    }

