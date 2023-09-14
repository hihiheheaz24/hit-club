import Configs from "../../../Loading/src/Configs";
import Http from "../../../Loading/src/Http";
import App from "../../../Lobby/LobbyScript/Script/common/App";
import Dialog from "../../../Lobby/LobbyScript/Script/common/Dialog";
import ScrollViewControl from "../../../Lobby/LobbyScript/Script/common/ScrollViewControl";
import Utils from "../../../Lobby/LobbyScript/Script/common/Utils";
import TaiXiuMiniController from "./TaiXiuMini.TaiXiuMiniController";

const { ccclass, property } = cc._decorator;

const WIN_CONFIG = {
    0: {money: 200000000, index: 0, total: "4 tỷ"},
    1: {money: 120000000, index: 1, total: "3.5 tỷ"},
    2: {money: 80000000, index: 2, total: "3 tỷ"},
    3: {money: 50000000, index: 3, total: "2.5 tỷ"},
    4: {money: 30000000, index: 4, total: "2 tỷ"},
    5: {money: 20000000, index: 5, total: "1.7 tỷ"},
    6: {money: 20000000, index: 5, total: "1.7 tỷ"},
    7: {money: 15000000, index: 6, total: "1.7 tỷ"},
    8: {money: 15000000, index: 6, total: "1.7 tỷ"},
    9: {money: 10000000, index: 7, total: "1.5 tỷ"},
    10: {money: 10000000, index: 7, total: "1.5 tỷ"},
    11: {money: 10000000, index: 7, total: "1.5 tỷ"},
    12: {money: 8000000, index: 8, total: "1.5 tỷ"},
    13: {money: 8000000, index: 8, total: "1.5 tỷ"},
    14: {money: 8000000, index: 8, total: "1.5 tỷ"},
    15: {money: 5000000, index: 9, total: "1.2 tỷ"},
    16: {money: 5000000, index: 9, total: "1.2 tỷ"},
    17: {money: 5000000, index: 9, total: "1.2 tỷ"},
    18: {money: 5000000, index: 9, total: "1.2 tỷ"},
    19: {money: 5000000, index: 9, total: "1.2 tỷ"},
}

namespace taixiumini {
    @ccclass
    export class PopupHonors extends Dialog {
        @property(cc.Node)
        itemTemplate: cc.Node = null;
        @property([cc.SpriteFrame])
        sprRank: cc.SpriteFrame[] = [];
        private items = new Array<cc.Node>();
        @property(ScrollViewControl)
        scrView: ScrollViewControl = null;
        @property([cc.SpriteFrame])
        sprMoney: cc.SpriteFrame[] = [];
        private dataList = [];

        onLoad(){
            if (this.itemTemplate != null) this.itemTemplate.active = false;
            for (var i = 0; i < 20; i++) {
                let item = cc.instantiate(this.itemTemplate);
                item.parent = this.itemTemplate.parent;
                item["index"] = i;
                this.items.push(item);
            }
            this.itemTemplate.destroy();
            this.itemTemplate = null;
        }

        show() {
            super.show();
            App.instance.showBgMiniGame("TaiXiu");
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].active = false;
            }
        }

        dismiss() {
            super.dismiss();
            for (let i = 0; i < this.items.length; i++) {
                this.items[i].active = false;
            }
            TaiXiuMiniController.instance.playSoundClick();
        }

        _onShowed() {
            super._onShowed();
            this.loadData();
        }

        private loadData() {
            App.instance.showLoading(true);
            Http.get(Configs.App.API, { "c": 101, "mt": Configs.App.MONEY_TYPE, "txType": 1 }, (err, res) => {
                App.instance.showLoading(false);
                if (err != null) return;
                if (res["success"]) {
                    this.dataList = res["topTX"].slice();
                    for (let i = 0; i < this.items.length; i++) {
                        const item = this.items[i]
                        if (i < this.dataList.length){
                            const itemData = this.dataList[i];
                            item.active = true;
                            item.getChildByName("bg").opacity = item['itemID'] % 2 == 0 ? 255 : 0;
                            item.getChildByName("lblRank").getComponent(cc.Label).string = (item['index'] + 1).toString();
                            item.getChildByName("lblAccount").getComponent(cc.Label).string = itemData["username"];
                            item.getChildByName("lblWin").getComponent(cc.Label).string = Utils.formatNumber(itemData["money"]);
                            item.getChildByName("imageWin").getComponent(cc.Sprite).spriteFrame = this.sprMoney[WIN_CONFIG[i]["index"]];
                            if (item['index'] < 3) {
                                item.getChildByName("ic_rank").active = true;
                                item.getChildByName("lblRank").active = false;
                                item.getChildByName("ic_rank").getComponent(cc.Sprite).spriteFrame = this.sprRank[item['index']];
                            } else {
                                item.getChildByName("ic_rank").active = false;
                                item.getChildByName("lblRank").active = true;
                            }
                            item.getChildByName("lbltongcuoc").getComponent(cc.Label).string = WIN_CONFIG[i]["total"];
                            item.getChildByName("lblthuong").getComponent(cc.Label).string = Utils.formatNumber(WIN_CONFIG[i]["money"]);
                        } else {
                            item.active = false;
                        }
                      
                    }
                }



            });
        }
    }

   

}

export default taixiumini.PopupHonors;