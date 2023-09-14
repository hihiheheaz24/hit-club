import TaiXiuMiniController from "./../TaiXiuMini.TaiXiuMiniController";
const { ccclass, property } = cc._decorator;

@ccclass
export default class TableHistory extends cc.Component {
    @property(cc.Node)
    protected table: cc.Node = null;
    @property(cc.Prefab)
    protected cell: cc.Prefab = null;
    @property(cc.Node)
    protected btnSortTime: cc.Node = null;
    @property(cc.Node)
    protected btnSortMoney: cc.Node = null;
    @property(cc.Node)
    protected btnBack: cc.Node = null;
    @property(cc.Node)
    protected btnNext: cc.Node = null;
    @property(cc.Node)
    protected pageIndexView: cc.Node = null;
    @property
    protected itemPerPage = 7;
    private _initialized:boolean = false;
    protected currentPage:number;
    protected totalPage: number;
    protected currentMoneyReverse: number = 1;
    protected currentTimeReverse: number = 1;
    protected currentSortType: string = 'TIME';
    protected data = [];
    onLoad(){
        if (this._initialized) { return; }
        this.currentPage = 1;
        this.totalPage = 1;
        this.initTableCells(this.itemPerPage);  
        this._initialized = true;
    }

    updateData(data){
        this.node.active = true;
        this.currentPage = 1;
        this.btnBack.getComponent(cc.Button).interactable = false;
        this.btnNext.getComponent(cc.Button).interactable = true;
        if(data.length <= this.currentPage * this.itemPerPage || data.length < this.itemPerPage) {
            this.btnNext.getComponent(cc.Button).interactable = false;
        }
        this.onUpdateIndexView(this.currentPage);
        this.clearTableData();
        this.updateTableData(data);
    }

    onUpdateIndexView(pageIndex = 1){
        this.pageIndexView.getComponent(cc.Label).string = pageIndex.toString();
    }

    cancelChangePage() {
        if (this.currentPage !== 1) this.btnBack.getComponent(cc.Button).interactable = true;
        if (this.currentPage < this.totalPage) this.btnNext.getComponent(cc.Button).interactable = true;
    }

    onNextButton(){
        TaiXiuMiniController.instance.playSoundClick();
        this.btnNext.getComponent(cc.Button).interactable = false;
        this.btnBack.getComponent(cc.Button).interactable = false;
        this.currentPage += 1;
        this.onUpdateIndexView(this.currentPage);
        this.updateTableDataByIndex(this.currentPage);
    }

    onPreviousButton(){
        TaiXiuMiniController.instance.playSoundClick();
        if(this.currentPage == 1) return;
        this.btnNext.getComponent(cc.Button).interactable = false;
        this.btnBack.getComponent(cc.Button).interactable = false;
        this.currentPage -= 1;
        this.onUpdateIndexView(this.currentPage);
        this.updateTableDataByIndex(this.currentPage);
    }

    onSortMoneyButton(){
        TaiXiuMiniController.instance.playSoundClick();
        this.currentSortType = "MONEY";
        this.currentMoneyReverse =  -1 * this.currentMoneyReverse;
        this.sortByType(this.currentSortType);
        this.updateTableDataByIndex(this.currentPage);
    }

    onSortTimeButton(){
        TaiXiuMiniController.instance.playSoundClick();
        this.currentSortType = "TIME";
        this.currentTimeReverse =  -1 * this.currentTimeReverse;
        this.sortByType(this.currentSortType);
        this.updateTableDataByIndex(this.currentPage);
    }

    // Table
    initTableCells(itemPerPage) {
        for (let i = 0; i < itemPerPage; ++i) {
            const cell = cc.instantiate(this.cell);
            cell.parent = this.table;
            cell.active = false;
        }
    }

    updateTableData(data) {
        this.data = data;
        this.totalPage = Math.ceil(this.data.length / this.itemPerPage);
        this.sortByType(this.currentSortType);
        this.updateTableDataByIndex(this.currentPage);
    }
    
    updateTableDataByIndex(pageIndex) {
        const start = (pageIndex - 1)*this.itemPerPage;
        const end = start + this.itemPerPage;
        const newData = this.data.slice( start, end);
        this.table.children.forEach((child, index) => {
            if (index < newData.length) {
                child.getComponent("TaiXiuMini.CellHistory").updateData(newData[index]);
                child.active = true;
            }
            else {
                child.active = false;
            }
        });
        this.cancelChangePage();
    }

    sortByType(currentSortType){
        if(currentSortType === "MONEY"){
            this.btnSortMoney.opacity = 255;
            this.btnSortTime.opacity = 150;
            this.sortByMoney(this.currentMoneyReverse);
        } else {
            this.sortByTime(this.currentTimeReverse);  
            this.btnSortMoney.opacity = 150;
            this.btnSortTime.opacity = 255;
        }
    }

    sortByMoney(reverse = 1){
        if(reverse === 1){
            this.data = this.data.sort((a, b) => parseFloat(b.betValue) - parseFloat(a.betValue));
        } else {
            this.data = this.data.sort((a, b) => parseFloat(a.betValue) - parseFloat(b.betValue));
        }
        this.btnSortMoney.angle = reverse === 1 ? 0 : 180;
       
    }

    sortByTime(reverse = 1){
        if(reverse === 1){
            this.data = this.data.sort((a, b) => parseFloat(b.timestamp) - parseFloat(a.timestamp));
        } else {
            this.data = this.data.sort((a, b) => parseFloat(a.timestamp) - parseFloat(b.timestamp));
        }
        this.btnSortTime.angle = reverse === 1 ? 0 : 180; 
    }

    clearTableData() {
        this.table.children.forEach(child => child.active = false);
    }

    onReset(){
        this.currentSortType = "TIME";
        this.currentMoneyReverse = 1;
        this.currentTimeReverse = 1;
        this.btnSortMoney.angle = 0;
        this.btnSortTime.angle = 0;
    }
}
