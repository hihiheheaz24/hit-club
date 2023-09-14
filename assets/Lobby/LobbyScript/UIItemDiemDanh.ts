
import { Global } from "../../Loading/src/Global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIItemDiemDanh extends cc.Component {
    @property(cc.Label)
    txtTitle: cc.Label = null;
    @property(cc.Label)
    txtProgress: cc.Label = null;
    @property(cc.Node)
    btnLam: cc.Node = null;
    @property(cc.Node)
    btnNhanThuong: cc.Node = null;
    @property(cc.Node)
    btnHoanThanh: cc.Node = null;
    @property(cc.Label)
    txtDes1: cc.Label = null;

    private _id1 = 0;
    private _callback12 = null;
    

    getDescription(gameId) {
        var data = {
            title: "",
            des: "",
            progress: "",
        }
        switch (gameId) {
            case 0:
                data = {
                    title: "Cược mỗi ngày",
                    des: "Đạt tổng cược 200k với bất kì game nào",
                    progress: "0/200,000",
                }
                break;
            case 1:
                data = {
                    title: "Cào thẻ xả láng",
                    des: "Tổng nạp thành công ít nhất 500,000đ bằng thẻ cào",
                    progress: "0/500,000",
                }
                break;
            case 2:
                data = {
                    title: "Cảm nhận Momo",
                    des: "Tổng nạp thành công ít nhất 500,000đ qua Momo",
                    progress: "0/500,000",
                }
                break;
        }
        return data;
    }

    init(id, callback) {
        this._id1 = id;
        this._callback12 = callback;
        var {title, des, progress} = this.getDescription(id);
        this.txtProgress.string = "(" + progress +")";
        this.txtDes1.string = des;
        this.txtTitle.string = title;
    
        this.btnLam.active = true;
        this.btnNhanThuong.active = false;
        this.btnHoanThanh.active = false;
    }

    onBtnLam() {
        if(this._id1 === 0 ){
            Global.LobbyController.actGameTaiXiu();
        } else if(this._id1 === 1){
            Global.LobbyController.actAddCoin();
        } else if(this._id1 === 2){
            Global.LobbyController.actAddCoin();
        }
        if(this._callback12){
            this._callback12();
        }
    }
}
