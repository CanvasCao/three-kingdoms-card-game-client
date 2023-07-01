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

    selectedIndexes: (number|string)[],

    // 基本卡
    targetId?: string,

    // 为了校验无懈可击是否冲突
    wuxieTargetCardId?: string,

    // 响应技能选中的目标 流离
    skillTargetIds?: string[]
}

export type EmitCardBoardData = {
    originId: string,
    targetId: string,
    card: Card,
    cardAreaType: CardAreaType,
    type: CardBoardActionType,

    selectedIndexes: (number|string)[],
}


export type EmitThrowData = {
    cards: Card[]
    selectedIndexes: (number|string)[],
}

export type EmitWugufengdengData = {
    card: Card,
    playerId: string,
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
    originIndexes: (number|string)[],
    type: string,
}

export type EmitNotifyAddToPlayerCardData = {
    fromId: string,
    toId: string,
    cards: Card[],
    originIndexes: number[],
    message: never,

    cardAreaType: CardAreaType,
}

export type EmitNotifyAddLinesData = {
    fromId: string,
    toIds?: string[],
    cards: Card[],
    actualCard: Card,
}