import { Conf } from "../Config/config";
import { HandleData } from "../Data/handleData";
import { orgData } from "../Data/orgData";
import { orgLevel, playerLevel } from "../Enum/orgEnum";
import { createSystemMessage } from "../i18n/signal";
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
                    name: "总部",
                    pos: [0, 0, 0]
                },
                cpf: 0,
                getCpfLevel: playerLevel.Manager
            },
            applyList: []
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const a = new Organization(orgdata);
    } catch (error) {
        logger.error(error);
        player.tell(createSystemMessage("Error", Conf.language));
    }

}


/** 玩家查看公会列表 
 * @param player 查看的玩家
 */
export function orgList(player: Player) {
    const data = new HandleData();
    player.tell(createSystemMessage("PLayer_Call_List", Conf.language, data.orgNum, data.nameList.join(",")));
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
            player.tell(createSystemMessage("NoFindOrg", Conf.language));
            return;
        }
        const org = new Organization(orgdata);
        org.addApplyList({
            name: player.realName,
            xuid: player.xuid,
            level: playerLevel.Member,
            time: new Date().toLocaleString("zh", { hour12: false }).replaceAll("/", "-"),
        });
        player.tell(createSystemMessage("ApplyJoinOrg", Conf.language));
    }
    catch (error) {
        logger.error(error);
        player.tell(createSystemMessage("Error", Conf.language));
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
            player.tell(createSystemMessage("NoFindOrg", Conf.language));
            return;
        }
        const org = new Organization(orgdata);
        org.kickMember(player.xuid);
        player.tell(createSystemMessage("QuitOrg", Conf.language));
    }
    catch (error) {
        logger.error(error);
        player.tell(createSystemMessage("Error", Conf.language));
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
            player.tell(createSystemMessage("NoFindOrg", Conf.language));
            return;
        }
        const org = new Organization(orgdata);
        const orgpl = org.members.at(org.findPlayer(player.xuid));
        if (orgpl.level === playerLevel.Owner) {
            data.deleteOrg(org.uuid);
            player.tell(createSystemMessage("DeleteOrg_Success", Conf.language));
        }
        else {
            player.tell(createSystemMessage("PermissionsNotEnough", Conf.language));
        }
    }
    catch (error) {
        logger.error(error);
        player.tell(createSystemMessage("Error", Conf.language));
    }
}