import DropDown from "../../../Loading/Add-on/DropDown/Script/DropDown";
import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../Script/common/App";
import BroadcastReceiver from "../Script/common/BroadcastReceiver";
import Tween from "../Script/common/Tween";
import Utils from "../Script/common/Utils";
import ItemGameLive from "./ItemGameLive";

const { ccclass, property } = cc._decorator;
var ListGame = ["Tài khoản chính", "Live Bacarat", "Live AE Sexy",'SABA Sports'];

var _this = null;
@ccclass
export default class GameLiveController extends cc.Component {

    @property(cc.Node)
    boxLeft: cc.Node = null;
    @property(cc.Node)
    boxRight: cc.Node = null;
    @property([ItemGameLive])
    arrItem: ItemGameLive[] = [];
    @property(DropDown)
    dropFrom: DropDown = null;
    @property(DropDown)
    dropTo: DropDown = null;
    @property(cc.EditBox)
    editMoney: cc.EditBox = null;
    @property(cc.Label)
    txtTotalMoney: cc.Label = null;
	@property(cc.Node)
	nodeWebView:cc.Node
		
	_webview : cc.WebView = null
		
    private balanceAG = 0;
    private balanceIBC = 0;
    private balanceWM = 0;
    private balanceSBO = 0;
    private balanceBanca = 0;
    private balanceEBET = 0;
    private totalMoney = 0;
	
	private balanceAE = 0;
	private balanceBET = 0;
	
	
	private url = "";
	private urlae = "";
	private urlbet = "";
    onLoad() {
        _this = this;
        ListGame = [App.instance.getTextLang("txt_main_account"), "Live AE Sexy",'SABA Sports'];
    }
    show() {
        this.node.setSiblingIndex(this.node.parent.childrenCount);
        this.editMoney.tabIndex = -1;
        this.boxLeft.opacity = 0;
        this.boxLeft.position = new cc.Vec3(0, 200, 0);
        cc.Tween.stopAllByTarget(this.boxLeft);
        cc.tween(this.boxLeft)
            .to(0.5, { position: cc.v3(0, 0, 0), opacity: 255 }, { easing: "backOut" })
            .start();

        this.boxRight.opacity = 0;
        this.boxRight.position = new cc.Vec3(0, -200, 0);
        cc.Tween.stopAllByTarget(this.boxRight);
        cc.tween(this.boxRight)
            .to(0.5, { position: cc.v3(0, 0, 0), opacity: 255 }, { easing: "backOut" })
            .start();

        // this.dropFrom = this.dropFrom.getComponent("DropDown");
        this.dropTo = this.dropTo.getComponent("DropDown");
        this.editMoney.string = "";
        this.initDropFrom();
        this.initDropTo();
        this.totalMoney = Configs.Login.Coin;
        this.updateTotalMoney();
        this.node.active = true;

        for (var i = 0; i < this.arrItem.length; i++) {
            this.arrItem[i].show();
        }
        this.arrItem[0].updateData(Configs.Login.Coin);
		App.instance.showLoading(true);			

        this.updateInfoAG(true);
		this.updateInfoAE(true);
		this.updateInfoBET(true);

    }



    updateInfoAG(isUpdateTotal = false) {
        Http.postz("https://serverlive.hit9.live/coin_game", { game: "Bacarat", type: "GetBalance", nick_name: Configs.Login.Nickname, token: Configs.Login.TokenPayment }, (err, res) => {
             ////Utils.Log("updateInfoAg:" + JSON.stringify(res));
            App.instance.showLoading(false);			
			if (res["status"] == 0) {
                this.url = res.url;
				_this.arrItem[1].updateData(res.newCoin);
				_this.balanceAG = parseInt(res.newCoin);
				if (isUpdateTotal == true) {
					_this.totalMoney += parseInt(res.newCoin);
					_this.updateTotalMoney();
				}
            }
            else {
               // _this.arrItem[1].maintain();
            }
        });
    }
    updateInfoAE(isUpdateTotal = false) {
        Http.postz("https://serverlive.hit9.live/coin_game", { game: "AESEX",type: "GetBalance", nick_name: Configs.Login.Nickname, token: Configs.Login.TokenPayment }, (err, res) => {
            App.instance.showLoading(false);			
			if (res["status"] == 0) {
                this.urlae = res.url;
				_this.arrItem[2].updateData(res.newCoin);
				_this.balanceAE = parseInt(res.newCoin);
				if (isUpdateTotal == true) {
					_this.totalMoney += parseInt(res.newCoin);
					_this.updateTotalMoney();
				}
            }
            else {
               // _this.arrItem[1].maintain();
            }
        });
    }
    
    updateInfoBET(isUpdateTotal = false) {
        Http.postz("https://serverlive.hit9.live/coin_game", { game: "BET",type: "GetBalance", nick_name: Configs.Login.Nickname, token: Configs.Login.TokenPayment }, (err, res) => {
            App.instance.showLoading(false);			
			if (res["status"] == 0) {
                this.urlbet = res.url;
				_this.arrItem[3].updateData(res.newCoin);
				_this.balanceBET = parseInt(res.newCoin);
				if (isUpdateTotal == true) {
					_this.totalMoney += parseInt(res.newCoin);
					_this.updateTotalMoney();
				}
            }
            else {
               // _this.arrItem[1].maintain();
            }
        });
    }
	
	
    initDropFrom() {
        var datas = new Array();
        for (let i = 0; i < ListGame.length; i++) {
            datas.push({ optionString: ListGame[i] });
        }
        this.dropFrom.clearOptionDatas();
        this.dropFrom.addOptionDatas(datas);
        this.dropFrom.selectedIndex = 0;
    }

    initDropTo() {
        var datas = new Array();
        for (let i = 0; i < ListGame.length; i++) {
            datas.push({ optionString: ListGame[i] });
        }
        this.dropTo.clearOptionDatas();
        this.dropTo.addOptionDatas(datas);
        this.dropTo.selectedIndex = 1;
    }

    updateTotalMoney() {
        Tween.numberTo(this.txtTotalMoney, this.totalMoney, 1);
    }

    hide() {
		var self = this;
		self.nodeWebView.active = false   
		self.node.active = false;
		//self.clearAll()
    }

    onToggleDropTo() {

    }

    onToggleDropFrom() {

    }
	loginGame(e: cc.Event.EventTouch, customEventData: string) {
		/*		
		App.instance.showLoading(true);			
		Http.postz("https://serverlive.hit9.live/logingame", {'game' : 'Bacarat', nick_name: Configs.Login.Nickname, token: Configs.Login.TokenPayment }, (err, res) => {
			App.instance.showLoading(false);	
			if(res.status == 0){
			//var self = this;
			//self._webview = self.nodeWebView.getChildByName("nodeWebView").getComponent(cc.WebView)
			//self.nodeWebView.active = true			
			//self._webview.url = res.url;
			
			var url = res.url;
			cc.sys.openURL(url);			
			}else{
				App.instance.ShowAlertDialog(res["msg"]);
			}
		}
		*/
		//var url = this.url;
		//cc.sys.openURL(url);	

		var url = this.url;
		//var url_casino = this.url_casino;
		//var url_evo = this.url_evo;
		var urlae = this.urlae;
		var urlbet = this.urlbet;
		if(customEventData == 'Bacarat'){
		cc.sys.openURL(url);		
		}if(customEventData == 'AESEX'){
		cc.sys.openURL(urlae);		
		}if(customEventData == 'BET'){
		cc.sys.openURL(urlbet);		
		}else{
		cc.sys.openURL(url);		
		}


		
	}

		
    onBtnConfirm() {
         ////Utils.Log("vao day cai ne");
        setTimeout(() => {
            if (this.dropFrom.labelCaption.string == ListGame[0]) {
                //nap
                var money = Utils.formatEditBox(this.editMoney.string) ;
                if (this.editMoney.string == "") {
                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                    return;
                }

                else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                    return;
                }
                else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                }
                switch (this.dropTo.labelCaption.string) {
                    case ListGame[1]:
                        if (money  > Configs.Login.Coin) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
                            return;
                        }
                         ////Utils.Log("Nap:" + _this.arrItem[0].money + " : " + _this.arrItem[1].money + " : " + money);
                        App.instance.showLoading(true);
                        Http.postz("https://serverlive.hit9.live/CashIn", {'amount': money,'game' : 'Bacarat','token': Configs.Login.TokenPayment, 'type': 'CashIn'}, (err, res) => {
                            App.instance.showLoading(false);
                            if (res["status"] == 0) {
                                 ////Utils.Log("Nap AG res:" + JSON.stringify(res));
                                _this.updateInfoAG();
                                _this.arrItem[0].updateData(_this.arrItem[0].money - money );
                                Configs.Login.Coin -= money;
                                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_note_transfer_8"));
                            }
                            else {
                                App.instance.ShowAlertDialog(res["msg"]);
                            }
                        });
                        break;
						
                    case ListGame[2]:
                        if (money  > Configs.Login.Coin) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
                            return;
                        }
                         ////Utils.Log("Nap:" + _this.arrItem[0].money + " : " + _this.arrItem[1].money + " : " + money);
                        App.instance.showLoading(true);
                        Http.postz("https://serverlive.hit9.live/CashIn", {'amount': money,'game' : 'AESEX','token': Configs.Login.TokenPayment, 'type': 'CashIn'}, (err, res) => {
                            App.instance.showLoading(false);
                            if (res["status"] == 0) {
                                 ////Utils.Log("Nap AG res:" + JSON.stringify(res));
                                _this.updateInfoAE();
                                _this.arrItem[0].updateData(_this.arrItem[0].money - money );
                                Configs.Login.Coin -= money;
                                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_note_transfer_8"));
                            }
                            else {
                                App.instance.ShowAlertDialog(res["msg"]);
                            }
                        });
                        break;						
						
                    case ListGame[3]:
                        if (money  > Configs.Login.Coin) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
                            return;
                        }
                         ////Utils.Log("Nap:" + _this.arrItem[0].money + " : " + _this.arrItem[1].money + " : " + money);
                        App.instance.showLoading(true);
                        Http.postz("https://serverlive.hit9.live/CashIn", {'amount': money,'game' : 'BET','token': Configs.Login.TokenPayment, 'type': 'CashIn'}, (err, res) => {
                            App.instance.showLoading(false);
                            if (res["status"] == 0) {
                                 ////Utils.Log("Nap AG res:" + JSON.stringify(res));
                                _this.updateInfoBET();
                                _this.arrItem[0].updateData(_this.arrItem[0].money - money );
                                Configs.Login.Coin -= money;
                                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_note_transfer_8"));
                            }
                            else {
                                App.instance.ShowAlertDialog(res["msg"]);
                            }
                        });
                        break;							
						
                    
                }
            }
            else if (this.dropTo.labelCaption.string == ListGame[0]) {
                //rut
                var money = Utils.formatEditBox(this.editMoney.string) ;
                if (this.editMoney.string == "") {
                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                    return;
                }

                else if (this.dropFrom.labelCaption.string == this.dropTo.labelCaption.string) {
                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                    return;
                }
                else if (this.dropFrom.selectedIndex != 0 && this.dropTo.selectedIndex != 0) {
                    App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                }
                switch (this.dropFrom.labelCaption.string) {
                    case ListGame[1]:
                         ////Utils.Log("Rut:" + this.balanceAG);
                        //ag
                        if (money  > this.balanceAG) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
                            return;
                        }
                        App.instance.showLoading(true);
						Http.postz("https://serverlive.hit9.live/CashIn", {'amount': money,'game' : 'Bacarat','token': Configs.Login.TokenPayment, 'type': 'CashOut'}, (err, res) => {                            App.instance.showLoading(false);
                            if (res["status"] == 0) {
                                _this.updateInfoAG();
                                _this.arrItem[0].updateData(_this.arrItem[0].money + money );
                                Configs.Login.Coin += money;
                                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_note_transfer_9"));
                            }
                            else {
                                App.instance.ShowAlertDialog(res["msg"]);
                            }
                        });
                        break;
						
                    case ListGame[2]:
                         ////Utils.Log("Rut:" + this.balanceAG);
                        //ag
                        if (money  > this.balanceAE) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
                            return;
                        }
                        App.instance.showLoading(true);
						Http.postz("https://serverlive.hit9.live/CashIn", {'amount': money,'game' : 'AESEX','token': Configs.Login.TokenPayment, 'type': 'CashOut'}, (err, res) => {                            App.instance.showLoading(false);
                            if (res["status"] == 0) {
                                _this.updateInfoAE();
                                _this.arrItem[0].updateData(_this.arrItem[0].money + money );
                                Configs.Login.Coin += money;
                                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_note_transfer_9"));
                            }
                            else {
                                App.instance.ShowAlertDialog(res["msg"]);
                            }
                        });
                        break;						
						
                     case ListGame[3]:
                         ////Utils.Log("Rut:" + this.balanceAG);
                        //ag
                        if (money  > this.balanceBET) {
                            App.instance.ShowAlertDialog(App.instance.getTextLang("txt_not_enough"));
                            return;
                        }
                        App.instance.showLoading(true);
						Http.postz("https://serverlive.hit9.live/CashIn", {'amount': money,'game' : 'BET','token': Configs.Login.TokenPayment, 'type': 'CashOut'}, (err, res) => {                            App.instance.showLoading(false);
                            if (res["status"] == 0) {
                                _this.updateInfoBET();
                                _this.arrItem[0].updateData(_this.arrItem[0].money + money );
                                Configs.Login.Coin += money;
                                BroadcastReceiver.send(BroadcastReceiver.USER_UPDATE_COIN);
                                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_note_transfer_9"));
                            }
                            else {
                                App.instance.ShowAlertDialog(res["msg"]);
                            }
                        });
                        break;	                  
                }
            }
            else {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_error"));
                return;
            }
        }, 300)
    }

}
