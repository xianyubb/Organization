import { PLUGIN_NAME } from "../..";


const lang = {
    zh_cn: {
        "Command_Description": "公会系统"
    },
    "en_us": {
        "Command_Description": "Organization System"
    }
};

i18n.load(`.//plugins//${PLUGIN_NAME}//lang/lang.json`, "zh_cn", lang);