const GAME_STATUS = {
    "PLAYING": "PLAYING",
    "IDLE": "IDLE" // 默认值 未开始的游戏gamestatus为null idle只存在很短暂的时间
}

const GAME_STAGE = {
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

const STAGE_NAMES_CN = [
    "开始",
    "判定",
    "摸牌",
    "出牌",
    "弃牌",
    "结束"
]

export {
    GAME_STATUS,
    GAME_STAGE,
    STAGE_NAMES,
    STAGE_NAMES_CN
}