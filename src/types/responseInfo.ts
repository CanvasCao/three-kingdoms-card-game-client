import {Card} from "./card"

export type ResponseInfo = BasicCardResponseInfo | WuXieResponseInfo | SkillResponseInfo | undefined

export type BasicCardResponseInfo = {
    targetId: string,
    cardValidate: (card?: Card) => boolean,
    needResponseCard: boolean
}

export type WuXieResponseInfo = {
    wuxieTargetCardId: string,
    cardValidate: (card?: Card) => boolean,
    needResponseCard: boolean
}

export type SkillResponseInfo = {
    cardValidate: (card?: Card) => boolean
    needResponseCard: boolean
}