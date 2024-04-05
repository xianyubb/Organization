import { Organization } from "./DataList"

export const OrgDB = new KVDatabase("./plugins/Organization/Data/org")

export const PlayerDB = new KVDatabase("./plugins/Organization/Data/player")


/**
 * 读取Org数据库
 * @param key 键
 * @returns 异步读取
 */
export function ReadOrgDB(key: string) {
    return new Promise((resolve: (value: Organization | null) => void, reject: (reason: Error) => void) => {
        const db = OrgDB.get(key)
        if (db) resolve(db)
        else {
            logger.error("未读取到数据")
            reject(new Error("未读取到数据"));
        }
    })
}

/**
 * 写入Org数据库
 * @param key 键
 * @param value 值
 * @returns 是否成功写入
 */
export function WriteOrgDB(key: string, value: Organization) {
    return new Promise((resolve: (value: boolean) => void, reject: (reason: Error) => void) => {
        const reason: boolean = OrgDB.set(key, value);
        if (reason) resolve(reason)
        else {
            logger.error("数据库写入失败")
            reject(new Error("数据库写入失败"));
        }
    })
}

/**
 * 删除Org数据项
 * @param key 键
 * @returns 是否成功删除
 */
export function DeleteOrgDB(key: string) {
    return new Promise((resolve: (value: boolean) => void, reject: (reason: Error) => void) => {
        const reason: boolean = OrgDB.delete(key);
        if (reason) resolve(reason)
        else {
            logger.error("数据库删除失败")
            reject(new Error("数据库删除失败"));
        }
    })
}


/**
 * 读取Player数据库
 * @param key 键
 * @returns 异步读取
 */
export function ReadPlayerDB(key: string) {
    return new Promise((resolve: (value: string | null) => void, reject: (reason: Error) => void) => {
        const db = PlayerDB.get(key)
        if (db) resolve(db)
        else {
            logger.error("未读取到数据")
            reject(new Error("未读取到数据"));
        }
    })
}

/**
 * 写入Player数据库
 * @param key 键
 * @param value 值
 * @returns 是否成功写入
 */
export function WritePlayerDB(key: string, value: string) {
    return new Promise((resolve: (value: boolean) => void, reject: (reason: Error) => void) => {
        const reason: boolean = PlayerDB.set(key, value);
        if (reason) resolve(reason)
        else {
            logger.error("数据库写入失败")
            reject(new Error("数据库写入失败"));
        }
    })
}

/**
 * 删除Player数据项
 * @param key 键
 * @returns 是否成功删除
 */
export function DeletePlayerDB(key: string) {
    return new Promise((resolve: (value: boolean) => void, reject: (reason: Error) => void) => {
        const reason: boolean = PlayerDB.delete(key);
        if (reason) resolve(reason)
        else {
            logger.error("数据库删除失败")
            reject(new Error("数据库删除失败"));
        }
    })
}

/**
 * 检查玩家是否在工会中
 * @param player 检测玩家
 * @returns 
 */
export function CheckPlayerOrg(player: Player) {
    return new Promise((resolve: (value: boolean) => void) => {
        const db = PlayerDB.get(player.realName)
        if (db) resolve(true)
        else resolve(false)
    })
}