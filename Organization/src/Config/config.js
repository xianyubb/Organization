"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conf = exports.config = void 0;
const __1 = require("../..");
exports.config = {
    Economy: "Score",
    Score: "money",
    allowCreate: true,
    language: "zh_cn",
    Normal: {
        maxPlayer: 5,
        maxTransPoints: 10,
        TransMoney: 0,
        cteateMoney: 0
    },
    Middle: {
        maxPlayer: 10,
        maxTransPoints: 20,
        TransMoney: 0,
        superMoney: 0
    },
    High: {
        maxPlayer: 20,
        maxTransPoints: 30,
        TransMoney: 0,
        superMoney: 0
    },
};
const conf = new JsonConfigFile(`./plugins/${__1.PLUGIN_NAME}/config.json`, JSON.stringify(exports.config));
/** 配置项 */
exports.Conf = JSON.parse(conf.read());
