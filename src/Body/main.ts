import { Organization, OrgLevel, Permissions, PlayerData } from "../Data/DataList";
import { CheckPlayerOrg, DeleteOrgDB, DeletePlayerDB, ReadOrgDB, ReadPlayerDB, WriteOrgDB, WritePlayerDB } from "../Data/KVDB";



// 生成随机码
function createCode() {
    let code: string = "";
    const codeLength = 6;// 验证码的长度  
    const random = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];// 随机数  
    for (let i = 0; i < codeLength; i += 1) {// 循环操作  
        const index = Math.floor(Math.random() * 61);// 取得随机数的索引（0~35）  
        code += random[index];// 根据索引取得随机数加到code上  
    }
    return code;
}

/**
 * 创建工会
 * @param name 工会名
 * @param Owner 创建者
 */
export function CreateOrg(name: string, Owner: Player) {
    const code = createCode();
    const date = new Date();
    const now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    const org: Organization = {
        Name: name,
        UUID: code,
        CreateTime: now,
        Level: OrgLevel.v1,
        Players: [{
            RealName: Owner.realName,
            Xuid: Owner.xuid,
            Permissions: Permissions.Creater,
            JoinTime: now
        }],
        ApplyPlayer: [],
        Owner: {
            RealName: Owner.realName,
            Xuid: Owner.xuid,
            Permissions: Permissions.Creater,
            JoinTime: now
        },
        Data: {
            Money: 0,
            TransferPoint: []
        }
    }
    WriteOrgDB(name, org)
    WritePlayerDB(Owner.realName, name)
}

/**
 * 删除工会
 * @param name 工会名
 */
export async function DeleteOrg(name: string, Deleter: Player) {

    ReadOrgDB(name).then((Orgdb, reject?: any) => {
        if (reject) {
            Deleter.tell("未读取到数据");
        }
        const Create = Orgdb.Owner.Xuid;
        if (Create !== Deleter.xuid) {
            Deleter.tell("无权删除");
            return;
        }
        Orgdb.Players.forEach(async (player: PlayerData) => {
            DeletePlayerDB(player.RealName)
        })
        DeleteOrgDB(name);
    })
}

/**
 * 申请加入工会
 * @param name 工会名
 * @param player 申请人
 */
export async function ApplyJoinOrg(name: string, UUID: string, player: Player) {
    if (await CheckPlayerOrg(player)) {
        player.tell("你已是工会成员，无法再次加入工会！");
    }
    ReadOrgDB(name).then((Orgdb: Organization, reject?: (reason: any) => PromiseLike<never>) => {
        if (Orgdb.UUID !== UUID) {
            player.tell("UUID 错误!你不是该工会的申请人")
            return;
        }
        if (reject) {
            player.tell("未读取到数据");
        }
        const date = new Date();
        const now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

        let check = true;
        let i = 0;
        while (check) {
            check = !(player.xuid === Orgdb.ApplyPlayer.at(i).Xuid)
            i += 1;
        }
        if (!check) {
            player.tell("你已经申请过该工会！")
            return;
        }
        Orgdb.ApplyPlayer.push({
            RealName: player.realName,
            Xuid: player.xuid,
            Permissions: Permissions.Menber,
            JoinTime: now
        })
        WriteOrgDB(name, Orgdb)
        WritePlayerDB(player.realName, name)
    })

}

/**
 * 加入工会
 * @param name 工会名
 * @param player 申请人
 */
export async function JoinOrg(name: string, player: Player) {
    const Orgdb = await ReadOrgDB(name);
    const date = new Date();
    const now = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    Orgdb.Players.push({
        RealName: player.realName,
        Xuid: player.xuid,
        Permissions: Permissions.Menber,
        JoinTime: now
    })
    WriteOrgDB(name, Orgdb)
    WritePlayerDB(player.realName, name)
}

/**
 * 离开工会
 * @param player 离开的玩家
 */
export async function LeaveOrg(player: Player) {
    ReadPlayerDB(player.realName).then(async (Orgname: string, reject?: (reason: any) => PromiseLike<never>) => {
        if (reject) {
            player.tell("无法退出这个工会");
        }
        const Orgdb = await ReadOrgDB(Orgname);
        Orgdb.Players = Orgdb.Players.filter(item => item.Xuid !== player.xuid)
        WriteOrgDB(Orgname, Orgdb)
        DeletePlayerDB(player.realName)
    })

}