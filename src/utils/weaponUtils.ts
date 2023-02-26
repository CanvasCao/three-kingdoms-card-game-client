import {GameFEStatus} from "../types/gameFEStatus";
import {EQUIPMENT_CARDS_CONFIG} from "../config/cardConfig";

const getIsZhangBaSheMaoSelected = (gameFEStatus: GameFEStatus) => {
    return gameFEStatus.selectedWeaponCard?.CN === EQUIPMENT_CARDS_CONFIG.ZHANG_BA_SHE_MAO.CN
}
export {getIsZhangBaSheMaoSelected};