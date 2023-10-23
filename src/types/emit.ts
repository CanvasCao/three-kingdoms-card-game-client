import {Action} from "./gameStatus";
import {Card, PlayerBoardAction} from "./card";
import {GAME_STATUS} from "../config/gameConfig";

// 前端=>后端
// 游戏开始前
export type EmitRejoinRoomData = {
    playerId: string,
    roomId: string,
}

export type EmitJoinRoomData = {
    playerId: string,
    playerName: string,
    roomId: string
}

export type EmitSwitchTeamMemberData = {
    playerId: string,
    roomId: string,
    teamMember: string,
}

// 游戏开始中
export type EmitActionData = Action

export type EmitResponseData = {
    chooseToResponse: boolean,
    cards: Card[],
    actualCard?: Card,
    originId: string,

    // 为了校验无懈可击是否冲突
    wuxieTargetCardId?: string,

    // 响应技能选中的目标 流离
    skillTargetIds?: string[],
    skillKey?: string
}

export type EmitThrowData = {
    cards: Card[],
    playerId: string,
}

export type EmitCardBoardData = {
    originId: string,
    targetId: string,
    card: Card,
    action: PlayerBoardAction,
}

export type EmitWugufengdengBoardData = {
    card: Card,
    playerId: string,
}

export type EmitHeroSelectBoardData = {
    playerId: string,
    heroId: string,
}

export type EmitFanJianBoardData = {
    huase: string,
}

// 后端=>前端
export type RoomStatus = keyof typeof GAME_STATUS;
export type RoomPlayer = { playerId: string, playerName: string, teamMember: string }
export type EmitRefreshRooms = {
    roomId: string | number,
    roomPlayers: RoomPlayer[],
    status: RoomStatus,
}[]

export type EmitRefreshRoomPlayers = {
    roomId: string | number,
    roomPlayers: RoomPlayer[],
    teamMembers: string[],
}

export type EmitNotifyAddToPublicCardData = {
    fromId: string,
    cards: Card[],

    originId?: string,
    targetIds?: string[],
    pandingPlayerId?: string,
    pandingNameKey?: string,
    type?: string,
    skillKey?: string,
}

export type EmitNotifyAddToPlayerCardData = {
    fromId: string,
    toId: string,
    cards: Card[],
    isPublic: boolean, // isPublic false的情况 有可能因为fromId/toId是自己而变成isPublic true
    message: never,
}

export type EmitNotifyAddLinesData = {
    fromId: string,
    toIds?: string[],
    actualCard: Card,
}