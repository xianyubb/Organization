"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleData = void 0;
const fs = require("fs");
const __1 = require("../..");
function updateData(orgdata) {
    fs.writeFileSync(`${__1.path}/orgData.json`, JSON.stringify(orgdata));
}
class HandleData {
    constructor() {
        this.data = JSON.parse(fs.readFileSync(`${__1.path}/orgData.json`).toString());
    }
    /** 获取公会数 */
    get orgNum() {
        return this.data.length;
    }
    /** 是否有公会 */
    get isclear() {
        if (this.data.length)
            return true;
        return false;
    }
    /** 清除所有公会 */
    clear() {
        this.data = [];
        fs.writeFileSync(`${__1.path}/orgData.json`, JSON.stringify(this.data));
    }
    /**
     * uuid获取目标公会
     * @param uuid 公会uuid
     * @returns 获取成功返回公会数据 失败则返回null
     */
    getOrgData(uuid) {
        let org = null;
        this.data.find((_org) => {
            if (_org.uuid === uuid) {
                org = _org;
                return true;
            }
            return false;
        });
        return org;
    }
    /**
    * uuid获取目标公会下标
    * @param uuid 公会uuid
    * @returns 获取成功返回公会下标 失败则返回-1
    */
    getOrgDataIndex(uuid) {
        let index = -1;
        this.data.find((_org, _index) => {
            if (_org.uuid === uuid) {
                index = _index;
                return true;
            }
            return false;
        });
        return index;
    }
    /**
     * 更新公会数据文件
     * @param orgdata 需要更新的公会
     */
    updateOrgData(orgdata) {
        this.data.find((_org, index) => {
            if (_org.uuid === orgdata.uuid) {
                this.data[index] = orgdata;
                return true;
            }
            return false;
        }, {});
        updateData(this.data);
    }
    /**
     * 删除公会
     * @param uuid 删除公会的uuid
     */
    deleteOrg(uuid) {
        this.data.splice(this.getOrgDataIndex(uuid), 1);
        updateData(this.data);
    }
    /**
     * 公会名列表
     */
    get nameList() {
        return this.data.map((_org) => _org.name);
    }
    /**
     * 添加公会至文件
     */
    addOrg(orgdata) {
        this.data.push(orgdata);
        updateData(this.data);
    }
}
exports.HandleData = HandleData;
