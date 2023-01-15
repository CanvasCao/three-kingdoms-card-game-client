const bgWidth = 1200
const bgHeight = 675

const cardWidth = 80;
const cardHeight = 106;

const controlEquipmentWidth = 140;
const controlEquipmentHeight = 30;

const sizeConfig = {
    "background": {
        "width": bgWidth,
        "height": bgHeight
    },
    "playersArea": {
        "width": bgWidth * 0.8,
        "height": bgHeight - cardHeight * 1.3
    },
    "controlCard": {
        "width": cardWidth,
        "height": cardHeight
    },
    "controlEquipment": {
        "width": controlEquipmentWidth,
        "height": controlEquipmentHeight
    },
    "player": {
        "width": 140,
        "height": 168
    },
    "blood": {
        "height": 30,
        "width": 45.6
    },
    "okBtn": {
        "width": 120,
        "height": 40
    },
    "cancelBtn": {
        "width": 100,
        "height": 40
    },
    "endRoundBtn": {
        "width": 100,
        "height": 40
    }
}

export {
    sizeConfig
}