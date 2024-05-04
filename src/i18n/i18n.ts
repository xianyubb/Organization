import { PLUGIN_NAME } from "../..";


const lang = {
    "zh_cn": {
        "Command_Description": "公会系统",
        "Organization": "公会",
        "PLayer_Call_List": "当前有 {0} 个公会 分别是 {1}.",
        "NoFindOrg": "没有找到这个公会.",
        "Error": "出现错误，请让服主联系作者.",
        "QuitOrgSuccess": "成功退出公会!",
        "QuitOrgFailed": "成功退出公会!",
        "ApplyJoinOrgSuccess": "成功申请加入公会!",
        "CreateOrgSuccess": "成功创建公会!",
        "DeleteOrgSuccess": "成功删除公会!",
        "PermissionsNotEnough": "权限不足，无法操作!!!",
        "EconomicTypeCouldNotBeFound": "未能找到相应的经济类型",
        "AddMoneyFailure": "经济增加失败",
        "AddMoneySuccess": "经济增加成功,增加了 {0}",
        "ReduceMoneyFailure": "经济减少失败",
        "ReduceMoneySuccess": "经济减少成功,减少了 {0}",
        "FirstFormTitle": "首页",
        "FirstFormContent": "请选择接下来的操作...",
        "CreateOrg": "创建公会",
        "JoinOrg": "加入公会",
        "CreateFormTitle": "创建公会",
        "CreateFormContent": "请按提示操作...",
        "CreateOrgInputDescription": "输入公会名称",
        "JoinFormTitle": "加入公会",
        "JoinFormContent": "请按提示操作...",
        "JoinOrgInputDescription": "输入加入公会的uuid",
        "ManagerFormTitle": "管理公会",
        "ManagerFormContent": "公会uuid: {0}",
        "GoTOMainPosition": "前往总部",
        "GoTOMainPositionSuccess": "成功前往总部",
        "GoTOMainPositionFailed": "前往总部失败",
        "QuitOrg": "退出公会",
        "TransPoints": "传送锚点",
        "TransPointSuccess": "成功传送到此锚点",
        "TransPointFailed": "传送到此锚点失败",
        "Cpf": "公积金",
        "OrgSettings": "公会设置",
        "TransPointFormTitle": "传送锚点",
        "TransPointFormContent": "选择要传送的锚点",
        "CloseForm": "关闭了表单...",
        "QuitOrgFormTitle": "退出公会",
        "QuitOrgFormContent": "是否要退出该公会?若您为公会创建者,将直接解散公会",
        "QuitOrgFormButton1": "确定",
        "QuitOrgFormButton2": "取消",
        "CpfFormTitle": "公积金",
        "CpfFormContent": "正数为添加公积金,负数为取出公积金",
        "CpfFormDescription": "输入数目 范围-100000 - 100000",
        "CpfFormInputDescription": "当前公积金 {0}",
        "CpfFormInputOverMax": "超出范围,没有效果哦",
        "CpfFormInputNotEnough": "公积金或者你的钱不够哦",
        "OrgListTitle": "公会列表",
        "OrgListContent": "请选择要操作的公会...",
        "RenameOrgFormTitle": "重命名公会",
        "RenameOrgFormContent": "请按提示操作...",
        "RenameOrgInputDescription": "请输入新公会名",
        "RenameOrgFailed": "更改失败!",
        "RenameOrgSuccess": "更改成功!",
        "ChangeLevelFormTitle": "更改玩家权限",
        "ChangeLevelDropdown": "请选择要更改的玩家...",
        "ChangeLevelFailed": "更改失败!",
        "ChangeLevelFormLevel": "请选择更改的权限...",
        "Member": "成员",
        "Manager": "管理员",
        "Owner": "公会拥有者",
        "ChangeLevelSuccess": "更改玩家权限成功!",
        "ManageMemberFormTitle": "管理玩家",
        "ManageMemberFormContent": "请选择要进行操作的玩家...",
        "ManageMemberFormContent2": "请选择接下来的操作...",
        "KickMember": "踢出公会",
        "KickMemberSuccess": "踢出公会成功!",
        "KickMemberFailed": "踢出公会失败!",
        "AddTransPointsFormTitle": "添加传送点",
        "AddTransPointsFormTips": "请输入[x,y,z,dimid]格式坐标,否则无法使用",
        "AddTransPointsFormName": "请输入传送点名称",
        "AddTransPointsFormContent": "请输入传送点坐标",
        "AddTransPointsFailed": "添加坐标失败!",
        "AddTransPointsSuccess": "添加坐标成功!",
        "TransPointsFormReduceOrEditTitle": "删除或修改传送点",
        "TransPointsFormReduceOrEditDropDown": "请选择传送点",
        "TransPointsFormReduceOrEditContent1": "关闭修改,打开删除",
        "TransPointsFormReduceOrEditContent2": "修改或者删除传送点",
        "ReduceTransPointSuccess": "删除传送点成功",
        "ReduceTransPointFailed": "删除传送点失败",
        "ChangeTransPointsFormTitle": "修改传送点",
        "ChangeTransPointsFormName": "请输入新传送点名称",
        "ChangeTransPointsFormTips": "请输入[x,y,z,dimid]格式坐标,否则无法使用",
        "ChangeTransPointsFormContent": "请输入新传送点坐标",
        "ChangeTransPointsSuccess": "修改传送点成功!",
        "ChangeTransPointsFailed": "修改传送点失败!",
        "ChangeMainPointsFormTitle": "修改总部坐标",
        "ChangeMainPointsFormName": "请输入总部名称",
        "ChangeMainPointsFormTips": "请输入[x,y,z,dimid]格式坐标,否则无法使用",
        "ChangeMainPointsFormContent": "请输入总部坐标",
        "ChangeMainPointsSuccess": "修改总部坐标成功!",
        "ChangeMainPointsFailed": "修改总部坐标失败!",
        "TransPointsManagerFormTitle": "管理传送点",
        "TransPointsManagerFormContent": "请选择接下来的操作",
        "AddTransPoints": "添加传送点",
        "ReduceTransPoints": "修改或删除传送点",
        "SetMainPoint": "修改总部坐标",
        "CheckApplyMemberFormTitle": "查看申请列表",
        "CheckApplyMemberTitle2": "申请处理",
        "CheckApplyMemberFormContent": "请选择要处理的玩家",
        "CheckApplyMemberContent": "是否同意此玩家加入公会",
        "CheckApplyMemberAgree": "同意",
        "CheckApplyMemberDisAgree": "拒绝",
        "AllowMemberJoinSuccess": "同意玩家进入公会成功",
        "AllowMemberJoinFailed": "同意玩家进入公会失败",
        "ChangeOwnerFormTitle": "更改公会主人",
        "TransferOrgSuccess": "更改成功",
        "TransferOrgFailed": "更改失败",
        "SettingFormTitle": "公会设置",
        "RenameOrg": "重命名公会",
        "SetMemberPermissions": "设置玩家权限",
        "ManageMember": "管理玩家",
        "TransPointsManager": "管理传送点",
        "CheckApplyMember": "查看申请列表",
        "ChangeOwner": "修改公会主人",
        "ChangeOwnerFormContent": "请选择继承人",
        "SettingFormContent": "请选择接下来的操作..."
    },
    "en_us": {
        "Command_Description": "Organization System",
        "Organization": "Organization"
    }
};

i18n.load(`.//plugins//${PLUGIN_NAME}//lang/lang.json`, "zh_cn", lang);

