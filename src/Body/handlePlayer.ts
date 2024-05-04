import { Conf } from "../Config/config";
import { HandleData } from "../Data/handleData";
import { orgData } from "../Data/orgData";
import { playerData } from "../Data/playerData";
import { reduceMoney } from "../Economic/Economic";
import { orgLevel, playerLevel } from "../Enum/orgEnum";
import { XYMessage } from "../i18n/signal";
import { Organization } from "./Org";

// 生成随机码
function createUUID() {
    let code: string = "";
    const codeLength = 6;// 验证码的长度  
    const random: Array<string | number> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];// 随机数  
    for (let i = 0; i < codeLength; i += 1) {// 循环操作  
        const index = Math.floor(Math.random() * 61);// 取得随机数的索引（0~35）  
        code += random[index];// 根据索引取得随机数加到code上  
    }
    return code;
}

/**
 * 玩家创建公会
 * @param player 创建公会的玩家
 * @param orgName 公会名称
 * @returns 
 */
export function createOrg(player: Player, orgName: string) {
    try {
        const uuid = createUUID();
        const orgdata: orgData = {
            name: orgName,
            uuid,
            level: orgLevel.Normal,
            members: [{
                name: player.name,
                xuid: player.xuid,
                level: playerLevel.Owner,
                time: new Date().toLocaleString("zh", { hour12: false }).replaceAll("/", "-"),
            }],
            time: new Date().toLocaleString("zh", { hour12: false }).replaceAll("/", "-"),
            manager: {
                maxPlayer: Conf.Normal.maxPlayer,
                transPoints: [],
                mainPosition: {
                    name: "MainPosition",
                    pos: [0, 0, 0, 0]
                },
                cpf: 0,
                getCpfLevel: playerLevel.Manager
            },
            applyList: []
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const a = new HandleData();
        a.addOrg(orgdata);
        const b: Array<string> = playerData.get(player.xuid);
        if (b.indexOf(orgdata.uuid) === -1) {
            b.push(orgdata.uuid);
            playerData.set(player.xuid, b);
        }
        player.tell(XYMessage("CreateOrgSuccess", Conf.language));
        reduceMoney(player, Conf.Normal.cteateMoney);
    } catch (error) {
        logger.error(error);
        player.tell(XYMessage("Error", Conf.language));
    }

}


/** 玩家查看公会列表 
 * @param player 查看的玩家
 */
export function orgList(player: Player) {
    const data = new HandleData();
    player.tell(XYMessage("PLayer_Call_List", Conf.language, data.orgNum, data.nameList.join(",")));
}

/** 玩家申请加入公会 
 * @param player 申请的玩家
 * @param uuid 玩家申请的公会
 */
export function applyJoinOrg(player: Player, uuid: string) {
    try {
        const data = new HandleData();
        const orgdata = data.getOrgData(uuid);
        if (orgdata === null) {
            player.tell(XYMessage("NoFindOrg", Conf.language));
            return;
        }
        const org = new Organization(orgdata);
        org.addApplyList({
            name: player.realName,
            xuid: player.xuid,
            level: playerLevel.Member,
            time: new Date().toLocaleString("zh", { hour12: false }).replaceAll("/", "-"),
        });
        player.tell(XYMessage("ApplyJoinOrgSuccess", Conf.language));
    }
    catch (error) {
        logger.error(error);
        player.tell(XYMessage("Error", Conf.language));
    }
}

/** 
 * 玩家退出公会
 * @param player 退出的玩家
 * @param uuid 退出的公会的uuid
 */
export function quitOrg(player: Player, uuid: string) {
    try {
        const data = new HandleData();
        const orgdata = data.getOrgData(uuid);
        if (orgdata === null) {
            player.tell(XYMessage("NoFindOrg", Conf.language));
            return;
        }
        const org = new Organization(orgdata);

        org.kickMember(player.xuid);
        player.tell(XYMessage("QuitOrgSuccess", Conf.language));
        const a: Array<string> = playerData.get(player.xuid);

        a.find((_uuid, index) => {
            if (uuid === _uuid) {
                a.splice(index, 1);
                playerData.set(player.xuid, a);
                return true;
            }
            return false;
        });
    }
    catch (error) {
        logger.error(error);
        player.tell(XYMessage("Error", Conf.language));
    }
}

/** 玩家解散公会
 * @param player 解散的玩家
 * @param uuid 解散的公会的 uuid
 */
export function deleteOrg(player: Player, uuid: string) {
    try {
        const data = new HandleData();
        const orgdata = data.getOrgData(uuid);
        if (orgdata === null) {
            player.tell(XYMessage("NoFindOrg", Conf.language));
            return;
        }
        const org = new Organization(orgdata);
        const orgpl = org.members.at(org.findPlayer(player.xuid));
        if (orgpl.level === playerLevel.Owner) {
            org.members.forEach((orgmember) => {
                const a: Array<string> = playerData.get(orgmember.xuid);
                a.find((_uuid, index) => {
                    if (org.uuid === _uuid) {
                        a.splice(index, 1);
                        playerData.set(player.xuid, a);
                        return true;
                    }
                    return false;
                });
            });
            data.deleteOrg(org.uuid);
            player.tell(XYMessage("DeleteOrgSuccess", Conf.language));
        }
        else {
            player.tell(XYMessage("PermissionsNotEnough", Conf.language));
        }
    }
    catch (error) {
        logger.error(error);
        player.tell(XYMessage("Error", Conf.language));
    }
}