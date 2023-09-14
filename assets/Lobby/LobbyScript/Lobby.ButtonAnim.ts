
const {ccclass, property} = cc._decorator;
import { Global } from "../../Loading/src/Global";
var TW = cc.tween
@ccclass
export default class ButtonAnim extends cc.Component {
    progressBar =  null;
    progressBarComp =  null;
    txtPercent = null;
    onLoad(){
        this.progressBar = this.node.getChildByName("ProgressBar");
        this.progressBarComp = this.progressBar.getComponent(cc.ProgressBar);
        this.txtPercent = this.progressBar.getChildByName("txt").getComponent(cc.Label);
        this.progressBar.active = false;
        this.progressBar.progress  = 0;
        this.txtPercent.string = "0%"
    }

    hideProgressBar(){
        this.progressBar.active = false; 
    }

    showProgressBar(){
        this.progressBar.active = true;
        this.progressBar.progress  = 0;
        this.txtPercent.string = "0%"
    }

    updateProgressBar(finish, total){
        this.progressBarComp.progress = Math.max(this.progressBarComp.progress, finish / total);
        this.txtPercent.string = parseInt((finish / total) * 100) + "%";
    }
    

    actGoToXocDia(){
        this.showProgressBar();
        Global.LobbyController.actGoToXocDiaV2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }

    actGoToShootFish(){
        this.showProgressBar();
        Global.LobbyController.actGoToShootFishV2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }


    actGoToSlot1(){
        this.showProgressBar();
        Global.LobbyController.actGoToSlot1V2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }


    actGoToSlot3(){
        this.showProgressBar();
        Global.LobbyController.actGoToSlot3V2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }
    actGoBaiCao(){
        this.showProgressBar();
        Global.LobbyController.actGoToBaiCaoV2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }



    actGoToSlot4(){
        this.showProgressBar();
        Global.LobbyController.actGoToSlot4V2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }


    actGoToSlot6(){
        this.showProgressBar();
        Global.LobbyController.actGoToSlot6V2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }


    actGoToSlot7(){
        this.showProgressBar();
        Global.LobbyController.actGoToSlot7V2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }

    actGoToSlot8(){
        this.showProgressBar();
        Global.LobbyController.actGoToSlot8V2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }

    actGoToSlot10(){
        this.showProgressBar();
        Global.LobbyController.actGoToSlot10V2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }


    actGoToSlot11(){
        this.showProgressBar();
        Global.LobbyController.actGoToSlot11V2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }

    actGameSlot3x3Gem(){
        this.showProgressBar();
        Global.LobbyController.actGameSlot3x3GemV2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }

    actGameMiniPoker(){
        this.showProgressBar();
        Global.LobbyController.actGameMiniPokerV2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }

    actGameCaoThap(){
        this.showProgressBar();
        Global.LobbyController.actGameCaoThapV2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }

    actGameSlot3x3(){
        this.showProgressBar();
        Global.LobbyController.actGameSlot3x3V2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }

    actGoToTLMN(){
        this.showProgressBar();
        Global.LobbyController.actGoToTLMNV2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }
    actGoToTLMNSolo(){
        this.showProgressBar();
        Global.LobbyController.actGoToTLMNSoloV2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }

    actGoToMauBinh(){
        this.showProgressBar();
        Global.LobbyController.actGoToMauBinhV2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }

    actGoToLieng(){
        this.showProgressBar();
        Global.LobbyController.actGoToLiengV2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }

    actGoToSam(){
        this.showProgressBar();
        Global.LobbyController.actGoToSamV2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }
    actGoBaCay(){
        this.showProgressBar();
        Global.LobbyController.actGoToBaCayV2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }


    actGoToPoker(){
        this.showProgressBar();
        Global.LobbyController.actGoToPokerV2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }

    actGotoLoto(){
        this.showProgressBar();
        Global.LobbyController.actGotoLotoV2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }

    actGameBauCua(){
        this.showProgressBar();
        Global.LobbyController.actGameBauCuaV2((finish, total, isDone)=>{
            if(!isDone){
                this.updateProgressBar(finish, total)
            } else {
                this.hideProgressBar();
            }
        });
    }


    


    


    


    


    


    


    

}
