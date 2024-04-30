import { Conf } from "../Config/config";

function RegCommand() {
    const cmd = mc.newCommand("organization", i18n.get("Command_Description", Conf.language), PermType.Any);
    cmd.setAlias("ori");
    cmd.setEnum("list", ["list"]);
    cmd.mandatory("List", ParamType.Enum, "list", 1);
    cmd.overload(["List"]);
    cmd.setCallback(() => { });
    cmd.setup();
}

mc.listen("onServerStarted", () => {
    RegCommand();
});