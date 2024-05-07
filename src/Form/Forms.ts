import { Organization } from "../Body/Org";
import { applyJoinOrg, createOrg, deleteOrg, quitOrg } from "../Body/handlePlayer";
import { Conf } from "../Config/config";
import { HandleData } from "../Data/handleData";
import { orgMember, transPoints } from "../Data/orgData";
import { playerData } from "../Data/playerData";
import { addmoney, reduceMoney } from "../Economic/Economic";
import { LeveltoString, orgLevel, playerLevel } from "../Enum/orgEnum";
import { XYSignal, XYMessage } from "../i18n/signal";
import { XYCustomForm } from "./FormHelper/CustomForm";
import { XYSimpleForm } from "./FormHelper/SimpleForm";

const lang = Conf.language;

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
 * 设置表单
 * @param player 打开设置的玩家
 * @param uuid 公会uuid
 */
function settingForm(player: Player, uuid: string) {
    const data = new HandleData();
    const orgdata = data.getOrgData(uuid);
    const org = new Organization(orgdata);
    if (org.findPlayerData(player.xuid).level < playerLevel.Manager) {
        player.tell(XYMessage("PermissionsNotEnough", lang));
        return;
    }

    /**
     * 重命名公会
     * @param _pl 玩家
     */
    function RenameOrgForm(_pl: Player) {
        const Form = new XYCustomForm(XYSignal("RenameOrgFormTitle", lang), _pl);
        Form.addLabel(XYSignal("RenameOrgFormContent", lang), () => { })
            .addInput(XYSignal("RenameOrgInputDescription", lang), (_data: any, pl: Player) => {
                if (!data) {
                    pl.tell(XYMessage("CloseForm", lang));
                    return;
                }
                if (typeof _data !== "string") _data = _data.toString();
                if (org.changeName(_data)) {
                    pl.tell(XYMessage("RenameOrgSuccess", lang));
                }
                else {
                    pl.tell(XYMessage("RenameOrgFailed", lang));
                }
            }, "Organ", "Organ")
            .send();
    }

    // /**
    //  * 更改公会内玩家权限
    //  * @param _pl 操作者
    //  * @returns 
    //  */
    // function ChangeLevelForm(_pl: Player) {
    //     if (org.findPlayerData(_pl.xuid).level !== playerLevel.Owner) {
    //         player.tell(XYMessage("PermissionsNotEnough", lang));
    //         return;
    //     }
    //     const Form = new XYCustomForm(XYSignal("ChangeLevelFormTitle", lang), _pl);
    //     const playerList: Array<string> = [];
    //     orgdata.members.forEach((orgmember) => {
    //         playerList.push(orgmember.name);
    //     });
    //     Form.addDropdown(XYSignal("ChangeLevelDropdown", lang), playerList, (_data: any, pl: Player) => {
    //         if (_data === null) {
    //             pl.tell(XYMessage("CloseForm", lang));
    //             return;
    //         }
    //         if (_data === -1) {
    //             pl.tell(XYMessage("ChangeLevelFailed", lang));
    //             return;
    //         }
    //         const orgmember = org.findPlayerData(orgdata.members[_data].xuid);
    //         if (!orgmember) {
    //             pl.tell(XYMessage("ChangeLevelFailed", lang));
    //         }
    //         const Form2 = new XYCustomForm(XYSignal("ChangeLevelFormTitle", lang), pl);
    //         Form2.addDropdown(XYSignal("ChangeLevelFormLevel", lang), [XYSignal("Member", lang), XYSignal("Manager", lang)], (_datas: any, pla: Player) => {
    //             if (_datas === null) {
    //                 pl.tell(XYMessage("ChangeLevelFailed", lang));
    //                 return;
    //             }
    //             if (_datas === 0) {
    //                 if (org.changePlayerLevel(orgdata.members[_data].xuid, playerLevel.Member)) {
    //                     pla.tell(XYMessage("ChangeLevelSuccess", lang));
    //                 }
    //                 else {
    //                     pla.tell(XYMessage("ChangeLevelFailed", lang));
    //                 }
    //             }
    //             else if (_datas === 1) {
    //                 if (
    //                     org.changePlayerLevel(orgdata.members[_data].xuid, playerLevel.Manager)) {
    //                     pla.tell(XYMessage("ChangeLevelSuccess", lang));
    //                 }
    //                 else {
    //                     pla.tell(XYMessage("ChangeLevelFailed", lang));
    //                 }
    //             }
    //         }, 0)
    //             .send();
    //     }, 0)
    //         .send();
    // }



    /**
     * 管理玩家表单
     * @param _pl 操作者
     */
    function ManageMemberForm(_pl: Player) {


        function funcList(pl: Player, orgmember: orgMember) {
            const Form = new XYSimpleForm(XYSignal("ManageMemberFormTitle", lang), XYSignal("ManageMemberFormContent2", lang), pl);
            Form.addButton(XYSignal("KickMember", lang), (_play: Player) => {
                if (orgmember.level === playerLevel.Owner) {
                    deleteOrg(_play, orgdata.uuid);
                    return;
                }
                if (org.kickMember(orgmember.xuid)) {
                    _play.tell(XYMessage("KickMemberSuccess", lang));
                } else {
                    _play.tell(XYMessage("KickMemberFailed", lang));
                }
            })
                .addButton(XYSignal("ManageMemberPermission", lang), (_play: Player) => {
                    const Form2 = new XYCustomForm(XYSignal("ChangeLevelFormTitle", lang), _play);
                    Form2.addDropdown(XYSignal("ChangeLevelFormLevel", lang), [XYSignal("Member", lang), XYSignal("Manager", lang)], (_datas: any, pla: Player) => {
                        if (_datas === null) {
                            pl.tell(XYMessage("ChangeLevelFailed", lang));
                            return;
                        }
                        if (_datas === 0) {
                            if (org.changePlayerLevel(orgmember.xuid, playerLevel.Member)) {
                                pla.tell(XYMessage("ChangeLevelSuccess", lang));
                            }
                            else {
                                pla.tell(XYMessage("ChangeLevelFailed", lang));
                            }
                        }
                        else if (_datas === 1) {
                            if (
                                org.changePlayerLevel(orgmember.xuid, playerLevel.Manager)) {
                                pla.tell(XYMessage("ChangeLevelSuccess", lang));
                            }
                            else {
                                pla.tell(XYMessage("ChangeLevelFailed", lang));
                            }
                        }
                    }, 0)
                        .send();
                });
            Form.send();
        }

        const Form = new XYSimpleForm(XYSignal("ManageMemberFormTitle", lang), XYSignal("ManageMemberFormContent", lang), _pl);
        // 逻辑
        // for owner 显示全部玩家
        // for manager 显示成员
        if (org.findPlayerData(_pl.xuid).level === playerLevel.Owner) {
            orgdata.members.forEach((orgmember) => {
                Form.addButton(orgmember.name, (_player: Player) => {
                    funcList(_player, orgmember);
                });
            });
            Form.send();
        } else if (org.findPlayerData(_pl.xuid).level === playerLevel.Manager) {
            orgdata.members.forEach((orgmember) => {
                if (orgmember.level === playerLevel.Member) {
                    Form.addButton(orgmember.name, (_player: Player) => {
                        funcList(_player, orgmember);
                    });
                }
            });
            Form.send();
        }
    }

    let level: "Normal" | "Middle" | "High" = "Normal";
    switch (orgdata.level) {
        case orgLevel.Normal:
            level = "Normal";
            break;
        case orgLevel.Middle:
            level = "Middle";
            break;
        case orgLevel.High:
            level = "High";
            break;
        default: { /* empty */ }
    }

    /**
     * 传送点管理表单
     */
    function TransPointsManagerForm(_pl: Player) {

        function AddTransPointsForm(_play: Player) {

            if (orgdata.manager.transPoints.length >= Conf[level].maxTransPoints) {
                _play.tell(XYMessage("OverMaxTransPoints", lang));
                return;
            }
            const Form = new XYCustomForm(XYSignal("AddTransPointsFormTitle", lang), _play);
            let name: string = "";
            Form.addInput(XYSignal("AddTransPointsFormName", lang), (datas, pl) => {
                if (datas === null) {
                    pl.tell(XYMessage("CloseForm", lang));
                    return;
                }
                name = datas;
            }, "point", "point")
                .addLabel(XYSignal("AddTransPointsFormTips", lang), () => { })
                .addInput(XYSignal("AddTransPointsFormContent", lang), (_data, pl) => {
                    if (_data === null) {
                        pl.tell(XYMessage("CloseForm", lang));
                        return;
                    }
                    if (_data === "") {
                        pl.tell(XYMessage("AddTransPointsFailed", lang));
                        return;
                    }
                    if (org.addTransPoint(
                        {
                            name,
                            pos: JSON.parse(_data)
                        }
                    )) {
                        pl.tell(XYMessage("AddTransPointsSuccess", lang));
                    } else {
                        pl.tell(XYMessage("AddTransPointsFailed", lang));
                    }
                }, "pos", "[0,0,0,0]")
                .send();
        }

        function TransPointsFormReduceOrEdit(_play: Player) {
            const Form = new XYCustomForm(XYSignal("TransPointsFormReduceOrEditTitle", lang), _play);
            const PointList = [];
            orgdata.manager.transPoints.forEach((transPoint) => {
                PointList.push(transPoint.name);
            });
            let node: number;
            Form.addDropdown(XYSignal("TransPointsFormReduceOrEditDropDown", lang), PointList, (_data: number, _player: Player) => {
                if (_data === null) {
                    _player.tell(XYMessage("CloseForm", lang));
                }
                node = _data;
            }, 0)
                .addLabel(XYSignal("TransPointsFormReduceOrEditContent1", lang), () => { })
                .addSwitch(XYSignal("TransPointsFormReduceOrEditContent2", lang), (datas: boolean, pl: Player) => {
                    if (datas === null) {
                        pl.tell(XYMessage("CloseForm", lang));
                        return;
                    }
                    if (datas === true) {
                        if (org.reduceTransPoint(PointList[node])) {
                            pl.tell(XYMessage("ReduceTransPointSuccess", lang));
                        } else {
                            pl.tell(XYMessage("ReduceTransPointFailed", lang));
                        }
                    } else {
                        const Form2 = new XYCustomForm(XYSignal("ChangeTransPointsFormTitle", lang), _play);
                        let name: string = "";
                        Form2
                            .addInput(XYSignal("ChangeTransPointsFormName", lang), (datas2, pl1) => {
                                if (datas2 === null) {
                                    pl1.tell(XYMessage("CloseForm", lang));
                                    return;
                                }
                                name = datas2;
                            }, "point", "point")
                            .addLabel(XYSignal("ChangeTransPointsFormTips", lang), () => { })
                            .addInput(XYSignal("ChangeTransPointsFormContent", lang), (_data, pl2) => {
                                if (_data === null) {
                                    pl2.tell(XYMessage("CloseForm", lang));
                                    return;
                                }
                                if (_data === "") {
                                    pl2.tell(XYMessage("ChangeTransPointsFailed", lang));
                                    return;
                                }
                                if (org.changeTransPoint(PointList[node], {
                                    name,
                                    pos: JSON.parse(_data)
                                })) {
                                    pl2.tell(XYMessage("ChangeTransPointsSuccess", lang));
                                } else {
                                    pl2.tell(XYMessage("ChangeTransPointsFailed", lang));
                                }
                            }, "pos", "[0,0,0,0]")
                            .send();
                    }
                }, false);
            Form.send();
        }
        function SetMainPointForm(_play: Player
        ) {
            const Form2 = new XYCustomForm(XYSignal("ChangeMainPointsFormTitle", lang), _play);
            let name: string = "";
            Form2.addInput(XYSignal("ChangeMainPointsFormName", lang), (datas2, pl1) => {
                if (datas2 === null) {
                    pl1.tell(XYMessage("CloseForm", lang));
                    return;
                }
                name = datas2;
            }, "point", "point")
                .addLabel(XYSignal("ChangeMainPointsFormTips", lang), () => { })
                .addInput(XYSignal("ChangeMainPointsFormContent", lang), (_data, pl2) => {
                    if (_data === null) {
                        pl2.tell(XYMessage("CloseForm", lang));
                        return;
                    }
                    if (_data === "") {
                        pl2.tell(XYMessage("ChangeMainPointsFailed", lang));
                        return;
                    }
                    if (org.setMainPoint({
                        name,
                        pos: JSON.parse(_data)
                    })) {
                        pl2.tell(XYMessage("ChangeMainPointsSuccess", lang));
                    } else {
                        pl2.tell(XYMessage("ChangeMainPointsFailed", lang));
                    }
                }, "pos", "[0,0,0,0]")
                .send();
        }
        const Form = new XYSimpleForm(XYSignal("TransPointsManagerFormTitle", lang), XYSignal("TransPointsManagerFormContent", lang), _pl);
        Form.addButton(XYSignal("AddTransPoints", lang), (pl: Player) => {
            AddTransPointsForm(pl);
        })
            .addButton(XYSignal("ReduceTransPoints", lang), (pl: Player) => {
                TransPointsFormReduceOrEdit(pl);
            })
            .addButton(XYSignal("SetMainPoint", lang), (pl: Player) => {
                SetMainPointForm(pl);
            })
            .send();
    }


    /** 
     * 查看申请列表表单
     */
    function CheckApplyMemberForm(player1: Player) {
        const Form = new XYSimpleForm(XYSignal("CheckApplyMemberFormTitle", lang), XYSignal("CheckApplyMemberFormContent", lang), player1);
        orgdata.applyList.forEach((orgmember) => {
            Form.addButton(orgmember.name, (_player: Player) => {
                _player.sendModalForm(
                    XYSignal("CheckApplyMemberTitle2", lang),
                    XYSignal("CheckApplyMemberContent", lang),
                    XYSignal("CheckApplyMemberAgree"),
                    XYSignal("CheckApplyMemberDisAgree", lang),
                    (pl: Player, result) => {
                        if (result === null) {
                            pl.tell(XYMessage("CloseForm", lang));
                            return;
                        }
                        if (result) {
                            if (org.allowMemberJoin(_player.xuid)) {
                                _player.tell(XYMessage("AllowMemberJoinSuccess", lang));
                            } else {
                                _player.tell(XYMessage("AllowMemberJoinFailed", lang));
                            }
                        }
                    });

            });
        });
        Form.send();
    }
    /**
     * 转让公会表单
     * @param _player 
     */
    function ChangeOwnerForm(_player: Player) {
        const Form = new XYSimpleForm(XYSignal("ChangeOwnerFormTitle", lang), XYSignal("ChangeOwnerFormContent", lang), _player);
        if (org.findPlayerData(_player.xuid).level === playerLevel.Owner) {
            orgdata.members.forEach((orgmember) => {
                Form.addButton(orgmember.name, (_player1: Player) => {
                    if (org.transferOrg(_player1.xuid, orgmember.xuid)) {
                        _player1.tell(XYMessage("TransferOrgSuccess", lang));
                    } else {
                        _player1.tell(XYMessage("TransferOrgFailed", lang));
                    }
                });
            });
            Form.send();
        } else {
            _player.tell(XYMessage("PermissionsNotEnough", lang));
        }
    }
    const Form = new XYSimpleForm(XYSignal("SettingFormTitle", lang), XYSignal("SettingFormContent", lang), player);
    Form.addButton(XYSignal("RenameOrg", lang), (pl: Player) => {
        RenameOrgForm(pl);
    })
        // .addButton(XYSignal("SetMemberPermissions", lang), (pl: Player) => {
        //     ChangeLevelForm(pl);
        // })
        .addButton(XYSignal("ManageMember", lang), (pl: Player) => {
            ManageMemberForm(pl);
        })
        .addButton(XYSignal("TransPointsManager"), (pl: Player) => {
            TransPointsManagerForm(pl);
        })
        .addButton(XYSignal("CheckApplyMember", lang), (pl: Player) => {
            CheckApplyMemberForm(pl);
        })
        .addButton(XYSignal("ChangeOwner", lang), (pl: Player) => {
            ChangeOwnerForm(pl);
        })
        .send();
}

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
        const Form = new XYCustomForm(XYSignal("CpfFormTitle"), _player);
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
                    org.updateData();
                    if (org.cpf < mount) {
                        pl.tell(XYMessage("CpfFormInputNotEnough", lang));
                        return;
                    }
                    if (addmoney(pl, mount)) {
                        org.reduceCpf(mount);
                    } else {
                        pl.tell(XYMessage("CpfFormInputNotEnough", lang));
                    }
                }
            }, "-100000 - 100000", "0");
        }
        Form.send();
    }

    /** 传送点表单
     * @param player 
     * @param TransPoint 
     */
    function TransPointForm(_player: Player, TransPoint: Array<transPoints>) {
        const Form = new XYSimpleForm(XYSignal("TransPointFormTitle", lang), XYSignal("TransPointFormContent", lang), _player);
        TransPoint.forEach((transPoint) => {
            Form.addButton(transPoint.name, (pl: Player) => {
                const pos = new IntPos(Math.floor(transPoint.pos[0]), Math.floor(transPoint.pos[1]), Math.floor(transPoint.pos[2]), Math.floor(transPoint.pos[3]));
                if (reduceMoney(pl, Conf[LeveltoString(orgdata.level)].TransMoney)) {
                    if (pl.teleport(pos))
                        pl.tell(XYMessage("TransPointSuccess", lang));
                    else pl.tell(XYMessage("TransPointFailed", lang));
                } else {
                    pl.tell(XYMessage("MoneyNotEnough", lang));
                }

            });
        });
        Form.send();
    };
    /**
     * 主表单
     */
    const Form = new XYSimpleForm(XYSignal("ManagerFormTitle", lang), XYSignal("ManagerFormContent", lang, uuid), player);
    Form.addButton(XYSignal("GoTOMainPosition", lang), (pl: Player) => {
        const main = orgdata.manager.mainPosition.pos;
        const pos = new IntPos(Math.floor(main[0]), Math.floor(main[1]), Math.floor(main[2]), Math.floor(main[3]));
        const { level } = orgdata;
        if (reduceMoney(pl, Conf[LeveltoString(level)].TransMoney)) {
            if (pl.teleport(pos))
                pl.tell(XYMessage("GoTOMainPositionSuccess", lang));
            else pl.tell(XYMessage("GoTOMainPositionFailed", lang));
        } else {
            pl.tell(XYMessage("MoneyNotEnough", lang));
        }
        // if (pl.teleport(pos)) {
        //     reduceMoney(pl, Conf[LeveltoString(level)].TransMoney);
        //     pl.tell(XYMessage("GoTOMainPositionSuccess", lang));
        // }
        // else pl.tell(XYMessage("GoTOMainPositionFailed", lang));
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
                settingForm(pl, uuid);
            } else {
                pl.tell(XYMessage("PermissionsNotEnough", lang));
            }
        })
        .send();
}



/**
 * 判断玩家是否有公会 如果有则发送选择管理的公会表单 如果没有则发送 First form
 * @param player 
 */
export function isHasOrg(player: Player) {
    playerData.reload();
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


