
import Configs from "../../Loading/src/Configs";
import { Global } from "../../Loading/src/Global";
import cmd from "./Lobby.Cmd";
import App from "./Script/common/App";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";
import Dialog from "./Script/common/Dialog";
import Utils from "./Script/common/Utils";
import MiniGameNetworkClient from "./Script/networks/MiniGameNetworkClient";
import InPacket from "./Script/networks/Network.InPacket";

const { ccclass, property } = cc._decorator;

@ccclass("Lobby.PopupProfile.TabProfile")
export class TabProfile {
    @property(cc.Label)
    lblNickname: cc.Label = null;
    @property(cc.Label)
    lblChip: cc.Label = null;
    @property(cc.Label)
    lblVipPoint: cc.Label = null;
    @property(cc.Label)
    lblEmail: cc.Label = null;
    @property(cc.Label)
    lblGender: cc.Label = null;
    @property(cc.Label)
    lblBirthday: cc.Label = null;
    @property(cc.Label)
    lblVipPointPercent: cc.Label = null;
    @property(cc.Label)
    lblPhone: cc.Label = null;
    @property(cc.Label)
    lblAddress: cc.Label = null;
    @property(cc.Label)
    lblRefcode: cc.Label = null;
    @property(cc.Label)
    lblVipName: cc.Label = null;
    @property(cc.Slider)
    sliderVipPoint: cc.Slider = null;
    @property(cc.Sprite)
    spriteProgressVipPoint: cc.Sprite = null;

    @property(cc.Sprite)
    spriteAvatar: cc.Sprite = null;
}

@ccclass("Lobby.PopupProfile.PopupUpdateInfo")
export class PopupUpdateInfo {
    @property(cc.EditBox)
    edbMail: cc.EditBox = null;
    @property(cc.EditBox)
    edbAddress: cc.EditBox = null;
    @property(cc.EditBox)
    edbBirthday: cc.EditBox = null;
    @property(cc.EditBox)
    edbRefCode: cc.EditBox = null;
    @property(cc.ToggleContainer)
    toggleContainer: cc.ToggleContainer = null;
    @property(cc.Node)
    bg: cc.Node = null;
    type = 1;//1-address,2-Email;
    gender = 1;
    refcode = "";

    setInfo() {
        this.edbBirthday.string = Configs.Login.Birthday;
        this.edbAddress.string = Configs.Login.Address;
        this.edbMail.string = Configs.Login.Mail;
        this.edbRefCode.string = this.refcode;
        if (Configs.Login.Gender) {
            this.toggleContainer.node.children[0].getComponent(cc.Toggle).isChecked = true;
        } else {
            this.toggleContainer.node.children[2].getComponent(cc.Toggle).isChecked = true;
        }
    }
    dismiss() {
        cc.tween(this.bg).to(0.3, { scale: 0.8, opacity: 150 }, { easing: cc.easing.backIn }).call(() => {
            this.bg.parent.active = false;
        }).start();
    }
    show() {
        this.bg.parent.active = true;
        cc.tween(this.bg).set({ scale: 0.8, opacity: 150 }).to(0.3, { scale: 1, opacity: 255 }, { easing: cc.easing.backOut }).start();
    }
    onClickUpdate() {
        // this.dismiss();
        // if (this.edbBirthday.string == "" && this.edbAddress.string == "" && this.edbMail.string == "") {
        //     App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_input_all"));
        //     return;
        // }

        let birthday = this.edbBirthday.string.trim();
        let address = this.edbAddress.string.trim();
        let mail = this.edbMail.string.trim();
        let refCode = this.edbRefCode.string.trim();
        let count = 0;
        if (birthday.length > 0) {
            for (let i = 0, l = birthday.length; i < l; i++) {
                if (birthday[i] == "-")
                    count++;
            };
            if (count < 2) {
                App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_error_birthday"));
                return;
            }
        }
        MiniGameNetworkClient.getInstance().send(new cmd.ReqUpdateUserInfo(mail, birthday, address, this.gender, refCode));
    }
    onClickGender(data) {
        this.gender = parseInt(data);
    }
}


@ccclass
export default class PopupProfile extends Dialog {
    @property(TabProfile)
    tabProfile: TabProfile = null;
    @property(PopupUpdateInfo)
    popupUpdateInfo: PopupUpdateInfo = null;

    @property(cc.Label)
    lblTienHienCo: cc.Label = null;
    @property(cc.Label)
    lblTienTrongKet: cc.Label = null;



    start() {

        BroadcastReceiver.register(BroadcastReceiver.USER_INFO_UPDATED, () => {
            if (!this.node.active) return;
            this.tabProfile.spriteAvatar.spriteFrame = App.instance.getAvatarSpriteFrame(Configs.Login.Avatar);
        }, this);

        MiniGameNetworkClient.getInstance().addListener((data) => {
            if (!this.node.active) return;
            let inpacket = new InPacket(data);
            //  //Utils.Log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case cmd.Code.GET_KET_SAT: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResGetKetSat(data);
                    switch (res.error) {
                        case 0:
                            //this._coinKet = res.currentMoney;
                            this.lblTienTrongKet.string = Utils.formatNumber(res.currentMoney);
                            this.lblTienHienCo.string  = Utils.formatNumber(Configs.Login.Coin);
                            break;
                        case 1:
                            //this.showToast("Có lỗi xảy ra, Vui lòng thử lại sau!");
                            break; 
                    }
                    break;                
                }
                case cmd.Code.EXCHANGE_VIP_POINT: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResExchangeVipPoint(data);
                    switch (res.error) {
                        case 0:
                            App.instance.alertDialog.showMsg("Vui lòng nhấn \"Lấy OTP\" hoặc nhận OTP qua APP OTP, và nhập để tiếp tục.");
                            break;
                        case 1:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_room_err6"));
                            break;
                        case 2:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_profile_note'));
                            break;
                        default:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_unknown_error"));
                            break;
                    }
                    break;
                }

                case cmd.Code.EXCHANGE_VIP_POINT: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResExchangeVipPoint(data);
                    switch (res.error) {
                        case 0:
                            App.instance.alertDialog.showMsg("Vui lòng nhấn \"Lấy OTP\" hoặc nhận OTP qua APP OTP, và nhập để tiếp tục.");
                            break;
                        case 1:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_room_err6"));
                            break;
                        case 2:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_profile_note'));
                            break;
                        default:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_unknown_error"));
                            break;
                    }
                    break;
                }
                case cmd.Code.RESULT_EXCHANGE_VIP_POINT: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResResultExchangeVipPoint(data);
                    switch (res.error) {
                        case 0:
                            Configs.Login.Coin = res.currentMoney;
                            BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_reward') + "\n" + Utils.formatNumber(res.moneyAdd) + " Xu");
                            break;
                        case 1:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_room_err6"));
                            break;
                        case 2:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_profile_note'));
                            break;
                        default:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang("txt_unknown_error"));
                            break;
                    }
                    break;
                }
                case cmd.Code.GET_OTP: {
                    if (!this.node.active) return;
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
                case cmd.Code.SEND_OTP: {
                    let res = new cmd.ResSendOTP(data);
                    //  //Utils.Log(res);
                    App.instance.showLoading(false);
                    switch (res.error) {
                        case 0:
                            break;
                        case 1:
                        case 2:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_error_exchange'));
                            break;
                        case 77:
                        case 3:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_incorrect_otp'));
                            break;
                        case 4:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_login_account_expired_otp'));
                            break;
                        default:
                            App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_unknown_error'));
                            break;
                    }
                    break;
                }
                case cmd.Code.CHANGE_EMAIL: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResChangeEmail(data);
                    this.actCloseUpdateInfo();
                    if (res.error == 0) {
                        let lblEmail = this.tabProfile.lblEmail;
                        lblEmail.enableItalic = false;
                        lblEmail.enableUnderline = false;
                        lblEmail.node.parent.getComponent(cc.Button).interactable = false;
                        lblEmail.node.color = cc.Color.WHITE;
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_profile_info_change'));
                        this.tabProfile.lblEmail.string = this.popupUpdateInfo.edbMail.string;
                    } else {
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_unknown_error1'));
                    }
                    break;
                }
                case cmd.Code.UPDATE_USER_INFO: {
                    let res = new cmd.ResUpdateUserInfo(data);
                    this.actCloseUpdateInfo();
                    if (res.error == 0) {
                        this.tabProfile.lblEmail.string = this.popupUpdateInfo.edbMail.string;
                        this.tabProfile.lblAddress.string = this.popupUpdateInfo.edbAddress.string;
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_profile_info_change'));
                        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetSecurityInfo());
                    } else {
                        App.instance.alertDialog.showMsg(App.instance.getTextLang('txt_unknown_error1'));
                    }
                    break;
                }
                case cmd.Code.GET_SECURITY_INFO: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResGetSecurityInfo(data);
                    //Utils.Log("GET_SECURITY_INFO=", res);
                    Configs.Login.Mail = res.email;
                    Configs.Login.Address = res.address;
                    Configs.Login.Gender = res.gender;
                    let lblPhone = this.tabProfile.lblPhone;
                    let lblEmail = this.tabProfile.lblEmail;
                    let lblAddress = this.tabProfile.lblAddress;
                    this.popupUpdateInfo.refcode = res.refferalCode;
                    this.tabProfile.lblGender.string = Configs.Login.Gender == true ? App.instance.getTextLang("txt_gender_male") : App.instance.getTextLang("txt_gender_female");
                    let msg = App.instance.getTextLang("Hãy kích hoạt SĐT");
                    let msg1 = App.instance.getTextLang("txt_not_update");
                    this.tabProfile.lblRefcode.string = res.refferalCode != "" ? res.refferalCode : msg1;
                    lblPhone.string = res.mobile == "" ? msg : res.mobile.substring(0, res.mobile.length - 3) + "***";
                    lblPhone.enableItalic = res.mobile == "" ? true : false;
                    lblPhone.enableUnderline = res.mobile == "" ? true : false;
                    lblPhone.node.color = res.mobile == "" ? cc.Color.WHITE : cc.Color.WHITE;
                    lblEmail.string = res.email == "" ? msg1 : res.email;
                    this.tabProfile.lblBirthday.string = res['birthday'] != "" ? res['birthday'].replace(/-/g, '/') : msg1;


                    lblAddress.string = Configs.Login.Address != "" ? Configs.Login.Address : msg1;
                    if (Configs.Login.Address == "") {
                        lblAddress.string = Configs.Login.FacebookID != "" ? App.instance.getTextLang('txt_profile_click') : msg1;
                    }
                    lblAddress.enableItalic = Configs.Login.FacebookID != "" ? true : false;
                    lblAddress.node.color = Configs.Login.FacebookID != "" ? cc.Color.WHITE : cc.Color.WHITE;
                    lblAddress.node.parent.getComponent(cc.Button).interactable = Configs.Login.FacebookID != "" ? true : false;
                    break;
                }
            }
        }, this);
    }

    actRule() {
        App.instance.actRule();
        this.dismiss();
    }

    onBtnChangePass() {
        App.instance.actChangePass();
    }
    onBtnRefund() {
        this.dismiss();
        Global.LobbyController.actRefund();
    }
    onClickAddress() {
        cc.sys.openURL("https://www.facebook.com/" + Configs.Login.FacebookID);
    }
    onClickOTPTelegram() {
        App.instance.openTelegram(Configs.App.getLinkTelegram());
    }
    actChangeAvatar() {
        App.instance.actChangeAvatar();
    }
    actUpdateInfo() {
        this.popupUpdateInfo.show();
    }
    actSendUpdateInfo() {
        this.popupUpdateInfo.onClickUpdate();
    }
    actCloseUpdateInfo() {
        this.popupUpdateInfo.dismiss();
    }
    actChangeUserInfo(even, data) {
        Utils.Log("Data==" + data);
        switch (data) {
            case "1": {
                Global.LobbyController.actSecurity();
                this.dismiss();
                break;
            }
            case "2":
            case "3": {
                this.popupUpdateInfo.show()
                this.popupUpdateInfo.setInfo();
                break;
            }
        }
    }
    actChooseGender(even, data) {
        this.popupUpdateInfo.onClickGender(data);
    }
    

    show() {
        super.show();
        this.getProfile();
        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetKetSat());
    }


    actGetOTP() {
        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetOTP(1));
    }

    actGetProfile(){
        this.getProfile();
    }

    private getProfile() {
        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqGetSecurityInfo());
        this.tabProfile.lblNickname.string = Configs.Login.Nickname;
        this.tabProfile.lblChip.string = Utils.formatNumber(Configs.Login.Coin);
        this.tabProfile.lblVipPoint.string = "VP: " + Utils.formatNumber(Configs.Login.VipPoint) + "/" + Utils.formatNumber(Configs.Login.getVipPointNextLevel());
        this.tabProfile.lblVipName.string = Configs.Login.getVipPointName();
        this.tabProfile.sliderVipPoint.progress = Math.min(Configs.Login.VipPoint / Configs.Login.getVipPointNextLevel(), 1);
        this.tabProfile.spriteProgressVipPoint.fillRange = this.tabProfile.sliderVipPoint.progress;
        this.tabProfile.lblVipPointPercent.string = Math.floor(this.tabProfile.sliderVipPoint.progress * 100) + "%";
        this.tabProfile.spriteAvatar.spriteFrame = App.instance.getAvatarSpriteFrame(Configs.Login.Avatar);
    }
    actBack() {
        let seft = this;
        App.instance.confirmDialog.show3(App.instance.getTextLang("txt_ask_logout"), "ĐĂNG XUẤT", (isConfirm) => {
            if (isConfirm) {
                App.instance.checkMailUnread = true;

                if (cc.sys.isBrowser) {
                    window.localStorage.removeItem('u');
                    window.localStorage.removeItem('at');
                    window.localStorage.removeItem('at_fb');
                    window.localStorage.removeItem('un');
                    window.localStorage.removeItem('pw');

                }
                cc.sys.localStorage.setItem("IsAutoLogin", 0);
                BroadcastReceiver.send(BroadcastReceiver.USER_LOGOUT);
                App.instance.updateConfigGame(App.DOMAIN);
                App.instance.RECONNECT_GAME = true;
                seft.dismiss();
            }
            
        });
    }
    actShowPopupHistory(){
        Global.LobbyController.actPopupHistoryPlay();
    }

    actShowKetSat(){
        Global.LobbyController.actPopupKetSat();
    }
}
