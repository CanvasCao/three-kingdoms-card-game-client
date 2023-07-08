// const bgWidth = 2048
// const bgHeight = 1152
const bgWidth = 1366
const bgHeight = 768

const cardWidth = 85;
const cardHeight = 116;

const controlCardBgMargin = 15
const controlEquipmentWidth = 140;
const controlEquipmentHeight = 30;
const controlSelectedOffsetX = 10;

const playerHeight = 168
const playerWeight = 140;

const sizeConfig = {
    background: {
        width: bgWidth,
        height: bgHeight
    },
    playersArea: {
        width: bgWidth * 0.8,
        height: bgHeight - cardHeight - controlCardBgMargin * 2
    },
    controlCard: {
        width: cardWidth,
        height: cardHeight
    },
    controlCardBgMargin: controlCardBgMargin,
    controlEquipment: {
        width: controlEquipmentWidth,
        height: controlEquipmentHeight
    },
    controlSelectedOffsetX: controlSelectedOffsetX,
    player: {
        width: playerWeight,
        height: playerHeight
    },
    playerSource: {
        width: 574,
        height: 761
    },
    blood: {
        height: 30,
        width: 45.6
    },
    okBtn: {
        width: 100,
        height: 40
    },
    cancelBtn: {
        width: 100,
        height: 40
    },
    endRoundBtn: {
        width: 75,
        height: 40
    }
}

export {
    sizeConfig
}