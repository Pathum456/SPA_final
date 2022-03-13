/**
 * @author _ Pathum_Kaleesha
 * @create - 2022-03-02 - 09.12
 * @since - v0.1.0
 **/
var regExCusID = /^(C-)[0-9]{3,4}$/;
function loadAllCustomer() {
    $("#customerTable").empty();
    for (let i = 0; i < customerDB.length; i++) {
        let customerID = customerDB[i].getID();
        let customerName =customerDB[i].getName();
        let customerAddress = customerDB[i].getAddress();
        let Contact = customerDB[i].getContact();
        let row = `<tr><td>${customerID}</td><td>${customerName}</td><td>${customerAddress}</td><td>${Contact}</td></tr>`;
        $("#customerTable").append(row);    }
    $("#customerTable>tr").click(function () {
        $("#cusID").val($(this).children(":eq(0)").text());
        $("#cusName").val($(this).children(":eq(1)").text());
        $("#cusAddress").val($(this).children(":eq(2)").text());
        $("#contact").val($(this).children(":eq(3)").text());
    });
}

$("#addCustomer").click(function ( ){
    saveCustomer();
});

function saveCustomer(){
    if ($("#cusID").val()==("") || $("#cusName").val()== ("") || $("#cusAddress").val()==("") ||$("#contact").val()==("")
){
        swal("Text fields can't be null...!", "Clicked the button!", "error");

    }else {
        let customerID = $("#cusID").val();
        let customerName = $("#cusName").val();
        let customerAddress = $("#cusAddress").val();
        let customerTP = $("#contact").val();
        var Customer = new CustomerDTO(customerID, customerName, customerAddress, customerTP);
        customerDB.push(Customer);
        swal("Customer Saved...!", "Clicked the button!", "success");
        loadAllCustomer();
       // $("#cusID,#cusName,#cusAddress,#contact").val("");
        clearAllC();
    }
    loadCustomerIds();
}


$("#cusID").keyup(function () {
    let input = $("#cusID").val();
    if (regExCusID.test(input)) {
        $("#cusID").css('border', '2px solid green');
        $("#error").text("");
    } else {
        $("#cusID").css('border', '2px solid red');
        $("#error").text("Wrong format : C00-001");
    }
});
/* Customer Update*/
$("#updateCustomer").click(function () {
    for (var i in customerDB ){
        if ($("#cusID").val() == customerDB[i].getID()){
            let customerID = $("#cusID").val();
            let customerName = $("#cusName").val();
            let customerAddress = $("#cusAddress").val();
            let customerContact = $("#contact").val();
            var customer = new CustomerDTO(customerID,customerName,customerAddress,customerContact);
            customerDB[i].setName(customer.getName());
            customerDB[i].setAddress(customer.getAddress());
            customerDB[i].setContact(customer.getContact());
            swal("Customer Updated...!", "Clicked the button!", "success");
        }
    }
    clearAllC()
    loadAllCustomer();

    loadCustomerIds();
});
/*Delete Customer*/
$("#deleteCustomer").click( function () {

    for(var i in customerDB) {
        if ($("#cusID").val() == customerDB[i].getID()){

                customerDB.splice(i,1);

        }
    }
    /*End of the Delete Button*/
    clearAllC()
    loadAllCustomer();
    loadCustomerIds();

});


$("#searchCustomer").click(function (){
    searchCustomer();
});
function searchCustomer() {
    let val = $("#srcCusID").val();
    for (let i = 0; i < customerDB.length; i++) {
        if (customerDB[i].getID() == val){
            $('#cusID').val(customerDB[i].getID());
            $("#cusName").val(customerDB[i].getName());
            $("#cusAddress").val(customerDB[i].getAddress());
            $("#contact").val(customerDB[i].getContact());
        }
    }
    loadAllCustomer();

}
//,
function clearAllC() {
    $("#cusID,#cusName,#cusAddress,#contact").val("");
    $('#cusID,#cusName').css('border', '2px solid #ced4da');
    $('#cusAddress,#contact').css('border', '2px solid #ced4da');
    $('#cusID').focus();
    $("#addCustomer").attr('disabled', false);


}
function loadCustomerIds() {
    $("#cmbOrderCustId").empty();
    $('#cmbOrderCustId').append(new Option("Customer ID", ""));
    for (var i in customerDB){
        let id=customerDB[i].getID();
        $('#cmbOrderCustId').append(new Option(id, id));
    }
}