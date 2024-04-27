import *as fs from 'fs';
import { path } from "../..";
import { orgLevel } from "../Enum/orgEnum";



export type orgMember = {
    /** 玩家名 */
    name: string;
    /** 玩家Xuid */
    xuid: string;
    /** 玩家在公会中的权限 */
    level: orgLevel;
    /** 玩家加入公会的日期 */
    time: string;
};

export type transPoints = {
    /** 传送点名称 */
    name: string;
    /** 传送点坐标 */
    pos: Array<number>;
};

export type orgManager = {
    /** 最大玩家数 */
    maxPlayer: number;
    /** 传送点列表 */
    transPoints: Array<transPoints>;
    /** 总部传送点 */
    mainPosition: transPoints;
    /** 公积金 */
    cpf: number;
    /** 获取公积金所需等级 */
    getCpfLevel: orgLevel;
};


export type orgData = {
    /** 公会名称 */
    name: string;
    /** 公会ID */
    uuid: string;
    /** 公会等级 */
    level: orgLevel;
    /** 公会成员 */
    members: orgMember[];
    /** 公会创建的日期 */
    time: string;
    /** 公会管理项 */
    manager: orgManager;
    /** 申请列表 */
    applyList: orgMember[];
};


export function initData() {
    if (!fs.existsSync(`${path}/orgData.json`)) {
        fs.mkdir(path, () => {
            fs.writeFileSync(`${path}/orgData.json`, JSON.stringify([]));
        });
    }
}

