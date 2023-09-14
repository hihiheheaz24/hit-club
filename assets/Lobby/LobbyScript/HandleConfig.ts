// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

   
    @property(cc.String)
    linkAPI: string = ''; // Link API điền vào đây

    @property(cc.Node)
    btnNap : cc.Node = null;

    @property(cc.Node)
    btnRut : cc.Node = null;
    version: any;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.version =  cc.sys.localStorage.getItem('versionClient') || "1.0.0";
        this.getConfigLink();
    }

    start () {

    }

    getConfigLink(){
        let http = cc.loader.getXMLHttpRequest();
		http.open("GET", this.linkAPI, true);
		http.setRequestHeader('Content-Type', 'application/json');
		http.onreadystatechange = () => {//Call a function when the state changes.
			if (http.readyState === 4 && (http.status >= 200 && http.status < 300)) {
                console.log("data load duowc la " + http.responseText);
                if(http.responseText == "") return;
                let data = null;  
                data = JSON.parse(http.responseText);
                if (data == null) {
                    console.log("data config = null")
                    return;
                }
                if(this.version === "2.0.0"){
                    if(!data.isRut){
                        this.btnRut.active = false;
                    }
                    else{
                        this.btnRut.active = true;
                    }
                    if(!data.isNap){
                        this.btnNap.active = false;
                    }
                    else{
                        this.btnNap.active = true;
                    }
                }
             
            }
        }
          
          http.onerror = ()=>{
            console.log("load config error")
          }
          
          http.ontimeout = ()=>{
            console.log("load config time out")
          }
		http.send();
    }

    // update (dt) {}
}
