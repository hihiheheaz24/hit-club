
import Http from "../../../Loading/src/Http";
import Configs from "../../../Loading/src/Configs";
import TaiXiuMiniController from "./TaiXiuMini.TaiXiuMiniController";
import Dialog from "../../../Lobby/LobbyScript/Script/common/Dialog";
import Utils from "../../../Lobby/LobbyScript/Script/common/Utils";
import App from "../../../Lobby/LobbyScript/Script/common/App";
import TaiXiuMiniTableHistory from "./Table/TaiXiuMini.TableHistory";
const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupDetailHistory extends Dialog {
    @property(cc.Label)
    lblSession: cc.Label = null;
    @property(cc.Label)
    lblResult: cc.Label = null;
    @property(cc.Label)
    lblTotalBetTai: cc.Label = null;
    @property(cc.Label)
    lblTotalBetXiu: cc.Label = null;
    @property(cc.Label)
    lblTotalPersonTai: cc.Label = null;
    @property(cc.Label)
    lblTotalPersonXiu: cc.Label = null;
    @property([cc.SpriteFrame])
    sfDices: cc.SpriteFrame[] = [];
    @property(cc.Sprite)
    sprDice1: cc.Sprite = null;
    @property(cc.Sprite)
    sprDice2: cc.Sprite = null;
    @property(cc.Sprite)
    sprDice3: cc.Sprite = null;
    @property(cc.Sprite)
    sprResult: cc.Sprite = null;
    @property(cc.Node)
    sprResult_Tai: cc.Node = null;
    @property(cc.Node)
    sprResult_Xiu: cc.Node = null;

    @property(TaiXiuMiniTableHistory)
    tableHistoryTai: TaiXiuMiniTableHistory = null;
    @property(TaiXiuMiniTableHistory)
    tableHistoryXiu: TaiXiuMiniTableHistory = null;

    private session: number = 0;
    private historiesTai = [];
    private historiesXiu = [];
    private totalBetTai = 0;
    private totalRefundTai = 0;
    private totalBetXiu = 0;
    private totalRefundXiu = 0;

    showDetail(session: number) {
        this.session = session;
        this.show();
    }

    show() {
        super.show();
        App.instance.showBgMiniGame("TaiXiu");
        this.onReset();
    }

    _onShowed() {
        super._onShowed();
        this.loadData();
    }

    dismiss() {
        super.dismiss();
        TaiXiuMiniController.instance.playSoundClick();
    }

    private loadData() {
        App.instance.showLoading(true);
        Http.get(Configs.App.API, { "c": 102, "rid": this.session, "mt": Configs.App.MONEY_TYPE }, (err, res) => {
            if (err != null) return;
            this.historiesTai = [];
            this.historiesXiu = [];
            App.instance.showLoading(false);
            if (res.success && res["resultTX"] !== null) {
                cc.warn("res", res)
                const date = this.getTime(res["resultTX"]["timestamp"]).date;
                //  cc.log("HISTORY SESSION:", JSON.stringify(res));
                for (var i = 0; i < res["transactions"].length; i++) {
                    var itemData = res["transactions"][i];
                    itemData['timestamp'] = date.getTime() + itemData["inputTime"] * 60000;
                    if (itemData["betSide"] === 1) {
                        this.historiesTai.push(itemData);
                        this.totalBetTai += itemData["betValue"];
                        this.totalRefundTai += itemData["refund"];

                    } else {
                        this.historiesXiu.push(itemData);
                        this.totalBetXiu += itemData["betValue"];
                        this.totalRefundXiu += itemData["refund"];
                    }
                }
                const {h,m,s} = this.getTime(res["resultTX"]["timestamp"]);
                this.lblSession.string = "#" + res["resultTX"]["referenceId"] + "(" + h + ":" + m + ":" + s + ")";
                const totalResult = res["resultTX"]["dice1"] + res["resultTX"]["dice2"] + res["resultTX"]["dice3"]
                this.lblResult.string = totalResult;
                this.sprDice1.spriteFrame = this.sfDices[res["resultTX"]["dice1"]];
                this.sprDice1.node.active = true;
                this.sprDice2.spriteFrame = this.sfDices[res["resultTX"]["dice2"]];
                this.sprDice2.node.active = true;
                this.sprDice3.spriteFrame = this.sfDices[res["resultTX"]["dice3"]];
                this.sprDice3.node.active = true;
                this.lblTotalBetTai.string = Utils.formatMoney(this.totalBetTai) + "/" + Utils.formatMoney(this.totalRefundTai);
                this.lblTotalBetXiu.string = Utils.formatMoney(this.totalBetXiu) + "/" + Utils.formatMoney(this.totalRefundXiu);
                this.lblTotalPersonTai.string = this.historiesTai.length.toString();
                this.lblTotalPersonXiu.string = this.historiesXiu.length.toString();
                if (res["resultTX"]["result"] == 1) {
                    this.playAnimWin(this.sprResult_Tai);  
                } else {
                    this.playAnimWin(this.sprResult_Xiu);
                }
                this.updateTableData();

            }
        });
    }

    getTime(timeString){
        const h = parseInt(timeString.slice(0,2));
        const m = parseInt(timeString.slice(3,5));
        const s = parseInt(timeString.slice(6,8));
        const day = parseInt(timeString.slice(9,11));
        const mon = parseInt(timeString.slice(12,14));
        const year = parseInt(timeString.slice(15,19));
        const newDate = new Date(year, mon, day, h, m, s);
        return {h,m,s,day,mon,year,date: newDate};

    }

    private playAnimWin(animNode) {
        cc.Tween.stopAllByTarget(this.sprResult_Tai);
        cc.Tween.stopAllByTarget(this.sprResult_Xiu);
        this.sprResult_Tai.scale = 0.6;
        this.sprResult_Xiu.scale = 0.6;
        cc.tween(animNode).repeatForever(
            cc.tween().sequence(
                cc.tween().to(0.3, { scale: 0.7 }),
                cc.tween().to(0.3, { scale: 0.6 }),
                cc.tween().to(0.3, { scale: 0.5 }),
                cc.tween().to(0.3, { scale: 0.6 })))
            .start();
    }

    private updateTableData() {
        this.tableHistoryTai.updateData(this.historiesTai)
        this.tableHistoryXiu.updateData(this.historiesXiu)
    }

    public actNextSession() {
        TaiXiuMiniController.instance.playSoundClick();
        this.session++;
        if (this.session > TaiXiuMiniController.instance.histories[TaiXiuMiniController.instance.histories.length - 1].session) {
            this.session = TaiXiuMiniController.instance.histories[TaiXiuMiniController.instance.histories.length - 1].session;
            return;
        }
        this.loadData();
    }
    
    public actPrevSession() {
        TaiXiuMiniController.instance.playSoundClick();
        this.session--;
        this.loadData();
    }

    public onReset() {
        this.sprDice1.node.active = false;
        this.sprDice2.node.active = false;
        this.sprDice3.node.active = false;
        this.lblSession.string = "";
        this.lblResult.string = "";
        this.lblTotalPersonTai.string = "";
        this.lblTotalPersonXiu.string = "";
        this.totalBetTai = 0;
        this.totalBetXiu = 0;
        this.totalRefundTai = 0;
        this.totalRefundXiu = 0;
        this.tableHistoryXiu.onReset();
        this.tableHistoryTai.onReset();

    }


}
