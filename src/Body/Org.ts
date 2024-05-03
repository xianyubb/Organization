import { HandleData } from "../Data/handleData";
import { orgData, orgManager, orgMember, transPoints } from "../Data/orgData";
import { playerData } from "../Data/playerData";
import { orgLevel, playerLevel } from "../Enum/orgEnum";


export class Organization {
    private orgdata: orgData;

    handleData: HandleData;

    constructor(org: orgData) {
        this.orgdata = org;
        this.handleData = new HandleData();
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
        this.handleData.updateOrgData(this.orgdata);
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
     * 通过xuid查找公会中的人
     * @param xuid xuid
     * @return 
     */
    findPlayerData(xuid: string) {
        let i = 0;
        for (i = 0; i < this.members.length; i += 1) {
            if (this.members[i].xuid === xuid) {
                return this.members[i];
            }
        }
        return null;
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
        if (this.members.indexOf(orgmenber[0]) !== -1) {
            const a: Array<string> = playerData.get(xuid);
            if (a.indexOf(this.orgdata.uuid) === -1) {
                a.push(this.orgdata.uuid);
                playerData.set(xuid, a);
            }
            return true;
        }
        return false;
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
                const a = playerData.get(xuid);
                if (a.indexOf(this.orgdata.uuid) !== -1) {
                    a.splice(a.indexOf(this.orgdata.uuid), 1);
                    playerData.set(xuid, a);
                }
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

    /** 添加申请成员
     * @param player 添加的玩家
     */
    addApplyList(player: orgMember) {
        this.orgdata.applyList.push(player);
        this.updateData();
        return this.orgdata.applyList.indexOf(player) !== -1;
    }
}

