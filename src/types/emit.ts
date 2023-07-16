import {MultiTargetsAction, OneTargetAction} from "./gameStatus";
import {Card, CardAreaType, CardBoardActionType} from "./card";

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

// 游戏开始中
export type EmitActionData = OneTargetAction | MultiTargetsAction

export type EmitResponseData = {
    chooseToResponse: boolean,
    cards: Card[],
    actualCard: Card,
    originId: string,

    // 基本卡
    targetId?: string,

    // 为了校验无懈可击是否冲突
    wuxieTargetCardId?: string,

    // 响应技能选中的目标 流离
    skillTargetIds?: string[]
}

export type EmitThrowData = {
    cards: Card[]
}

export type EmitCardBoardData = {
    originId: string,
    targetId: string,
    card: Card,
    cardAreaType: CardAreaType,
    type: CardBoardActionType,
}

export type EmitWugufengdengBoardData = {
    card: Card,
    playerId: string,
}

export type EmitHeroSelectBoardData = {
    playerId: string,
    heroId: string,
}


// 后端=>前端
export type RoomStatus = "PLAYING" | "IDLE";
export type EmitRefreshRooms = {
    roomId: string | number,
    players: { playerId: string, playerName: string }[],
    status: RoomStatus,
}[]

export type EmitRefreshRoomPlayers = {
    playerId: string,
    playerName: string
}[];

export type EmitNotifyAddToPublicCardData = {
    fromId: string,
    originId: string,
    targetId?: string,
    cards: Card[],
    pandingPlayerId: string,
    pandingName: string,
    throwPlayerId: string,
    type: string,
    skillName?: string,
}

export type EmitNotifyAddToPlayerCardData = {
    fromId: string,
    toId: string,
    cards: Card[],
    message: never,

    cardAreaType: CardAreaType,
}

export type EmitNotifyAddLinesData = {
    fromId: string,
    toIds?: string[],
    cards: Card[],
    actualCard: Card,
}