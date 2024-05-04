

// LiteLoader-AIDS automatic generated
/// <reference path="./HelperLib/src/index.d.ts"/>




const manifest = require("./manifest.json");

export const PLUGIN_NAME = manifest.name;

export const path = `./plugins/${PLUGIN_NAME}//Data/`;


mc.listen("onServerStarted", () => {
    require("./src/Config/config");
    require('./src/Data/playerData');
    require('./src/Data/handleData');
    require('./src/Data/orgData');
    require("./src/Command/Command");
    require('./src/i18n/i18n');

}
);

