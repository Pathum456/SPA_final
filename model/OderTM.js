/**
 * @author _ Pathum_Kaleesha
 * @create - 2022-03-10 - 14.45
 * @since - v0.1.0
 **/
function OrderTM(id,name,price,qty,total) {
    this.itemId = id;
    this.itemName = name;
    this.itemPrice = price;
    this.itemQty = qty;
    this.total = total;

    this.getId = function () {
        return this.itemId;
    }
    this.setId = function (id) {
        this.itemId = id;
    }

    this.getName = function () {
        return this.itemName;
    }

    this.setName = function (name) {
        this.itemName = name;
    }
    this.getPrice = function () {
        return this.itemPrice;
    }

    this.setPrice = function (price) {
        this.itemPrice = price;
    }
    this.getQty = function () {
        return this.itemQty;
    }

    this.setQty= function (qty) {
        this.itemQty = qty;
    }

    this.getTotal = function () {
        return this.total;
    }

    this.setTotal= function (total) {
        this.total = total;
    }

}