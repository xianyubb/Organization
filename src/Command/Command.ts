import { ApplyJoinOrg, CreateOrg, DeleteOrg, LeaveOrg } from "../Body/main";
import { PlayerCanCreate } from "../Config/Config";

mc.listen("onServerStarted", () => {
    const Cmd = mc.newCommand("organization", "工会面板", PermType.Any);
    Cmd.setAlias("org")
    Cmd.overload([])
    Cmd.setEnum("create", ["create", "delete"]);
    Cmd.mandatory("Action", ParamType.Enum, "create")
    Cmd.mandatory("Name", ParamType.String)
    Cmd.overload(["create", "Name"]);
    Cmd.setEnum("join", ["join"]);
    Cmd.mandatory("Action", ParamType.Enum, "join")
    Cmd.mandatory("UUID", ParamType.String)
    Cmd.overload(["join", "Name", "UUID"])
    Cmd.setEnum("leave", ["leave"]);
    Cmd.mandatory("Action", ParamType.Enum, "leave")
    Cmd.overload(["leave"]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Cmd.setCallback((_cmd, _ori, out, res) => {
        if (!_ori.player) return;
        const { player } = _ori;
        switch (res.Action) {
            case "create": {
                if (PlayerCanCreate) {
                    // TODO: 经济
                    CreateOrg(res.Name, player);
                }
                break;
            }
            case "join": {
                ApplyJoinOrg(res.Name, res.UUID, player);
                break;
            }
            case "leave": {
                LeaveOrg(player);
                break;
            }
            case "delete": {
                DeleteOrg(res.Name, player);
                break;
            }
            default: {
                // TODO : GUI
                break;
            }
        }

    })
    Cmd.setup();
})