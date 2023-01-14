import Phaser from "phaser";
import {Socket} from "../socket/socket.io.esm.min";
import {Card} from "./gameStatus";
import {BoardPlayer} from "../class/Player/BoardPlayer";
import {GameStatusObserved} from "../class/Observed/GameStatusObserved";
import {GameFEStatusObserved} from "../class/Observed/GameFEStatusObserved";
import {ControlButtons} from "../class/Button/ControlButtons";
import {ControlCardsManager} from "../class/Manager/ControlCardsManager";
import {NofityAnimationManager} from "../class/Manager/NofityAnimationManager";

export type BtnGroup = {
    img?: Phaser.GameObjects.Image,
    text?: Phaser.GameObjects.Text,
}

export type PlayerEquipmentGroup = {
    distanceText?: Phaser.GameObjects.Text,
    nameText?: Phaser.GameObjects.Text,
    huaseNumText?: Phaser.GameObjects.Text,
}

export type GamingScene = Phaser.Scene &
    {
        socket: Socket;
        inited: boolean;
        controlCards: Card[];
        boardPlayers: BoardPlayer[];
        gameStatusObserved: GameStatusObserved;
        gameFEStatusObserved: GameFEStatusObserved;
        controlButtons: ControlButtons | undefined;
        controlCardsManager: ControlCardsManager | undefined;
        notifyAnimationManager: NofityAnimationManager | undefined;
    }