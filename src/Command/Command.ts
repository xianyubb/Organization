import { Conf } from "../Config/config";
import { isHasOrg } from "../Form/Forms";
import { XYSignal } from "../i18n/signal";

function RegCommand() {
    const cmd = mc.newCommand("organization", i18n.get("Command_Description", Conf.language), PermType.Any);
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
    cmd.overload([]);               // form
    cmd.setCallback((_cmd, ori, _out, result) => {
        if (!ori.player) _out.error(XYSignal("ConsoleCmd", Conf.language));
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
                    isHasOrg(ori.player);
                    break;
                }
        }
    });
    cmd.setup();
}

mc.listen("onServerStarted", () => {
    RegCommand();
});