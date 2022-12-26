import {Card, MultiTargetsAction, OneTargetAction} from "./gameStatus";

export type EmitPlayPublicCardData = {
    cards: Card[];
    message: string;
}

export type EmitActionData = OneTargetAction | MultiTargetsAction

export type EmitResponseData = {
    cards: Card[],
    actualCard: Card,
    originId: string,
    targetId: string,
    wuxieTargetCardId?: string,
}

export type EmitCardBoardData = {
    originId: string,
    targetId: string,
    card: Card,
    type: "REMOVE" | "MOVE",
}

export type EmitThrowData = {
    cards: Card[]
}