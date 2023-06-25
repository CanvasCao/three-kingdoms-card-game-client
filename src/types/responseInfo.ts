import {Card} from "./card"
import {GameFEStatus} from "./gameFEStatus"

export type BaseResponseInfo = {
    cardIsAbleValidate: (card: Card) => boolean,
    okButtonIsAbleValidate: (gameFEStatus: GameFEStatus) => boolean
}

export interface BasicCardResponseInfo extends BaseResponseInfo {
    targetId: string,
}

export interface WuXieResponseInfo extends BaseResponseInfo {
    wuxieTargetCardId: string,
}

export interface SkillResponseInfo extends BaseResponseInfo {
    skillTargetIds?: string[]
}

export type ResponseInfo = BasicCardResponseInfo | WuXieResponseInfo | SkillResponseInfo | undefined
