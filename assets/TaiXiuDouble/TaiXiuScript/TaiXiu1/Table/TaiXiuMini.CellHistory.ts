import Utils from "../../../../Lobby/LobbyScript/Script/common/Utils";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CellHistory extends cc.Component {
    @property(cc.Node)
    protected time: cc.Node = null;
    @property(cc.Node)
    protected account: cc.Node = null;
    @property(cc.Node)
    protected bet: cc.Node = null;
    @property(cc.Node)
    protected refund: cc.Node = null;
    @property
    protected height: number = 50;

    onLoad(){
        this.node.height = this.height;
    }

    public updateData(itemData){
        if(!itemData) return;
        const date = new Date(itemData.timestamp);
        const hour    = date.getHours();
        const minute  = date.getMinutes();
        const seconds = date.getSeconds();  
        this.time.getComponent(cc.Label).string = hour + ":" + minute + ":" + seconds;
        this.account.getComponent(cc.Label).string = itemData["username"];
        this.bet.getComponent(cc.Label).string = Utils.formatMoney(itemData["betValue"]);
        this.refund.getComponent(cc.Label).string = Utils.formatMoney(itemData["refund"]);
    }

}
