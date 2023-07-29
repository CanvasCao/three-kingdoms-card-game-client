import {CardConfig} from "../types/card"

// FE
const CARD_NUM_DESC: { [key: number]: string } = {
    1: "A",
    2: "2",
    3: "3",
    4: "4",
    5: "5",
    6: "6",
    7: "7",
    8: "8",
    9: "9",
    10: "10",
    11: "J",
    12: "Q",
    13: "K",
}

// BE
const CARD_LOCATION = {
    PAIDUI: "PAIDUI",
    HAND: "HAND",
    EQUIPMENT: "EQUIPMENT",
    HORSE: "HORSE",
    PANDING: "PANDING"
}

const CARD_HUASE= {
    HEITAO: "♠",
    CAOHUA: '♣',
    FANGKUAI: '♦',
    HONGTAO: '♥',
}

const CARD_TYPE = {
    EQUIPMENT: "EQUIPMENT",
    SCROLL: "SCROLL",
    BASIC: "BASIC",
}

const CARD_ATTRIBUTE = {
    LIGHTNING: "LIGHTNING",
    FIRE: "FIRE",
}

const EQUIPMENT_TYPE = {
    WEAPON: "WEAPON",
    SHIELD: "SHIELD",
    PLUS_HORSE: "PLUS_HORSE",
    MINUS_HORSE: "MINUS_HORSE",
}

const CARD_TYPE_CONFIG = {
    [CARD_TYPE.EQUIPMENT]: {
        key: [CARD_TYPE.EQUIPMENT],
        "CN": "装备",
        "EN": "EQUIPMENT",
    },
    [CARD_TYPE.SCROLL]: {
        key: [CARD_TYPE.SCROLL],
        "CN": "锦囊",
        "EN": "SCROLL",
    },
    [CARD_TYPE.BASIC]: {
        key: [CARD_TYPE.BASIC],
        "CN": "基本",
        "EN": "BASIC",
    },
}

const BASIC_CARDS_CONFIG = {
    "SHA": {
        key: "SHA",
        "CN": "杀",
        "EN": "Strike",
        type: CARD_TYPE.BASIC
    },
    "LEI_SHA": {
        key: "LEI_SHA",
        "CN": "雷杀",
        "EN": "Lightning Strike",
        type: CARD_TYPE.BASIC,
        attribute: CARD_ATTRIBUTE.LIGHTNING,
    },
    "HUO_SHA": {
        key: "HUO_SHA",
        "CN": "火杀",
        "EN": "Fire Strike",
        type: CARD_TYPE.BASIC,
        attribute: CARD_ATTRIBUTE.FIRE,
    },
    "SHAN": {
        key: "SHAN",
        "CN": "闪",
        "EN": "Dodge",
        type: CARD_TYPE.BASIC
    },
    "TAO": {
        key: "TAO",
        "CN": "桃",
        "EN": "Peach",
        type: CARD_TYPE.BASIC
    },
    "JIU": {
        key: "JIU",
        "CN": "酒",
        "EN": "Wine",
        type: CARD_TYPE.BASIC
    },
}

const IMMEDIATE_SCROLL_CARDS_CONFIG = {
    // 锦囊
    "WAN_JIAN_QI_FA": {
        key: "WAN_JIAN_QI_FA",
        "CN": "万箭齐发",
        "EN": "Arrow Barrage",
        type: CARD_TYPE.SCROLL
    },
    "NAN_MAN_RU_QIN": {
        key: "NAN_MAN_RU_QIN",
        "CN": "南蛮入侵",
        "EN": "Barbarian Invasion",
        type: CARD_TYPE.SCROLL
    },
    "TAO_YUAN_JIE_YI": {
        key: "TAO_YUAN_JIE_YI",
        "CN": "桃园结义",
        "EN": "Peach Garden",
        type: CARD_TYPE.SCROLL
    },
    "WU_ZHONG_SHENG_YOU": {
        key: "WU_ZHONG_SHENG_YOU",
        "CN": "无中生有",
        "EN": "Something for Nothing",
        type: CARD_TYPE.SCROLL
    },
    "WU_GU_FENG_DENG": {
        key: "WU_GU_FENG_DENG",
        "CN": "五谷丰登",
        "EN": "Bountiful Harvest",
        type: CARD_TYPE.SCROLL
    },
    "GUO_HE_CHAI_QIAO": {
        key: "GUO_HE_CHAI_QIAO",
        "CN": "过河拆桥",
        "EN": "Dismantle",
        type: CARD_TYPE.SCROLL
    },
    "SHUN_SHOU_QIAN_YANG": {
        key: "SHUN_SHOU_QIAN_YANG",
        "CN": "顺手牵羊",
        "EN": "Snatch",
        type: CARD_TYPE.SCROLL
    },
    "JIE_DAO_SHA_REN": {
        key: "JIE_DAO_SHA_REN",
        "CN": "借刀杀人",
        "EN": "Borrowed Sword",
        type: CARD_TYPE.SCROLL
    },
    "JUE_DOU": {
        key: "JUE_DOU",
        "CN": "决斗",
        "EN": "Duel",
        type: CARD_TYPE.SCROLL
    },
    "WU_XIE_KE_JI": {
        key: "WU_XIE_KE_JI",
        "CN": "无懈可击",
        "EN": "Cancel",
        type: CARD_TYPE.SCROLL
    },

    // junzheng
    "HUO_GONG": {
        key: "HUO_GONG",
        "CN": "火攻",
        "EN": "Fire Attack",
        type: CARD_TYPE.SCROLL,
    },
    "TIE_SUO_LIAN_HUAN": {
        key: "TIE_SUO_LIAN_HUAN",
        "CN": "铁索连环",
        "EN": "Chain",
        type: CARD_TYPE.SCROLL,
    },
}

const DELAY_SCROLL_CARDS_CONFIG = { // 延时锦囊
    "LE_BU_SI_SHU": {
        key: "LE_BU_SI_SHU",
        "CN": "乐不思蜀",
        "EN": "Contentment",
        type: CARD_TYPE.SCROLL,
        isDelay: true,
    },
    "BING_LIANG_CUN_DUAN": {
        key: "BING_LIANG_CUN_DUAN",
        "CN": "兵粮寸断",
        "EN": "Supply Outage",
        type: CARD_TYPE.SCROLL,
        isDelay: true,
    },
    "SHAN_DIAN": {
        key: "SHAN_DIAN",
        "CN": "闪电",
        "EN": "Lightning",
        type: CARD_TYPE.SCROLL,
        isDelay: true,
    }
}
const SCROLL_CARDS_CONFIG = {
    ...IMMEDIATE_SCROLL_CARDS_CONFIG,
    ...DELAY_SCROLL_CARDS_CONFIG,
}
const WEAPON_CARDS_CONFIG = {
    // 武器
    "ZHU_GE_LIAN_NU": {
        key: "ZHU_GE_LIAN_NU",
        "CN": "诸葛连弩",
        "EN": "Crossbow",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.WEAPON,
        distance: 1
    },
    "CI_XIONG_SHUANG_GU_JIAN": {
        key: "CI_XIONG_SHUANG_GU_JIAN",
        "CN": "雌雄双股剑",
        "EN": "Binary Sword",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.WEAPON,
        distance: 2
    },
    "GU_DIN_DAO": {
        key: "GU_DIN_DAO",
        "CN": "古锭刀",
        "EN": "Ancient Sword",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.WEAPON,
        distance: 2
    },
    "QING_LONG_YAN_YUE_DAO": {
        key: "QING_LONG_YAN_YUE_DAO",
        "CN": "青龙偃月刀",
        "EN": "Green Dragon Sword",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.WEAPON,
        distance: 3
    },
    "FANG_TIAN_HUA_JI": {
        key: "FANG_TIAN_HUA_JI",
        "CN": "方天画戟",
        "EN": "Halberd",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.WEAPON,
        distance: 4
    },
    "HAN_BIN_JIAN": {
        key: "HAN_BIN_JIAN",
        "CN": "寒冰剑",
        "EN": "Ice Sword",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.WEAPON,
        distance: 2
    },
    "GUAN_SHI_FU": {
        key: "GUAN_SHI_FU",
        "CN": "贯石斧",
        "EN": "Stone Axe",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.WEAPON,
        distance: 3
    },
    "QI_LIN_GONG": {
        key: "QI_LIN_GONG",
        "CN": "麒麟弓",
        "EN": "Qilin Bow",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.WEAPON,
        distance: 5
    },
    "ZHU_QUE_YU_SHAN": {
        key: "ZHU_QUE_YU_SHAN",
        "CN": "朱雀羽扇",
        "EN": "Fire Fan",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.WEAPON,
        distance: 4
    },
    "QIN_GANG_JIAN": {
        key: "QIN_GANG_JIAN",
        "CN": "青釭剑",
        "EN": "Green Steel Sword",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.WEAPON,
        distance: 2
    },
    "ZHANG_BA_SHE_MAO": {
        key: "ZHANG_BA_SHE_MAO",
        "CN": "丈八蛇矛",
        "EN": "Snake Spear",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.WEAPON,
        distance: 3
    },
}

const SHIELD_CARDS_CONFIG = {
    // 防具
    "BA_GUA_ZHEN": {
        key: "BA_GUA_ZHEN",
        "CN": "八卦阵",
        "EN": "Eight Diagrams",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.SHIELD,
    },
    "REN_WANG_DUN": {
        key: "REN_WANG_DUN",
        "CN": "仁王盾",
        "EN": "King's Shield",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.SHIELD,
    },
    "TENG_JIA": {
        key: "TENG_JIA",
        "CN": "藤甲",
        "EN": "Vine Armour",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.SHIELD,
    },
    "BAI_YIN_SHI_ZI": {
        key: "BAI_YIN_SHI_ZI",
        "CN": "白银狮子",
        "EN": "Silver Lion",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.SHIELD,
    },
}

const PLUS_HORSE_CARDS_CONFIG = {
    // 马
    "DI_LU": {
        key: "DI_LU",
        "CN": "的卢",
        "EN": "Plus horse",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.PLUS_HORSE,
    },
    "JUE_YING": {
        key: "JUE_YING",
        "CN": "绝影",
        "EN": "Plus horse",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.PLUS_HORSE,
    },
    "ZHAO_HUANG_FEI_DIAN": {
        key: "ZHAO_HUANG_FEI_DIAN",
        "CN": "爪黄飞电",
        "EN": "Plus horse",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.PLUS_HORSE,
    },
}
const MINUS_HORSE_CARDS_CONFIG = {
    "CHI_TU": {
        key: "CHI_TU",
        "CN": "赤兔",
        "EN": "Minus horse",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.MINUS_HORSE,
    },
    "DA_WAN": {
        key: "DA_WAN",
        "CN": "大宛",
        "EN": "Minus horse",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.MINUS_HORSE,
    },
    "ZI_XING": {
        key: "ZI_XING",
        "CN": "紫骍",
        "EN": "Minus horse",
        type: CARD_TYPE.EQUIPMENT,
        equipmentType: EQUIPMENT_TYPE.MINUS_HORSE,
    },
}

const EQUIPMENT_CARDS_CONFIG = {
    ...WEAPON_CARDS_CONFIG,
    ...SHIELD_CARDS_CONFIG,
    ...PLUS_HORSE_CARDS_CONFIG,
    ...MINUS_HORSE_CARDS_CONFIG,
}

const CARD_CONFIG: CardConfig = {
    ...BASIC_CARDS_CONFIG,
    ...SCROLL_CARDS_CONFIG,
    ...EQUIPMENT_CARDS_CONFIG,
}

const ALL_SHA_CARD_NAMES = [
    CARD_CONFIG.SHA.key,
    CARD_CONFIG.LEI_SHA.key,
    CARD_CONFIG.HUO_SHA.key,
]

export {
    ALL_SHA_CARD_NAMES,

    CARD_NUM_DESC,
    CARD_LOCATION,
    CARD_HUASE,
    CARD_TYPE,
    EQUIPMENT_TYPE,

    // card configs
    CARD_TYPE_CONFIG,
    CARD_CONFIG,
    BASIC_CARDS_CONFIG,
    SCROLL_CARDS_CONFIG,
    EQUIPMENT_CARDS_CONFIG,
    DELAY_SCROLL_CARDS_CONFIG,
}