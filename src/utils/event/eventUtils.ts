import { GameStatus } from "../../types/gameStatus"

const findOnGoingUseStrikeEvent = (gameStatus:GameStatus) => {
    const useStrikeEvent = gameStatus?.useStrikeEvents.find((event) => !event.done)
    return useStrikeEvent
}

export {
    findOnGoingUseStrikeEvent
}
