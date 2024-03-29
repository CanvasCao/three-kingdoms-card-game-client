// const bgWidth = 2048
// const bgHeight = 1152
const bgWidth = 1366
const bgHeight = 768

const cardWidth = 85;
const cardHeight = 116;

const controlCardMargin = 2
const boardCardMargin = 10
const controlCardBgMargin = 15
const controlEquipmentWidth = 142;
const controlEquipmentHeight = 30;
const controlCardSelectedOffsetX = 10;

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

    // controlCard
    controlCard: {
        width: cardWidth,
        height: cardHeight
    },
    controlCardMargin,
    controlCardBgMargin,
    controlEquipment: {
        width: controlEquipmentWidth,
        height: controlEquipmentHeight
    },
    controlCardSelectedOffsetX: controlCardSelectedOffsetX,


    // board
    boardCardMargin,

    // player
    player: {
        width: playerWeight,
        height: playerHeight
    },
    playerSource: {
        width: 350,
        height: 464
    },

    // select hero
    selectHeroCard: {
        width: cardWidth,
        height: cardHeight
    },
    heroCardSource: {
        width: 350,
        height: 464
    },

    //blood
    teamTag: {
        height: 36,
        width: 36
    },

    //blood
    blood: {
        height: 30,
        width: 45.6
    },

    //btn
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
    },
    boardBtn: {
        width: 75,
        height: 30
    }
}

export {
    sizeConfig
}