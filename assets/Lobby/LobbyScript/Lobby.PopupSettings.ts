
import Dialog from "./Script/common/Dialog";
import BroadcastReceiver from "./Script/common/BroadcastReceiver";
import SPUtils from "./Script/common/SPUtils";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends Dialog {
    @property(cc.Toggle)
    toggleMusic: cc.Toggle = null;
    @property(cc.Toggle)
    toggleSound: cc.Toggle = null;
    @property(cc.Toggle)
    toggleAuto: cc.Toggle = null;

    start(){
        if(this.toggleMusic){
            this.toggleMusic.node.on("toggle", () => {
                SPUtils.setMusicVolumn(this.toggleMusic.isChecked ? 1 : 0);
                BroadcastReceiver.send(BroadcastReceiver.ON_AUDIO_CHANGED);
            });
            this.toggleSound.node.on("toggle", () => {
                SPUtils.setSoundVolumn(this.toggleSound.isChecked ? 1 : 0);
                BroadcastReceiver.send(BroadcastReceiver.ON_AUDIO_CHANGED);
            });

            this.toggleAuto.node.on("toggle", () => {
              
            });
        }
       
    }

    show() {
        super.show();
        if(this.toggleMusic){
            this.toggleMusic.isChecked = SPUtils.getMusicVolumn() > 0;
            this.toggleSound.isChecked = SPUtils.getSoundVolumn() > 0;
        }
       
    }
  
}
