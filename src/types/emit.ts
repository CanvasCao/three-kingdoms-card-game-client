import {Card, MultiTargetsAction, OneTargetAction} from "./gameStatus";

// 前端=>后端
export type EmitActionData = OneTargetAction | MultiTargetsAction

export type EmitResponseData = {
    cards: Card[],
    actualCard: Card,
    originId: string,
    targetId: string,

    // 为了校验无懈可击是否冲突
    wuxieTargetCardId?: string,

    selectedIndexes: number[],
}

export type CardAreaType = "hand" | 'equipment' | 'panding'

export type EmitCardBoardData = {
    originId: string,
    targetId: string,
    card: Card,
    cardAreaType: CardAreaType
    type: "REMOVE" | "MOVE",

    selectedIndex: number,
}

export type EmitJoinRoomData = {
    playerId: string,
    playerName: string,
    roomId: string
}

export type EmitThrowData = {
    cards: Card[]

    selectedIndexes: number[],
}

export type EmitWugufengdengData = {
    card: Card,
    playerId: string,
}


// 后端=>前端
export type EmitRefreshRooms = {
    roomId: string | number,
    players: { playerId: string, playerName: string }[],
}[]

export type EmitRefreshRoomPlayers = {
    playerId: string,
    playerName: string
}[];

export type EmitNotifyAddToPublicCardData = {
    fromId: string,
    toId: never,
    cards: Card[],
    actualCard: Card,
    originIndexes: number[],
    message: string
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