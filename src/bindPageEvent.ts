import {socket} from "./socket";
import {getMyPlayerId, getMyPlayerName, setMyPlayerIdAndName} from "./utils/gameStatusUtils";
import emitMap from "./config/emitMap.json";
import JSONEditor from "./jsoneditor/jsoneditor.min.js";
import {getFeatureToggle} from "./toggle/toggle";
import {GameStatus} from "./types/gameStatus";
import {EmitJoinRoomData, EmitRefreshRoomPlayers, EmitRefreshRooms} from "./types/emit";

const bindPageEvent = () => {
    // create the editor
    const SHOW_JSON_EDITOR = getFeatureToggle().SHOW_JSON_EDITOR;
    if (SHOW_JSON_EDITOR) {
        const container = document.getElementById('jsoneditor')
        // @ts-ignore
        window.editor = new JSONEditor(container, {})
        // @ts-ignore
        window.editor2 = new JSONEditor(container, {})
    }

    const SHOW_GO_TO_NEXT_STAGE = getFeatureToggle().SHOW_GO_TO_NEXT_STAGE;
    if (SHOW_GO_TO_NEXT_STAGE) {
        $("#GoNextStage").click(() => {
            socket.emit(emitMap.GO_NEXT_STAGE);
        })
    } else {
        $("#GoNextStage").hide()
    }


    // bind page event
    // loginPage
    $('#loginButton').click(() => {
        const val = $("#nameInput").val()
        if (val) {
            setMyPlayerIdAndName(val.toString())
            $('#joinPage').css('display', 'none');
            $('#roomsPage').css('display', 'flex');
            socket.emit(emitMap.REFRESH_ROOMS);
        }
    })

    // roomsPage
    socket.on(emitMap.REFRESH_ROOMS, (data: EmitRefreshRooms) => {
        if ($("#roomsPage").css('display') == 'none') {
            return
        }

        console.log("REFRESH_ROOMS", data)

        $("#roomsPage").html(
            `<div style="width: 40rem" class="flex w-full justify-center">
        <ul class="space-y-8 rounded-lg w-full text-gray-900">` +
            data.map(room => {
                return `<li class="rounded-md flex items-center justify-between bg-white px-6 py-6 border-b border-gray-200 w-full">
                        <span>room ${room.roomId} </span> 
                        <span>${room.players.length} player(s)</span>
                      <button data-roomid=${room.roomId} class="justify-center rounded-md py-2 px-4 text-white bg-yellow-600 hover:bg-yellow-700">Join</button>
                    </li>`
            }).join('')
            + `</ul></div>`
        );

        $("#roomsPage button").click(function () {
            const roomId = $(this).attr('data-roomid');
            socket.emit(emitMap.JOIN_ROOM, {
                playerId: getMyPlayerId(),
                playerName: getMyPlayerName(),
                roomId
            } as EmitJoinRoomData);
        })
    })

    // roomPlayersPage
    socket.on(emitMap.REFRESH_ROOM_PLAYERS, (data: EmitRefreshRoomPlayers) => {
        console.log("REFRESH_ROOM_PLAYERS", data)
        $('#roomsPage').css('display', 'none');
        $('#roomPlayersPage').css('display', 'flex');
        $('#roomPlayersPage').html(
            `<div style="width: 40rem" class="space-y-8">` +
            data.map(player => {
                return `<span class="rounded-md flex items-center justify-between bg-white px-6 py-6 border-b border-gray-200 w-full">
                    ${player.playerName}
                </span> `
            }).join('') +
            `<button id="startButton" class="w-full justify-center rounded-md py-2 px-4 text-white
                bg-yellow-600 hover:bg-yellow-700">START</button></div>`
        )
        $("#startButton").click(() => {
            socket.emit(emitMap.INIT);
        })
    })

    // gamePage
    socket.on(emitMap.INIT, (data: GameStatus) => {
        console.log("INIT", data)
        $("#roomPlayersPage").hide();
        $("#canvas").css('display', 'flex');
    })
}


export {bindPageEvent}