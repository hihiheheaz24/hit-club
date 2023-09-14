
import Dialog from "../../../Lobby/LobbyScript/Script/common/Dialog";
import TaiXiuMiniController from "./TaiXiuMini.TaiXiuMiniController";
const { ccclass, property } = cc._decorator;

namespace taixiumini {
    @ccclass
    export class PopupInfo extends Dialog { 
        dismiss() {
            super.dismiss();
           
            TaiXiuMiniController.instance.playSoundClick();
        }
    }

}
export default taixiumini.PopupInfo;