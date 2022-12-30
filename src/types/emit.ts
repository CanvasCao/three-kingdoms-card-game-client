import {Card, MultiTargetsAction, OneTargetAction} from "./gameStatus";

// 前端=>后端
export type EmitActionData = OneTargetAction | MultiTargetsAction

export type EmitResponseData = {
    cards: Card[],
    actualCard: Card,
    originId: string,
    targetId: string,
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

export type EmitThrowData = {
    cards: Card[]

    selectedIndexes: number[],
}


// 后端=>前端
// 前端根据originId targetId决定是否画箭头
export type EmitNotifyAddPublicCardData = {
    fromId: string,
    toId: never,
    cards: Card[],
    actualCard: Card,
    originIndexes: number[],
    message: string
}

export type EmitNotifyOwnerChangeCardData = {
    fromId: string,
    toId: string,
    cards: Card[],
    originIndexes: number[],
    message: never,

    cardAreaType: CardAreaType,
}