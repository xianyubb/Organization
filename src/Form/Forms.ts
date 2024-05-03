import { Organization } from "../Body/Org";
import { applyJoinOrg, createOrg, deleteOrg, quitOrg } from "../Body/handlePlayer";
import { Conf } from "../Config/config";
import { HandleData } from "../Data/handleData";
import { transPoints } from "../Data/orgData";
import { playerData } from "../Data/playerData";
import { addmoney, reduceMoney } from "../Economic/Economic";
import { LeveltoString, playerLevel } from "../Enum/orgEnum";
import { XYSignal, XYMessage } from "../i18n/signal";
import { XYCustomForm } from "./FormHelper/CustomForm";
import { XYSimpleForm } from "./FormHelper/SimpleForm";

const lang = Conf.language;

/** 传送点表单
 * @param player 
 * @param TransPoint 
 */
function TransPointForm(player: Player, TransPoint: Array<transPoints>) {
    const Form = new XYSimpleForm(XYSignal("TransPointFormTitle", lang), XYMessage("TransPointFormContent", lang), player);
    TransPoint.forEach((transPoint) => {
        Form.addButton(transPoint.name, (pl: Player) => {
            const pos = new IntPos(transPoint.pos[0], transPoint.pos[1], transPoint.pos[2], transPoint.pos[3]);
            if (pl.teleport(pos)) {
                pl.tell(XYMessage("TransPointSuccess", lang));
            }
            else pl.tell(XYMessage("TransPointFailed", lang));
        });
    });
    Form.send();
};

/**
 * 管理公会表单
 * @param player 
 */
export function ManagerForm(player: Player, uuid: string) {
    const data = new HandleData();
    const orgdata = data.getOrgData(uuid);
    const org = new Organization(orgdata);

    /**
     * 退出公会表单
     * @param player 退出的玩家 
     */
    function QuitOrgForm(_player: Player) {
        _player.sendModalForm(XYSignal("QuitOrgFormTitle", lang),
            XYSignal("QuitOrgFormContent", lang),
            XYSignal("QuitOrgFormButton1", lang),
            XYSignal("QuitOrgFormButton2", lang),
            (pl: Player, result: boolean | null) => {
                if (!result) pl.tell(XYMessage("CloseForm"));
                if (result === true) {
                    if (org.findPlayerData(pl.xuid).level === playerLevel.Owner) {
                        deleteOrg(pl, orgdata.uuid);
                    } else
                        quitOrg(pl, orgdata.uuid);
                };
            }
        );
    }

    /**
     * 公会公积金表单
     * @param player 
     */
    function CpfForm(_player: Player) {
        const Form = new XYCustomForm(XYSignal("CpfFormTitle"), player);
        Form.addLabel(XYSignal("CpfFormContent", lang), () => { });
        if (org.findPlayerData(_player.xuid).level >= orgdata.manager.getCpfLevel) {
            Form.addLabel(XYSignal("CpfFormDescription", lang), () => { });
            Form.addInput(XYSignal("CpfFormInputDescription", lang, orgdata.manager.cpf), (datas: string, pl: Player) => {
                let mount = Math.floor(parseFloat(datas));
                if (mount > 100000
                    || mount < -100000) {
                    pl.tell(XYMessage("CpfFormInputOverMax", lang));
                    return;
                }
                if (mount >= 0) {
                    if (reduceMoney(pl, mount)) {
                        org.addCpf(mount);
                    }
                    else pl.tell(XYMessage("CpfFormInputNotEnough", lang));
                } else if (mount < 0) {
                    mount = Math.abs(mount);
                    if (orgdata.manager.cpf < mount) {
                        pl.tell(XYMessage("CpfFormInputNotEnough", lang));
                        return;
                    }
                    if (addmoney(pl, mount)) {
                        org.reduceCpf(mount);
                    } else {
                        pl.tell(XYMessage("CpfFormInputNotEnough", lang));
                    }
                }
            }, "-100000--100000", "0");
        }
        Form.send();
    }


    const Form = new XYSimpleForm(XYSignal("ManagerFormTitle", lang), XYSignal("ManagerFormContent", lang), player);
    Form.addButton(XYSignal("GoTOMainPosition", lang), (pl: Player) => {
        const main = orgdata.manager.mainPosition.pos;
        const pos = new IntPos(main[0], main[1], main[2], main[3]);
        const { level } = orgdata;
        if (pl.teleport(pos)) {
            reduceMoney(pl, Conf[LeveltoString(level)].TransMoney);
            pl.tell(XYMessage("GoTOMainPositionSuccess", lang));
        }
        else pl.tell(XYMessage("GoTOMainPositionFailed", lang));
    })
        .addButton(XYSignal("TransPoints", lang), (pl: Player) => {
            TransPointForm(pl, orgdata.manager.transPoints);
        })
        .addButton(XYSignal("Cpf", lang), (pl: Player) => {
            CpfForm(pl);
        })
        .addButton(XYSignal("QuitOrg", lang), (pl: Player) => {
            QuitOrgForm(pl);
        })
        .addButton(XYSignal("OrgSettings", lang), (pl: Player) => {
            const orgPl = org.findPlayerData(pl.xuid);
            if (orgPl.level >= playerLevel.Manager) {
                // TODO: setting form
            } else {
                pl.tell(XYMessage("PermissionsNotEnough", lang));
            }
        })
        .send();
}


/**
 * 创建公会表单
 * @param player 
 */
export function CreateForm(player: Player) {
    const Form = new XYCustomForm(XYSignal("CreateFormTitle", lang), player);
    Form.addLabel(XYSignal("CreateFormContent", lang), () => {
    }).addInput(XYSignal("CreateOrgInputDescription", lang), (data: string, pl: Player) => {
        data = data.toString();
        createOrg(pl, data);
        // TODO Jump to Manager Form
    }, "Organ", "Organ")
        .send();
}

/**
 * 加入公会表单
 * @param player 
 */

export function JoinForm(player: Player) {
    const Form = new XYCustomForm(XYSignal("JoinFormTitle", lang), player);
    Form.addLabel(XYSignal("JoinFormContent", lang), () => {
    }).addInput(XYSignal("JoinOrgInputDescription", lang), (data: string, pl: Player) => {
        data = data.toString();
        applyJoinOrg(pl, data);
    }, "Organ", "Organ")
        .send();
}


/**
 * 初级表单
 * @param player 
 */
export function FirstForm(player: Player) {
    const Form = new XYSimpleForm(XYSignal("FirstFormTitle", lang), XYSignal("FirstFormContent", lang), player);
    Form.addButton(XYSignal("CreateOrg", lang), (pl: Player) => {
        if (Conf.allowCreate) {
            CreateForm(pl);
        } else if (pl.permLevel >= 1) {
            CreateForm(pl);
        } else {
            pl.tell(XYMessage("PermissionsNotEnough", lang));
        }
    }).
        addButton(XYSignal("JoinOrg", lang), (pl: Player) => {
            JoinForm(pl);
        })
        .send();
}

/**
 * 判断玩家是否有公会 如果有则发送选择管理的公会表单 如果没有则发送 First form
 * @param player 
 */
export function isHasOrg(player: Player) {
    const data = new HandleData();
    const playerOrgList: Array<string> = playerData.get(player.xuid);
    if (playerOrgList.length > 0) {
        const Form = new XYSimpleForm(XYSignal("OrgListTitle", lang), XYSignal("OrgListContent", lang), player);
        playerOrgList.forEach((uuid) => {
            const orgdata = data.getOrgData(uuid);
            Form.addButton(orgdata.name, (pl: Player) => {
                ManagerForm(pl, orgdata.uuid);
            });
        });
        Form.send();
        return;
    }
    FirstForm(player);
}

