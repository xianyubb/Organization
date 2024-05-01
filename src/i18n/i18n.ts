import { PLUGIN_NAME } from "../..";


const lang = {
    zh_cn: {
        "Command_Description": "公会系统",
        "Organization": "公会",
        "PLayer_Call_List": "当前有 {0} 个公会 分别是 {1}.",
        "NoFindOrg": "没有找到这个公会.",
        "Error": "出现错误，请让服主联系作者.",
        "QuitOrg": "成功退出公会!",
        "ApplyJoinOrg": "成功申请加入公会!",
        "DeleteOrg_Success": "成功删除公会!",
        "PermissionsNotEnough": "权限不足，无法操作!!!"
    },
    "en_us": {
        "Command_Description": "Organization System",
        "Organization": "Organization"
    }
};

i18n.load(`.//plugins//${PLUGIN_NAME}//lang/lang.json`, "zh_cn", lang);

