"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHasOrg = exports.ManagerForm = exports.FirstForm = exports.JoinForm = exports.CreateForm = void 0;
const Org_1 = require("../Body/Org");
const handlePlayer_1 = require("../Body/handlePlayer");
const config_1 = require("../Config/config");
const handleData_1 = require("../Data/handleData");
const playerData_1 = require("../Data/playerData");
const Economic_1 = require("../Economic/Economic");
const orgEnum_1 = require("../Enum/orgEnum");
const signal_1 = require("../i18n/signal");
const CustomForm_1 = require("./FormHelper/CustomForm");
const SimpleForm_1 = require("./FormHelper/SimpleForm");
const lang = config_1.Conf.language;
/**
 * 创建公会表单
 * @param player
 */
function CreateForm(player) {
    const Form = new CustomForm_1.XYCustomForm((0, signal_1.XYSignal)("CreateFormTitle", lang), player);
    Form.addLabel((0, signal_1.XYSignal)("CreateFormContent", lang), () => {
    }).addInput((0, signal_1.XYSignal)("CreateOrgInputDescription", lang), (data, pl) => {
        data = data.toString();
        (0, handlePlayer_1.createOrg)(pl, data);
        // TODO Jump to Manager Form
    }, "Organ", "Organ")
        .send();
}
exports.CreateForm = CreateForm;
/**
 * 加入公会表单
 * @param player
 */
function JoinForm(player) {
    const Form = new CustomForm_1.XYCustomForm((0, signal_1.XYSignal)("JoinFormTitle", lang), player);
    Form.addLabel((0, signal_1.XYSignal)("JoinFormContent", lang), () => {
    }).addInput((0, signal_1.XYSignal)("JoinOrgInputDescription", lang), (data, pl) => {
        data = data.toString();
        (0, handlePlayer_1.applyJoinOrg)(pl, data);
    }, "Organ", "Organ")
        .send();
}
exports.JoinForm = JoinForm;
/**
 * 初级表单
 * @param player
 */
function FirstForm(player) {
    const Form = new SimpleForm_1.XYSimpleForm((0, signal_1.XYSignal)("FirstFormTitle", lang), (0, signal_1.XYSignal)("FirstFormContent", lang), player);
    Form.addButton((0, signal_1.XYSignal)("CreateOrg", lang), (pl) => {
        if (config_1.Conf.allowCreate) {
            CreateForm(pl);
        }
        else if (pl.permLevel >= 1) {
            CreateForm(pl);
        }
        else {
            pl.tell((0, signal_1.XYMessage)("PermissionsNotEnough", lang));
        }
    }).
        addButton((0, signal_1.XYSignal)("JoinOrg", lang), (pl) => {
        JoinForm(pl);
    })
        .send();
}
exports.FirstForm = FirstForm;
/**
 * 设置表单
 * @param player 打开设置的玩家
 * @param uuid 公会uuid
 */
function settingForm(player, uuid) {
    const data = new handleData_1.HandleData();
    const orgdata = data.getOrgData(uuid);
    const org = new Org_1.Organization(orgdata);
    if (org.findPlayerData(player.xuid).level < orgEnum_1.playerLevel.Manager) {
        player.tell((0, signal_1.XYMessage)("PermissionsNotEnough", lang));
        return;
    }
    /**
     * 重命名公会
     * @param _pl 玩家
     */
    function RenameOrgForm(_pl) {
        const Form = new CustomForm_1.XYCustomForm((0, signal_1.XYSignal)("RenameOrgFormTitle", lang), _pl);
        Form.addLabel((0, signal_1.XYSignal)("RenameOrgFormContent", lang), () => { })
            .addInput((0, signal_1.XYSignal)("RenameOrgInputDescription", lang), (_data, pl) => {
            if (!data) {
                pl.tell((0, signal_1.XYMessage)("CloseForm", lang));
                return;
            }
            if (typeof _data !== "string")
                _data = _data.toString();
            if (org.changeName(_data)) {
                pl.tell((0, signal_1.XYMessage)("RenameOrgSuccess", lang));
            }
            else {
                pl.tell((0, signal_1.XYMessage)("RenameOrgFailed", lang));
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
    function ManageMemberForm(_pl) {
        function funcList(pl, orgmember) {
            const Form = new SimpleForm_1.XYSimpleForm((0, signal_1.XYSignal)("ManageMemberFormTitle", lang), (0, signal_1.XYSignal)("ManageMemberFormContent2", lang), pl);
            Form.addButton((0, signal_1.XYSignal)("KickMember", lang), (_play) => {
                if (orgmember.level === orgEnum_1.playerLevel.Owner) {
                    (0, handlePlayer_1.deleteOrg)(_play, orgdata.uuid);
                    return;
                }
                if (org.kickMember(orgmember.xuid)) {
                    _play.tell((0, signal_1.XYMessage)("KickMemberSuccess", lang));
                }
                else {
                    _play.tell((0, signal_1.XYMessage)("KickMemberFailed", lang));
                }
            })
                .addButton((0, signal_1.XYSignal)("ManageMemberPermission", lang), (_play) => {
                const Form2 = new CustomForm_1.XYCustomForm((0, signal_1.XYSignal)("ChangeLevelFormTitle", lang), _play);
                Form2.addDropdown((0, signal_1.XYSignal)("ChangeLevelFormLevel", lang), [(0, signal_1.XYSignal)("Member", lang), (0, signal_1.XYSignal)("Manager", lang)], (_datas, pla) => {
                    if (_datas === null) {
                        pl.tell((0, signal_1.XYMessage)("ChangeLevelFailed", lang));
                        return;
                    }
                    if (_datas === 0) {
                        if (org.changePlayerLevel(orgmember.xuid, orgEnum_1.playerLevel.Member)) {
                            pla.tell((0, signal_1.XYMessage)("ChangeLevelSuccess", lang));
                        }
                        else {
                            pla.tell((0, signal_1.XYMessage)("ChangeLevelFailed", lang));
                        }
                    }
                    else if (_datas === 1) {
                        if (org.changePlayerLevel(orgmember.xuid, orgEnum_1.playerLevel.Manager)) {
                            pla.tell((0, signal_1.XYMessage)("ChangeLevelSuccess", lang));
                        }
                        else {
                            pla.tell((0, signal_1.XYMessage)("ChangeLevelFailed", lang));
                        }
                    }
                }, 0)
                    .send();
            });
            Form.send();
        }
        const Form = new SimpleForm_1.XYSimpleForm((0, signal_1.XYSignal)("ManageMemberFormTitle", lang), (0, signal_1.XYSignal)("ManageMemberFormContent", lang), _pl);
        // 逻辑
        // for owner 显示全部玩家
        // for manager 显示成员
        if (org.findPlayerData(_pl.xuid).level === orgEnum_1.playerLevel.Owner) {
            orgdata.members.forEach((orgmember) => {
                Form.addButton(orgmember.name, (_player) => {
                    funcList(_player, orgmember);
                });
            });
            Form.send();
        }
        else if (org.findPlayerData(_pl.xuid).level === orgEnum_1.playerLevel.Manager) {
            orgdata.members.forEach((orgmember) => {
                if (orgmember.level === orgEnum_1.playerLevel.Member) {
                    Form.addButton(orgmember.name, (_player) => {
                        funcList(_player, orgmember);
                    });
                }
            });
            Form.send();
        }
    }
    let level = "Normal";
    switch (orgdata.level) {
        case orgEnum_1.orgLevel.Normal:
            level = "Normal";
            break;
        case orgEnum_1.orgLevel.Middle:
            level = "Middle";
            break;
        case orgEnum_1.orgLevel.High:
            level = "High";
            break;
        default: { /* empty */ }
    }
    /**
     * 传送点管理表单
     */
    function TransPointsManagerForm(_pl) {
        function AddTransPointsForm(_play) {
            if (orgdata.manager.transPoints.length >= config_1.Conf[level].maxTransPoints) {
                _play.tell((0, signal_1.XYMessage)("OverMaxTransPoints", lang));
                return;
            }
            const Form = new CustomForm_1.XYCustomForm((0, signal_1.XYSignal)("AddTransPointsFormTitle", lang), _play);
            let name = "";
            Form.addInput((0, signal_1.XYSignal)("AddTransPointsFormName", lang), (datas, pl) => {
                if (datas === null) {
                    pl.tell((0, signal_1.XYMessage)("CloseForm", lang));
                    return;
                }
                name = datas;
            }, "point", "point")
                .addLabel((0, signal_1.XYSignal)("AddTransPointsFormTips", lang), () => { })
                .addInput((0, signal_1.XYSignal)("AddTransPointsFormContent", lang), (_data, pl) => {
                if (_data === null) {
                    pl.tell((0, signal_1.XYMessage)("CloseForm", lang));
                    return;
                }
                if (_data === "") {
                    pl.tell((0, signal_1.XYMessage)("AddTransPointsFailed", lang));
                    return;
                }
                if (org.addTransPoint({
                    name,
                    pos: JSON.parse(_data)
                })) {
                    pl.tell((0, signal_1.XYMessage)("AddTransPointsSuccess", lang));
                }
                else {
                    pl.tell((0, signal_1.XYMessage)("AddTransPointsFailed", lang));
                }
            }, "pos", "[0,0,0,0]")
                .send();
        }
        function TransPointsFormReduceOrEdit(_play) {
            const Form = new CustomForm_1.XYCustomForm((0, signal_1.XYSignal)("TransPointsFormReduceOrEditTitle", lang), _play);
            const PointList = [];
            orgdata.manager.transPoints.forEach((transPoint) => {
                PointList.push(transPoint.name);
            });
            let node;
            Form.addDropdown((0, signal_1.XYSignal)("TransPointsFormReduceOrEditDropDown", lang), PointList, (_data, _player) => {
                if (_data === null) {
                    _player.tell((0, signal_1.XYMessage)("CloseForm", lang));
                }
                node = _data;
            }, 0)
                .addLabel((0, signal_1.XYSignal)("TransPointsFormReduceOrEditContent1", lang), () => { })
                .addSwitch((0, signal_1.XYSignal)("TransPointsFormReduceOrEditContent2", lang), (datas, pl) => {
                if (datas === null) {
                    pl.tell((0, signal_1.XYMessage)("CloseForm", lang));
                    return;
                }
                if (datas === true) {
                    if (org.reduceTransPoint(PointList[node])) {
                        pl.tell((0, signal_1.XYMessage)("ReduceTransPointSuccess", lang));
                    }
                    else {
                        pl.tell((0, signal_1.XYMessage)("ReduceTransPointFailed", lang));
                    }
                }
                else {
                    const Form2 = new CustomForm_1.XYCustomForm((0, signal_1.XYSignal)("ChangeTransPointsFormTitle", lang), _play);
                    let name = "";
                    Form2
                        .addInput((0, signal_1.XYSignal)("ChangeTransPointsFormName", lang), (datas2, pl1) => {
                        if (datas2 === null) {
                            pl1.tell((0, signal_1.XYMessage)("CloseForm", lang));
                            return;
                        }
                        name = datas2;
                    }, "point", "point")
                        .addLabel((0, signal_1.XYSignal)("ChangeTransPointsFormTips", lang), () => { })
                        .addInput((0, signal_1.XYSignal)("ChangeTransPointsFormContent", lang), (_data, pl2) => {
                        if (_data === null) {
                            pl2.tell((0, signal_1.XYMessage)("CloseForm", lang));
                            return;
                        }
                        if (_data === "") {
                            pl2.tell((0, signal_1.XYMessage)("ChangeTransPointsFailed", lang));
                            return;
                        }
                        if (org.changeTransPoint(PointList[node], {
                            name,
                            pos: JSON.parse(_data)
                        })) {
                            pl2.tell((0, signal_1.XYMessage)("ChangeTransPointsSuccess", lang));
                        }
                        else {
                            pl2.tell((0, signal_1.XYMessage)("ChangeTransPointsFailed", lang));
                        }
                    }, "pos", "[0,0,0,0]")
                        .send();
                }
            }, false);
            Form.send();
        }
        function SetMainPointForm(_play) {
            const Form2 = new CustomForm_1.XYCustomForm((0, signal_1.XYSignal)("ChangeMainPointsFormTitle", lang), _play);
            let name = "";
            Form2.addInput((0, signal_1.XYSignal)("ChangeMainPointsFormName", lang), (datas2, pl1) => {
                if (datas2 === null) {
                    pl1.tell((0, signal_1.XYMessage)("CloseForm", lang));
                    return;
                }
                name = datas2;
            }, "point", "point")
                .addLabel((0, signal_1.XYSignal)("ChangeMainPointsFormTips", lang), () => { })
                .addInput((0, signal_1.XYSignal)("ChangeMainPointsFormContent", lang), (_data, pl2) => {
                if (_data === null) {
                    pl2.tell((0, signal_1.XYMessage)("CloseForm", lang));
                    return;
                }
                if (_data === "") {
                    pl2.tell((0, signal_1.XYMessage)("ChangeMainPointsFailed", lang));
                    return;
                }
                if (org.setMainPoint({
                    name,
                    pos: JSON.parse(_data)
                })) {
                    pl2.tell((0, signal_1.XYMessage)("ChangeMainPointsSuccess", lang));
                }
                else {
                    pl2.tell((0, signal_1.XYMessage)("ChangeMainPointsFailed", lang));
                }
            }, "pos", "[0,0,0,0]")
                .send();
        }
        const Form = new SimpleForm_1.XYSimpleForm((0, signal_1.XYSignal)("TransPointsManagerFormTitle", lang), (0, signal_1.XYSignal)("TransPointsManagerFormContent", lang), _pl);
        Form.addButton((0, signal_1.XYSignal)("AddTransPoints", lang), (pl) => {
            AddTransPointsForm(pl);
        })
            .addButton((0, signal_1.XYSignal)("ReduceTransPoints", lang), (pl) => {
            TransPointsFormReduceOrEdit(pl);
        })
            .addButton((0, signal_1.XYSignal)("SetMainPoint", lang), (pl) => {
            SetMainPointForm(pl);
        })
            .send();
    }
    /**
     * 查看申请列表表单
     */
    function CheckApplyMemberForm(player1) {
        const Form = new SimpleForm_1.XYSimpleForm((0, signal_1.XYSignal)("CheckApplyMemberFormTitle", lang), (0, signal_1.XYSignal)("CheckApplyMemberFormContent", lang), player1);
        orgdata.applyList.forEach((orgmember) => {
            Form.addButton(orgmember.name, (_player) => {
                _player.sendModalForm((0, signal_1.XYSignal)("CheckApplyMemberTitle2", lang), (0, signal_1.XYSignal)("CheckApplyMemberContent", lang), (0, signal_1.XYSignal)("CheckApplyMemberAgree"), (0, signal_1.XYSignal)("CheckApplyMemberDisAgree", lang), (pl, result) => {
                    if (result === null) {
                        pl.tell((0, signal_1.XYMessage)("CloseForm", lang));
                        return;
                    }
                    if (result) {
                        if (org.allowMemberJoin(_player.xuid)) {
                            _player.tell((0, signal_1.XYMessage)("AllowMemberJoinSuccess", lang));
                        }
                        else {
                            _player.tell((0, signal_1.XYMessage)("AllowMemberJoinFailed", lang));
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
    function ChangeOwnerForm(_player) {
        const Form = new SimpleForm_1.XYSimpleForm((0, signal_1.XYSignal)("ChangeOwnerFormTitle", lang), (0, signal_1.XYSignal)("ChangeOwnerFormContent", lang), _player);
        if (org.findPlayerData(_player.xuid).level === orgEnum_1.playerLevel.Owner) {
            orgdata.members.forEach((orgmember) => {
                Form.addButton(orgmember.name, (_player1) => {
                    if (org.transferOrg(_player1.xuid, orgmember.xuid)) {
                        _player1.tell((0, signal_1.XYMessage)("TransferOrgSuccess", lang));
                    }
                    else {
                        _player1.tell((0, signal_1.XYMessage)("TransferOrgFailed", lang));
                    }
                });
            });
            Form.send();
        }
        else {
            _player.tell((0, signal_1.XYMessage)("PermissionsNotEnough", lang));
        }
    }
    const Form = new SimpleForm_1.XYSimpleForm((0, signal_1.XYSignal)("SettingFormTitle", lang), (0, signal_1.XYSignal)("SettingFormContent", lang), player);
    Form.addButton((0, signal_1.XYSignal)("RenameOrg", lang), (pl) => {
        RenameOrgForm(pl);
    })
        // .addButton(XYSignal("SetMemberPermissions", lang), (pl: Player) => {
        //     ChangeLevelForm(pl);
        // })
        .addButton((0, signal_1.XYSignal)("ManageMember", lang), (pl) => {
        ManageMemberForm(pl);
    })
        .addButton((0, signal_1.XYSignal)("TransPointsManager"), (pl) => {
        TransPointsManagerForm(pl);
    })
        .addButton((0, signal_1.XYSignal)("CheckApplyMember", lang), (pl) => {
        CheckApplyMemberForm(pl);
    })
        .addButton((0, signal_1.XYSignal)("ChangeOwner", lang), (pl) => {
        ChangeOwnerForm(pl);
    })
        .send();
}
/**
 * 管理公会表单
 * @param player
 */
function ManagerForm(player, uuid) {
    const data = new handleData_1.HandleData();
    const orgdata = data.getOrgData(uuid);
    const org = new Org_1.Organization(orgdata);
    /**
     * 退出公会表单
     * @param player 退出的玩家
     */
    function QuitOrgForm(_player) {
        _player.sendModalForm((0, signal_1.XYSignal)("QuitOrgFormTitle", lang), (0, signal_1.XYSignal)("QuitOrgFormContent", lang), (0, signal_1.XYSignal)("QuitOrgFormButton1", lang), (0, signal_1.XYSignal)("QuitOrgFormButton2", lang), (pl, result) => {
            if (!result)
                pl.tell((0, signal_1.XYMessage)("CloseForm"));
            if (result === true) {
                if (org.findPlayerData(pl.xuid).level === orgEnum_1.playerLevel.Owner) {
                    (0, handlePlayer_1.deleteOrg)(pl, orgdata.uuid);
                }
                else
                    (0, handlePlayer_1.quitOrg)(pl, orgdata.uuid);
            }
            ;
        });
    }
    /**
     * 公会公积金表单
     * @param player
     */
    function CpfForm(_player) {
        const Form = new CustomForm_1.XYCustomForm((0, signal_1.XYSignal)("CpfFormTitle"), _player);
        Form.addLabel((0, signal_1.XYSignal)("CpfFormContent", lang), () => { });
        if (org.findPlayerData(_player.xuid).level >= orgdata.manager.getCpfLevel) {
            Form.addLabel((0, signal_1.XYSignal)("CpfFormDescription", lang), () => { });
            Form.addInput((0, signal_1.XYSignal)("CpfFormInputDescription", lang, orgdata.manager.cpf), (datas, pl) => {
                let mount = Math.floor(parseFloat(datas));
                if (mount > 100000
                    || mount < -100000) {
                    pl.tell((0, signal_1.XYMessage)("CpfFormInputOverMax", lang));
                    return;
                }
                if (mount >= 0) {
                    if ((0, Economic_1.reduceMoney)(pl, mount)) {
                        org.addCpf(mount);
                    }
                    else
                        pl.tell((0, signal_1.XYMessage)("CpfFormInputNotEnough", lang));
                }
                else if (mount < 0) {
                    mount = Math.abs(mount);
                    org.updateData();
                    if (orgdata.manager.cpf < mount) {
                        log(3);
                        pl.tell((0, signal_1.XYMessage)("CpfFormInputNotEnough", lang));
                        return;
                    }
                    if ((0, Economic_1.addmoney)(pl, mount)) {
                        log(1);
                        org.reduceCpf(mount);
                    }
                    else {
                        log(2);
                        pl.tell((0, signal_1.XYMessage)("CpfFormInputNotEnough", lang));
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
    function TransPointForm(_player, TransPoint) {
        const Form = new SimpleForm_1.XYSimpleForm((0, signal_1.XYSignal)("TransPointFormTitle", lang), (0, signal_1.XYSignal)("TransPointFormContent", lang), _player);
        TransPoint.forEach((transPoint) => {
            Form.addButton(transPoint.name, (pl) => {
                const pos = new IntPos(Math.floor(transPoint.pos[0]), Math.floor(transPoint.pos[1]), Math.floor(transPoint.pos[2]), Math.floor(transPoint.pos[3]));
                if (pl.teleport(pos)) {
                    (0, Economic_1.reduceMoney)(pl, config_1.Conf[(0, orgEnum_1.LeveltoString)(orgdata.level)].TransMoney);
                    pl.tell((0, signal_1.XYMessage)("TransPointSuccess", lang));
                }
                else
                    pl.tell((0, signal_1.XYMessage)("TransPointFailed", lang));
            });
        });
        Form.send();
    }
    ;
    /**
     * 主表单
     */
    const Form = new SimpleForm_1.XYSimpleForm((0, signal_1.XYSignal)("ManagerFormTitle", lang), (0, signal_1.XYSignal)("ManagerFormContent", lang, uuid), player);
    Form.addButton((0, signal_1.XYSignal)("GoTOMainPosition", lang), (pl) => {
        const main = orgdata.manager.mainPosition.pos;
        const pos = new IntPos(Math.floor(main[0]), Math.floor(main[1]), Math.floor(main[2]), Math.floor(main[3]));
        const { level } = orgdata;
        if (pl.teleport(pos)) {
            (0, Economic_1.reduceMoney)(pl, config_1.Conf[(0, orgEnum_1.LeveltoString)(level)].TransMoney);
            pl.tell((0, signal_1.XYMessage)("GoTOMainPositionSuccess", lang));
        }
        else
            pl.tell((0, signal_1.XYMessage)("GoTOMainPositionFailed", lang));
    })
        .addButton((0, signal_1.XYSignal)("TransPoints", lang), (pl) => {
        TransPointForm(pl, orgdata.manager.transPoints);
    })
        .addButton((0, signal_1.XYSignal)("Cpf", lang), (pl) => {
        CpfForm(pl);
    })
        .addButton((0, signal_1.XYSignal)("QuitOrg", lang), (pl) => {
        QuitOrgForm(pl);
    })
        .addButton((0, signal_1.XYSignal)("OrgSettings", lang), (pl) => {
        const orgPl = org.findPlayerData(pl.xuid);
        if (orgPl.level >= orgEnum_1.playerLevel.Manager) {
            settingForm(pl, uuid);
        }
        else {
            pl.tell((0, signal_1.XYMessage)("PermissionsNotEnough", lang));
        }
    })
        .send();
}
exports.ManagerForm = ManagerForm;
/**
 * 判断玩家是否有公会 如果有则发送选择管理的公会表单 如果没有则发送 First form
 * @param player
 */
function isHasOrg(player) {
    playerData_1.playerData.reload();
    const data = new handleData_1.HandleData();
    const playerOrgList = playerData_1.playerData.get(player.xuid);
    if (playerOrgList.length > 0) {
        const Form = new SimpleForm_1.XYSimpleForm((0, signal_1.XYSignal)("OrgListTitle", lang), (0, signal_1.XYSignal)("OrgListContent", lang), player);
        playerOrgList.forEach((uuid) => {
            const orgdata = data.getOrgData(uuid);
            Form.addButton(orgdata.name, (pl) => {
                ManagerForm(pl, orgdata.uuid);
            });
        });
        Form.send();
        return;
    }
    FirstForm(player);
}
exports.isHasOrg = isHasOrg;
