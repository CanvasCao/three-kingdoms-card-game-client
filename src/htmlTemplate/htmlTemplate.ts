import {i18Config} from "../i18n/i18Config"
import {i18} from "../i18n/i18nUtils"
import {RoomPlayer} from "../types/emit"
import {minidenticon} from "minidenticons";
import {URL_CONFIG} from "../config/urlConfig";

const joinRoomButtonTemplate = (roomId: number | string) => {
    return `<button data-roomid=${roomId} class="justify-center rounded-md py-2 px-4 text-white bg-yellow-600 hover:bg-yellow-700">
            ${i18(i18Config.JOIN)}
            </button>`
}

const playingTipTemplate = () => {
    return `<span class="justify-center rounded-md py-2 px-4 text-white bg-gray-600">
                    ${i18(i18Config.PLAYING)}
                    <span/>`
}

const fullPLayersTipTemplate = () => {
    return `<span class="justify-center rounded-md py-2 px-4 text-white bg-gray-600">
                    ${i18(i18Config.JOIN)}
                    </span>`
}

const startGameButtonTemplate = () => {
    return `<button id="startButton" class="absolute h-32 w-32 rounded-full right-[-160px] bottom-[-80px] text-white bg-yellow-600 hover:bg-yellow-700">${i18(i18Config.START)}</button>`
}

const startGameButtonDisableTemplate = () => {
    return `<button class="absolute h-32 w-32 rounded-full right-[-160px] bottom-[-80px] text-white bg-gray-600">${i18(i18Config.START)}</button>`
}

const roomMemberContainerTemplate = (player: RoomPlayer | undefined, showHost: boolean, teamMember: string) => {
    const style = player ? "background: white;" : "box-shadow:0px 0px 10px rgba(0, 0, 0, 0.5) inset, 0px 0px 10px rgba(255, 255, 255,0.5) inset; background: #f0e0c22b;cursor: pointer;"
    const content = player ? `${minidenticon(player.playerName)} <div>${player.playerName}</div>` : `<div class="text-gray-100">${i18(i18Config.EMPTY)}</div>`
    const hostTag = showHost ? hostTagTemplate() : '';
    const teamTag = teamTagTemplate(teamMember.split("-")[0]);
    return `<div style="height: 12rem; ${style}" 
                 data-teammember=${teamMember}
                 class="${player ? '' : 'emptySlot'} relative flex flex-col rounded-md justify-center items-center px-6 py-6 border-b border-gray-200 w-full">` +
        content + hostTag + teamTag +
        `</div> `
}

const hostTagTemplate = () => {
    return `<div class="absolute bottom-[10px] right-[10px] text-green-500 transform rotate-[-19deg] font-bold border-4 border-green-500 p-0.5">${i18(i18Config.HOST)}</div>`
}

const teamTagTemplate = (teamNumber: string) => {
    // @ts-ignore
    const src = URL_CONFIG.baseUrl + '/' + URL_CONFIG.other[teamNumber];
    return `<img style="width: 3rem;" class="absolute top-[-20px] right-[-20px]" src="${src}"/>`
}

export {
    // rooms
    joinRoomButtonTemplate,
    playingTipTemplate,
    fullPLayersTipTemplate,

    // room
    roomMemberContainerTemplate,
    hostTagTemplate,

    startGameButtonTemplate,
    startGameButtonDisableTemplate,
}