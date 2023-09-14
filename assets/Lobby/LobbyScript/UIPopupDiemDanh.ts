import Configs from "../../Loading/src/Configs";
import { Global } from "../../Loading/src/Global";
import Http from "../../Loading/src/Http";
import cmd from "./Lobby.Cmd";
import App from "./Script/common/App";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";
import Dialog from "./Script/common/Dialog";
import Utils from "./Script/common/Utils";
import MiniGameNetworkClient from "./Script/networks/MiniGameNetworkClient";
import InPacket from "./Script/networks/Network.InPacket";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UIPopupDiemDanh extends Dialog {
    @property(cc.Node)
    table: cc.Node = null;
    @property(cc.Node)
    prefab: cc.Node = null;
    @property(cc.Node)
    itemDiemDanhNode: cc.Node = null;
    @property(cc.ToggleContainer)
    tabs: cc.ToggleContainer = null;
    private tabSelectedIdx = 0;

    onLoad(){
        this.initTableCells(10);  
    }
    initTableCells(itemPerPage) {
        for (let i = 0; i < itemPerPage; ++i) {
            const cell = cc.instantiate(this.itemDiemDanhNode);
            cell.parent = this.table;
            cell.active = false;
        }
    }

    start() {
        for (let i = 0; i < this.tabs.toggleItems.length; i++) {
            this.tabs.toggleItems[i].node.on("toggle", () => {
                this.tabSelectedIdx = i;
                this.onTabChanged();
            });
        }

        // MiniGameNetworkClient.getInstance().addListener((data) => {
        //     if (!this.node.active) return;
        //     let inpacket = new InPacket(data);
        //     //Utils.Log(inpacket.getCmdId());
        //     switch (inpacket.getCmdId()) {
        //         case cmd.Code.GET_LIST_QUEST: {

        //             this.content.removeAllChildren();
        //             this.itemDiemDanh = null;
        //             let res = new cmd.ResGetListQuest(data);
        //             var list = JSON.parse(res.bf);
        //             for (var i = 0; i < list.length; i++) {
        //                 var item = cc.instantiate(this.prefab);
        //                 item.parent = this.content;
        //                 item.setSiblingIndex(list[i].dailyQuestData.piority + 1);
        //                 //Utils.Log(list[i].dailyQuestData.piority + 1);
        //                 item.getComponent("UIItemDiemDanh").init(list[i]);
        //             }

        //         }
        //             break;
        //         case cmd.Code.RECEIVE_LIST_QUEST: {
        //             let res = new cmd.ResReceiveListQuest(data);
        //             //Utils.Log("ListQuest:" + JSON.stringify(res));
        //             if (res.isSuccess) {
        //                 App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_giftcode_success'));
        //                 MiniGameNetworkClient.getInstance().send(new cmd.ReqGetListQuest());
        //                 Configs.Login.Coin = res.currentMoney;
        //                 BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
        //             }
        //         }
        //             break;
        //     }
        // }, this);           
    }

    show() {
        super.show();
        this.clearTableData();
    }

    _onShowed() {
        super._onShowed();
        this.tabSelectedIdx = 0;
        this.tabs.toggleItems[this.tabSelectedIdx].isChecked = true;
        this.onTabChanged();
      
    }

    private onTabChanged() {
        let data = [0]
        if(this.tabSelectedIdx == 0){
            data = [0]
        } else {
            data = [1,2]
        }
        this.table.children.forEach((child, index) => {
            if (index < data.length) {
                child.getComponent("UIItemDiemDanh").init(data[index], ()=>{
                    this.dismiss();
                });
                child.active = true;
            }else {
                child.active = false;
            }
        });
    }

    clearTableData(){
        this.table.children.forEach((child, index) => {
            child.active = false;
        });
    }

    // onEnable() {
    //     this.checkDiemDanh();
    // }
    // checkDiemDanh() {
    //     Http.get(Configs.App.API, { c: "2031", nn: Configs.Login.Nickname, at: Configs.Login.AccessToken, ac: "history" }, (err, res) => {
    //         //Utils.Log("DIEMDANH:", res);
    //         if (res['data'] != null) {
    //             if (this.itemDiemDanh == null) {
    //                 this.itemDiemDanh = cc.instantiate(this.itemDiemDanhNode);
    //                 this.itemDiemDanh.parent = this.content;
    //                 this.itemDiemDanh.setSiblingIndex(0);
    //                 //  cc.log("init diem danh");
    //             }
    //             let progress = 0;
    //             let dataHis = res['data'];
    //             for (let i = 0; i < dataHis.length; i++) {
    //                 if (dataHis[i]['consecutive'] != 0) {
    //                     progress++
    //                 }
    //             }
    //             cc.find('BgProgress/Progress', this.itemDiemDanh).getComponent(cc.Sprite).fillRange = progress / 7;
    //             this.itemDiemDanh.getChildByName('TxtProgress').getComponent(cc.Label).string = App.instance.getTextLang('txt_progress') + ": " + Math.floor((progress / 7) * 100) + "%";
    //         }
    //     });
    // }
    // onClickAttendance() {
    //     Global.LobbyController.actDiemDanh1();
    //     this.dismiss();
    // }
    // show() {
    //     super.show();
    //     // App.instance.showLoading(true);
    //     MiniGameNetworkClient.getInstance().send(new cmd.ReqGetListQuest());
    // }
}
