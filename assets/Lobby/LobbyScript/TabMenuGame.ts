

import TabsListGame from "./Lobby.TabsListGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TabMenuGame extends cc.Component {


    @property([cc.Node])
    listTab: cc.Node[] = [];

    @property([cc.Toggle])
    listToggle: cc.Toggle[] = [];

    @property([cc.Node])
    listAllGame: cc.Node[] = [];
    @property([cc.Node])
    listLiveGame: cc.Node[] = [];
    @property([cc.Node])
    listSlotGame: cc.Node[] = [];
    @property([cc.Node])
    listCardGame: cc.Node[] = [];
    @property([cc.Node])
    listMiniGame: cc.Node[] = [];
    @property([cc.Node])
    listGameSport: cc.Node[] = [];
    @property([cc.Node])

    listGameOff: cc.Node[] = [];
    @property(TabsListGame)

    tabListGame: TabsListGame = null;

    startIdxs: number[] = [];

    onLoad() {
        this.listAllGame.forEach(e => {
            if (e) {
                this.startIdxs.push(e.getSiblingIndex());
            }
        });
    }

    onBtnTabAll() {
        for (let i = 0; i < this.listAllGame.length; i++) {
            if (this.listAllGame[i]) {
                if(this.listGameOff.includes(this.listAllGame[i])) {
                    this.listAllGame[i].active = false;
                    continue;
                }          
                this.listAllGame[i].active = true;
                this.listAllGame[i].setSiblingIndex(this.startIdxs[i]);
            }
        }
    }

    onBtnTabSport() {
        this.listAllGame.forEach(e => {
            if (e) e.active = false;
        });
        let idx = 0;
        this.listGameSport.forEach(e => {
            if (e) {
                e.active = true;
                e.setSiblingIndex(idx++);
            }
        });
    }

    onBtnTabLive() {
        this.listAllGame.forEach(e => {
            if (e) e.active = false;
        });
        let idx = 0;
        this.listLiveGame.forEach(e => {
            if (e) {
                e.active = true;
                e.setSiblingIndex(idx++);
            }
        });
    }

    onBtnTabSlot() {
        this.listAllGame.forEach(e => {
            if (e) {
                e.active = false;
                // e.setSiblingIndex(idx++);
            }
        });
        let idx = 0;
        // this.listSlotGame.forEach(e => {
        //     if (e) {
        //         e.active = true;
        //         e.setSiblingIndex(idx++);
        //     }
        // });

        for (let i = 0; i < this.listSlotGame.length; i++) {
            const slotGame = this.listSlotGame[i];
            if(slotGame){
                if(this.listGameOff.includes(slotGame)) {
                    slotGame.active = false;
                    continue;
                }      
                slotGame.active = true;
                slotGame.setSiblingIndex(idx++);
            } 
        }

    }

    onBtnTabMini() {
        this.listAllGame.forEach(e => {
            if (e) {
                e.active = false;
                // e.setSiblingIndex(idx++);
            }
        });
        let idx = 0;
        // this.listMiniGame.forEach(e => {
        //     if (e) {
        //         e.active = true;
        //         e.setSiblingIndex(idx++);
        //     }
        // });

        for (let i = 0; i < this.listMiniGame.length; i++) {
            const miniGame = this.listMiniGame[i];
            if(miniGame){
                if(this.listGameOff.includes(miniGame)) {
                    miniGame.active = false;
                    continue;
                }      
                miniGame.active = true;
                miniGame.setSiblingIndex(idx++);
            } 
        }
    }

    onBtnTabCard() {
        this.listAllGame.forEach(e => {
            if (e) {
                e.active = false;
                // e.setSiblingIndex(idx++);
            }
        });
        let idx = 0;
        // this.listCardGame.forEach(e => {
        //     if (e) {
        //         e.active = true;
        //         e.setSiblingIndex(idx++);
        //     }
        // });

        for (let i = 0; i < this.listCardGame.length; i++) {
            const cardGame = this.listCardGame[i];
            if(cardGame){
                if(this.listGameOff.includes(cardGame)) {
                    cardGame.active = false;
                    continue;
                }      
                cardGame.active = true;
                cardGame.setSiblingIndex(idx++);
            } 
        }
    }
    
    onBtnTabFish() {
        let idx = 0;
        this.listAllGame.forEach(e => {
            if (e) {
                e.active = true;
                e.setSiblingIndex(idx++);
            }
        });
    }
}
