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
}

export type EmitThrowData = {
    cards: Card[]
}