
import { PlayerCanCreate } from "../Config/Config";
import { CheckPlayerOrg } from "../Data/KVDB";
import { XYSimpleForm } from "../FormAPI/SimpleForm"

// 主菜单
export function MainForm(Player: Player) {
    const form = new XYSimpleForm("工会主菜单", "请选择接下来的操作...", Player);
    if (PlayerCanCreate) form.addButton("创建工会", (player: Player) => {
        // TODO create org form
    })
    else if (Player.permLevel >= 1) {
        form.addButton("创建工会", async (player: Player) => {
            // TODO create org form
            if (await CheckPlayerOrg(player)) {
                player.tell("你已是工会成员，无法创建工会！");
            }
        })
    }
    form.addButton("申请加入工会", async (player: Player) => {
    // TODO join org form
        if (await CheckPlayerOrg(player)) {
            player.tell("你已是工会成员，无法再次加入工会！");
        }
    }).addButton("退出工会", async (player: Player) => {
        if (!await CheckPlayerOrg(player)) {
            player.tell("你不是工会成员，无法退出工会！");
        }
        // TODO leave org form
    }).addButton("工会列表", (player: Player) => {
        // TODO view org form

    }).addButton("我的工会", async (player: Player) => {
        // TODO view org form
        if (!await CheckPlayerOrg(player)) {
            player.tell("你不是工会成员，无法查看工会！");
        }
    })


}