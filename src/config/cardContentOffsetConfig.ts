import {sizeConfig} from "./sizeConfig";

const cardHuaseNumberObjOffsetX = -sizeConfig.controlCard.width / 2.3
const cardHuaseNumberObjOffsetY = -sizeConfig.controlCard.height / 2

const cardNameObjOffsetX = sizeConfig.controlCard.width / 40
const cardNameObjOffsetNonBasicY = -(sizeConfig.controlCard.height * 0.35)
const cardNameObjOffsetBasicY = cardNameObjOffsetNonBasicY + 5

const cardMessageObjOffsetX = 0
const cardMessageObjOffsetY = sizeConfig.controlCard.height / 2.5

const cardTypeObjOffsetX = -sizeConfig.controlCard.width / 2 + 6
const cardTypeObjOffsetY = sizeConfig.controlCard.height / 2 - 4

export {
    cardHuaseNumberObjOffsetX,
    cardHuaseNumberObjOffsetY,

    cardNameObjOffsetX,
    cardNameObjOffsetBasicY,
    cardNameObjOffsetNonBasicY,

    cardMessageObjOffsetX,
    cardMessageObjOffsetY,

    cardTypeObjOffsetX,
    cardTypeObjOffsetY,
}