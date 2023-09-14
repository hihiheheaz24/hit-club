
import Configs from "../../Loading/src/Configs";
import { Global } from "../../Loading/src/Global";
import cmd from "./Lobby.Cmd";
import App from "./Script/common/App";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";
import Dialog from "./Script/common/Dialog";
import Utils from "./Script/common/Utils";
import MiniGameNetworkClient from "./Script/networks/MiniGameNetworkClient";
import InPacket from "./Script/networks/Network.InPacket";
import Http from "../../Loading/src/Http";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupKetSat extends Dialog {
    @property(cc.Label)
    lblTienHienCo: cc.Label = null;
    @property(cc.Label)
    lblTienTrongKet: cc.Label = null;
    @property(cc.Label)
    lblToast: cc.Label = null;
    @property(cc.EditBox)
    edbAmount: cc.EditBox = null;
    @property(cc.Label)
    lblOTP: cc.Label = null;
    @property(cc.EditBox)
    edbOTP: cc.EditBox = null;
    @property(cc.Node)
    otpButton: cc.Node = null;
    _coinKet = 0;
    start() {

        BroadcastReceiver.register(BroadcastReceiver.USER_UPDATE_COIN, () => {
            this.lblTienHienCo.string  = Utils.formatNumber(Configs.Login.Coin);
        }, this);

        this.edbAmount.node.on("editing-did-ended", () => {
            let number = Utils.stringToInt(this.edbAmount.string);
            this.edbAmount.string = Utils.formatNumber(number);
        });

        MiniGameNetworkClient.getInstance().addListener((data) => {
            if (!this.node.active) return;
            let inpacket = new InPacket(data);
         
            switch (inpacket.getCmdId()) {
                case cmd.Code.GET_KET_SAT: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResGetKetSat(data);
                    switch (res.error) {
                        case 0:
                            this._coinKet = res.currentMoney;
                            this.lblTienTrongKet.string = Utils.formatNumber(res.currentMoney);
                            this.lblTienHienCo.string  = Utils.formatNumber(Configs.Login.Coin);
                            break;
                        case 1:
                            this.showToast("Có lỗi xảy ra, Vui lòng thử lại sau!");
                            break; 
                    }
                    break;
                    break;
                }
                case cmd.Code.NAP_KET_SAT: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResNapTienKet(data);

                    switch (res.error) {
                        case 0:
                            MiniGameNetworkClient.getInstance().send(new cmd.ReqGetMoneyUse());
                            MiniGameNetworkClient.getInstance().send(new cmd.ReqGetKetSat());
                            this.edbAmount.string = "";
                            this.showToast("Nạp tiền vào két thành cộng.");
                            break;
                        case 1:
                            this.showToast("Có lỗi xảy ra, Vui lòng thử lại sau!");
                            break; 
                    }
                    break;
                }

                case cmd.Code.RUT_KET_SAT: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResRutTienKet(data);
                    switch (res.error) {
                        case 0:
                            MiniGameNetworkClient.getInstance().send(new cmd.ReqGetMoneyUse());
                            MiniGameNetworkClient.getInstance().send(new cmd.ReqGetKetSat());
                            this.edbAmount.string = "";
                            this.edbOTP.string = "";
                            this.edbOTP.node.active = false;
                            this.lblOTP.node.active = false;
                            this.otpButton.active = false;
                            this.showToast("Rút tiền khỏi két thành cộng.");
                            break;
                        case 1:
                            this.showToast("Có lỗi xảy ra, Vui lòng thử lại sau!");
                            break; 
                    }
                    break;
                }   
                case cmd.Code.GET_OTP: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResGetOTP(data);
                    //  //Utils.Log(res);
                    if (res.error == 0) {
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_otp_send'));
                    } else if (res.error == 30) {
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_otp_delay_time'));
                    } else {
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_action_not_success'));
                    }
                    break;
                }
            }
        }, this);
    }
    show() {
        super.show();
        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetKetSat());
    }


    submitNapTienKet() {
        let amount = Utils.stringToInt(this.edbAmount.string);
        if (amount <= 0) {
            this.showToast("Số tiền không hợp lệ.");
            return;
        }
        if (amount > Configs.Login.Coin) {
            this.showToast("Số dư không đủ.");
            return;
        }

        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqNapTienKet(amount));
    }

    submitRutTienKet() {
        let amount = Utils.stringToInt(this.edbAmount.string);
        if (amount <= 0) {
            this.showToast("Số tiền không hợp lệ");
            return;
        }

        if (amount > this._coinKet) {
            this.showToast("Số dư không đủ.");
            return;
        }
        if (this.edbOTP.node.active == false) {
            this.lblOTP.node.active = true;
            this.edbOTP.node.active = true;
            this.otpButton.active = true;
            return;
        }
        let otp = this.edbOTP.string;
        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqRutTienKet(amount, otp));
    }


    private showToast(message: string) {
        this.lblToast.string = message;
        let parent = this.lblToast.node.parent;
        parent.stopAllActions();
        parent.active = true;
        parent.opacity = 0;
        parent.runAction(cc.sequence(cc.fadeIn(0.1), cc.delayTime(1), cc.fadeOut(0.2), cc.callFunc(() => {
            parent.active = false;
        })));
    }


    latOTP() {
        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetOTP(1));
    }


}
