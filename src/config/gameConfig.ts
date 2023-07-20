const GAME_STATUS = {
    "PLAYING": "PLAYING",
    "IDLE": "IDLE" // 默认值 未开始的游戏gamestatus为null idle只存在很短暂的时间
}

const STAGE_NAME = {
    "START": "START",
    "JUDGE": "JUDGE",
    "DRAW": "DRAW",
    "PLAY": "PLAY",
    "THROW": "THROW",
    "END": "END",
}

const STAGE_NAMES = [
    "START",
    "JUDGE",
    "DRAW",
    "PLAY",
    "THROW",
    "END"
]

const STAGE_NAME_CONFIG = {
    [STAGE_NAME.START]: {
        EN: "START",
        CN: "开始"
    },
    [STAGE_NAME.JUDGE]: {
        EN: "JUDGE",
        CN: "判定"
    },
    [STAGE_NAME.DRAW]: {
        EN: "DRAW",
        CN: "摸牌"
    },
    [STAGE_NAME.PLAY]: {
        EN: "PLAY",
        CN: "出牌"
    },
    [STAGE_NAME.THROW]: {
        EN: "THROW",
        CN: "弃牌"
    },
    [STAGE_NAME.END]: {
        EN: "END",
        CN: "结束"
    },
}

export {
    GAME_STATUS,
    STAGE_NAME,
    STAGE_NAMES,
    STAGE_NAME_CONFIG
}