import {socket} from "./socket";
import {
    getMyPlayerId,
    getMyPlayerName,
    getRoomIdAndTimestamp,
    setMyPlayerIdAndName,
    setRoomIdAndTimestamp
} from "./utils/localstorage/localStorageUtils";
import emitMap from "./config/emitMap.json";
import {EmitJoinRoomData, EmitRefreshRoomPlayers, EmitRefreshRooms, EmitRejoinRoomData} from "./types/emit";
import {i18Config} from "./i18n/i18Config";
import {i18} from "./i18n/i18nUtils";
import {GAME_STATUS} from "./config/gameConfig";
import {isWithin30Minutes} from "./utils/time/timeUtils";

const bindLoginPageEvent = () => {
    $('#joinPage h2').text(i18(i18Config.TITLE))
    $('#joinPage input').attr("placeholder", i18(i18Config.NAME_PLACEHOLDER))
    $('#joinPage button').text(i18(i18Config.LOGIN))

    $('#loginButton').click(() => {
        const val = $("#nameInput").val()
        if (val) {
            setMyPlayerIdAndName(val.toString())
            $('.page').hide();
            $('#roomsPage').css('display', 'flex');
            socket.emit(emitMap.REFRESH_ROOMS);
        }
    })
}

const bindRoomsPageEvent = () => {
    socket.on(emitMap.REFRESH_ROOMS, (data: EmitRefreshRooms) => {
        if ($("#roomsPage").css('display') == 'none') {
            return
        }

        console.log("REFRESH_ROOMS", data)

        $("#roomsPage").html(
            `<div style="width: 40rem" class="flex w-full justify-center">
        <ul class="space-y-8 rounded-lg w-full text-gray-900">` +
            data.map(room => {
                const joinButton = `<button data-roomid=${room.roomId} class="justify-center rounded-md py-2 px-4 text-white bg-yellow-600 hover:bg-yellow-700">
                    ${i18(i18Config.JOIN)}
                    </button>`
                const playingTip = `<span class="justify-center rounded-md py-2 px-4 text-white bg-gray-600">
                    ${i18(i18Config.PLAYING)}
                    <span/>`
                const fullPlayersButton = `<span class="justify-center rounded-md py-2 px-4 text-white bg-gray-600">
                    ${i18(i18Config.JOIN)}
                    </span>`

                let display;
                if (room.players.length > 8) {
                    display = fullPlayersButton;
                } else if (room.status == GAME_STATUS.IDLE) {
                    display = joinButton;
                } else {
                    display = playingTip
                }

                return `<li class="rounded-md flex items-center justify-between bg-white px-6 py-6 border-b border-gray-200 w-full">
                        <span>${i18(i18Config.ROOM)} ${room.roomId} </span> 
                        <span>${room.players.length} ${i18(i18Config.PLAYERS)}</span>
                       ${display}
                    </li>`
            }).join('')
            + `</ul></div>`
        );

        $("#roomsPage button").click(function () {
            const roomId = $(this).attr('data-roomid');
            setRoomIdAndTimestamp(roomId!)
            socket.emit(emitMap.JOIN_ROOM, {
                playerId: getMyPlayerId(),
                playerName: getMyPlayerName(),
                roomId
            } as EmitJoinRoomData);
        })
    })
}

const bindRoomPlayersPageEvent = () => {
    socket.on(emitMap.REFRESH_ROOM_PLAYERS, (data: EmitRefreshRoomPlayers) => {
        console.log("REFRESH_ROOM_PLAYERS", data)
        $('.page').hide();
        $('#roomPlayersPage').css('display', 'flex');

        const isHost = data?.[0]?.playerId == getMyPlayerId()
        let btnString
        if (!isHost) {
            btnString = `<button class="w-full justify-center rounded-md py-2 px-4 text-white
                bg-gray-600">${i18(i18Config.WAIT_FOR_START)}</button>`
        } else if (data?.length > 1) {
            btnString = `<button id="startButton" class="w-full justify-center rounded-md py-2 px-4 text-white
                bg-yellow-600 hover:bg-yellow-700">${i18(i18Config.START)}</button>`
        } else {
            btnString = `<button class="w-full justify-center rounded-md py-2 px-4 text-white
                bg-gray-600">${i18(i18Config.START)}</button>`
        }

        $('#roomPlayersPage').html(
            `<div style="width: 40rem" class="space-y-8">` +
            data.map((player, index) => {
                return `<span class="rounded-md flex items-center justify-between bg-white px-6 py-6 border-b border-gray-200 w-full">
                    <span>${player.playerName}</span>
                    <span>${index == 0 ? i18(i18Config.HOST) : ""}</span>
                </span> `
            }).join('') +
            btnString +
            `</div>`
        )
        $("#startButton").click(() => {
            socket.emit(emitMap.INIT);
        })
    })
}

const tryRejoinRoom = () => {
    const {roomId, timestamp} = getRoomIdAndTimestamp();
    if (!roomId || !timestamp) {
        return
    }

    if (isWithin30Minutes(timestamp)) {
        socket.emit(emitMap.REJOIN_ROOM, {
            playerId: getMyPlayerId(),
            roomId
        } as EmitRejoinRoomData);
    }
}

const bindPageEvent = () => {
    bindLoginPageEvent();
    bindRoomsPageEvent();
    bindRoomPlayersPageEvent();
}

export {
    bindPageEvent,
    tryRejoinRoom
}