import { Conf } from "../Config/config";
import { XYMessage } from "../i18n/signal";

let Score: Objective = null;
if (Conf.Economy === "Score") {
    Score = mc.getScoreObjective(Conf.Score);
}



/**
 * 增加玩家存款
 * @param player 要增加的玩家
 * @param amount 
 */
export function addmoney(player: Player, amount: number) {
    if (Conf.Economy === "Score") {
        if (Score) {
            try {
                const old = Score.getScore(player);
                if (Score.addScore(player, amount) >= old + amount) {
                    player.tell(XYMessage("AddMoneySuccess", Conf.language, amount));
                    return true;
                }
                player.tell(XYMessage("AddMoneyFailure", Conf.language));
                return false;

            }
            catch (e) {
                logger.error(e);
                player.tell(XYMessage("AddMoneyFailure", Conf.language));
            }
            return false;
        }
    } else if (Conf.Economy === "LLmoney") {
        if (money.add(player.xuid, amount)) {
            player.tell(XYMessage("AddMoneySuccess", Conf.language, amount));
            return true;
        } 
            player.tell(XYMessage("AddMoneyFailure", Conf.language));
            return false;
    } else {
        logger.error(XYMessage("EconomicTypeCouldNotBeFound", Conf.language));
        return false;
    }
    return false;
}

/**
 * 减少玩家存款
 * @param player
 * @param amount
 */
export function reduceMoney(player: Player, amount: number) {
    if (Conf.Economy === "Score") {
        if (Score) {
            try {
                const old = Score.getScore(player);
                if (Score.reduceScore(player, amount) <= old - amount) {
                    player.tell(XYMessage("ReduceMoneySuccess", Conf.language, amount));
                    return true;
                }
                player.tell(XYMessage("ReduceMoneyFailure", Conf.language));
            }
            catch (e) {
                logger.error(e);
                player.tell(XYMessage("ReduceMoneyFailure", Conf.language));
            }
            return false;
        }
    } else if (Conf.Economy === "LLmoney") {
        if (money.reduce(player.xuid, amount)) {
            player.tell(XYMessage("ReduceMoneySuccess", Conf.language, amount));
            return true;
        }
        player.tell(XYMessage("ReduceMoneyFailure", Conf.language));
        return false;
    } else {
        logger.error(XYMessage("EconomicTypeCouldNotBeFound", Conf.language));
        return false;
    }
    return false;
}

