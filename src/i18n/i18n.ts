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
        "AddMoneySuccess": "经济增加成功",
        "ReduceMoneyFailure": "经济减少失败",
        "ReduceMoneySuccess": "经济减少成功",
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
        "ManagerFormContent": "请按提示操作...",
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
        "CpfFormInputDescription":"当前公积金 {0}",
        "CpfFormInputOverMax": "超出范围,没有效果哦",
        "CpfFormInputNotEnough": "公积金或者你的钱不够哦"

    },
    "en_us": {
        "Command_Description": "Organization System",
        "Organization": "Organization"
    }
};

i18n.load(`.//plugins//${PLUGIN_NAME}//lang/lang.json`, "zh_cn", lang);

