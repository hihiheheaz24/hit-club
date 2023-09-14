import Dialog from "./Dialog";
import { Global } from "../../../../Loading/src/Global";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupBannerTheDialog extends Dialog {

    actConfirm(){
        Global.LobbyController.actAddCoin();
        this.dismiss();
    }

    actKhongHienThiLai(){
        window.localStorage.setItem("popupThe", "1");    
        this.dismiss();
    }
}
