import Configs from "../../Loading/src/Configs";
import Http from "../../Loading/src/Http";
import App from "./Script/common/App";
import Dialog from "./Script/common/Dialog";
import Utils from "./Script/common/Utils";

const TYPE = {
    RUT : 1,
    NAP : 0
};

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupTransactionV2 extends Dialog {
    @property(cc.Node)
    protected btnBack: cc.Node = null;
    @property(cc.Node)
    protected btnNext: cc.Node = null;
    @property(cc.Node)
    protected pageIndexView: cc.Node = null;
    @property(cc.Node)
    protected table: cc.Node = null;
    @property(cc.Prefab)
    protected cell: cc.Prefab = null;
    @property
    protected itemPerPage = 5;
    protected currentPage:number;
    protected totalPage: number;
    protected type: number;
    private _initialized:boolean = false;

    private GameName = {
        110: "Ngũ Long",
        170: "Crypto",
        2: "Tài Xỉu",
        5: "Xèng",
        11: "Tiến Lên",
        160: "Cung Hỷ Phát Tài",
        120: "Thần Tài",
        150: "Sơn Tinh Thủy Tinh",
        1: "MiniPoker",
        3: "Bầu Cua",
        9: "Ba Cây",
        4: "Cao Thấp",
        191: "Ăn Khế Trả Vàng",
        190: "Tài Xỉu Siêu Tốc",
        12: "Xóc Đĩa",
        180: "Kho Báu Tứ Linh",
        197: "Tây Du Ký",
        198: "Kim Cương",
    }
    onLoad() {
        if (this._initialized) { return; }
        this.currentPage = 1;
        this.totalPage = 1;
        this.initTableCells(this.itemPerPage);  
        this._initialized = true;
    }

    // Table
    initTableCells(itemPerPage) {
        for (let i = 0; i < itemPerPage; ++i) {
            const cell = cc.instantiate(this.cell);
            cell.parent = this.table;
            cell.active = false;
        }
    }
    clearTableData() {
        this.table.children.forEach(child => child.active = false);
    }

    show(type = TYPE.RUT) {
        this.type = type;
        super.show();
        this.currentPage = 1;
        this.totalPage = 1;
        this.btnNext.active = false;
        this.btnBack.active = false;
        this.btnNext.getComponent(cc.Button).interactable = false;
        this.btnBack.getComponent(cc.Button).interactable = false;
        this.clearTableData();
    }

    _onShowed() {
        super._onShowed();
        this.loadData(this.currentPage);
    }

    onUpdateIndexView(pageIndex = 1){
        this.pageIndexView.getComponent(cc.Label).string = "Trang: " + pageIndex.toString();
    }

    cancelChangePage() {
        if (this.currentPage !== 1) {
            this.btnBack.getComponent(cc.Button).interactable = true;
            this.btnBack.active = true;
        } else {
            this.btnBack.active = false;
        }
        if ((this.itemPerPage * this.currentPage) < this.totalPage) {
            this.btnNext.getComponent(cc.Button).interactable = true;
            this.btnNext.active = true;
        } else {
            this.btnNext.active = false;
        }
    }

    onNextButton(){
        this.btnNext.getComponent(cc.Button).interactable = false;
        this.btnBack.getComponent(cc.Button).interactable = false;
        this.currentPage += 1;
        this.onUpdateIndexView(this.currentPage);
        this.loadData(this.currentPage);
    }

    onPreviousButton(){
        if(this.currentPage == 1) return;
        this.btnNext.getComponent(cc.Button).interactable = false;
        this.btnBack.getComponent(cc.Button).interactable = false;
        this.currentPage -= 1;
        this.onUpdateIndexView(this.currentPage);
        this.loadData(this.currentPage);
    }

    parseDescriptionJson(item, itemData) {

        var desJson = JSON.parse(itemData["description"]);
        item.getChildByName("Service").getComponent(cc.Label).string = this.GameName[desJson["gameID"]];
        var gameID = desJson["gameID"];
        switch (gameID) {
            case "110": case "170": case "5": case "160": case "120": case "150": case "191": case "180": case "197": case "198":
                //slot
                if (desJson["type"] == 0) {
                    //dat cuocf
                    item.getChildByName("Desc").getComponent(cc.RichText).string = "<color=#e12e0b>Đặt cược : " + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                }
                else if (desJson["type"] == 1) {
                    item.getChildByName("Desc").getComponent(cc.RichText).string = "Thưởng nhân hũ " + this.GameName[desJson["gameID"]];

                }
                else {
                    switch (desJson["result"]) {
                        case 5: case 1:
                            var msg = "<color=#e12e0b>Đặt cược : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>Trả thưởng : +" + Utils.formatNumber(desJson["totalPrizes"]) + "</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 2:
                            var msg = "<color=#e12e0b>Đặt cược : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>Thắng lớn : +" + Utils.formatNumber(desJson["totalPrizes"]) + "</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 3:
                            var msg = "<color=#e12e0b>Đặt cược : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>Nỗ hủ : +" + Utils.formatNumber(desJson["totalPrizes"]) + "</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 4:
                            var msg = "<color=#e12e0b>Đặt cược : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>X2 Nỗ hủ : +" + Utils.formatNumber(desJson["totalPrizes"]) + "</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                    }


                }
                break;
            case "2":
                //tai xiu
                if (desJson["type"] == 6) {
                    var msg = "<color=#fbf2e1>Phiên : #" + desJson["referenceId"] + "\n</color>"
                    msg += "<color=e12e0b>\nCược : " + (desJson["betSide"] == 0 ? "Xỉu" : "Tài") + "</color>";
                    item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                }
                else if (desJson["type"] == 7) {
                    if (desJson["action"] == 0) {
                        var msg = "<color=#fbf2e1>Phiên : #" + desJson["referenceId"] + "\n</color>"
                        msg += "<color=#f0bf0b>Trả Cược : +" + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                        item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                    }
                    else if (desJson["action"] == 1) {
                        var msg = "<color=#fbf2e1>Phiên : #" + desJson["referenceId"] + "\n</color>"
                        msg += "<color=#f0bf0b>Trả Thưởng : +" + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                        item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                    }
                    else if (desJson["action"] == 2) {
                        var msg = "<color=#fbf2e1>Phiên : #" + desJson["referenceId"] + "\n</color>"
                        msg += "<color=#f0bf0b>Hoàn Tiền : +" + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                        item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                    }
                    else if (desJson["action"] == 3) {
                        var msg = "<color=#fbf2e1>Phiên : #" + desJson["referenceId"] + "\n</color>"
                        msg += "<color=#f0bf0b>Nổ Hũ : +" + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                        item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                    }
                }

                break;
            case "3":
                //bau cua
                if (desJson["action"] == 0) {
                    var msg = "<color=#fbf2e1>Phiên : #" + desJson["referenceId"] + "\n</color>"
                    msg += "<color=#e12e0b>Đặt Cược : " + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                    item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                }
                else if (desJson["action"] == 1) {
                    var msg = "<color=#fbf2e1>Phiên : #" + desJson["referenceId"] + "\n</color>"
                    msg += "<color=#f0bf0b>Trả Cược : +" + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                    item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                }
                else if (desJson["action"] == 2) {
                    var msg = "<color=#fbf2e1>Phiên : #" + desJson["referenceId"] + "\n</color>"
                    msg += "<color=#f0bf0b>Trả Thưởng : +" + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                    item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                }

                break;
            case "4":
                //cao thap
                if (desJson["action"] == 0) {
                    var msg = "<color=#fbf2e1>Phiên : #" + desJson["referenceId"] + "  Số bước:" + desJson["step"] + "\n</color>"
                    msg += "<color=#e12e0b>Đặt Cược : " + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                    item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                }
                else if (desJson["action"] == 1) {
                    var msg = "<color=#fbf2e1>Phiên : #" + desJson["referenceId"] + "  Số bước:" + desJson["step"] + "\n</color>"
                    msg += "<color=#f0bf0b>Thắng Thường : +" + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                    item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                }
                else if (desJson["action"] == 2) {
                    var msg = "<color=#fbf2e1>Phiên : #" + desJson["referenceId"] + "  Số bước:" + desJson["step"] + "\n</color>"
                    msg += "<color=#f0bf0b>Nỗ Hũ : +" + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                    item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                }

                break;
            case "11":
                var msg = "<color=#fbf2e1>Phiên : #" + desJson["matchID"] + "\n</color>"
                msg += "<color=#fbf2e1>Phòng : " + desJson["roomID"] + "</color>";
                item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                break;
            case "15":
                var msg = "<color=#fbf2e1>Phiên : #" + desJson["matchID"] + "\n</color>"
                msg += "<color=#fbf2e1>Phòng : " + desJson["roomID"] + "</color>";
                msg += "    <color=#e12e0b>\nCược : " + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                item.getChildByName("Service").getComponent(cc.Label).string = "Xóc Đĩa";
                break;
            case "9":
                var msg = "<color=#fbf2e1>Phiên : #" + desJson["matchID"] + "\n</color>"
                msg += "<color=#fbf2e1>Phòng : " + desJson["roomID"] + "</color>";
                item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                break;
            case "1":
                if (desJson["type"] == 0) {
                    //dat cuoc
                    item.getChildByName("Desc").getComponent(cc.RichText).string = "<color=#e12e0b>Đặt cược : " + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                }
                else if (desJson["type"] == 1) {
                    item.getChildByName("Desc").getComponent(cc.RichText).string = "Thưởng nhân hũ " + this.GameName[desJson["gameID"]];

                }
                else {
                    switch (desJson["result"]) {
                        case 1:
                            var msg = "<color=#e12e0b>Đặt cược : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>Trả thưởng : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - TPS Jackpot</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 2:
                            var msg = "<color=#e12e0b>Đặt cược : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>Trả thưởng : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - Jackpot</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 3:
                            var msg = "<color=#e12e0b>Đặt cược : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>Trả thưởng : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - Tứ Quý</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 4:
                            var msg = "<color=#e12e0b>Đặt cược : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>Trả thưởng : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - Cù Lũ</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 5:
                            var msg = "<color=#e12e0b>Đặt cược : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>Trả thưởng : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - Thùng</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 6:
                            var msg = "<color=#e12e0b>Đặt cược : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>Trả thưởng : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - Sảnh</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 7:
                            var msg = "<color=#e12e0b>Đặt cược : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>Trả thưởng : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - Sám Cô</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 8:
                            var msg = "<color=#e12e0b>Đặt cược : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>Trả thưởng : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - Hai Đôi</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 9:
                            var msg = "<color=#e12e0b>Đặt cược : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>Trả thưởng : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - Đôi J+</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 10:
                            var msg = "<color=#e12e0b>Đặt cược : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>Trả thưởng : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - Đôi J-</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 11:
                            var msg = "<color=#e12e0b>Đặt cược : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>Trả thưởng : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - Bài Cao</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                        case 12:
                            var msg = "<color=#e12e0b>Đặt cược : -" + Utils.formatNumber(desJson["totalbet"]) + "\n</color>";
                            msg += "<color=#f0bf0b>Trả thưởng : +" + Utils.formatNumber(desJson["totalPrizes"]) + " - X2 Jackpot</color>";
                            item.getChildByName("Desc").getComponent(cc.RichText).string = msg;
                            break;
                    }

                }
                break;
        }
        var serviceName = itemData["serviceName"];
        switch (serviceName) {
            case "182":
                item.getChildByName("Service").getComponent(cc.Label).string = "Giftcode";
                var msg1 = "Code : " + desJson["giftCode"] + "\n";
                msg1 += "<color=#f0bf0b>Thưởng : +" + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                item.getChildByName("Desc").getComponent(cc.RichText).string = msg1;
                break;
            case "186":
                item.getChildByName("Service").getComponent(cc.Label).string = "Hoàn trả";
                var msg1 = "Ngày : " + desJson["day"] + "\n";
                msg1 += "<color=#f0bf0b>Hoàn trả : +" + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                item.getChildByName("Desc").getComponent(cc.RichText).string = msg1;
                break;
            case "199":
                item.getChildByName("Service").getComponent(cc.Label).string = "Điểm Danh";
                var msg1 = "<color=#FFFFFF>Thưởng điểm danh hàng ngày</color>";
                item.getChildByName("Desc").getComponent(cc.RichText).string = msg1;
                break;
        }

        var type = desJson["type"];
        switch (type) {
            case 12:
                item.getChildByName("Service").getComponent(cc.Label).string = "Kích soạt SĐT";
                var msg1 = "<color=#f0bf0b>Thưởng : +" + Utils.formatNumber(itemData["moneyExchange"]) + "</color>";
                item.getChildByName("Desc").getComponent(cc.RichText).string = msg1;
                break;

        }
    }

    fakeData(){
        const data = [
            {
                "ID": 453435253,
                "CreatedAt": "27:05:2022 12:12:12",
                "BankCode": "mbBank",
                "TypeCode": "Nạp code Pay",
                "Amount": 200000,
                "Note": "-",
                "Status": 0
            },
            {
                "ID": 453435253,
                "CreatedAt": "27:05:2022 12:12:12",
                "BankCode": "mbBank",
                "TypeCode": "Nạp code Pay",
                "Amount": 200000,
                "Note": "-",
                "Status": 1
            },
            {
                "ID": 453435253,
                "CreatedAt": "27:05:2022 12:12:12",
                "BankCode": "mbBank",
                "TypeCode": "Nạp code Pay",
                "Amount": 200000,
                "Note": "-",
                "Status": 2
            },
            {
                "ID": 453435253,
                "CreatedAt": "27:05:2022 12:12:12",
                "BankCode": "mbBank",
                "TypeCode": "Nạp code Pay",
                "Amount": 200000,
                "Note": "-",
                "Status": 3
            },
            {
                "ID": 453435253,
                "CreatedAt": "27:05:2022 12:12:12",
                "BankCode": "mbBank",
                "TypeCode": "Nạp code Pay",
                "Amount": 200000,
                "Note": "-",
                "Status": 4
            },
        ]
        return data;
    }

    private loadData(currentPage) {
        App.instance.showLoading(true);
        let params = { "c": 2016, "nn": Configs.Login.Nickname, "tt": this.type, "p": currentPage, "mi": this.itemPerPage };
        Http.get(Configs.App.API, params, (err, res) => {
            App.instance.showLoading(false);
            if (err != null) {
                return;
            }
            if (res["success"]) {
                this.totalPage = res["totalRecords"];
                this.updateTableData(res['data']);
            } else {
                this.clearTableData();
            }
        });
    }

    updateTableData(listData = []){
        //if(listData.length == 0)  listData = this.fakeData();
        this.btnBack.getComponent(cc.Button).interactable = false;
        this.btnNext.getComponent(cc.Button).interactable = true;
        if(listData.length <= this.currentPage * this.itemPerPage || listData.length < this.itemPerPage) {
            this.btnNext.getComponent(cc.Button).interactable = false;
        }
        this.onUpdateIndexView(this.currentPage);
        this.clearTableData();  
        this.table.children.forEach((item, index) => {
            if (index < listData.length) {
                const data = listData[index];
                item.getChildByName('lbID').getComponent(cc.Label).string = data['ID'];
                item.getChildByName('lbTime').getComponent(cc.Label).string = data['CreatedAt'].replace(" ", "\n");
                item.getChildByName("lbBank").getComponent(cc.Label).string = data['BankCode'];
                item.getChildByName("lbType").getComponent(cc.Label).string = data['TypeCode'];
                item.getChildByName("lbNote").getComponent(cc.Label).string = data['Note'];
                item.getChildByName("lbAmount").getComponent(cc.Label).string = Utils.formatNumber(data['Amount']);
                switch (data['Status']) {
                    case 0:
                        item.getChildByName("lbStatus").getComponent(cc.Label).string = App.instance.getTextLang('txt_pending');
                        item.getChildByName("lbStatus").color = cc.Color.YELLOW;
                        break;
                    case 1:
                        item.getChildByName("lbStatus").getComponent(cc.Label).string = App.instance.getTextLang('txt_receive2');
                        item.getChildByName("lbStatus").color = cc.Color.YELLOW;
                        break;
                    case 4:
                    case 2:
                        item.getChildByName("lbStatus").getComponent(cc.Label).string = App.instance.getTextLang('txt_success');
                        item.getChildByName("lbStatus").color = cc.Color.GREEN;
                        break;
                    case 3:
                        item.getChildByName("lbStatus").getComponent(cc.Label).string = App.instance.getTextLang('txt_failed');
                        item.getChildByName("lbStatus").color = cc.Color.RED;
                        break;
                    case 12:
                        item.getChildByName("lbStatus").getComponent(cc.Label).string = App.instance.getTextLang('txt_request_cashout');
                        item.getChildByName("lbStatus").color = cc.Color.CYAN;
                        break;

                    default:
                        item.getChildByName("lbStatus").getComponent(cc.Label).string = App.instance.getTextLang('txt_receive2');
                        item.getChildByName("lbStatus").color = cc.Color.WHITE;

                }  
                item.active = true;
            }
            else {
                item.active = false;
            }
        });
        this.cancelChangePage();
    }

    convertNameThirdParty(serviceName) {
        switch (serviceName) {
            case "WM_DEPOSIT":
            case "WM_WITHDRAW":
                return "Live casino WM";
            case "IBC2_DEPOSIT":
            case "IBC2_WITHDRAW":
                return "Sơn Tinh Thủy Tinh IBC";
            case "SBO_DEPOSIT":
            case "SBO_WITHDRAW":
                return "Sơn Tinh Thủy Tinh SBO";
            case "AG_DEPOSIT":
            case "AG_WITHDRAW":
                return "Live casino AG";
            case "CMD_DEPOSIT":
            case "CMD_WITHDRAW":
                return "Sơn Tinh Thủy Tinh CMD368";
            case "FISH_DEPOSIT":
            case "FISH_WITHDRAW":
                return "Bắn Cá";
            case "EBET_DEPOSIT":
            case "EBET_WITHDRAW":
                return "Live EBET";
            case "Cashout":
                return "Rút tiền";
            case "190":
                return "Tài Xỉu Siêu Tốc";
            case "201":
                return "Lì Xì Giờ Vàng";
            case "202":
                return "Giới Thiệu Bạn Bè";
            default:
                return serviceName
        }
    }
}
