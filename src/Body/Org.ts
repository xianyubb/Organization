import { HandleData } from "../Data/handleData";
import { orgData, orgManager, orgMember, transPoints } from "../Data/orgData";
import { orgLevel, playerLevel } from "../Enum/orgEnum";


export class Organization extends HandleData {
    private orgdata: orgData;

    constructor(org: orgData) {
        super();
        this.orgdata = org;
        this.updateData();
    }

    /** 公会名 */
    get name(): string {
        return this.orgdata.name;
    }

    /** 公会ID */
    get uuid(): string {
        return this.orgdata.uuid;
    }

    /** 公会等级 */
    get level(): orgLevel {
        return this.orgdata.level;
    }

    /** 公会成员 */
    get members(): orgMember[] {
        return this.orgdata.members;
    }

    /** 公会创建的日期 */
    get time(): string {
        return this.orgdata.time;
    }

    /** 公会管理项 */
    get manager(): orgManager {
        return this.orgdata.manager;
    }

    /** 申请列表 */
    get applyList(): orgMember[] {
        return this.orgdata.applyList;
    }

    /** 公会公积金 */
    get cpf(): number {
        return this.orgdata.manager.cpf;
    }

    /**
     * 更新公会数据
     */
    updateData() {
        this.updateOrgData(this.orgdata);
    }

    /** 
     * 通过xuid查找公会中的人
     * @param xuid xuid
     * @return 下标 没有找到即为-1
     */
    findPlayer(xuid: string) {
        let i = 0;
        for (i = 0; i < this.members.length; i += 1) {
            if (this.members[i].xuid === xuid) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 允许玩家加入公会 
     * @param xuid 需要加入的玩家的xuid
     * @returns 是否成功加入
     */
    allowMemberJoin(xuid: string) {
        let i = 0;
        let orgmenber: orgMember[];
        for (i = 0; i < this.applyList.length; i += 1) {
            if (this.applyList[i].xuid === xuid) {
                this.members.push(this.applyList[i]);
                orgmenber = this.applyList.splice(i, 1);
                break;
            }
        }
        this.updateData();
        return this.members.indexOf(orgmenber[0]) !== -1;
    }

    /**
     * 把玩家踢出公会
     * @param xuid 需要退出的玩家的xuid
     * @returns 是否成功退出
     */
    kickMember(xuid: string) {
        let i = 0;
        let orgmenber: orgMember[];
        for (i = 0; i < this.members.length; i += 1) {
            if (this.members[i].xuid === xuid) {
                orgmenber = this.members.splice(i, 1);
                break;
            }
        }
        this.updateData();
        return this.members.indexOf(orgmenber[0]) === -1;
    }

    /** 
     * 更新玩家公会权限
     * @param xuid 需要更新的玩家的xuid
     * @param level 权限
     *  @returns 是否更改成功
     */
    updateMemberLevel(xuid: string, level: playerLevel) {
        this.members.at(this.findPlayer(xuid)).level = level;
        this.updateData();
        return this.members.at(this.findPlayer(xuid)).level === level;
    }

    /** 
     * 转让公会
     * @param xuid1 转让的人
     * @param xuid2 被转让人
     * @returns 是否转让成功
     */
    transferOrg(xuid1: string, xuid2: string) {
        this.members.at(this.findPlayer(xuid1)).level = playerLevel.Member;
        this.members.at(this.findPlayer(xuid2)).level = playerLevel.Manager;
        this.updateData();
        return this.members.at(this.findPlayer(xuid2)).level === playerLevel.Manager;;
    }

    /** 
     * 修改公会名称
     * @param name
     * @returns 是否更改成功
     */
    changeName(name: string) {
        this.orgdata.name = name;
        this.updateData();
        return this.orgdata.name === name;
    }

    /** 
     * 更改公会等级
     * @param level
     * @returns 是否更改成功
     */
    changeLevel(level: orgLevel) {
        this.orgdata.level = level;
        this.updateData();
        return this.orgdata.level === level;
    }

    /**
     * 增加一个传送点
     * @param tanspoints 传送点
     * @returns 是否成功添加
     */
    addTransPoint(tanspoints: transPoints) {
        this.orgdata.manager.transPoints.push(tanspoints);
        this.updateData();
        return this.orgdata.manager.transPoints.indexOf(tanspoints) !== -1;
    }

    /**
     * 删除一个传送点
     * @param tanspoints 传送点
     * @returns 是否成功删除
     */
    reduceTransPoint(tanspoints: transPoints) {
        this.orgdata.manager.transPoints.splice(this.orgdata.manager.transPoints.indexOf(tanspoints), 1);
        this.updateData();
        return this.orgdata.manager.transPoints.indexOf(tanspoints) === -1;
    }

    /** 
     * 设置总部
     * @param mainPoint 总部信息
     */
    setMainPoint(mainPoint: transPoints) {
        this.orgdata.manager.mainPosition = mainPoint;
        this.updateData();
        return this.orgdata.manager.mainPosition === mainPoint;
    }

    /** 
     * 增加公会公积金
     * @param cpf 增加的公积金
     * @returns 是否增加成功
     */
    addCpf(cpf: number) {
        const a = this.orgdata.manager.cpf;
        this.orgdata.manager.cpf += cpf;
        this.updateData();
        return this.orgdata.manager.cpf >= a;
    }

    /** 
     * 减少公会公积金
     * @param cpf 减少的公积金
     * @returns 是否减少成功
     */
    reduceCpf(cpf: number) {
        const a = this.orgdata.manager.cpf;
        this.orgdata.manager.cpf -= cpf;
        this.updateData();
        return this.orgdata.manager.cpf <= a;
    }

    /** 
     * 修改公会公积金所需等级
     * @param level 所需等级
     * @returns 
     */
    changeCpfLevel(level: playerLevel) {
        this.orgdata.manager.getCpfLevel = level;
        this.updateData();
        return this.orgdata.manager.getCpfLevel === level;
    }
}

// 生成随机码
function createUUID() {
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
 * 玩家创建公会
 * @param player 创建公会的玩家
 * @param orgName 公会名称
 * @returns 
 */
export function createOrg(player: Player, orgName: string) {
    const uuid = createUUID();
    const orgdata: orgData = {
        name: orgName,
        uuid,
        level: orgLevel.Normal,
        members: [{
            name: player.name,
            xuid: player.xuid,
            level: playerLevel.Owner,
            time: new Date().toLocaleString()
        }],
        time: new Date().toLocaleString(),
        manager: {
            maxPlayer: 5,
            transPoints: [],
            mainPosition: {
                name: "总部",
                pos: [0, 0, 0]
            },
            cpf: 0,
            getCpfLevel: playerLevel.Member
        },
        applyList: []
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const a = new Organization(orgdata);
}