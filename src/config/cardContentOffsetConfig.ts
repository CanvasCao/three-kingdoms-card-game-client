import {sizeConfig} from "./sizeConfig";

const cardHuaseNumberObjOffsetX = -sizeConfig.controlCard.width / 2.03
const cardHuaseNumberObjOffsetY = -sizeConfig.controlCard.height / 2.07

const cardNameObjOffsetX = sizeConfig.controlCard.width / 40
const cardNameObjOffsetY = -(sizeConfig.controlCard.height * 0.35)

const cardMessageObjOffsetX = 0
const cardMessageObjOffsetY = sizeConfig.controlCard.height / 2.5

const cardTypeObjOffsetX = -sizeConfig.controlCard.width / 2 + 2
const cardTypeObjOffsetY = sizeConfig.controlCard.height / 2 - 2

const cardDistanceObjOffsetX = sizeConfig.controlCard.width / 2.4
const cardDistanceObjOffsetY = sizeConfig.controlCard.height / 2.9

export {
    cardHuaseNumberObjOffsetX,
    cardHuaseNumberObjOffsetY,

    cardNameObjOffsetX,
    cardNameObjOffsetY,

    cardMessageObjOffsetX,
    cardMessageObjOffsetY,

    cardTypeObjOffsetX,
    cardTypeObjOffsetY,

    cardDistanceObjOffsetX,
    cardDistanceObjOffsetY,
}