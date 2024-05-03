import *as fs from 'fs';
import { path } from "../..";
import { orgData } from './orgData';


function updateData(orgdata: Array<orgData>) {
    fs.writeFileSync(`${path}/orgData.json`, JSON.stringify(orgdata));
}


export class HandleData {
    private data: Array<orgData>;

    constructor() {
        this.data = JSON.parse(fs.readFileSync(`${path}/orgData.json`).toString());
    }

    /** 获取公会数 */
    get orgNum() {
        return this.data.length;
    }

    /** 是否有公会 */
    get isclear() {
        if (this.data.length) return true;
        return false;
    }

    /** 清除所有公会 */
    clear() {
        this.data = [];
        fs.writeFileSync(`${path}/orgData.json`, JSON.stringify(this.data));
    }

    /**
     * uuid获取目标公会
     * @param uuid 公会uuid
     * @returns 获取成功返回公会数据 失败则返回null
     */
    getOrgData(uuid: string) {
        let org: orgData | null = null;
        this.data.find((_org: orgData) => {
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
    getOrgDataIndex(uuid: string) {
        let index: number = -1;
        this.data.find((_org: orgData, _index: number) => {
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
    updateOrgData(orgdata: orgData) {
        this.data.find((_org: orgData, index: number) => {
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
    deleteOrg(uuid: string) {
        this.data.splice(this.getOrgDataIndex(uuid), 1);
        updateData(this.data);
    }

    /** 
     * 公会名列表
     */
    get nameList() {
        return this.data.map((_org: orgData) => _org.name);
    }

    /**
     * 添加公会至文件
     */
    addOrg(orgdata: orgData) {
        this.data.push(orgdata);
        updateData(this.data);
    }
}


