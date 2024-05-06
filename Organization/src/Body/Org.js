"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organization = void 0;
const config_1 = require("../Config/config");
const handleData_1 = require("../Data/handleData");
const playerData_1 = require("../Data/playerData");
const orgEnum_1 = require("../Enum/orgEnum");
class Organization {
    constructor(org) {
        this.orgdata = org;
        this.handleData = new handleData_1.HandleData();
    }
    /** 公会名 */
    get name() {
        return this.orgdata.name;
    }
    /** 公会ID */
    get uuid() {
        return this.orgdata.uuid;
    }
    /** 公会等级 */
    get level() {
        return this.orgdata.level;
    }
    /** 公会成员 */
    get members() {
        return this.orgdata.members;
    }
    /** 公会创建的日期 */
    get time() {
        return this.orgdata.time;
    }
    /** 公会管理项 */
    get manager() {
        return this.orgdata.manager;
    }
    /** 申请列表 */
    get applyList() {
        return this.orgdata.applyList;
    }
    /** 公会公积金 */
    get cpf() {
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
    findPlayer(xuid) {
        this.updateData();
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
    findPlayerData(xuid) {
        let i = 0;
        for (i = 0; i < this.members.length; i += 1) {
            if (this.members[i].xuid === xuid) {
                return this.members[i];
            }
        }
        return null;
    }
    /**
     * 通过Name查找公会中的人
     * @param name name
     * @return
     */
    findPlayerDataWithName(name) {
        let i = 0;
        for (i = 0; i < this.members.length; i += 1) {
            if (this.members[i].name === name) {
                return this.members[i];
            }
        }
        return null;
    }
    getLevel() {
        let level = "Normal";
        switch (this.orgdata.level) {
            case orgEnum_1.orgLevel.Normal:
                level = "Normal";
                break;
            case orgEnum_1.orgLevel.Middle:
                level = "Middle";
                break;
            case orgEnum_1.orgLevel.High:
                level = "High";
                break;
            default: { /* empty */ }
        }
        return level;
    }
    /**
     * 允许玩家加入公会
     * @param xuid 需要加入的玩家的xuid
     * @returns 是否成功加入
     */
    allowMemberJoin(xuid) {
        let i = 0;
        let orgmenber;
        for (i = 0; i < this.applyList.length; i += 1) {
            if (this.applyList[i].xuid === xuid) {
                if (this.members.indexOf(this.members[i]) === -1)
                    return false;
                if (this.orgdata.members.length >= config_1.Conf[this.getLevel()].maxPlayer) {
                    return false;
                }
                this.members.push(this.applyList[i]);
                orgmenber = this.applyList.splice(i, 1);
                break;
            }
        }
        this.updateData();
        if (this.members.indexOf(orgmenber[0]) !== -1) {
            const a = playerData_1.playerData.get(xuid);
            if (a.indexOf(this.orgdata.uuid) === -1) {
                a.push(this.orgdata.uuid);
                playerData_1.playerData.set(xuid, a);
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
    kickMember(xuid) {
        let i = 0;
        let orgmenber;
        for (i = 0; i < this.members.length; i += 1) {
            if (this.members[i].xuid === xuid) {
                orgmenber = this.members.splice(i, 1);
                const a = playerData_1.playerData.get(xuid);
                if (a.indexOf(this.orgdata.uuid) !== -1) {
                    a.splice(a.indexOf(this.orgdata.uuid), 1);
                    playerData_1.playerData.set(xuid, a);
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
    updateMemberLevel(xuid, level) {
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
    transferOrg(xuid1, xuid2) {
        this.members.at(this.findPlayer(xuid1)).level = orgEnum_1.playerLevel.Member;
        this.members.at(this.findPlayer(xuid2)).level = orgEnum_1.playerLevel.Owner;
        this.updateData();
        return this.members.at(this.findPlayer(xuid2)).level === orgEnum_1.playerLevel.Owner;
    }
    /**
     * 修改公会名称
     * @param name
     * @returns 是否更改成功
     */
    changeName(name) {
        this.orgdata.name = name;
        this.updateData();
        return this.orgdata.name === name;
    }
    /**
     * 更改公会等级
     * @param level
     * @returns 是否更改成功
     */
    changeLevel(level) {
        this.orgdata.level = level;
        this.updateData();
        return this.orgdata.level === level;
    }
    /**
     * 增加一个传送点
     * @param tanspoints 传送点
     * @returns 是否成功添加
     */
    addTransPoint(tanspoints) {
        this.orgdata.manager.transPoints.push(tanspoints);
        this.updateData();
        return this.orgdata.manager.transPoints.indexOf(tanspoints) !== -1;
    }
    /**
     * 删除一个传送点
     * @param tanspoints 传送点名
     * @returns 是否成功删除
     */
    reduceTransPoint(tanspoints) {
        let point = null;
        this.orgdata.manager.transPoints.find((trans) => {
            if (trans.name === tanspoints) {
                point = trans;
                this.orgdata.manager.transPoints.splice(this.orgdata.manager.transPoints.indexOf(trans), 1);
                return true;
            }
            return false;
        });
        this.updateData();
        return this.orgdata.manager.transPoints.indexOf(point) === -1;
    }
    /**
     * 修改传送点
     * @param tanspoints 传送点名
     */
    changeTransPoint(tanspoints, newtranspoint) {
        this.orgdata.manager.transPoints.find((trans, index) => {
            if (trans.name === tanspoints) {
                trans = newtranspoint;
                this.orgdata.manager.transPoints[index] = newtranspoint;
                return true;
            }
            return false;
        });
        this.updateData();
        return this.orgdata.manager.transPoints.indexOf(newtranspoint) !== -1;
    }
    /**
     * 设置总部
     * @param mainPoint 总部信息
     */
    setMainPoint(mainPoint) {
        this.orgdata.manager.mainPosition = mainPoint;
        this.updateData();
        return this.orgdata.manager.mainPosition === mainPoint;
    }
    /**
     * 增加公会公积金
     * @param cpf 增加的公积金
     * @returns 是否增加成功
     */
    addCpf(cpf) {
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
    reduceCpf(cpf) {
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
    changeCpfLevel(level) {
        this.orgdata.manager.getCpfLevel = level;
        this.updateData();
        return this.orgdata.manager.getCpfLevel === level;
    }
    /** 添加申请成员
     * @param player 添加的玩家
     */
    addApplyList(player) {
        this.orgdata.applyList.push(player);
        this.updateData();
        return this.orgdata.applyList.indexOf(player) !== -1;
    }
    /**
     * 修改玩家等级
     */
    changePlayerLevel(xuid, level) {
        this.members.at(this.findPlayer(xuid)).level = level;
        this.updateData();
        return this.members.at(this.findPlayer(xuid)).level === level;
    }
}
exports.Organization = Organization;
