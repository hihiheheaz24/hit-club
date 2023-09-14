import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../../../Lobby/LobbyScript/Script/common/App";
import Dialog from "../../../Lobby/LobbyScript/Script/common/Dialog";
import Utils from "../../../Lobby/LobbyScript/Script/common/Utils";
import TaiXiuMiniController from "./TaiXiuMini.TaiXiuMiniController";

const { ccclass, property } = cc._decorator;

namespace taixiumini {
    @ccclass
    export class PopupTopHu extends Dialog {
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
        @property(cc.Prefab)
        protected cellMini: cc.Prefab = null;
        protected itemPerPage = 2;
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
                const chillTable = cell.getChildByName("DanhSachNoHu");
                for (let ii = 0; ii < 20; ++ii) {
                    const cellMini = cc.instantiate(this.cellMini);
                    cellMini.parent = chillTable;
                    cellMini.active = false;
                }
            }
        }

        clearTableData() {
            this.table.children.forEach(child => {
                child.active = false;
                child.height = 185;
                child.getChildByName("DanhSachNoHu").children.forEach(childMini => childMini.active = false);
            });
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
            if (this.currentPage < this.totalPage) {
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
            this.updateTableData(this.data, this.currentPage);
        }
    
        onPreviousButton(){
            if(this.currentPage == 1) return;
            this.btnNext.getComponent(cc.Button).interactable = false;
            this.btnBack.getComponent(cc.Button).interactable = false;
            this.currentPage -= 1;
            this.onUpdateIndexView(this.currentPage);
            this.updateTableData(this.data, this.currentPage);
        }
    
        dismiss() {
            super.dismiss();
            TaiXiuMiniController.instance.playSoundClick();
        }

        _onShowed() {
            super._onShowed();
            this.loadData();
           
        }

     

        private loadData() {
            App.instance.showLoading(true);
            Http.get(Configs.App.API, { "c": 2049}, (err, res) => {
                App.instance.showLoading(false);
                if (err != null) return;
                if (res["success"]) {
                    this.totalPage =  Math.ceil(res["transactions"].length/this.itemPerPage);
                    res['transactions'] = res['transactions'].reverse();
                    this.data = res['transactions'];
                    this.updateTableData(res['transactions'], this.currentPage);
                   
                } else {
                    this.clearTableData();
                }
            });
        }

       
        updateTableData(listData = [], currentPage){
            const newData = [];
            let startIndex = currentPage * this.itemPerPage - this.itemPerPage;
            for (let i = 0 ; i< listData.length; i++){
                if(i>= startIndex && i < (startIndex+this.itemPerPage)){
                    newData.push(listData[i])
                }
            }
          
            this.btnBack.getComponent(cc.Button).interactable = false;
            this.btnNext.getComponent(cc.Button).interactable = true;
            if(currentPage <= this.totalPage) {
                this.btnNext.getComponent(cc.Button).interactable = false;
            }
            this.onUpdateIndexView(currentPage);
            this.clearTableData();  
            this.table.children.forEach((item, index) => {
                if (index < newData.length) {
                    const itemData = newData[index];
                    const listUser = [];
                    //itemData['data'] = "AccDaizzgia|5145044,VanWeeday|4298969,ngoaihinh11|354436,ngoaihinh12|354436,ngoaihinh12|354436,ngoaihinh13|354436"
                    const arrayUser = itemData["data"].split(",");
                    arrayUser.forEach(userItem =>{
                        const userData = userItem.split("|");
                        listUser.push({"name":userData[0], "money": userData[1]});
                    })
                    itemData["listUser"] = listUser;
                    item.getComponent("TaiXiuMini.CellTopHu").updateData(itemData);
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
export default taixiumini.PopupTopHu;