import { PLUGIN_NAME } from "../..";

export const playerData = new JsonConfigFile(`.//plugins/${PLUGIN_NAME}//playerData.json`);

mc.listen("onJoin", (player) => {
    playerData.init(player.xuid, []);
});