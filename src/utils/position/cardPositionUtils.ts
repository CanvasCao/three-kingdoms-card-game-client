import {sizeConfig} from "../../config/sizeConfig";

const getMyCardPosition = (index: number) => {
    if (index >= 0) {
        return {
            x: sizeConfig.controlEquipment.width + sizeConfig.controlCardBgMargin + index * (sizeConfig.controlCard.width + sizeConfig.controlCardMargin) + sizeConfig.controlCard.width / 2,
            y: sizeConfig.background.height - sizeConfig.controlCard.height / 2 - sizeConfig.controlCard.height * 0.15
        }
    } else {
        return {
            x: 0,
            y: sizeConfig.playersArea.height
        }
    }

}

export {getMyCardPosition};
