import {socket} from "./socket";
import {
    getMyPlayerId,
    getMyPlayerName,
    getRoomIdAndTimestamp,
    setMyPlayerIdAndName,
    setRoomIdAndTimestamp
} from "./utils/localstorage/localStorageUtils";
import {EMIT_TYPE} from "./config/emitConfig";
import {
    EmitJoinRoomData,
    EmitRefreshRoomPlayers,
    EmitRefreshRooms,
    EmitRejoinRoomData,
    EmitSwitchTeamMemberData
} from "./types/emit";
import {i18Config} from "./i18n/i18Config";
import {i18} from "./i18n/i18nUtils";
import {GAME_STATUS} from "./config/gameConfig";
import {isWithinMinutes} from "./utils/time/timeUtils";
import {
    fullPLayersTipTemplate,
    joinRoomButtonTemplate,
    playingTipTemplate,
    roomMemberContainerTemplate,
    startGameButtonDisableTemplate,
    startGameButtonTemplate
} from "./htmlTemplate/htmlTemplate";

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
            socket.emit(EMIT_TYPE.REFRESH_ROOMS);
        }
    })
}

const bindRoomsPageEvent = () => {
    socket.on(EMIT_TYPE.REFRESH_ROOMS, (data: EmitRefreshRooms) => {
        if ($("#roomsPage").css('display') == 'none') {
            return
        }

        console.log("REFRESH_ROOMS", data)

        $("#roomsPage").html(
            `<div style="width: 40rem" class="flex w-full justify-center">
        <ul class="space-y-8 rounded-lg w-full text-gray-900">` +
            data.map(room => {
                let roomAction;
                if (room.roomPlayers.length >= 8) {
                    roomAction = fullPLayersTipTemplate()
                } else if (room.status == GAME_STATUS.IDLE) {
                    roomAction = joinRoomButtonTemplate(room.roomId)
                } else {
                    roomAction = playingTipTemplate()
                }

                return `<li class="rounded-md flex items-center justify-between bg-white px-6 py-6 border-b border-gray-200 w-full">
                        <span>${i18(i18Config.ROOM)} ${room.roomId} </span> 
                        <span>${room.roomPlayers.length} ${i18(i18Config.PLAYERS)}</span>
                       ${roomAction}
                    </li>`
            }).join('')
            + `</ul></div>`
        );

        $("#roomsPage button").click(function () {
            const roomId = $(this).attr('data-roomid');
            setRoomIdAndTimestamp(roomId!)
            socket.emit(EMIT_TYPE.JOIN_ROOM, {
                playerId: getMyPlayerId(),
                playerName: getMyPlayerName(),
                roomId
            } as EmitJoinRoomData);
        })
    })
}

const bindRoomPlayersPageEvent = () => {
    socket.on(EMIT_TYPE.REFRESH_ROOM_PLAYERS, (data: EmitRefreshRoomPlayers) => {
        console.log("REFRESH_ROOM_PLAYERS", data)
        $('.page').hide();
        $('#roomPlayersPage').css('display', 'flex');

        const roomPlayers = data.roomPlayers || [];
        const teamMembers = data.teamMembers || [];
        const hostPlayerId = roomPlayers[0]?.playerId
        const isHost = roomPlayers[0]?.playerId == getMyPlayerId()
        let startButton = ''
        if (isHost) {
            startButton = (roomPlayers?.length > 1) ? startGameButtonTemplate() : startGameButtonDisableTemplate()
        }

        $('#roomPlayersPage').html(
            `<div style="width: 40rem;" class="grid grid-cols-4 gap-8 relative">` +
            teamMembers.map((teamMember) => {
                const player = roomPlayers.find(player => player.teamMember == teamMember)
                const showHost = player?.playerId == hostPlayerId;
                return roomMemberContainerTemplate(player, showHost, teamMember);
            }).join('') +
            startButton +
            `</div>`
        )
        $("#startButton").click(() => {
            socket.emit(EMIT_TYPE.INIT);
        })
        $(".emptySlot").click(function () {
            const teamMember = $(this).attr('data-teammember');
            socket.emit(EMIT_TYPE.SWITCH_TEAM_MEMBER, {
                playerId: getMyPlayerId(),
                roomId: data.roomId,
                teamMember,
            } as EmitSwitchTeamMemberData);
        })
    })
}

const tryRejoinRoom = () => {
    const {roomId, timestamp} = getRoomIdAndTimestamp();
    if (!roomId || !timestamp) {
        return
    }

    if (isWithinMinutes(timestamp)) {
        socket.emit(EMIT_TYPE.REJOIN_ROOM, {
            playerId: getMyPlayerId(),
            roomId
        } as EmitRejoinRoomData);
    }
}


export {
    bindLoginPageEvent,
    bindRoomsPageEvent,
    bindRoomPlayersPageEvent,
    tryRejoinRoom
}