"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrg = exports.quitOrg = exports.applyJoinOrg = exports.orgList = exports.createOrg = void 0;
const config_1 = require("../Config/config");
const handleData_1 = require("../Data/handleData");
const playerData_1 = require("../Data/playerData");
const Economic_1 = require("../Economic/Economic");
const orgEnum_1 = require("../Enum/orgEnum");
const signal_1 = require("../i18n/signal");
const Org_1 = require("./Org");
// 生成随机码
function createUUID() {
    let code = "";
    const codeLength = 6; // 验证码的长度  
    const random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']; // 随机数  
    for (let i = 0; i < codeLength; i += 1) { // 循环操作  
        const index = Math.floor(Math.random() * 61); // 取得随机数的索引（0~35）  
        code += random[index]; // 根据索引取得随机数加到code上  
    }
    return code;
}
/**
 * 玩家创建公会
 * @param player 创建公会的玩家
 * @param orgName 公会名称
 * @returns
 */
function createOrg(player, orgName) {
    try {
        const uuid = createUUID();
        const orgdata = {
            name: orgName,
            uuid,
            level: orgEnum_1.orgLevel.Normal,
            members: [{
                    name: player.name,
                    xuid: player.xuid,
                    level: orgEnum_1.playerLevel.Owner,
                    time: new Date().toLocaleString("zh", { hour12: false }).replaceAll("/", "-"),
                }],
            time: new Date().toLocaleString("zh", { hour12: false }).replaceAll("/", "-"),
            manager: {
                maxPlayer: config_1.Conf.Normal.maxPlayer,
                transPoints: [],
                mainPosition: {
                    name: "MainPosition",
                    pos: [0, 0, 0, 0]
                },
                cpf: 0,
                getCpfLevel: orgEnum_1.playerLevel.Manager
            },
            applyList: []
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const a = new handleData_1.HandleData();
        a.addOrg(orgdata);
        const b = playerData_1.playerData.get(player.xuid);
        if (b.indexOf(orgdata.uuid) === -1) {
            b.push(orgdata.uuid);
            playerData_1.playerData.set(player.xuid, b);
        }
        player.tell((0, signal_1.XYMessage)("CreateOrgSuccess", config_1.Conf.language));
        (0, Economic_1.reduceMoney)(player, config_1.Conf.Normal.cteateMoney);
    }
    catch (error) {
        logger.error(error);
        player.tell((0, signal_1.XYMessage)("Error", config_1.Conf.language));
    }
}
exports.createOrg = createOrg;
/** 玩家查看公会列表
 * @param player 查看的玩家
 */
function orgList(player) {
    const data = new handleData_1.HandleData();
    player.tell((0, signal_1.XYMessage)("PLayer_Call_List", config_1.Conf.language, data.orgNum, data.nameList.join(",")));
}
exports.orgList = orgList;
/** 玩家申请加入公会
 * @param player 申请的玩家
 * @param uuid 玩家申请的公会
 */
function applyJoinOrg(player, uuid) {
    try {
        const data = new handleData_1.HandleData();
        const orgdata = data.getOrgData(uuid);
        if (orgdata === null) {
            player.tell((0, signal_1.XYMessage)("NoFindOrg", config_1.Conf.language));
            return;
        }
        const org = new Org_1.Organization(orgdata);
        org.addApplyList({
            name: player.realName,
            xuid: player.xuid,
            level: orgEnum_1.playerLevel.Member,
            time: new Date().toLocaleString("zh", { hour12: false }).replaceAll("/", "-"),
        });
        player.tell((0, signal_1.XYMessage)("ApplyJoinOrgSuccess", config_1.Conf.language));
    }
    catch (error) {
        logger.error(error);
        player.tell((0, signal_1.XYMessage)("Error", config_1.Conf.language));
    }
}
exports.applyJoinOrg = applyJoinOrg;
/**
 * 玩家退出公会
 * @param player 退出的玩家
 * @param uuid 退出的公会的uuid
 */
function quitOrg(player, uuid) {
    try {
        const data = new handleData_1.HandleData();
        const orgdata = data.getOrgData(uuid);
        if (orgdata === null) {
            player.tell((0, signal_1.XYMessage)("NoFindOrg", config_1.Conf.language));
            return;
        }
        const org = new Org_1.Organization(orgdata);
        org.kickMember(player.xuid);
        player.tell((0, signal_1.XYMessage)("QuitOrgSuccess", config_1.Conf.language));
        const a = playerData_1.playerData.get(player.xuid);
        a.find((_uuid, index) => {
            if (uuid === _uuid) {
                a.splice(index, 1);
                playerData_1.playerData.set(player.xuid, a);
                return true;
            }
            return false;
        });
    }
    catch (error) {
        logger.error(error);
        player.tell((0, signal_1.XYMessage)("Error", config_1.Conf.language));
    }
}
exports.quitOrg = quitOrg;
/** 玩家解散公会
 * @param player 解散的玩家
 * @param uuid 解散的公会的 uuid
 */
function deleteOrg(player, uuid) {
    try {
        const data = new handleData_1.HandleData();
        const orgdata = data.getOrgData(uuid);
        if (orgdata === null) {
            player.tell((0, signal_1.XYMessage)("NoFindOrg", config_1.Conf.language));
            return;
        }
        const org = new Org_1.Organization(orgdata);
        const orgpl = org.members.at(org.findPlayer(player.xuid));
        if (orgpl.level === orgEnum_1.playerLevel.Owner) {
            playerData_1.playerData.reload();
            org.members.forEach((orgmember) => {
                const a = playerData_1.playerData.get(orgmember.xuid);
                a.splice(a.indexOf(uuid));
                playerData_1.playerData.set(orgmember.xuid, a);
            });
            data.deleteOrg(org.uuid);
            player.tell((0, signal_1.XYMessage)("DeleteOrgSuccess", config_1.Conf.language));
        }
        else {
            player.tell((0, signal_1.XYMessage)("PermissionsNotEnough", config_1.Conf.language));
        }
    }
    catch (error) {
        logger.error(error);
        player.tell((0, signal_1.XYMessage)("Error", config_1.Conf.language));
    }
}
exports.deleteOrg = deleteOrg;
