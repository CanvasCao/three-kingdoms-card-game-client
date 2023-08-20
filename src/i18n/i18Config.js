export const i18Config = {
    // LOGIN page
    TITLE: {EN: "Legends of the Three Kingdoms", CN: "三国杀"},
    NAME_PLACEHOLDER: {EN: "Your name", CN: "你的名字"},
    LOGIN: {EN: "Login", CN: "登陆"},

    // ROOMS page
    ROOM: {EN: "Room", CN: "房间"},
    PLAYERS: {EN: "Player(s)", CN: "人"},
    JOIN: {EN: "Join", CN: "加入"},
    PLAYING: {EN: "Playing", CN: "游戏中"},

    // ROOM Players Page
    START: {EN: "START", CN: "开始游戏"},
    WAIT_FOR_START: {EN: "Please wait for host to start the game", CN: "请等待房主开始游戏"},
    HOST: {EN: "Host", CN: "房主"},

    // button
    OK: {EN: "OK", CN: "确定"},
    CANCEL: {EN: "CANCEL", CN: "取消"},
    END: {EN: "END", CN: "结束"},


    // 操作提示
    // play phase
    PLEASE_SELECT_A_CARD: {
        EN: "Play phase, please play a card",
        CN: "出牌阶段，请选择一张卡牌"
    },
    SELECT_SHA: {
        EN: "Please select {number} character as the target of the [Strike]",
        CN: "请选择{number}名角色，作为杀的目标"
    },
    SELECT_TAO: {
        EN: "Play [Peach] to recover 1 point of health",
        CN: "出桃回复1点体力"
    },
    SELECT_JIU: {
        EN: "Use wine to cause your next [Strike] to deal +1 damage",
        CN: "使用酒，令自己的下一张使用的【杀】造成的伤害+1"
    },
    // 装备
    SELECT_WEAPON_OR_SHEILD: {
        EN: "Equipment {name}",
        CN: "装备{name}"
    },
    SELECT_MINUS_HORSE: {
        EN: "After equipment {name},\r\nwhen you calculate the distance to other characters will -1 distance",
        CN: "装备{name}后，你计算与其他角色的距离时-1"
    },
    SELECT_PLUS_HORSE: {
        EN: "After equipment {name},\r\nwhen you are defending, other characters will have +1 distance from you",
        CN: "装备{name}后，你防守时其他角色与你的距离会+1"
    },
    // 锦囊
    SELECT_WU_ZHONG_SHENG_YOU: {
        EN: "You can draw 2 cards",
        CN: "你可以摸两张牌"
    },
    SELECT_JUE_DOU: {
        EN: "Choose a target to duel with",
        CN: "选择一个目标与其决斗"
    },
    SELECT_JIE_DAO_SHA_REN: {
        EN: "Choose a character with a weapon to strike another character,\r\nif they don't, they must give their weapon to you",
        CN: "选择一名装备区有武器的角色杀另一名角色，若其不杀，则其须将其武器交给你"
    },
    SELECT_AOE: {
        EN: "Play {name}",
        CN: "使用{name}"
    },
    SELECT_GUO_HE_CHAI_QIAO: {
        EN: "Choose a target and discard one of their cards",
        CN: "请选择一个目标 弃置其一张牌"
    },
    SELECT_SHUN_SHOU_QIAN_YANG: {
        EN: "Choose a target with a distance of 1 and get one of their cards",
        CN: "选择一个距离为1的目标，获得其一张牌"
    },
    SELECT_SHAN_DIAN: {
        EN: "Put [Lightning] in your judgment zone",
        CN: "将闪电置入你的判定区"
    },
    SELECT_LE_BU_SI_SHU: {
        EN: "Please select 1 character as the target of the [Contentment]",
        CN: "请选择1名角色，作为乐不思蜀的目标"
    },
    SELECT_BING_LIANG_CUN_DUAN: {
        EN: "Please select 1 character as the target of the [Supply Outage]",
        CN: "请选择1名角色，作为兵粮寸断的目标"
    },
    SELECT_ZHANG_BA_SHE_MAO: {
        EN: "Launching the special effect of the Snake Spear to use two hand cards as [Strike]",
        CN: "发动丈八蛇矛将两张手牌当杀使用或打出"
    },

    // 操作提示
    // 响应
    RESPONSE_TAO: {
        EN: "{name} is dying, needs {number} peach(es), do you want to play [Peach]?",
        CN: "{name}濒死，需要{number}个桃，是否出桃？"
    },
    RESPONSE_SHAN: {
        EN: "{name} played [Strike] on you, please play 1 [Dodge]",
        CN: "{name}对你出杀，请打出1张闪"
    },
    RESPONSE_MULTI_SHAN: {
        EN: "{name} played [Strike] on you, need play {number} [Dodge] to dodge",
        CN: "{name}对你出杀，需要打出{number}张闪才能闪避"
    },
    RESPONSE_WU_XIE_TO_MAKE_IT_INEFFECTIVE: {
        EN: "{cardName} is going to become ineffective for {name}, do you want to play [Cancel] to make it effective?",
        CN: "{cardName}即将对{name}失效，是否使用【无懈可击】令其生效？"
    },
    RESPONSE_WU_XIE_TO_MAKE_IT_EFFECTIVE: {
        EN: "{cardName} is going to take effect on {name}, do you want to play [Cancel] to make it ineffective?",
        CN: "{cardName}即将对{name}生效，是否使用【无懈可击】令其失效？"
    },
    RESPONSE_WAN_JIAN_QI_FA: {
        EN: "{name} played [Arrow Barrage], please play a [Dodge]",
        CN: "{name}使用了万箭齐发，请出一张闪"
    },
    RESPONSE_NAN_MAN_RU_QIN: {
        EN: "{name} played [Barbarian Invasion], please play a [Strike]",
        CN: "{name}使用了南蛮入侵，请出一张杀"
    },
    RESPONSE_JUE_DOU: {
        EN: "{name} duel with you, please play a [Strike]",
        CN: "{name}与你决斗，请出一张杀"
    },
    RESPONSE_JIE_DAO_SHA_REN: {
        EN: "Play a [Strike] on {targetName} or give your weapon to {originName}",
        CN: "对{targetName}出一张杀，否则将你的武器交给{originName}"
    },
    WAIT_WU_XIE: {
        EN: "Waiting for the user to play [Cancel]",
        CN: "无懈可击询问中"
    },

    // SKILL
    RESPONSE_SKILL_OR_NOT: {
        EN: "Do you activate the {skillName}?",
        CN: "是否发动 {skillName}？"
    },
    RESPONSE_SKILL_GUI_CAI: {
        EN: "Play a hand card to replace the judgment card",
        CN: "打出一张手牌代替判定牌"
    },
    RESPONSE_SKILL_LIU_LI: {
        EN: "Discard one card and transfer this [Strike] to another character within your attacking range (cannot be the character who used this [Strike])",
        CN: '弃置一张牌并将此【杀】转移给你攻击范围内的一名其他角色（不能是使用此【杀】的角色）'
    },
    RESPONSE_SKILL_CI_XIONG_SHUANG_GU_JIAN: {
        EN: "{name} activates the Binary Sword. Please discard one card or click Cancel to allow {name} to draw one card.",
        CN: '{name}发动雌雄双股剑，请弃置一张牌或点取消让{name}摸一张牌'
    },
    RESPONSE_SKILL_GUAN_SHI_FU: {
        EN: "You may discard two cards to make this [Strike] still take effect.",
        CN: '你可以弃置两张牌，令此【杀】依然对其生效。'
    },
    RESPONSE_SKILL_QING_LONG_YAN_YUE_DAO: {
        EN: "Do you want to activate the Green Dragon Sword and continue to strike",
        CN: '是否发动青龙偃月刀 继续出杀？'
    },
    RESPONSE_SKILL_TU_XI: {
        EN: "Obtain one hand card from up to two other characters",
        CN: '获得最多两名其他角色的各一张手牌'
    },

    // cardBoard
    RESPONSE_SKILL_FAN_KUI: {
        EN: "Obtain one card from the source of the damage",
        CN: '获得伤害来源的一张牌'
    },
    RESPONSE_SKILL_HAN_BIN_JIAN: {
        EN: "Please discard two cards",
        CN: '请依次弃置其两张牌'
    },
    RESPONSE_SKILL_QI_LIN_GONG: {
        EN: "Please discard one horse card",
        CN: '请弃置一张坐骑牌'
    },

    // 操作提示
    // 弃牌
    SELECT_THROW_CARDS: {
        EN: "You need to discard {number} hand card(s)",
        CN: "您需要弃置{number}张手牌，请选牌"
    },

    // 操作提示
    // 五谷丰登
    WU_GU_FENG_DENG_WAIT_WU_XIE: {
        EN: "{name} is about to choose a card\r\nwaiting for [cancel]",
        CN: "{name}即将选牌，正在询问无懈可击"
    },
    WU_GU_FENG_DENG_CHOOSING: {
        EN: "{name} is choosing",
        CN: "{name}正在选牌"
    },

    // playerCardsBoard
    PLAYER_BOARD_HAND_CARD_CATEGORY: {
        EN: "Hand\r\ncard",
        CN: "手\r\n牌"
    },
    PLAYER_BOARD_EQUIPMENT_CARD_CATEGORY: {
        EN: "Equip-\r\nment\r\ncard",
        CN: "装\r\n备\r\n牌"
    },
    PLAYER_BOARD_PANDING_CARD_CATEGORY: {
        EN: "Delayed\r\nscroll\r\ncard",
        CN: "延\r\n时\r\n锦\r\n囊\r\n牌"
    },
    PLAYER_CARD_BOARD_TITLE: {
        EN: "{titleName}  Choose a card from {playerName}",
        CN: "{titleName}  选择一张{playerName}的卡牌"
    },
    HERO_SELECT_BOARD_TITLE: {
        EN: "Select your hero",
        CN: "选将"
    },

    // PublicCardMessage
    PUBLIC_CARD_MESSAGE_PLAY_NO_TARGET: {
        EN: "{name} play",
        CN: "{name}使用"
    },
    PUBLIC_CARD_MESSAGE_PLAY_HAVE_TARGET: {
        EN: "{originName} to {targetName}",
        CN: "{originName} 对 {targetName}"
    },
    PUBLIC_CARD_MESSAGE_PLAY_PANDING_RESULT: {
        EN: "{playerName}'s {pandingName} judgement result",
        CN: "{playerName}的{pandingName}判定结果"
    },
    PUBLIC_CARD_MESSAGE_PLAY_THROW: {
        EN: "{name} throw",
        CN: "{name}弃牌"
    },
    PUBLIC_CARD_MESSAGE_PLAY_CHAI: {
        EN: "{name} dismantled",
        CN: "{name}被拆"
    },

    // BoardPlayerThinkingHint
    IS_THINKING: {
        EN: "Is thinking",
        CN: "正在思考"
    },
    IS_DEAD: {
        EN: "Defeated",
        CN: "阵亡"
    }
}
