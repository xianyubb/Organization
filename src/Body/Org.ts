import { orgData, orgManager, orgMember } from "../Data/orgData";
import { orgLevel } from "../Enum/orgEnum";



export class Organization {
    data: orgData;

    constructor(org: orgData) {
        this.data = org;
    }

    /** 公会名 */
    get name(): string { 
        return this.data.name;
    }

    /** 公会ID */
    get uuid(): string {
        return this.data.uuid;
    }

    /** 公会等级 */
    get level(): orgLevel {
        return this.data.level;
    }
    
    /** 公会成员 */
    get members(): orgMember[] {
        return this.data.members;
    }

    /** 公会创建的日期 */
    get time(): string {
        return this.data.time;
    }
    
    /** 公会管理项 */
    get manager(): orgManager {
        return this.data.manager;
        
    }
    
    /** 申请列表 */
    get applyList(): orgMember[] {
        return this.data.applyList;
    }

}