// LiteLoader-AIDS automatic generated
/// <reference path="d:\Dev\Xianyubb-Dev/dts/helperlib/src/index.d.ts"/>


const manifest = require("./manifest.json");


export const PLUGIN_NAME = manifest.name;

console.log(PLUGIN_NAME)

require("./src/Data/KVDB");
require("./src/Body/main");
require("./src/Command/Command");
require("./src/Config/Config");

