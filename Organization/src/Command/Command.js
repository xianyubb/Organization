"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../Config/config");
const Forms_1 = require("../Form/Forms");
const signal_1 = require("../i18n/signal");
function RegCommand() {
    const cmd = mc.newCommand("organization", i18n.get("Command_Description", config_1.Conf.language), PermType.Any);
    cmd.setAlias("org");
    // cmd.mandatory("uuid", ParamType.String);
    // cmd.setEnum("list", ["list"]);
    // cmd.mandatory("action", ParamType.Enum, "list", 1);
    // cmd.setEnum("join", ["join"]);
    // cmd.mandatory("action", ParamType.Enum, "join", 1);
    // cmd.setEnum("quit", ["quit"]);
    // cmd.mandatory("action", ParamType.Enum, "quit", 1);
    // cmd.overload(["quit", "uuid"]);    // quit
    // cmd.overload(["join", "uuid"]);   // join
    // cmd.overload(["list"]);          // list
    cmd.overload([]); // form
    cmd.setCallback((_cmd, ori, _out, result) => {
        if (!ori.player)
            _out.error((0, signal_1.XYSignal)("ConsoleCmd", config_1.Conf.language));
        // const { uuid } = result;
        switch (result.action) {
            case "list":
                {
                    // TODO list
                    break;
                }
            case "join":
                {
                    // TODO join
                    break;
                }
            case "quit":
                {
                    // TODO quit 
                    break;
                }
            default:
                {
                    (0, Forms_1.isHasOrg)(ori.player);
                    break;
                }
        }
    });
    cmd.setup();
}
mc.listen("onServerStarted", () => {
    RegCommand();
});
