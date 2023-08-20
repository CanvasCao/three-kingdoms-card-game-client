import {sizeConfig} from "../../config/sizeConfig";
import {getMyPlayerId} from "../localstorage/localStorageUtils";
import {GameStatusPlayers, Player} from "../../types/player";

const playersAreaW = sizeConfig.playersArea.width;
const playersAreaH = sizeConfig.playersArea.height;
const topMargin = sizeConfig.player.height / 2 + 10
const leftMargin = sizeConfig.player.width / 2 + 3
const rightMargin = sizeConfig.player.width / 2
const topLeft = {
    x: playersAreaW * 0.3,
    y: topMargin
}
const topMiddle = {
    x: playersAreaW * 0.5,
    y: topMargin
}
const topRight = {
    x: playersAreaW * 0.7,
    y: topMargin
}

const leftTop = {
    x: leftMargin,
    y: playersAreaH * 0.3
}
const leftMiddle = {
    x: leftMargin,
    y: playersAreaH * 0.5
}
const leftBottom = {
    x: leftMargin,
    y: playersAreaH * 0.7
}

const rightTop = {
    x: playersAreaW - rightMargin,
    y: playersAreaH * 0.3
}
const rightMiddle = {
    x: playersAreaW - rightMargin,
    y: playersAreaH * 0.5
}
const rightBottom = {
    x: playersAreaW - rightMargin,
    y: playersAreaH * 0.7
}

const getPositions = (number: number) => {
    let positions;
    switch (number) {
        case 1:
            positions = [topMiddle]
            break;
        case 2:
            positions = [topRight, topLeft]
            break;
        case 3:
            positions = [rightMiddle, topMiddle, leftMiddle]
            break;
        case 4:
            positions = [rightMiddle, topRight, topLeft, leftMiddle]
            break;
        case 5:
            positions = [rightMiddle, topRight, topMiddle, topLeft, leftMiddle]
            break;
        case 6:
            positions = [rightBottom, rightTop, topRight, topLeft, leftTop, leftBottom,]
            break;
        case 7:
        default:
            positions = [rightBottom, rightTop, topRight, topMiddle, topLeft, leftTop, leftBottom,]
            break;
    }
    return positions
}

export const getPlayersWithPosition = (gameStatusPlayers: GameStatusPlayers): Player[] => {
    const myPlayer = gameStatusPlayers[getMyPlayerId()]

    const playersNumber = Object.keys(gameStatusPlayers).length
    const otherPlayersNumber = playersNumber - 1
    const otherPositions = getPositions(otherPlayersNumber);
    const firstLocation = myPlayer.location;

    const playersWithPosition: Player[] = []
    for (let i = 0; i < otherPlayersNumber; i++) {
        const otherModLocation = (firstLocation + 1 + i) % playersNumber;
        const player = Object.values(gameStatusPlayers).find((u) => u.location == otherModLocation)!;
        player.linePosition = otherPositions[i];
        player.playerPosition = otherPositions[i];
        playersWithPosition.push(player)
    }

    myPlayer.linePosition = {
        x: sizeConfig.background.width / 2,
        y: playersAreaH
    }
    myPlayer.playerPosition = {
        x: (sizeConfig.background.width - sizeConfig.player.width / 2) - 2,
        y: (sizeConfig.background.height - sizeConfig.player.height / 2) - 2
    }

    playersWithPosition.push(myPlayer)
    return playersWithPosition;
}
