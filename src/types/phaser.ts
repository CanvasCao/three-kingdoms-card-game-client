import Phaser from "phaser";
import {Socket} from "../socket/socket.io.esm.min";
import {Card} from "./gameStatus";

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
        controlPlayer: any;
        players: any;
        gameStatusObserved: any;
        gameFEStatusObserved: any;
        controlButtons: any;
        controlCardsManager: any;
        publicCardsManager: any;
    }