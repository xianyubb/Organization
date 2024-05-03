
import { PLUGIN_NAME } from "../..";




interface oriConfig {
    /** 最多人数 */
    maxPlayer: number,
    /** 最多传送点 */
    maxTransPoints: number,
    /** 传送花费经济 */
    TransMoney: number;
}

interface Normal extends oriConfig {
    /** 创建花费金钱 */
    cteateMoney: number;
}

interface unNormal extends oriConfig {
    /** 升级花费金钱 */
    superMoney: number;
}

type Config = {
    /** 经济类型 */
    Economy: "LLmoney" | "Score",
    /** 计分板名称 */
    Score: string;
    /** 是否允许玩家自己创建公会 */
    allowCreate: boolean;
    /** 语言 */
    language: string;
    /** 一级公会配置项 */
    Normal: Normal;
    /** 二级公会配置项 */
    Middle: unNormal;
    /** 三级公会配置项 */
    High: unNormal;
};

export const config: Config = {
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

const conf = new JsonConfigFile(`./plugins/${PLUGIN_NAME}/config.json`, JSON.stringify(config));
/** 配置项 */
export const Conf: Config = JSON.parse(conf.read())