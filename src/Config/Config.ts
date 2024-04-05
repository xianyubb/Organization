


type Setting = {
    "v1": {
        "name": string,// 类型名
        "MaxPlayer": number,// 最多人数
        "TransLimited": number, // 最多传送点数量
        "cost": number  // 价格
    },
    "v2": {
        "name": string,// 类型名
        "MaxPlayer": number,// 最多人数
        "TransLimited": number, // 最多传送点数量
        "cost": number  // 价格
    },
    "v3": {
        "name": string,// 类型名
        "MaxPlayer": number,// 最多人数
        "TransLimited": number, // 最多传送点数量
        "cost": number  // 价格
    }
}


const Config = new JsonConfigFile("./plugins/Organization/config.json");


export const MoneyType: "LLMoney" | "Score" = Config.init("MoneyType", "Score"); // 经济类型 "LLMoney" 或者 "Score"

export const ScoreName: string = Config.init("ScoreName", "money"); // 计分板名称

export const OrgSetting: Setting = Config.init("OrgSetting", {
    "v1": {
        "name": "一级工会",// 类型名
        "MaxPlayer": 5,// 最多人数
        "TransLimited": 10, // 最多传送点数量
        "cost": 500 // 价格
    },
    "v2": {
        "name": "二级工会",// 类型名
        "MaxPlayer": 15,// 最多人数
        "TransLimited": 100, // 最多传送点数量
        "cost": 5000 // 价格
    },
    "v3": {
        "name": "三级工会",// 类型名
        "MaxPlayer": 50,// 最多人数
        "TransLimited": 999, // 最多传送点数量
        "cost": 99999 // 价格
    }
});

export const PlayerCanCreate: boolean = Config.init("PlayerCanCreate", false); // 玩家是否可以创建工会 此处为游戏管理员 并非工会管理员