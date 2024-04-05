


export enum Permissions {
    // 工会管理员
    Admin = 0,
    // 工会成员
    Menber = 1,
    // 所属者
    Creater = 2
}

export enum OrgLevel {
    // 一级工会
    v1 = 0,
    // 二级工会
    v2 = 1,
    // 三级工会
    v3 = 2
}

export type PlayerData = {
    // 玩家名
    "RealName": string;
    // 玩家Xuid
    "Xuid": string;
    // 玩家权限
    "Permissions": Permissions
    // 玩家加入时间
    "JoinTime": string
}

type TransferPoint = {
    // 传送点名称
    "Name": string;
    // 传送点坐标
    "Position": [number, number, number, number]
    // 传送所需金额
    "Amount": number
}

// Organization data

export type OrganizationData = {
    // 工会总金额
    "Money": number
    // 工会传送点
    "TransferPoint": Array<TransferPoint>;

}

export type Organization = {
    // 工会名
    "Name": string,
    // 工会UUID 用于玩家进入工会
    "UUID": string,
    // 工会创建时间
    "CreateTime": string
    // 工会等级
    "Level": OrgLevel
    // 工会成员列表
    "Players": Array<PlayerData>
    // 工会申请列表
    "ApplyPlayer": Array<PlayerData>
    // 工会所属者
    "Owner": PlayerData;
    // 工会数据
    "Data": OrganizationData
}


