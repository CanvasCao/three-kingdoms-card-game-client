import {EQUIPMENT_CARDS_CONFIG, SCROLL_CARDS_CONFIG} from "./cardConfig"
import {SKILL_NAMES_CONFIG} from "./skillsConfig"

const PANDING_EFFECT_CONFIG = {
    [SCROLL_CARDS_CONFIG.LE_BU_SI_SHU.key]: {
        CN: '♠ ♣ ♦：跳过出牌阶段\n' +
            '\r' +
            '♥：乐不思蜀无效',
        EN: '♠ ♣ ♦: Skip play stage\n' +
            '\r' +
            '♥：Contentment has no efffect',
    },
    [SCROLL_CARDS_CONFIG.SHAN_DIAN.key]: {
        CN: '♠ 2-9：受到三点闪电伤害\n' +
            '\r' +
            '其他：闪电无效',
        EN: '♠ 2-9：Take three lightning damage\n' +
            '\r' +
            'Other：Lightning has no effect',
    },
    [EQUIPMENT_CARDS_CONFIG.BA_GUA_ZHEN.key]: {
        CN: '♥ ♦：视为出【闪】\n' +
            '\r' +
            '♠ ♣：八卦未生效',
        EN: '♥ ♦：Treat it as you played [Dodge]\n' +
            '\r' +
            '♠ ♣：Eight Diagrams has no effect',
    },
    [SKILL_NAMES_CONFIG.SHU006_TIE_JI.key]: {
        CN: '♥ ♦：目标无法闪避\n' +
            '\r' +
            '♠ ♣：铁骑未生效',
        EN: '♥ ♦：Target can not play [Dodge]\n' +
            '\r' +
            '♠ ♣：Iron Cavalry has no effect',
    },
    [SKILL_NAMES_CONFIG.WEI003_GANG_LIE.key]: {
        CN: '♦ ♠ ♣：伤害来源弃置两张手牌或受到1点伤害\n' +
            '\r' +
            '♥：刚烈未生效',
        EN: '♦ ♠ ♣：Damage source must discard two hand cards or take 1 point of damage\n' +
            '\r' +
            '♥：Unyielding has no effect',
    },
    [SKILL_NAMES_CONFIG.WEI007_LUO_SHEN.key]: {
        CN: '♠ ♣：获得判定牌，可以继续洛神\n' +
            '\r' +
            '♥ ♦：洛神未生效',
        EN: '♠ ♣：Acquire the judgment card, you may use this ability again.\n' +
            '\r' +
            '♥ ♦：Siren has no effect',
    },
}

export {
    PANDING_EFFECT_CONFIG,
}
