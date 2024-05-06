"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerData = void 0;
const __1 = require("../..");
exports.playerData = new JsonConfigFile(`.//plugins/${__1.PLUGIN_NAME}//playerData.json`);
mc.listen("onJoin", (player) => {
    exports.playerData.init(player.xuid, []);
});
