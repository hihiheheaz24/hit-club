import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../../../Lobby/LobbyScript/Script/common/App";
import Dialog from "../../../Lobby/LobbyScript/Script/common/Dialog";
import Utils from "../../../Lobby/LobbyScript/Script/common/Utils";
import TaiXiuMiniController from "./TaiXiuMini.TaiXiuMiniController";

const { ccclass, property } = cc._decorator;

namespace taixiumini {
    @ccclass
    export class PopupHistory extends Dialog {
        @property(cc.Node)
        protected btnBack: cc.Node = null;
        @property(cc.Node)
        protected btnNext: cc.Node = null;
        @property(cc.Node)
        protected pageIndexView: cc.Node = null;
        @property(cc.Node)
        protected table: cc.Node = null;
        @property(cc.Prefab)
        protected cell: cc.Prefab = null;
        @property
        protected itemPerPage = 10;
        protected currentPage:number;
        protected totalPage: number;
        protected data = [];
        
        private _initialized:boolean = false;
       

        onLoad() {
            if (this._initialized) { return; }
            this.currentPage = 1;
            this.totalPage = 1;
            this.initTableCells(this.itemPerPage);  
            this._initialized = true;
        }

          // Table
        initTableCells(itemPerPage) {
            for (let i = 0; i < itemPerPage; ++i) {
                const cell = cc.instantiate(this.cell);
                cell.parent = this.table;
                cell.active = false;
            }
        }

        clearTableData() {
            this.table.children.forEach(child => child.active = false);
        }


        show() {
            super.show();
            App.instance.showBgMiniGame("TaiXiu");
            this.currentPage = 1;
            this.totalPage = 1;
            this.btnNext.active = false;
            this.btnBack.active = false;
            this.btnNext.getComponent(cc.Button).interactable = false;
            this.btnBack.getComponent(cc.Button).interactable = false;
            this.clearTableData();
        }

        onUpdateIndexView(pageIndex = 1){
            this.pageIndexView.getComponent(cc.Label).string = "Trang: " + pageIndex.toString();
        }
    
        cancelChangePage() {
            if (this.currentPage !== 1) {
                this.btnBack.getComponent(cc.Button).interactable = true;
                this.btnBack.active = true;
            } else {
                this.btnBack.active = false;
            }
            if (this.data.length >= this.totalPage) {
                this.btnNext.getComponent(cc.Button).interactable = true;
                this.btnNext.active = true;
            } else {
                this.btnNext.active = false;
            }
        }

        onNextButton(){
            this.btnNext.getComponent(cc.Button).interactable = false;
            this.btnBack.getComponent(cc.Button).interactable = false;
            this.currentPage += 1;
            this.onUpdateIndexView(this.currentPage);
            this.loadData(this.currentPage);
        }
    
        onPreviousButton(){
            if(this.currentPage == 1) return;
            this.btnNext.getComponent(cc.Button).interactable = false;
            this.btnBack.getComponent(cc.Button).interactable = false;
            this.currentPage -= 1;
            this.onUpdateIndexView(this.currentPage);
            this.loadData(this.currentPage);
        }
    
    

        dismiss() {
            super.dismiss();
            TaiXiuMiniController.instance.playSoundClick();
        }

        _onShowed() {
            super._onShowed();
            this.loadData(this.currentPage);
           
        }

     

        private loadData(currentPage) {
            App.instance.showLoading(true);
            Http.get(Configs.App.API, { "c": 100, "p": currentPage, "un": Configs.Login.Nickname, "mt": Configs.App.MONEY_TYPE, "txType": 1 }, (err, res) => {
                App.instance.showLoading(false);
                if (err != null) return;
                if (res["success"]) {
                    this.totalPage = res["totalPages"];
                    this.data = res['transactions'];
                    this.updateTableData(res['transactions']);
                   
                } else {
                    this.clearTableData();
                }
            });
        }

       
        updateTableData(listData = []){
            this.btnBack.getComponent(cc.Button).interactable = false;
            this.btnNext.getComponent(cc.Button).interactable = true;
            if(listData.length <= this.currentPage * this.itemPerPage || listData.length < this.itemPerPage) {
                this.btnNext.getComponent(cc.Button).interactable = false;
            }
            this.onUpdateIndexView(this.currentPage);
            this.clearTableData();  
            this.table.children.forEach((item, index) => {
                if (index < listData.length) {
                    const itemData = listData[index];
                    item.getChildByName("lblSession").getComponent(cc.Label).string = itemData["referenceId"];
                    item.getChildByName("lblTime").getComponent(cc.Label).string = itemData["timestamp"].replace(" ", "\n");
                    item.getChildByName("lblBet").getComponent(cc.Label).string = Utils.formatNumber(itemData["betValue"]);
                    const winMoney = + itemData["totalPrize"] - itemData["betValue"];
                    item.getChildByName("lblRefund").getComponent(cc.Label).string = (winMoney > 0 ? "+" : "") + Utils.formatNumber(winMoney);
                    item.getChildByName("lblRefund").getComponent(cc.Label).node.color = winMoney > 0 ? new cc.Color(0,255,0) : new cc.Color(240, 48, 11);
                    let betResult = 0;
                    if(itemData["totalPrize"] > 0 ){
                        betResult = itemData["betSide"];
                    } else {
                        betResult = itemData["betSide"] === 1 ? 0 : 1;
                    }
                    const detailString = "Đặt " + (itemData["betSide"] === 1 ? "Tài" : "Xỉu") + " #" + itemData["referenceId"] 
                    + ". Kết quả " + (betResult === 1 ? "Tài" : "Xỉu")
                    + ", Tổng đặt\n" + Utils.formatNumber(itemData["betValue"])
                    + " Hoàn trả " + Utils.formatNumber(itemData["totalRefund"])
                    + ", Nhận " + Utils.formatNumber(itemData["totalPrize"])


                    if(itemData["betValue"] === itemData["totalRefund"]){
                        item.getChildByName("lblRefund").getComponent(cc.Label).string = "Hoà"
                        item.getChildByName("lblRefund").getComponent(cc.Label).node.color = new cc.Color(240, 255, 255);
                        item.getChildByName("lblBet").getComponent(cc.Label).string = "0";
                    }
                    item.getChildByName("lblDetail").getComponent(cc.Label).string = detailString;
                    
                    item.active = true;
                }
                else {
                    item.active = false;
                }
            });
            this.cancelChangePage();
        }
    }

}
export default taixiumini.PopupHistory;