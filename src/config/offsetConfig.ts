import sizeConfig from "./sizeConfig.json";

const cardHuaseNumberObjOffsetX = -sizeConfig.controlCard.width / 2
const cardHuaseNumberObjOffsetY = -sizeConfig.controlCard.height / 2.1
const cardNameObjOffsetX = sizeConfig.controlCard.width / 40
const cardNameObjOffsetY = -(sizeConfig.controlCard.height * 0.35)

export {
    cardHuaseNumberObjOffsetX,
    cardHuaseNumberObjOffsetY,
    cardNameObjOffsetX,
    cardNameObjOffsetY,
}