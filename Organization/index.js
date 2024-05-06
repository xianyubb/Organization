"use strict";
// LiteLoader-AIDS automatic generated
/// <reference path="./HelperLib/src/index.d.ts"/>
Object.defineProperty(exports, "__esModule", { value: true });
exports.path = exports.PLUGIN_NAME = void 0;
const manifest = require("./manifest.json");
exports.PLUGIN_NAME = manifest.name;
exports.path = `./plugins/${exports.PLUGIN_NAME}//Data/`;
mc.listen("onServerStarted", () => {
    require("./src/Config/config");
    require('./src/Data/playerData');
    require('./src/Data/handleData');
    require('./src/Data/orgData');
    require("./src/Command/Command");
    require('./src/i18n/i18n');
});
