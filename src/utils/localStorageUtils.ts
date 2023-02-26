import {uuidv4} from "./uuid";

const playerIdKey = 'three-kingdom-player-id'
const playerNameKey = 'three-kingdom-player-name'
const setMyPlayerIdAndName = (name: string) => {
    const newUUID = uuidv4()
    localStorage.setItem(playerIdKey, newUUID);
    localStorage.setItem(playerNameKey, name);
}

const getMyPlayerName = () => {
    const name = localStorage.getItem(playerNameKey);
    if (name) {
        return name
    } else {
        const name = uuidv4()
        localStorage.setItem(playerNameKey, name);
        return name;
    }
}

const getMyPlayerId = () => {
    const playerid = localStorage.getItem(playerIdKey);
    if (playerid) {
        return playerid
    } else {
        const newUUID = uuidv4()
        localStorage.setItem(playerIdKey, newUUID);
        return newUUID;
    }
}

export {
    setMyPlayerIdAndName,
    getMyPlayerId,
    getMyPlayerName,
}