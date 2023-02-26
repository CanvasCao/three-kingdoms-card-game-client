import {GamingScene} from "../../types/phaser";
import {GameStatus} from "../../types/gameStatus";
import {sizeConfig} from "../../config/sizeConfig";
import {GameFEStatus} from "../../types/gameFEStatus";
import Phaser from "phaser";
import {i18Config} from "../../i18n/i18Config";
import {getI18Lan, i18, i18Lans} from "../../i18n/i18nUtils";
import {CARD_CONFIG, EQUIPMENT_TYPE, SCROLL_CARDS_CONFIG} from "../../config/cardConfig";
import {getIsMyResponseCardTurn, getIsMyThrowTurn, getCanPlayInMyTurn} from "../../utils/stageUtils";
import {uuidv4} from "../../utils/uuid";
import {getAmendTargetMinMax} from "../../utils/playerUtils";

export class OperateHint {
    obId: string;
    gamingScene: GamingScene;
    operateHint?: Phaser.GameObjects.Text;
    X: number;
    Y: number;

    constructor(gamingScene: GamingScene) {
        this.obId = uuidv4();

        this.gamingScene = gamingScene;
        this.operateHint;
        this.X = sizeConfig.playersArea.width / 2;
        this.Y = sizeConfig.playersArea.height - sizeConfig.background.height * 0.12;

        this.drawOperateHint();

        this.gamingScene.gameStatusObserved.addObserver(this);
        this.gamingScene.gameFEStatusObserved.addSelectedStatusObserver(this);
    }

    drawOperateHint() {
        this.operateHint = this.gamingScene.add.text(
            this.X,
            this.Y,
            "",
            // @ts-ignore
            {fill: "#fff", align: "center", stroke: '#000', strokeThickness: 4}
        )
        this.operateHint.setPadding(0, 5, 0, 0);
        this.operateHint.setOrigin(0.5, 0.5);
        this.operateHint.setAlpha(0)
    }

    setText(gameStatus: GameStatus, gameFEStatus: GameFEStatus) {
        const _canPlayInMyTurn = getCanPlayInMyTurn(gameStatus);
        const isMyResponseCardTurn = getIsMyResponseCardTurn(gameStatus);
        const isMyThrowTurn = getIsMyThrowTurn(gameStatus);
        if (_canPlayInMyTurn) {
            this.operateHint?.setAlpha(1);
            const actualCardCNName = gameFEStatus.actualCard?.CN
            const actualCardName = (getI18Lan() == i18Lans.EN) ? gameFEStatus.actualCard?.EN : gameFEStatus.actualCard?.CN;
            const equipmentType = gameFEStatus.actualCard?.equipmentType

            // 没有选择牌
            if (!actualCardCNName) {
                this.operateHint?.setText(i18(i18Config.PLEASE_SELECT_A_CARD))
            }
            // 基本牌
            else if ([CARD_CONFIG.SHA.CN, CARD_CONFIG.LEI_SHA.CN, CARD_CONFIG.HUO_SHA.CN].includes(actualCardCNName)) {
                const minMax = getAmendTargetMinMax(gameStatus, gameFEStatus)
                const replaceNumber = (minMax.min == minMax.max) ? minMax.min : `${minMax.min}-${minMax.max}`;
                this.operateHint?.setText(i18(i18Config.SELECT_SHA, {number: replaceNumber}))
            } else if (actualCardCNName == CARD_CONFIG.TAO.CN) {
                this.operateHint?.setText(i18(i18Config.SELECT_TAO))
            }
            // 装备牌
            else if (equipmentType == EQUIPMENT_TYPE.WEAPON || equipmentType == EQUIPMENT_TYPE.SHIELD) {
                this.operateHint?.setText(i18(i18Config.SELECT_WEAPON_OR_SHEILD, {name: actualCardName}))
            } else if (equipmentType == EQUIPMENT_TYPE.MINUS_HORSE) {
                this.operateHint?.setText(i18(i18Config.SELECT_MINUS_HORSE, {name: actualCardName}))
            } else if (equipmentType == EQUIPMENT_TYPE.PLUS_HORSE) {
                this.operateHint?.setText(i18(i18Config.SELECT_PLUS_HORSE, {name: actualCardName}))
            }
            // 锦囊
            else if (actualCardCNName == SCROLL_CARDS_CONFIG.WU_ZHONG_SHENG_YOU.CN) {
                this.operateHint?.setText(i18(i18Config.SELECT_WU_ZHONG_SHENG_YOU))
            } else if (actualCardCNName == SCROLL_CARDS_CONFIG.JIE_DAO_SHA_REN.CN) {
                this.operateHint?.setText(i18(i18Config.SELECT_JIE_DAO_SHA_REN))
            } else if (actualCardCNName == SCROLL_CARDS_CONFIG.JUE_DOU.CN) {
                this.operateHint?.setText(i18(i18Config.SELECT_JUE_DOU))
            } else if ([
                SCROLL_CARDS_CONFIG.NAN_MAN_RU_QIN.CN,
                SCROLL_CARDS_CONFIG.WAN_JIAN_QI_FA.CN,
                SCROLL_CARDS_CONFIG.TAO_YUAN_JIE_YI.CN,
                SCROLL_CARDS_CONFIG.WU_GU_FENG_DENG.CN,
            ].includes(actualCardCNName)) {
                this.operateHint?.setText(i18(i18Config.SELECT_AOE, {name: actualCardName}))
            } else if (actualCardCNName == SCROLL_CARDS_CONFIG.GUO_HE_CHAI_QIAO.CN) {
                this.operateHint?.setText(i18(i18Config.SELECT_GUO_HE_CHAI_QIAO))
            } else if (actualCardCNName == SCROLL_CARDS_CONFIG.SHUN_SHOU_QIAN_YANG.CN) {
                this.operateHint?.setText(i18(i18Config.SELECT_SHUN_SHOU_QIAN_YANG))
            }
        }
    }

    gameStatusNotify(gameStatus: GameStatus) {
        const gameFEStatus = this.gamingScene.gameFEStatusObserved.gameFEStatus!;
        this.setText(gameStatus, gameFEStatus)
    }

    gameFEStatusNotify(gameFEStatus: GameFEStatus) {
        const gameStatus = this.gamingScene.gameStatusObserved.gameStatus!;
        this.setText(gameStatus, gameFEStatus)
    }
}
