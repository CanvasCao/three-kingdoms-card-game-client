import {i18Lans, i18WindowKey} from "./initi18n";


export const i18Config = {
    // LOGIN page
    TITLE: {KEY: "TITLE", EN: "Legends of the Three Kingdoms", CN: "三国杀"},
    NAME_PLACEHOLDER: {KEY: "NAME_PLACEHOLDER", EN: "Your name", CN: "你的名字"},
    LOGIN: {KEY: "LOGIN", EN: "Login", CN: "登陆"},

    // ROOMS page
    ROOM: {KEY: "ROOM", EN: "Room", CN: "房间"},
    PLAYERS: {KEY: "PLAYERS", EN: "Player(s)", CN: "人"},
    JOIN: {KEY: "JOIN", EN: "Join", CN: "加入"},

    // roomPlayersPage
    START: {KEY: "START", EN: "START", CN: "开始游戏"},
    WAIT_FOR_START: {KEY: "WAIT_FOR_START", EN: "Please wait for host to start the game", CN: "请等待房主开始游戏"},
    HOST: {KEY: "HOST", EN: "Host", CN: "房主"},

}

export const i18 = (obj) => {
    const lan = window[i18WindowKey] || i18Lans.EN;
    const key = obj.KEY
    return i18Config[key][lan]
}