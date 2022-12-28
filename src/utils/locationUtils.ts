import {GameStatusUsers, User} from "../types/gameStatus"
import sizeConfig from "../config/sizeConfig.json";
import {getMyUserId} from "./gameStatusUtils";

const playerAreaW = sizeConfig.background.width * 0.8;
const playerAreaH = sizeConfig.background.height - sizeConfig.controlPlayer.height;
const topMargin = sizeConfig.player.height / 2 + 10
const leftMargin = sizeConfig.player.width / 2 + 3
const rightMargin = sizeConfig.player.width / 2
const topLeft = {
    x: playerAreaW * 0.3,
    y: topMargin
}
const topMiddle = {
    x: playerAreaW * 0.5,
    y: topMargin
}
const topRight = {
    x: playerAreaW * 0.7,
    y: topMargin
}

const leftTop = {
    x: leftMargin,
    y: playerAreaH * 0.3
}
const leftMiddle = {
    x: leftMargin,
    y: playerAreaH * 0.5
}
const leftBottom = {
    x: leftMargin,
    y: playerAreaH * 0.7
}

const rightTop = {
    x: playerAreaW - rightMargin,
    y: playerAreaH * 0.3
}
const rightMiddle = {
    x: playerAreaW - rightMargin,
    y: playerAreaH * 0.5
}
const rightBottom = {
    x: playerAreaW - rightMargin,
    y: playerAreaH * 0.7
}

const getPotisions = (number: number) => {
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

export const getPlayersWithPosition = (gameStatusUsers: GameStatusUsers): User[] => {
    const usersNumber = Object.keys(gameStatusUsers).length
    const positions = getPotisions(usersNumber - 1);
    const myUser = gameStatusUsers[getMyUserId()]
    const firstLocation = myUser.location;

    const users: User[] = []
    for (let i = firstLocation; i < firstLocation + usersNumber; i++) {
        const modLocation = i % usersNumber;
        const user = Object.values(gameStatusUsers).find((u) => u.location == modLocation)!;
        if (myUser.userId !== user!.userId) {
            user.position = positions[i - 1];// 第一个人是自己 所以不push
        } else {
            user.position = {x: playerAreaW / 2, y: playerAreaH}
        }
        users.push(user)
    }

    return users

}
