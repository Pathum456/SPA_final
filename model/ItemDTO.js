/**
 * @author _ Pathum_Kaleesha
 * @create - 2022-03-10 - 22.39
 * @since - v0.1.0
 **/
function ItemDTO(itemCode,itemName,itemQTY,price){
    var __itemCode=itemCode;
    var __itemName=itemName;
    var __itemQTY=itemQTY;
    var __price=price;

    this.getItemCode = function () {
        return __itemCode;
    }
    this.getItemName = function () {
        return __itemName;
    }
    this.getItemQTY = function () {
        return __itemQTY;
    }
    this.getPrice = function () {
        return __price;
    }


    this.setItemCode = function (itemCode) {
        __itemCode=itemCode;
    }
    this.setItemName = function (itemName) {
        __itemName=itemName;
    }

    this.setItemQTY = function (itemQTY) {
        __itemQTY=itemQTY;
    }
    this.setPrice = function (price) {
        __price=price;
    }
}