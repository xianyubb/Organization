"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceMoney = exports.addmoney = void 0;
const config_1 = require("../Config/config");
const signal_1 = require("../i18n/signal");
let Score = null;
if (config_1.Conf.Economy === "Score") {
    Score = mc.getScoreObjective(config_1.Conf.Score);
}
/**
 * 增加玩家存款
 * @param player 要增加的玩家
 * @param amount
 */
function addmoney(player, amount) {
    if (config_1.Conf.Economy === "Score") {
        if (Score) {
            try {
                const old = Score.getScore(player);
                if (Score.addScore(player, amount) >= old + amount) {
                    player.tell((0, signal_1.XYMessage)("AddMoneySuccess", config_1.Conf.language, amount));
                    return true;
                }
                player.tell((0, signal_1.XYMessage)("AddMoneyFailure", config_1.Conf.language));
                return false;
            }
            catch (e) {
                logger.error(e);
                player.tell((0, signal_1.XYMessage)("AddMoneyFailure", config_1.Conf.language));
            }
            return false;
        }
    }
    else if (config_1.Conf.Economy === "LLmoney") {
        if (money.add(player.xuid, amount)) {
            player.tell((0, signal_1.XYMessage)("AddMoneySuccess", config_1.Conf.language, amount));
            return true;
        }
        player.tell((0, signal_1.XYMessage)("AddMoneyFailure", config_1.Conf.language));
        return false;
    }
    else {
        logger.error((0, signal_1.XYMessage)("EconomicTypeCouldNotBeFound", config_1.Conf.language));
        return false;
    }
    return false;
}
exports.addmoney = addmoney;
/**
 * 减少玩家存款
 * @param player
 * @param amount
 */
function reduceMoney(player, amount) {
    if (config_1.Conf.Economy === "Score") {
        if (Score) {
            try {
                const old = Score.getScore(player);
                if (Score.addScore(player, amount) >= old + amount) {
                    player.tell((0, signal_1.XYMessage)("ReduceMoneySuccess", config_1.Conf.language, amount));
                    return true;
                }
                player.tell((0, signal_1.XYMessage)("ReduceMoneyFailure", config_1.Conf.language));
            }
            catch (e) {
                logger.error(e);
                player.tell((0, signal_1.XYMessage)("ReduceMoneyFailure", config_1.Conf.language));
            }
            return false;
        }
    }
    else if (config_1.Conf.Economy === "LLmoney") {
        if (money.reduce(player.xuid, amount)) {
            player.tell((0, signal_1.XYMessage)("ReduceMoneySuccess", config_1.Conf.language, amount));
            return true;
        }
        player.tell((0, signal_1.XYMessage)("ReduceMoneyFailure", config_1.Conf.language));
        return false;
    }
    else {
        logger.error((0, signal_1.XYMessage)("EconomicTypeCouldNotBeFound", config_1.Conf.language));
        return false;
    }
    return false;
}
exports.reduceMoney = reduceMoney;
