{
    loadOrderId();
}
function loadOrderId() {
    if ($("#orderId").val() == "") {
        $("#orderId").val("001");
    } else {
        var value = parseInt($("#orderId").val());
        value++;
        $("#orderId").val(value);
    }
}
$("#btnPurchase").click(function () {
    if ($("#date").val() == "") {
        $("#date").css('border', '2px solid red');
    } else {
        loadOrderId();
        $("#orderFormCustomerName,#orderFormCustomerAddress,#orderFormCustomerTp,#date").val("");
        $("#orderFormTableBody").empty();
    }
});
function loadItemId() {
    $("#orderFormItemId").empty();
    itemDB.forEach(function (e) {
        $("#orderFormItemId").append($("<option></option>").attr("value", e).text(e.getItemCode()));
    });
}
function loadCustomerId() {
    $("#orderFormCstId").empty();
    //$("#orderFormCstId").append($("<option></option>").attr("value",e).text(--select Id--));*!/
    customerDB.forEach(function (e) {
        $("#orderFormCstId").append($("<option></option>").attr("value", e).text(e.getID()));
    });
}
$("#orderFormCstId").click(function () {
    var selectedId = $("#orderFormCstId option:selected").text();
    setCustomerData(selectedId);
});
function setCustomerData(id) {
    for (var i = 0; i < customerDB.length; i++) {
        if (customerDB[i].getID() == id) {
            $("#orderFormCustomerName").val(customerDB[i].getName());
            $("#orderFormCustomerAddress").val(customerDB[i].getAddress());
            $("#orderFormCustomerTp").val(customerDB[i].getContact());
        }
    }
}
$("#orderFormItemId").click(function () {
    var selectedId = $("#orderFormItemId option:selected").text();
    setItemData(selectedId);
});
function setItemData(id) {
    for (var j = 0; j < itemDB.length; j++) {
        if (itemDB[j].getItemCode() == id) {
            $("#orderFormItemName").val(itemDB[j].getItemName());
            $("#orderFormQty").val(itemDB[j].getItemQTY());
            $("#orderFormPrice").val(itemDB[j].getPrice());
        }
    }
}
$("#btnAddItem").click(function () {
    countTotal();
    if ($("#orderFormItemId option:selected").text() == "" || $("#orderFormCstId option:selected").text() == "") {
        alert("Please select the Customer Id and Item Id");
        clearOrderItem();
    } else {
        updateItemDatabase();
        saveOrder();
        loadTable();
        $("#orderFormTableBody>tr>td>button").click(function () {
            let text = "Confirm the remove of this item..!"
            if (confirm(text)) {
                $(this).closest('tr').remove();
                let orderId = $("#orderId").val();
                let id = $(this).closest('tr').children(":eq(0)").text();
                let qty = parseInt($(this).closest('tr').children(":eq(3)").text());
                removeItem(orderId, id, qty);
            }
        });
    }
});
function removeItem(orderId, id, qty) {
    /!*update itemDB*!/
    for (let i = 0; i < itemDB.length; i++) {
        if (id == itemDB[i].getItemCode()) {
            let preQty = itemDB[i].getItemQTY();
            preQty += qty;
            itemDB[i].set(preQty);
        }
    }
    /!*update orderDB*!/
    for (let j = 0; j < OrderDB.length; j++) {
        if (id == OrderDB[j].getOrderItemId() && orderId == OrderDB[j].getOrderId()) {
            OrderDB.splice(j, 1);
        }
    }
}
function countTotal() {
    var total;
    var displayTotal = parseInt($("#total").text());
    if (displayTotal == 0) {
        total = (parseInt($("#orderQty").val())) * (parseInt($("#orderFormPrice").val()));
        $("#total").text(total + ".00 /=");
    } else {
        var sum = displayTotal + (parseInt($("#orderQty").val())) * (parseInt($("#orderFormPrice").val()));
        $("#total").text(sum + ".00 /=");
    }
    displayTotal = parseInt($("#total").text());
    if (displayTotal > 100 || displayTotal < 1000) {
        $("#txtDiscount").val("5%");
        var subTotal = displayTotal - ((displayTotal * 5) / 100);
        $("#subTotal").text(subTotal + " /=");
    } else if (displayTotal > 1000) {
        $("#txtDiscount").val("10%");
        var subTotal = displayTotal - ((displayTotal * 10) / 100);
        $("#subTotal").text(subTotal + " /=");
    }
}
function saveOrder() {
    var orderID = $("#orderId").val();
    var date = $("#date").val();
    var customerId = $("#orderFormCstId option:selected").text();
    var itemId = $("#orderFormItemId option:selected").text();
    var itemName = $("#orderFormItemName").val();
    var itemPrice = parseInt($("#orderFormPrice").val());
    var qty = parseInt($("#orderQty").val());
    var total = itemPrice * qty;
    var orderDetails = new orderDTO();
    orderDetails.setOrderId(orderID);
    orderDetails.setOrderDate(date);
    orderDetails.setOrderCustomerId(customerId);
    orderDetails.setOrderItemId(itemId);
    orderDetails.setOrderItemName(itemName);
    orderDetails.setOrderItemPrice(itemPrice);
    orderDetails.setOrderQty(qty);
    orderDetails.setTotal(total);
    var checked = false;
    function idExits() {
        for (var i = 0; i < OrderDB.length; i++) {
            if (itemId == OrderDB[i].getOrderItemId()) {
                OrderDB[i].setOrderQty(OrderDB[i].getOrderQty() + qty);
                OrderDB[i].setTotal(OrderDB[i].getTotal() + total);
                return true;
            } else {
            }
        }
        return false;
    }
    if (OrderDB.length == 0) {
        checked = false;
    } else {
        checked = idExits();
    }
    if (checked) {
        clearOrderItem();
    } else {
        OrderDB.push(orderDetails);
        clearOrderItem();
    }
}
function loadTable() {
    $("#orderFormTableBody").empty();
    OrderDB.forEach(function (a) {
        let orderRow = `<tr><td>${a.getOrderItemId()}</td><td>${a.getOrderItemName()}</td><td>${a.getOrderItemPrice()}</td><td>${a.getOrderQty()}</td><td>${a.getTotal()}</td><td><button id="delete" type="button" class="btn btn-danger ">Remove</button></td></tr>`;
        $("#orderFormTableBody").append(orderRow);
    });
}
function clearOrderItem() {
    $("#orderFormItemName,#orderQty,#orderFormPrice,#orderFormQty").val("");
    $("#btnAddItem").attr("disabled", true);
    validateOrderForm();
}
function updateItemDatabase() {
    var itemId = $("#orderFormItemId option:selected").text();
    var qty = parseInt($("#orderQty").val());
    for (let i = 0; i < itemDB.length; i++) {
        if (itemId == itemDB[i].getItemCode()) {
            var x = parseInt(itemDB[i].getItemQTY());
            x -= qty;
            itemDB[i].setItemQTY(x);
        }
    }
}
/!*========================= validation =====================================*!/
let regxQty = /^[0-9]{1,3}$/;
let regxCash = /^[0-9](.){1,6}$/;
$("#btnAddItem").attr("disabled", true);
$("#btnPurchase").attr("disabled", true);
$("#orderQty,#txtCash").on('keyup', function () {
    validateOrderForm();
});
function validateOrderForm() {
    var qty = $("#orderQty").val();
    if (regxQty.test(qty)) {
        $("#orderQty").css('border', '2px solid green');
    } else {
        $("#orderQty").css('border', '2px solid red');
        $("#btnAddItem").attr("disabled", true);
    }
    var cash = $("#txtCash").val();
    if (regxCash.test(cash)) {
        $("#txtCash").css('border', '2px solid green');
    } else {
        $("#txtCash").css('border', '2px solid red');
        $("#btnAddItem").attr("disabled", true);
    }
}
$("#orderQty").on('keyup', function (e) {
    if (e.key == "Enter") {
        if (parseInt($("#orderQty").val()) > parseInt($("#orderFormQty").val())) {
            alert("Quantity is invalid");
            /!*swal("Good job!", "You clicked the button!", "success");*!/
        } else {
            checkValidation();
        }
    }
});
$("#txtCash").on('keyup', function (e) {
    if (e.key == "Enter") {
        if (parseInt($("#total").text()) <= parseInt($("#txtCash").val())) {
            setBalance();
            checkValidation();
        } else {
            alert("Wrong Amount..! ");
        }
    }
});
function checkValidation() {
    var qty = $("#orderQty").val();
    if (regxQty.test(qty)) {
        $("#btnAddItem").attr("disabled", false);
    } else {
        $("#orderQty").focus();
    }
    var cash = $("#txtCash").val();
    if (regxCash.test(cash)) {
        $("#btnPurchase").attr("disabled", false);
    } else {
        $("#txtCash").focus();
    }
}
function setBalance() {
    var balance = parseInt($("#txtCash").val()) - parseInt($("#subTotal").text());
    $("#txtBalance").val(balance + ".00");
}



const orderCusIDRegEx = /^(C00-)[0-9]{3,4}$/;
const orderItemCodeRegEx = /^(I00-)[0-9]{3,4}$/;
const orderIDRegEx = /^(O00-)[0-9]{4,5}$/;
const quantityRegEx = /^[1-9][0-9]*$/;


$("#txtOrderId").val("O00-0001");
//
//
//
//
// $("#btnAddToCart").attr('disabled', true);
// $("#btnPurchaseOrder").attr('disabled', true);
//
// $("#txtOrderId").prop('disabled', true);
// $("#txtDate").prop('disabled', true);
// $("#txtTime").prop('disabled', true);
// $("#txtOrderCustName").prop('disabled', true);
// $("#txtOrderCustAddress").prop('disabled', true);
// $("#txtOrderCustContact").prop('disabled', true);
// $("#txtOrderItemName").prop('disabled', true);
// $("#txtOrderItemPrice").prop('disabled', true);
// $("#txtOrderItemQty").prop('disabled', true);
// $("#txtSubTotal").prop('disabled', true);


function displayDateTime() {
    var date = new Date()
    var ampm = date.getHours( ) >= 12 ? 'PM' : 'AM';
    var hours = date.getHours( ) % 12;
    hours = hours ? hours : 12;
    hours=hours.toString().length===1? 0+hours.toString() : hours;

    var minutes=date.getMinutes().toString()
    minutes=minutes.length===1 ? 0+minutes : minutes;

    var seconds=date.getSeconds().toString()
    seconds=seconds.length===1 ? 0+seconds : seconds;

    var year=date.getFullYear().toString();

    var month=(date.getMonth() +1).toString();
    month=month.length===1 ? 0+month : month;

    var day=date.getDate().toString();
    day=day.length===1 ? 0+day : day;

    var x1=day + "/" + month + "/" + year;
    var x2 = hours + ":" +  minutes + ":" +  seconds + " " + ampm;
    $("#txtDate").val(x1);
    $("#txtTime").val(x2);
    playDateTime();
}
function playDateTime(){
    var refresh=1000; // Refresh rate in milli seconds
    mytime=setTimeout('displayDateTime()',refresh)
}
playDateTime();

$('#cmbOrderCustId').on('change', function() {
    var id = $(this).val();

    if(id===""){
        $("#txtOrderCustName").val("");
        $("#txtOrderCustAddress").val("");
        $("#txtOrderCustContact").val("");
    }else{
        var customerObject;
        for(var i in customerDB){
            if(customerDB[i].getID()===id){
                customerObject = customerDB[i];
            }
        }
        $("#txtOrderCustName").val(customerObject.getName());
        $("#txtOrderCustAddress").val(customerObject.getAddress());
        $("#txtOrderCustContact").val(customerObject.getContact());
    }
});

$('#cmbOrderItemCode').on('change', function() {
    var code = $(this).val();

    if(code===""){
        $("#txtOrderItemName").val("");
        $("#txtOrderItemPrice").val("");
        $("#txtOrderItemQty").val("");
    }else{
        var itemObject;
        for(var i in itemDB){
            if(itemDB[i].getItemCode()===code){
                itemObject = itemDB[i];
            }
        }
        $("#txtOrderItemName").val(itemObject.getItemName());
        $("#txtOrderItemPrice").val(itemObject.getPrice());
        setQtyOnHand();
        //$("#txtOrderItemQty").val(itemObject.getQty());
    }
});

// function setOrderButtons() {
//     let a = orderItemCodeRegEx.test($("#cmbOrderItemCode").val()) & orderCusIDRegEx.test($("#cmbOrderCustId").val()) & quantityRegEx.test($("#txtQuantity").val()) & parseInt($("#txtQuantity").val())<=parseInt($("#txtOrderItemQty").val());
//     let b = orderIDRegEx.test($("#txtOrderId").val()) & cartArray.length>0;
//     if (a) {
//         $("#btnAddToCart").attr('disabled', false);
//     } else {
//         $("#btnAddToCart").attr('disabled', true);
//     }
//     if (b) {
//         $("#btnPurchaseOrder").attr('disabled', false);
//     } else {
//         $("#btnPurchaseOrder").attr('disabled', true);
//     }
// }

$("#txtQuantity").keyup(function (event) {
    // setOrderButtons();
    if($("#txtQuantity").val()===""){
        $("#txtQuantity").css('border','1px solid #ced4da');
        $("#txtSubTotal").val("");
    }else if (parseInt($("#txtQuantity").val())<=parseInt($("#txtOrderItemQty").val()) & quantityRegEx.test($("#txtQuantity").val())){
        $("#txtQuantity").css('border','3px solid green');
        var st=parseInt($("#txtQuantity").val()) * parseFloat($("#txtOrderItemPrice").val());
        $("#txtSubTotal").val(st.toFixed(2));
    }else{
        $("#txtQuantity").css('border','3px solid red');
        $("#txtSubTotal").val("");
    }
});

$('#btnAddToCart').click(function () {
    let itmCode = $("#cmbOrderItemCode").val();
    let itmName = $("#txtOrderItemName").val();
    let itmPrice = $("#txtOrderItemPrice").val();
    let itmQty = $("#txtQuantity").val();
    let itmTotal = $("#txtSubTotal").val();

    var cartObject=new OrderTM(itmCode,itmName,itmPrice,itmQty,itmTotal);
    if(isOrderItemExists(cartObject.getId())){
        for(var i in cartArray){
            if(cartArray[i].getId()===itmCode){
                let newQty=parseInt(cartArray[i].getQty())+parseInt(cartObject.getQty());
                cartArray[i].setQty(newQty);
                let newTotal=parseFloat(cartArray[i].getTotal())+parseFloat(cartObject.getTotal());
                cartArray[i].setTotal(newTotal.toFixed(2));
            }
        }
    }else{
        cartArray.push(cartObject);
    }

    $("#txtQuantity").val("");
    $("#txtSubTotal").val("");
    $("#txtQuantity").css('border','1px solid #ced4da');

    setTotalPurchase();
    setQtyOnHand();
    //clearAllCustomerFields();
    loadAllCartObjects();

    // setOrderButtons();
    //setCustomerButtons();
});

$('#btnPurchaseOrder').click(function () {
    let orderID = $("#txtOrderId").val();
    let cusID = $("#cmbOrderCustId").val();
    let orderDate = $("#txtDate").val();
    let orderTime = $("#txtTime").val();
    let orderCost = $("#txtTotal").val();

    let detailList=new Array();

    for (var i in cartArray){
        let itmID=cartArray[i].getId();
        let itmQty=cartArray[i].getQty();
        let itmPrice=cartArray[i].getPrice();
        let itmTotal=cartArray[i].getTotal();

        var orderDetail=new OrderDetailDTO(itmID,orderID,itmQty,itmPrice,itmTotal);
        detailList.push(orderDetail);
    }

    var orderObject=new OrderDTO(orderID,cusID,orderDate,orderTime,orderCost,detailList);
    OrderDB.push(orderObject);

    reducePurchasedItems();
    cartArray.splice(0, cartArray.length);
    setOrderId();
    setTotalPurchase();
    clearAllOrderFields();
    loadAllCartObjects();
    // setOrderButtons();
});

function reducePurchasedItems() {
    for (var i in cartArray){
        var orderDetail=cartArray[i];
        for (var j in itemDB){
            if(itemDB[j].getItemCode()===orderDetail.getQty()){
                itemDB[j].setQty(itemDB[j].getQty()-orderDetail.getQty())
            }
        }
    }
}

function setOrderId() {
    var oldOrderId=$("#txtOrderId").val();
    var index=parseInt(oldOrderId.split("-")[1]);
    var newOrderId;
    if(index<9){
        index++;
        newOrderId="O00-000"+index;
    }else if(index<99){
        index++;
        newOrderId="O00-00"+index;
    }else if(index<999){
        index++;
        newOrderId="O00-0"+index;
    }else if(index<9999){
        index++;
        newOrderId="O00-"+index;
    }
    $("#txtOrderId").val(newOrderId);
}

function clearAllOrderFields() {
    $("#txtOrderCustName").val("");
    $("#txtOrderCustAddress").val("");
    $("#txtOrderCustContact").val("");
    $("#txtOrderItemName").val("");
    $("#txtOrderItemPrice").val("");
    $("#txtOrderItemQty").val("");
    $("#txtQuantity").val("");
    $("#txtSubTotal").val("");
    $("#txtQuantity").css('border','1px solid #ced4da');
}

function loadAllCartObjects() {
    $("#orderTable").empty();

    for (var i in cartArray){
        let itmCode=cartArray[i].getId();
        let itmName=cartArray[i].getName();
        let itmPrice=cartArray[i].getPrice();
        let itmQty=cartArray[i].getQty();
        let itmTotal=cartArray[i].getTotal();

        let row = `<tr><td>${itmCode}</td><td>${itmName}</td><td>${itmPrice}</td><td>${itmQty}</td><td>${itmTotal}</td></tr>`;
        $("#orderTable").append(row);
    }
}

function setTotalPurchase() {
    let total=0;
    for(var i in cartArray){
        total+=parseFloat(cartArray[i].getTotal());
    }
    $("#txtTotal").text(total.toFixed(2));
}

function setQtyOnHand() {
    var itemObject;
    for(var i in itemDB){
        if(itemDB[i].getItemCode()===$("#cmbOrderItemCode").val()){
            itemObject = itemDB[i];
        }
    }
    let qty=itemObject.getItemQTY();
    for(var i in cartArray){
        if(cartArray[i].getId()===$("#cmbOrderItemCode").val()){
            qty-= cartArray[i].getQty();
        }
    }
    $("#txtOrderItemQty").val(qty);
}

function isOrderItemExists(itmCode) {
    for(var i in cartArray){
        if(cartArray[i].getId()===itmCode){
            return true;
        }
    }
    return false;
}