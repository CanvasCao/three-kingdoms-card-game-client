import {socket} from "./socket";
import {getMyPlayerId} from "./utils/gameStatusUtils";
import emitMap from "./config/emitMap.json";
import JSONEditor from "./jsoneditor/jsoneditor.min.js";
import {getFeatureToggle} from "./toggle/toggle";
import {GameStatus} from "./types/gameStatus";

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
    $('#joinButton').click(() => {
        const val = $("#nameInput").val()
        if (val) {
            socket.emit(emitMap.REFRESH_ROOM_PLAYERS, {playerId: getMyPlayerId(), playerName: val});
            $('#joinPage').css('display', 'none');
            $('#roomPlayersPage').css('display', 'flex');
        }
    })

    socket.on(emitMap.REFRESH_ROOM_PLAYERS, (data: any) => {
        $("#roomPlayers").html(data.map((e: any) => `<div>${e.playerName}</div>`))
        if (data[0]?.playerId == getMyPlayerId()) {
            $("#startButton").show();
        }
    })

    $("#startButton").click(() => {
        socket.emit(emitMap.INIT);
    })

    socket.on(emitMap.INIT, (data: GameStatus) => {
        if (data.players[getMyPlayerId()]) {
            $("#roomPlayersPage").hide();
            $("#canvas").css('display', 'flex');
        }
    })
}


export {bindPageEvent}