import {uuidv4} from "../uuid";

const playerIdKey = 'three-kingdom-player-id'
const playerNameKey = 'three-kingdom-player-name'
const joinRoomKey = 'three-kingdom-join-room'

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

const getMyPlayerId = (): string => {
    const playerid = localStorage.getItem(playerIdKey);
    if (playerid) {
        return playerid
    } else {
        const newUUID = uuidv4()
        localStorage.setItem(playerIdKey, newUUID);
        return newUUID;
    }
}

const setRoomIdAndTimestamp = (roomId: string) => {
    if (roomId) {
        const timestamp = new Date().getTime()
        localStorage.setItem(joinRoomKey, JSON.stringify({roomId, timestamp}));
    }
}

const getRoomIdAndTimestamp = () => {
    const joinRoomObj = localStorage.getItem(joinRoomKey);
    if (joinRoomObj) {
        try {
            const roomIdAndTimestamp = JSON.parse(joinRoomObj)
            return roomIdAndTimestamp;
        } catch (e) {
            console.log("parse toggles error")
            return {}
        }
    } else {
        return {};
    }
}

export {
    setMyPlayerIdAndName,
    getMyPlayerId,
    getMyPlayerName,
    setRoomIdAndTimestamp,
    getRoomIdAndTimestamp
}