import {GameStatusUsers, User} from "../types/gameStatus"
import sizeConfig from "../config/sizeConfig.json";
import {getMyUserId} from "./gameStatusUtils";

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
    const myUser = gameStatusUsers[getMyUserId()]

    const usersNumber = Object.keys(gameStatusUsers).length
    const otherUsersNumber = usersNumber - 1
    const otherPositions = getPotisions(otherUsersNumber);
    const firstLocation = myUser.location;

    const usersWithPosition: User[] = []
    for (let i = 0; i < otherUsersNumber; i++) {
        const otherModLocation = (firstLocation + 1 + i) % usersNumber;
        const user = Object.values(gameStatusUsers).find((u) => u.location == otherModLocation)!;
        user.position = otherPositions[i];
        usersWithPosition.push(user)
    }

    myUser.position = {x: playersAreaW / 2, y: playersAreaH}
    usersWithPosition.push(myUser)
    return usersWithPosition
}
