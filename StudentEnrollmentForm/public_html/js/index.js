/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



/*
 * variable required for this projects 
 * @returns {String}
 */

var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpdbIML = '/api/iml';
var stuDBName = 'SCHOOL-DB';
var stuRelationName = 'STUDNET-TABLE';
var connToken = '90932840|-31949281689393069|90948330';


$("#rollno").focus();
/*
 * validate the input data in the form
 * @returns {String}
 */
function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $("#stuname").val(data.name);
    $("#cls").val(data.class);
    $("#dob").val(data.dob);
    $("#address").val(data.address);
    $("#enrolldate").val(data.enrolldate);


}
function resetForm() {
    $("#rollno").val("");
    $("#stuname").val("");
    $("#cls").val("");
    $("#dob").val("");
    $("#address").val("");
    $("#enrolldate").val("");
    $("#rollno").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#rollno").focus();
}


function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}
function validateData() {
    var rollno, stuname, cls, dob, address, enrolldate;
    rollno = $("#rollno").val();
    stuname = $("#stuname").val();
    cls = $("#cls").val();
    dob = $("#dob").val();
    address = $("#address").val();
    enrolldate = $("#enrolldate").val();

    if (rollno === "") {
        alert('Student roll no. missing');
        $("#rollno").focus();
        return "";
    }
    if (stuname === "") {
        alert('Student name missing');
        $("#stuname").focus();
        return "";
    }
    if (cls === "") {
        alert('Student class missing');
        $("#cls").focus();
        return "";
    }
    if (dob === "") {
        alert('Student date of birth missing');
        $("#dob").focus();
        return "";
    }
    if (address === "") {
        alert('Student address missing');
        $("#address").focus();
        return "";
    }
    if (enrolldate === "") {
        alert('Student enroll date missing');
        $("#enrolldate").focus();
        return "";
    }

    var jsonStrObj = {
        id: rollno,
        name: stuname,
        class: cls,
        dob: dob,
        address: address,
        enrolldate: enrolldate,
    };
    return JSON.stringify(jsonStrObj);
}


/*
 * saves data from the file into the database
 * @returns {undefined}
 */

function saveData() {
    var jsonStrObj = validateData();
    if (jsonStrObj === "") {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, stuDBName, stuRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#rollno").focus();
}

/*
 * changes the record 
 * @returns {undefined}
 */

function changeData() {
    $("#change").prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, stuDBName, stuRelationName, localStorage.getItem('recno'));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#rollno").focus();
}
function getRollNoAsJsonObj() {
    var rollno = $("#rollno").val();
    var jsonStr = {
        id: rollno
    };
    return JSON.stringify(jsonStr);
}


function getStudent() {
    var rollnoJsonObj = getRollNoAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, stuDBName, stuRelationName, rollnoJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400) {
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#stuname").focus();
    } else if (resJsonObj.status === 200) {
        $("#rollno").prop("disabled", true);
        fillData(resJsonObj);

        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#stuname").focus();
    }
}







