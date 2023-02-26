export const i18Config = {
    // LOGIN page
    TITLE: {KEY: "TITLE", EN: "Legends of the Three Kingdoms", CN: "三国杀"},
    NAME_PLACEHOLDER: {KEY: "NAME_PLACEHOLDER", EN: "Your name", CN: "你的名字"},
    LOGIN: {KEY: "LOGIN", EN: "Login", CN: "登陆"},

    // ROOMS page
    ROOM: {KEY: "ROOM", EN: "Room", CN: "房间"},
    PLAYERS: {KEY: "PLAYERS", EN: "Player(s)", CN: "人"},
    JOIN: {KEY: "JOIN", EN: "Join", CN: "加入"},

    // roomPlayersPage
    START: {KEY: "START", EN: "START", CN: "开始游戏"},
    WAIT_FOR_START: {KEY: "WAIT_FOR_START", EN: "Please wait for host to start the game", CN: "请等待房主开始游戏"},
    HOST: {KEY: "HOST", EN: "Host", CN: "房主"},

    // button
    OK: {KEY: "OK", EN: "OK", CN: "确定"},
    CANCEL: {KEY: "CANCEL", EN: "CANCEL", CN: "取消"},
    END: {KEY: "END", EN: "END", CN: "结束"},

    // play phase
    PLEASE_SELECT_A_CARD: {KEY: "PLEASE_SELECT_A_CARD", EN: "Play phase, please play a card", CN: "出牌阶段，请选择一张卡牌"},
    SELECT_SHA: {
        KEY: "SELECT_SHA",
        EN: "Please select {number} character as the target of the strike",
        CN: "请选择{number}名角色，作为杀的目标"
    },
    SELECT_TAO: {
        KEY: "SELECT_TAO",
        EN: "Play Peach to recover 1 point of health",
        CN: "出桃回复1点体力"
    },
    SELECT_JIU: {
        KEY: "SELECT_JIU",
        EN: "Use wine to cause your next used [Strike] to deal +1 damage",
        CN: "使用酒，令自己的下一张使用的【杀】造成的伤害+1"
    },
    // 装备
    SELECT_WEAPON_OR_SHEILD: {
        KEY: "SELECT_WEAPON_OR_SHEILD",
        EN: "Equipment {name}",
        CN: "装备{name}"
    },
    SELECT_MINUS_HORSE: {
        KEY: "SELECT_MINUS_HORSE",
        EN: "After equipment {name}, you calculate the distance to other characters will -1 distance",
        CN: "装备{name}后，你计算与其他角色的距离时-1"
    },
    SELECT_PLUS_HORSE: {
        KEY: "SELECT_PLUS_HORSE",
        EN: "After equipment {name}, when you are defending, other characters will have +1 distance from you",
        CN: "装备{name}后，你防守时其他角色与你的距离会+1"
    },
    // 锦囊
    SELECT_WU_ZHONG_SHENG_YOU: {
        KEY: "SELECT_WU_ZHONG_SHENG_YOU",
        EN: "You can draw 2 cards",
        CN: "你可以摸两张牌"
    },
    SELECT_JUE_DOU: {
        KEY: "SELECT_JUE_DOU",
        EN: "Choose a target to duel with",
        CN: "选择一个目标与其决斗"
    },
    SELECT_JIE_DAO_SHA_REN: {
        KEY: "SELECT_JIE_DAO_SHA_REN",
        EN: "Choose a character with a weapon in the equipment area to strike another character, and if they don't, they must give their weapon to you",
        CN: "选择一名装备区有武器的角色杀另一名角色，若其不杀，则其须将其武器交给你"
    },
    SELECT_AOE: {
        KEY: "SELECT_AOE",
        EN: "Play {name}",
        CN: "使用{name}"
    },
    SELECT_GUO_HE_CHAI_QIAO: {
        KEY: "SELECT_GUO_HE_CHAI_QIAO",
        EN: "Choose a target and discard one of their cards",
        CN: "请选择一个目标 弃置其一张牌"
    },
    SELECT_SHUN_SHOU_QIAN_YANG: {
        KEY: "SELECT_SHUN_SHOU_QIAN_YANG",
        EN: "Choose a target and get one of their cards",
        CN: "请选择一个目标，获得其一张牌"
    },
    SELECT_SHAN_DIAN: {
        KEY: "SELECT_SHAN_DIAN",
        EN: "Put Lightning in your judgment zone",
        CN: "将闪电置入你的判定区"
    },
    SELECT_LE_BU_SI_SHU: {
        KEY: "SELECT_LE_BU_SI_SHU",
        EN: "Please select {number} character as the target of the Contentment",
        CN: "请选择1名角色，作为乐不思蜀的目标"
    },
    SELECT_BING_LIANG_CUN_DUAN: {
        KEY: "SELECT_BING_LIANG_CUN_DUAN",
        EN: "Please select {number} character as the target of the Supply Outage",
        CN: "请选择1名角色，作为兵粮寸断的目标"
    },
    SELECT_ZHANG_BA_SHE_MAO: {
        KEY: "SELECT_ZHANG_BA_SHE_MAO",
        EN: "Launching the special effect of the Snake Spear to use two hand cards as Strike",
        CN: "发动丈八蛇矛将两张手牌当杀使用或打出"
    },


    // 响应
    RESPONSE_TAO: {
        KEY: "RESPONSE_TAO",
        EN: "{name} is dying, needs {number} peach(es), do you play [Peach]?",
        CN: "{name}濒死，需要{number}个桃，是否出桃?"
    },
    RESPONSE_WU_XIE: {
        KEY: "RESPONSE_WU_XIE",
        EN: "{originName}'s {scrollName} is going to take effect on {targetName}, do you play [Cancel]?",
        CN: "{originName}的{scrollName}锦囊对{targetName}即将生效，是否出无懈可击"
    },
    WAIT_WU_XIE: {
        KEY: "WAIT_WU_XIE",
        EN: "Waiting for the user to play [Cancel]",
        CN: "无懈可击询问中"
    },

    // 弃牌
    SELECT_THROW_CARDS: {
        KEY: "SELECT_THROW_CARDS",
        EN: "You need to discard {number} hand card(s)",
        CN: "您需要弃置{number}张手牌，请选牌"
    }
}
