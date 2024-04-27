import *as fs from 'fs';
import { path } from "../..";
import { orgData } from './orgData';



export class HandleData {
    data: Array<orgData>;

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
            if (org.uuid === uuid) {
                org = _org;
                return true;
            }
            return false;
        }, {});
        return org;
    }

}
