import Phaser from "phaser";
import {Socket} from "../socket/socket.io.esm.min";
import {Card} from "./gameStatus";
import {ControlPlayer} from "../class/ControlPlayer";
import {BoardPlayer} from "../class/BoardPlayer";
import {GameStatusObserved} from "../class/GameStatusObserved";
import {GameFEStatusObserved} from "../class/GameFEStatusObserved";
import {ControlButtons} from "../class/ControlButtons";
import {ControlCardsManager} from "../class/ControlCardsManager";
import {PublicControlCardsManager} from "../class/PublicCardsManager";

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
        controlPlayer: ControlPlayer | undefined;
        players: BoardPlayer[];
        gameStatusObserved: GameStatusObserved;
        gameFEStatusObserved: GameFEStatusObserved;
        controlButtons: ControlButtons | undefined;
        controlCardsManager: ControlCardsManager | undefined;
        publicControlCardsManager: PublicControlCardsManager | undefined;
    }