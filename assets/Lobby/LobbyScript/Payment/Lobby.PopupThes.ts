import Dialog from "../Script/common/Dialog";
import cmd from "../Lobby.Cmd";
import InPacket from "../Script/networks/Network.InPacket";
import MiniGameNetworkClient from "../Script/networks/MiniGameNetworkClient";
import Dropdown from "../Script/common/Dropdown";
import Configs from "../../../Loading/src/Configs";
import App from "../Script/common/App";
import Utils from "../Script/common/Utils";
import SPUtils from "../Script/common/SPUtils";
import Http from "../../../Loading/src/Http";
import BroadcastReceiver from "../Script/common/BroadcastReceiver";
import Clipboards from "../Clipboards";
//import VersionConfig from "../Script/common/VersionConfig";
//import ShootFishNetworkClient from "../Script/networks/ShootFishNetworkClient";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TabBanks extends Dialog {
    @property(cc.Node)
    itemFactorTemplate: cc.Node = null;

    @property(cc.Label)
    lblBankNumber: cc.Label = null;
    @property(cc.Label)
    lblBankAccountName: cc.Label = null;
    @property(cc.Label)
    lblBankAddress: cc.Label = null;

    @property(cc.Label)
    lblTransNote: cc.Label = null;
	@property(cc.Button)
    btnCopy: cc.Button = null;
	@property(cc.Button)
    btnCopyND: cc.Button = null;
    

    @property(Dropdown)
    dropdownBank: Dropdown = null;

    @property(cc.EditBox)
    edbAmount: cc.EditBox = null;
    @property(cc.Node)
    infoBank: cc.Node = null;
    @property(cc.Label)
    lblBankSelectTed: cc.Label = null;

    private _listBank = [];

    start() {
        this.lblTransNote.string = Configs.Login.Nickname;
        this.lblBankAccountName.string = "";
        this.lblBankNumber.string = "";
        App.instance.showLoading(true);
        Http.get(window.localStorage.getItem('api'), { "c": 131 }, (err, res) => {
            App.instance.showLoading(false);
            if (err == null) {
                if(res.data === undefined || res.data.length == 0){

                    return;
                }

                let listBank = res.data;
                this._listBank = listBank;
                let bankName = ["Chọn ngân hàng"];
                for(let i = 0; i < listBank.length; i ++){
                    bankName.push(listBank[i].name);
                }
                this.dropdownBank.setOptions(bankName);
                this.dropdownBank.setOnValueChange((idx) => {
                    if (idx > 0){
                       // this.lblBankAddress.string = listBank[idx - 1].bankAddress;
                       this.lblBankSelectTed.string = listBank[idx - 1].name;
                        // this.lblBankAccountName.string = listBank[idx - 1].bankAccountName;
                        // this.lblBankNumber.string = listBank[idx - 1].bankNumber;
                        this.submit(); 
                    } else {
                       // this.lblBankAddress.string = "";
                        // this.lblBankAccountName.string = "";
                        // this.lblBankNumber.string = "";
                        this.lblBankSelectTed.string = "Chọn ngân hàng";
                    }
                    
                    this.lblBankAccountName.string = "";
                    this.lblBankNumber.string = "";
                })
            }
        });

        this.lblBankSelectTed.string = "Chọn ngân hàng";
		
		this.btnCopy.node.on("click", ()=> {
            if (this.lblBankNumber.string.length > 0) {
                Utils.copy(this.lblBankNumber.string);
				App.instance.alertDialog.showMsg("Đã sao chép số tài khoản.");
            } else {
                App.instance.alertDialog.showMsg("Chưa có số tài khoản.");  
            }
        });
		this.btnCopyND.node.on("click", ()=> {
            if (this.lblTransNote.string.length > 0) {
                Utils.copy(this.lblTransNote.string);
				App.instance.alertDialog.showMsg("Đã sao chép nội dung.");
                
            } else {
                App.instance.alertDialog.showMsg("Chưa có nội dung.");  
            }
        });
        
        MiniGameNetworkClient.getInstance().addListener((data) => {
            let inpacket = new InPacket(data);
            console.log(inpacket.getCmdId());
            switch (inpacket.getCmdId()) {
                case cmd.Code.DEPOSIT_BANK_NEW: {
                    App.instance.showLoading(false);
                    let res = new cmd.ResDepositBankNew(data);
                    switch(res.error){
                        case 0:
                            let databc = JSON.parse(res.data);
                            this.lblBankAccountName.string = databc["phoneName"];
                            this.lblBankNumber.string = databc["phoneNum"];
                            this.lblTransNote.string = databc["code"];
                            break;
                        default:
                            App.instance.alertDialog.showMsg("Dữ liệu lỗi, vui lòng thử lại!");
                    }
                  //  console.log(res.error);
                    break;
                }
            }
        }, this);
    }

    submit() {
        let ddBank = this.dropdownBank.getValue();
        if (ddBank == 0) {
            App.instance.alertDialog.showMsg("Vui lòng chọn ngân hàng.");
            return;
        }
        let bankSelected = this._listBank[ddBank - 1].code;
        
        // var money = Utils.formatEditBox(this.edbAmount.string);
        // if(isNaN(money) || money <= 0){
        //     App.instance.alertDialog.showMsg("Số tiền nạp không hợp lệ");
        //     return;
        // }

        App.instance.showLoading(true);
        MiniGameNetworkClient.getInstance().send(new cmd.ReqDepositBankNew(bankSelected, 0));
    }

	onBtnXacNhan() {
        if (this.node.active) {
		
        
		
            var money = Utils.formatEditBox(this.edbAmount.string);
			//let ddBank = this.dropdownBank.getValue();
			let ddBank = this.dropdownBank.getValue();
			let bankList = this.dropdownBank.getData();
		if (ddBank > 0) {
        
			var bank = bankList[ddBank];
        }
            //var bankNumber = this.editBankNumber.string.trim();
            if (money == 0 || ddBank == null) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_input_all"));
                return;
            }
            if (money < 10000) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_in_min") + " 10.000");
                return;
            }
            if (money > 500000000) {
                App.instance.ShowAlertDialog(App.instance.getTextLang("txt_cash_in_max") + " 500.000.000");
                return;
            }
            var self = this;
            App.instance.showLoading(true, -1);
            //Utils.Log("chuyen khoan:" + encodeURIComponent(this.editName.string.trim()));
            var request = {
                "c": 2003,
                "fn": encodeURIComponent(ddBank),
                "am": money,
                "pt": 1,
                "nn": Configs.Login.Nickname,
                "at": Configs.Login.AccessToken,
                "pn": "manualbank",
                "bc": bank,
                "ds": Configs.Login.Nickname,
                "bn": money
            };
            //this.lbTransMsg.string = request['ds'];
            Http.get(window.localStorage.getItem('api'), request, (err, res) => {
                App.instance.showLoading(false);
                cc.log(res);
                if (res.success == true) {
                    App.instance.ShowAlertDialog("Gửi thông tin nạp tiền thành công!");
                }
                else {
                    App.instance.ShowAlertDialog(res.message);
                }
            });
        }

    }
	onClickCopyBankNumber() {
        if (this.lblBankNumber.string == "") {
            App.instance.alertDialog.showMsg("Vui lòng chọn ngân hàng.");
            return;
        }
        Utils.copy(this.lblBankNumber.string);
        App.instance.ShowAlertDialog("Đã sao chép số tài khoản!");
    }

    onClickCopyBankContent() {
        if (this.lblTransNote.string.length > 0) {
            Utils.copy(this.lblTransNote.string);
            App.instance.alertDialog.showMsg("Đã sao chép nội dung.");
            
        } else {
            App.instance.alertDialog.showMsg("Chưa có nội dung.");  
        }
    }

    

    
}

 