/**
    * @author _ Pathum_Kaleesha
    * @create - 2022-03-13 - 14.47
    * @since - v0.1.0 - CSS
**/

function OrderDetailDTO(itemId,orderId,itemQuantity,itemPrice,total) {
    this.itemId=itemId;
    this.orderId=orderId;
    this.itemQuantity=itemQuantity;
    this.itemPrice=itemPrice;
    this.total=total;
this.setItemId=function(itemId){
    this.itemId=itemId;
}
this.getItemId=function(){
    return this.itemId;
}
this.setOrderId=function(orderId){
    this.orderId=orderId;
}
this.getOrderId=function(){
    return this.orderId;
}
this.setItemQuantity=function(itemQuantity){
    this.itemQuantity=itemQuantity;
}
this.getItemQuantity=function(){
    return this.itemQuantity;
}
this.setItemPrice=function(itemPrice){
    this.itemPrice=itemPrice;
}
this.getItemPrice=function(){
    return this.itemPrice;
}
this.setTotal=function(total){
    this.total=total;
}
this.getTotal=function(){
    return this.total;
}}