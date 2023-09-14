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
import DropDown from "../../Loading/Add-on/DropDown/Script/DropDown";
import SPUtils from "./Script/common/SPUtils";

const { ccclass, property } = cc._decorator;
@ccclass("Lobby.PopupCashout.TabCashout")
export class TabCashout {

    @property(cc.Node)
    txtNote: cc.Node = null;
    @property(cc.Node)
    dropdownBank: cc.Node = null;
    @property(cc.EditBox)
    edbAmount: cc.EditBox = null;
    @property(cc.EditBox)
    editName: cc.EditBox = null;
    @property(cc.EditBox)
    editNumber: cc.EditBox = null;
    @property(cc.EditBox)
    editNameUpdate: cc.EditBox = null;
    @property(cc.EditBox)
    editNumberUpdate: cc.EditBox = null;
    dropdownBankComp: DropDown = null;

    private _listBank = [];
    start() {
        
        this.dropdownBankComp = this.dropdownBank.getComponent("DropDown");
    }

    show() {
        this.editName.string = "";
        this.editNumber.string = "";
        this.edbAmount.string = "";
     
        var data = {};
        data["c"] = 2011;
        Http.get(Configs.App.API, data, (err, res) => {
            this._listBank = res.bank.split(',');
            var datas = new Array();
            this._listBank.sort((a, b) => {
                return a.charCodeAt(0) - b.charCodeAt(0);
            })
            for (var i = 0; i < this._listBank.length; i++) {
                datas.push({ optionString: this._listBank[i] });
            }
            this.dropdownBankComp.clearOptionDatas();
            this.dropdownBankComp.addOptionDatas(datas);
            this.dropdownBankComp.selectedIndex = 0;
            const bankString = cc.sys.localStorage.getItem("cashout_info")
            if(bankString){
                let bankInfo = bankString.split("|");  
                this.editName.string = bankInfo[2];
                this.editNumber.string = bankInfo[1];
                this.dropdownBankComp.selectedIndex = this._listBank.findIndex((x) => x === bankInfo[0]);
            }
        })
        this.txtNote.active = false;
        
    }

    onChoseBank() {
        var indexBank = this.dropdownBankComp.selectedIndex; 
        this.txtNote.active = true;
    }

    submit() {

        if (Configs.Login.VerifyMobile === false) {
            App.instance.alertDialog.showMsg("Bạn chưa xác thực số điện thoại!");
            return;
        }

        let ddBank = this.dropdownBankComp.selectedIndex;
        if (ddBank < 0) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_select_bank1'));
            return;
        }

        if (this.editName.string == "" || this.editNumber.string == "") {
            App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_input_all"));
            return;
        }
        if (this.editName.string.indexOf(' ') == -1) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_not_blank'));
            return;
        }

        let amount = Utils.formatEditBox(this.edbAmount.string);
        if (amount < 20000) {
            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_out_min") + Utils.formatNumber(20000));
            return;
        }
        if (amount > 300000000) {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_cash_out_max') + Utils.formatNumber(300000000));
            return;
        }

        if (amount > Configs.Login.Coin) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_not_enough'));
            return;
        }

        let bankNumber = this.editNumber.string.trim();
        if (bankNumber == "") {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_note_transfer_4'));
            return;
        }
        let bankActName = this.editName.string.trim();
        if (bankActName == "") {
            App.instance.alertDialog.showMsg("Chưa nhập tên người nhận");
            return;
        }

        App.instance.showLoading(true);
        var data = {};
        data["c"] = 2010;
        data["am"] = amount;
        //BankCode|BankAccountNumber|BankAccountName
        const bankCode = this._listBank[ddBank];
        data["bn"] = "" + bankCode + "|" + bankNumber + "|" + bankActName;
        data["nn"] = Configs.Login.Nickname;
        const bankInfo = data["bn"];
        Http.get(Configs.App.API, data, (err, res) => {
            App.instance.showLoading(false);
             ////Utils.Log("CashOut:" + JSON.stringify(err) + " => " + JSON.stringify(res));
            if (res.success) {
                Configs.Login.Coin = res.data.currentMoney;
                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_note_transfer_5'));
                cc.sys.localStorage.setItem("cashout_info", bankInfo);
            }
            else {
                App.instance.alertDialog.showMsg(res.message);
            }

        });
        // MiniGameNetworkClient.getInstance().send(new cmd.ReqCashoutBank(bankSelected, bankNumber,bankActName, amount ));
    }


    onChangeEditName() {
        this.editName.string = Utils.formatNameBank(this.editName.string).toUpperCase();

    }
    onChangeEditNameUpdate() {
        this.editNameUpdate.string = Utils.formatNameBank(this.editNameUpdate.string).toUpperCase();
    }

    onChangeEditNumber() {
        this.editNumber.string = Utils.formatNumberBank(this.editNumber.string).toUpperCase();

    }
    onChangeEditNumberUpdate() {
        this.editNumberUpdate.string = Utils.formatNumberBank(this.editNumberUpdate.string).toUpperCase();

    }

}

@ccclass("Lobby.PopupCashout.TabMomo")
export class TabMomo {
    @property(cc.EditBox)
    editNumberPhoneMomo: cc.EditBox = null;
    @property(cc.EditBox)
    edbAmountMomo: cc.EditBox = null;
    @property(cc.EditBox)
    editName: cc.EditBox = null;

    start() {
        
    }

    show() {
        this.editNumberPhoneMomo.string = "";
        this.edbAmountMomo.string = "";
    }

    onChangeEditNameUpdate() {
        this.editName.string = Utils.formatNameBank(this.editName.string).toUpperCase();
    }

    onChangeEditMomo() {
        this.editNumberPhoneMomo.string = Utils.formatNumberBank(this.editNumberPhoneMomo.string).toUpperCase();

    }

    submitMomo() {
        if (Configs.Login.VerifyMobile === false) {
            App.instance.alertDialog.showMsg("Bạn chưa xác thực số điện thoại!");
            return;
        }

        let amount = Utils.formatEditBox(this.edbAmountMomo.string);
        if (amount < 10000) {
            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_out_min") + Utils.formatNumber(10000));
            return;
        }
        if (amount > 50000000) {
            App.instance.ShowAlertDialog(App.instance.getTextLang('txt_cash_out_max') + Utils.formatNumber(50000000));
            return;
        }

        if (amount > Configs.Login.Coin) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_not_enough'));
            return;
        }

        let bankNumber = this.editNumberPhoneMomo.string.trim();
        if (bankNumber == "") {
            App.instance.alertDialog.showMsg("Chưa nhập số momo");
            return;
        }

        let bankActName = this.editName.string.trim();
        if (bankActName == "") {
            App.instance.alertDialog.showMsg("Chưa nhập tên người nhận");
            return;
        }

        App.instance.showLoading(true);
        var data = {};
        data["c"] = 2010;
        data["am"] = amount;
        //BankCode|BankAccountNumber|BankAccountName
        data["bn"] = "momo" + "|" + bankNumber + "|" + bankActName;
        data["nn"] = Configs.Login.Nickname;
        const bankInfo = data["bn"];
        Http.get(Configs.App.API, data, (err, res) => {
            App.instance.showLoading(false);
             ////Utils.Log("CashOut:" + JSON.stringify(err) + " => " + JSON.stringify(res));
            if (res.success) {
                Configs.Login.Coin = res.data.currentMoney;
                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_note_transfer_5'));
                cc.sys.localStorage.setItem("cashout_info", bankInfo);
            }
            else {
                App.instance.alertDialog.showMsg(res.message);
            }

        });
        // MiniGameNetworkClient.getInstance().send(new cmd.ReqCashoutBank(bankSelected, bankNumber,bankActName, amount ));
    }

}

@ccclass("Lobby.PopupCashout.TabBank")
export class TabBank {
    @property(cc.EditBox)
    editName: cc.EditBox = null;
    @property(cc.EditBox)
    editNumber: cc.EditBox = null;
    @property(cc.EditBox)
    editBranch: cc.EditBox = null;
    @property(cc.Node)
    dropBank: cc.Node = null;
   
    @property(cc.Node)
    contentItem: cc.Node = null;
    @property(cc.Node)
    prefabItem: cc.Node = null;
    @property(cc.Node)
    boxList: cc.Node = null;
    @property(cc.Node)
    boxListEmpty: cc.Node = null;
    @property(cc.Node)
    popupAddBank: cc.Node = null;
    dropBankComp: DropDown = null;
    private _listBank = [];
    show() {
        this.dropBankComp = this.dropBank.getComponent("DropDown");
        this.getListBankProfile();
    }

    getListBankProfile() {
        this.contentItem.removeAllChildren();
        var self = this;
        var data = {};
        data["c"] = 2008;
        data["nn"] = encodeURIComponent(Configs.Login.Nickname.trim());
        data["pn"] = 1;
        data["l"] = 10;
        Http.get(Configs.App.API, data, (err, res) => {
            var list = JSON.parse(res.data).data;
            Configs.Login.ListBankRut = list;
            if (res == null || list.length == 0) {
                self.boxList.active = false;
                self.boxListEmpty.active = true;
            }
            else {
                self.boxList.active = true;
                self.boxListEmpty.active = false;
                for (var i = 0; i < list.length; i++) {
                    var nodeItem = cc.instantiate(self.prefabItem);
                    nodeItem.parent = self.contentItem;
                    nodeItem.setPosition(cc.v2(0, 0));
                    nodeItem.getComponent("ItemBankProfile").init(list[i], self);
                }
            }
        });
    }

    showPopupAddBank() {
        this.editName.string = "";
        this.editNumber.string = "";
        this.editBranch.string = "";
        var data = {};
        data["c"] = 2011;
        Http.get(Configs.App.API, data, (err, res) => {
            this._listBank = res.bank.split(',');
            var datas = new Array();
            this._listBank.sort((a, b) => {
                return a.charCodeAt(0) - b.charCodeAt(0);
            })
            for (var i = 0; i < this._listBank.length; i++) {
                datas.push({ optionString: this._listBank[i] });
            }
            this.dropBankComp.clearOptionDatas();
            this.dropBankComp.addOptionDatas(datas);
            this.dropBankComp.selectedIndex = 0;
        })
        this.popupAddBank.active = true;
        cc.tween(this.popupAddBank).set({ scale: 0.8, opacity: 255 }).to(0.3, { scale: 1.0, opacity: 255 }, { easing: cc.easing.backOut }).start();
    }

    closeTabAddBank() {
        cc.tween(this.popupAddBank).to(0.3, { scale: 0.8, opacity: 150 }, { easing: cc.easing.backIn }).call(() => {
            this.popupAddBank.active = false;
        }).start();
    }

    CreateBank() {
        if (this.editName.string == "" || this.editNumber.string == "" || this.editBranch.string == "") {
            App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_input_all"));
            return;
        }
        if (this.editName.string.indexOf(' ') == -1) {
            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_not_blank'));
            return;
        }
        var self = this;
        var data = {};
        data["c"] = 2007;
        data["nn"] = encodeURIComponent(Configs.Login.Nickname.trim());
        data["bn"] = encodeURIComponent(this.dropBankComp.labelCaption.string.trim());;
        data["cn"] = encodeURIComponent(this.editName.string.trim());
        data["bnum"] = this.editNumber.string;
        data["br"] = encodeURIComponent(this.editBranch.string.trim());;
        data["t"] = 0;
        Http.get(Configs.App.API, data, (err, res) => {
            this.closeTabAddBank();
            if (res.success) {
                self.getListBankProfile();
            }
            else {
                App.instance.alertDialog.showMsg(res.message);
            }
        });
    }

    onChangeEditName() {
        this.editName.string = Utils.formatNameBank(this.editName.string).toUpperCase();

    }
    onChangeEditNumber() {
        this.editNumber.string = Utils.formatNumberBank(this.editNumber.string).toUpperCase();
    }
    onChangeEditBranch() {
        this.editBranch.string = Utils.formatNameBank(this.editBranch.string).toUpperCase();

    }

  
}




@ccclass
export default class PopupCashout extends Dialog {
    @property(cc.ToggleContainer)
    tabs: cc.ToggleContainer = null;
    @property(TabCashout)
    tabCashout: TabCashout = null;
    @property(TabMomo)
    tabMomo: TabMomo = null;
    @property(TabBank)
    tabBank: TabBank = null;
    @property(cc.Node)
    tabContents: cc.Node = null;
    @property(cc.Node)
    tabBaoTri: cc.Node = null;
    private tabSelectedIdx = 0;

    start() {
        for (let i = 0; i < this.tabs.toggleItems.length; i++) {
            this.tabs.toggleItems[i].node.on("toggle", () => {
                this.tabSelectedIdx = i;
                this.onTabChanged();
            });
        }
        MiniGameNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
             ////Utils.Log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case cmd.Code.CASHOUT_CARD: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResCashoutCard(data);
                     ////Utils.Log(JSON.stringify(res));


                }
                case cmd.Code.CASHOUT_BANK: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResCashoutBank(data);
                    if (res.error == 0) {
                        Configs.Login.Coin = res.currentMoney;
                        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_note_transfer_6'));
                    } else {
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_note_transfer_7'));
                    }
                    break;
                }
                case cmd.Code.CASHOUT_MOMO: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResCashoutMomo(data);
                    if (res.error == 0) {
                        Configs.Login.Coin = res.currentMoney;
                        BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_note_transfer_6'));
                    } else {
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_note_transfer_7'));
                    }
                    break;
                }
            }
        }, this);
        this.tabCashout.start();
    }

    private onTabChanged() {
        for (let i = 0; i < this.tabContents.childrenCount; i++) {
            
            this.tabContents.children[i].active = i == this.tabSelectedIdx;
        }
        switch (this.tabSelectedIdx) {
            case 0:
                this.tabCashout.show();
                this.tabBaoTri.active = false;
                break;
                case 1:
                    this.tabSelectedIdx = 1; 
                    this.tabBaoTri.active = false;
                    break;
                case 2:
                    this.tabSelectedIdx = 2;
                    this.tabBaoTri.active = true;
                    break
            // case 1:
            //     this.tabBank.show();
            //     break;
        }
    }
    show() {
        super.show();
        for (let i = 0; i < this.tabContents.childrenCount; i++) {
            this.tabContents.children[i].active = false;
        }
        // var data = {};
        // data["c"] = 2008;
        // data["nn"] = Configs.Login.Nickname;
        // data["pn"] = 1;
        // data["l"] = 10;
        // Http.get(Configs.App.API, data, (err, res) => {
        //     var list = JSON.parse(res.data).data;
        //     if (res == null || list.length == 0) {
        //         this.tabSelectedIdx = 1;
        //     } else {
        //         this.tabSelectedIdx = 0;
        //     }
        //     this.tabs.toggleItems[this.tabSelectedIdx].isChecked = true;
        //     this.onTabChanged();
        // });

        this.tabSelectedIdx = 0;
        this.tabs.toggleItems[this.tabSelectedIdx].isChecked = true;
        this.onTabChanged();
    }
   
    actHideAddBank() {
        this.tabBank.closeTabAddBank();
    }

    actAddBankAccount() {
        this.tabBank.showPopupAddBank();
    }

    actEditNameCreateBank() {
        this.tabBank.onChangeEditName();
    }

   
    actEditNumberCreateBank() {
        this.tabBank.onChangeEditNumber();
    }

   
    actEditBranchCreateBank() {
        this.tabBank.onChangeEditBranch();
    }

    actCreateBank() {
        this.tabBank.CreateBank();
    }

    private onBtnChoseBank() {
        this.tabCashout.onChoseBank();
    }

    actSubmitNapNganHang() {
        this.tabCashout.submit();
    }

    actEditNameBank() {
        this.tabCashout.onChangeEditName();
    }

    actEditNameBankUpdate() {
        this.tabCashout.onChangeEditNameUpdate();
    }

    actEditNumber() {
        this.tabCashout.onChangeEditNumber();
    }

    actEditNumberUpdate() {
        this.tabCashout.onChangeEditNumberUpdate();
    }

    actShowPopupHistory(){
        Global.LobbyController.actTransaction();
    }

    actEditNameMomoUpdate() {
        this.tabMomo.onChangeEditNameUpdate();
    }

    actEditPhoneMomoUpdate() {
        this.tabMomo.onChangeEditMomo();
    }

    actGetOTP() {
        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetOTP(1));
    }

    actSubmitRutMomo() {
        this.tabMomo.submitMomo();
    }

}
