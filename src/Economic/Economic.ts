import { Conf } from "../Config/config";
import { XYMessage } from "../i18n/signal";

// let Score: Objective = null;
// if (Conf.Economy === "Score") {
//     Score = mc.getScoreObjective(Conf.Score);
// }

/**
 * 增加玩家存款
 * @param player 要增加的玩家
 * @param amount 
 */
export function addmoney(player: Player, amount: number) {
    if (amount === 0) return true;
    if (Conf.Economy === "Score") {

        try {
            const name = Conf.Score;
            if (mc.runcmdEx(`scoreboard players add "${player.name}" "${name}" ${amount}`).success) {
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
    } if (Conf.Economy === "LLmoney") {
        if (money.add(player.xuid, amount)) {
            player.tell(XYMessage("AddMoneySuccess", Conf.language, amount));
            return true;
        }
        player.tell(XYMessage("AddMoneyFailure", Conf.language));
        return false;
    }
    logger.error(XYMessage("EconomicTypeCouldNotBeFound", Conf.language));
    return false;
}

/**
 * 减少玩家存款
 * @param player
 * @param amount
 */
export function reduceMoney(player: Player, amount: number) {
    if (amount === 0) return true;
    if (Conf.Economy === "Score") {
        const name = Conf.Score;
        try {
            if (mc.runcmdEx(`scoreboard players remove "${player.name}" "${name}" ${amount}`).success) {
                player.tell(XYMessage("ReduceMoneySuccess", Conf.language, amount));
                return true;
            }
            player.tell(XYMessage("ReduceMoneyFailure", Conf.language));
            return false;
        }
        catch (e) {
            logger.error(e);
            player.tell(XYMessage("ReduceMoneyFailure", Conf.language));
        }
        return false;

    } if (Conf.Economy === "LLmoney") {
        if (money.reduce(player.xuid, amount)) {
            player.tell(XYMessage("ReduceMoneySuccess", Conf.language, amount));
            return true;
        }
        player.tell(XYMessage("ReduceMoneyFailure", Conf.language));
        return false;
    }
    logger.error(XYMessage("EconomicTypeCouldNotBeFound", Conf.language));
    return false;
}

