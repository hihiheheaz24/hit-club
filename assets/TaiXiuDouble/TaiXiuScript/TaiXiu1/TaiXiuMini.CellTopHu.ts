import Utils from "../../../Lobby/LobbyScript/Script/common/Utils";
const {ccclass, property} = cc._decorator;


namespace taixiumini {
    @ccclass
    export class CellTopHu extends cc.Component {
    @property(cc.Node)
    protected btnDetail: cc.Node = null;
    protected data = [];

    updateData(data){
        this.data = data;
        this.node.active = true;
        this.node.getChildByName("line").y =  -180;
        this.btnDetail.active = true;
        if(data.listUser.length > 4 ){
            this.btnDetail.active = true;
        } else {
            this.btnDetail.active = false;
        }
        this.node.getChildByName("lblSession").getComponent(cc.Label).string = data["referenceId"];
        this.node.getChildByName("lblTime").getComponent(cc.Label).string = data["time"].replace(" ", "\n");
        this.node.getChildByName("lblSoNguoi").getComponent(cc.Label).string = data["countBet"];
        this.node.getChildByName("lblKetQua").getComponent(cc.Label).string = data["result"]  === 1 ? "Tài" : "Xỉu";
        this.node.getChildByName("lblTienNoHu").getComponent(cc.Label).string = Utils.formatNumber(data["moneyJackpot"]);   
        this.node.getChildByName("DanhSachNoHu").children.forEach((itemMini, indexMini) => {
            if (indexMini < data.listUser.length) {
                if(indexMini < 3 ){
                    itemMini.active = true;
                    itemMini.getChildByName("lblTen").active = true;
                    itemMini.getChildByName("lblTen").getComponent(cc.Label).string =  data.listUser[indexMini]['name'];
                    itemMini.getChildByName("lblTien").active = true;
                    itemMini.getChildByName("lblTien").getComponent(cc.Label).string =  Utils.formatMoney(data.listUser[indexMini]['money']);
                    itemMini.getChildByName("lblMore").active = false;
                } else if(indexMini == 3){
                    if(data.listUser.length === 4){
                        itemMini.active = true;
                        itemMini.getChildByName("lblTen").active = true;
                        itemMini.getChildByName("lblTen").getComponent(cc.Label).string =  data.listUser[indexMini]['name'];
    
                        itemMini.getChildByName("lblTien").active = true;
                        itemMini.getChildByName("lblTien").getComponent(cc.Label).string =  Utils.formatMoney(data.listUser[indexMini]['money']);
    
                        itemMini.getChildByName("lblMore").active = false;
                    } else {
                        itemMini.active = true;
                        itemMini.getChildByName("lblTen").active = false;
                        itemMini.getChildByName("lblTien").active = false;
                        itemMini.getChildByName("lblMore").active = true;
                    }
                } else {
                    itemMini.active = false;
                }
            } else {
                itemMini.active = false;
            }
        })
    }
    onClickSHowDetail(){
        this.btnDetail.active = false;
        this.node.getChildByName("DanhSachNoHu").children.forEach((itemMini, indexMini) => {
            if (indexMini < this.data.listUser.length) {
                itemMini.active = true;
                itemMini.getChildByName("lblTen").active = true;
                itemMini.getChildByName("lblTen").getComponent(cc.Label).string =  this.data.listUser[indexMini]['name'];
                itemMini.getChildByName("lblTien").active = true;
                itemMini.getChildByName("lblTien").getComponent(cc.Label).string =  Utils.formatMoney(this.data.listUser[indexMini]['money']);
                itemMini.getChildByName("lblMore").active = false;
            } else {
                itemMini.active = false;
            }
        })
        this.scheduleOnce(() => {
            this.node.height = this.node.getChildByName("DanhSachNoHu").height;
            this.node.getChildByName("line").y =  -this.node.getChildByName("DanhSachNoHu").height - 5;
        }, 0.0001);
       
    }
}}
export default taixiumini.CellTopHu;