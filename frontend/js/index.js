function init() {
    $('#table_clubList').bootstrapTable({
        dataType: "json",
        classes: "table table-bordered table-striped table-sm",
        striped: true,
        uniqueId: 'id',
        sortName: 'id',
        columns: [{
            field: 'id',
            title: '代碼'
        }, {
            field: 'name',
            title: '名稱'
        }, {
            field: 'teacher',
            title: '教師'
        }, {
            field: 'isSpecial',
            title: '特殊社團'
        }]
    });
    $('#table_clubSelect').bootstrapTable({
        dataType: "json",
        classes: "table table-bordered table-striped table-sm",
        striped: true,
        uniqueId: 'sid',
        sortName: 'sid',
        columns: [{
            field: 'sid',
            title: '學號'
        }, {
            field: 'class',
            title: '班級'
        }, {
            field: 'number',
            title: '座號'
        }, {
            field: 'name',
            title: '姓名'
        }, {
            field: 'definite',
            title: '確定中選',
            width: 100,
            formatter: formatterDefinite,
        }, {
            field: 'alternate1',
            title: '志願1',
            width: 100,
            formatter: formatterAlternate1,
        }, {
            field: 'alternate2',
            title: '志願2',
            width: 100,
            formatter: formatterAlternate2,
        }, {
            field: 'alternate3',
            title: '志願3',
            width: 100,
            formatter: formatterAlternate3,
        }, {
            field: 'isOk',
            formatter: formatterIsOk,
        }]
    });
}

function OnHashchangeListener() {
    var hash = location.hash;
    if (hash != '') {
        $("#mNav .nav").find(".active").removeClass("active");
        $("a[href='" + hash + "']").parent().addClass('active');
    }
    $("div[id^='Content_']").hide();
    $("#title_bar").show();
    HideAlert();

    if (hash == '' && login_check()) {
        $('#Content_Announcement').show();
    }
    if (hash == '#ClubSelect' && login_check() && PermissionCheck(false, true)) {
        $('#Content_ClubSelect').show();
        $("#title_bar").hide();
    }
    if (hash == '#SelectResult' && login_check() && PermissionCheck(false, true)) {
        $('#Content_SelectResult').show();
        $("#title_bar").hide();
    }
    if (hash == '#SelectManage' && login_check() && PermissionCheck(true, true)) {
        $('#Content_SelectManage').show();
        $("#title_bar").hide();
    }
    if (hash == '#ClubManage' && login_check() && PermissionCheck(true, true)) {
        $('#Content_ClubManage').show();
        $("#title_bar").hide();
    }

    if (hash == '#UserManage' && login_check() && PermissionCheck(true, true)) {
        $('#Content_User_manage').show();
        $("#title_bar").hide();

        $.ajax({
            url: "../ntuh_yl_RT_mdms_api/user.php",
            data: "mode=get_user_list&acc=" + $.cookie("LoginInfoAcc") + "&pw=" + $.cookie("LoginInfoPw"),
            type: "POST",
            success: function (msg) {
                $.cookie("AllUserData", msg);
                var jsonA = JSON.parse(msg);
                for (let i = 0; i < jsonA.length; i++) {
                    jsonA[i]['permission'] += "(" + PermissionStr[jsonA[i]['permission']] + ")";
                }
                console.log(jsonA);
                $('#table_user').bootstrapTable({
                    data: jsonA,
                    dataType: "json",
                    classes: "table table-bordered table-striped table-sm",
                    striped: true,
                    pagination: true,
                    uniqueId: 'account',
                    sortName: 'account',
                    pageNumber: 1,
                    pageSize: 5,
                    search: true,
                    showPaginationSwitch: true,
                    columns: [{
                        field: 'account',
                        title: '帳號(員工編號)',
                        formatter: LinkFormatterUM
                    }, {
                        field: 'name',
                        title: '名稱'
                    }, {
                        field: 'permission',
                        title: '權限<i class="fas fa-info-circle" data-toggle="tooltip" data-placement="right" data-html="true" ' +
                            'title="<h6>權限說明：</h6>' +
                            '0 未啟用<br>' +
                            '1 狀態查詢<br>' +
                            '2 狀態登錄<br>' +
                            '3 紀錄查看<br>' +
                            '4 裝置管理<br>' +
                            '5 使用者管理<br>' +
                            '6-8 狀態登錄<br>' +
                            '9 管理員<br>' +
                            '若擁有權限>=所需權限<br>' +
                            '皆可使用" style="margin-left: 3px"></i>'
                    }, {
                        field: 'email',
                        title: 'E-mail',
                    }, {
                        field: 'created',
                        title: '建立時間',
                    }]
                });
                $('[data-toggle="tooltip"]').tooltip();
            },
            error: function (xhr) {
                console.log('ajax er');
                $.alert({
                    title: '錯誤',
                    content: 'Ajax 發生錯誤',
                    type: 'red',
                    typeAnimated: true
                });
            }
        });

        var getURl = new URL(location.href);
        if (getURl.searchParams.has('acc')) {
            var acc = getURl.searchParams.get('acc');
            var users = JSON.parse($.cookie("AllUserData"));
            console.log(users);
            var userinfo;
            for (let i = 0; i < users.length; i++) {
                if (users[i]['account'] == acc) {
                    userinfo = users[i];
                    break;
                }
            }
            if (userinfo != undefined) {
                $('#chguser-ShowAcc').val(userinfo['account']);
                $('#chguser-ShowName').val(userinfo['name']);
                $('#chguser-ShowPermission').val(userinfo['permission']);
                $('#chguser-ShowEmail').val(userinfo['email']);
            }
        }
    }
}

function login_check() {
    if ($.cookie('LoginInfoAcc')) {
        return true;
    } else if (location.hash == '') {
        ShowAlart('alert-info', "請先<a href='login.html' class='alert-link'>登入</a>", true, false);
    } else {
        ShowAlart('alert-danger', '尚未登入!!', false, false);
        return false;
    }
}

function PermissionCheck(needAdmin, isAlert) {
    HideAlert();
    var hasAdmin = $.cookie("LoginInfoAdmin");
    if ((needAdmin && hasAdmin == '1') || needAdmin != true) {
        console.log("Pass");
        return true;
    } else {
        console.log("NoPass");
        if (isAlert) {
            ShowAlart('alert-warning', "您的權限不足!!", false, false);
        }
        return false;
    }
}

window.operateEvents = {
    'click #device_table_update': function (e, value, row, index) {
        // e      Event
        // value  undefined
        // row    rowdata
        // index  row
        var DID = row['DID'];
        console.log(DID);
        location.href = '?DID=' + DID + '#UpdateStatus';
    },
    'click #device_table_manage': function (e, value, row, index) {
        var DID = row['DID'];
        console.log(DID);
        location.href = '?DID=' + DID + '#DeviceManage';
    },
    'click #device_table_mkqr': function (e, value, row, index) {
        var DID = row['DID'];
        console.log(DID);
        document.getElementById("QRModalTitle").innerText = DID;
        document.getElementById("QRModalContext1").innerHTML = "<img src='../ntuh_yl_RT_mdms_api/make_qrcode.php?DID=" + DID + "'/>";
        document.getElementById("QRModalContext2").innerHTML = "<a href='../ntuh_yl_RT_mdms_api/make_qrcode.php?DID=" + DID + "' download>下載QRCode<br>(87x87)</a>";

        $('#QRModal').modal('show');
    },
};

function LinkFormatterUM(value, row, index) {
    return "<a href='?acc=" + value + "#UserManage'>" + value + "</a>";
}

var grade_code = -1;

function changeGradeClass() {
    setTimeout(function () {
        var grade = $('#CS_grade_select li .active').text();
        console.log(grade);
        if (grade == "一年級") {
            grade_code = 1;
            $('#CS_class_selectG1').show();
            $('#CS_class_selectG2').hide();
        } else if (grade == "二年級") {
            grade_code = 2;
            $('#CS_class_selectG2').show();
            $('#CS_class_selectG1').hide();
        }
        $('#table_clubList').bootstrapTable('load', getClubList(grade_code));
        changeClass();
    }, 100);
}

var class_code = -1;

function changeClass() {
    setTimeout(function () {
        console.log(grade_code);

        if (grade_code == 1) {
            class_code = parseInt($('#CS_class_selectG1 li .active').text(), 10);
        } else if (grade_code == 2) {
            class_code = parseInt($('#CS_class_selectG2 li .active').text(), 10);
        }
        console.log(class_code);
        $('#table_clubSelect').bootstrapTable('load', getStudents(class_code));
    }, 100);
}

var club_data;

function getClubList(need_grade) {
    var fdata = "";
    var data = "";
    $.ajax({
        url: "../backend/db.php",
        data: "mode=getClubList" +
            "&acc=" + $.cookie("LoginInfoAcc") +
            "&pw=" + $.cookie("LoginInfoPw") +
            "&grade=" + need_grade,
        type: "POST",
        async: false,
        success: function (msg) {
            console.log(msg);
            if (msg != "no_data") {
                var jsonA = JSON.parse(msg);
                var FjsonA = JSON.parse(msg);
                data = jsonA;
                for (var i = 0; i < jsonA.length; i++)
                    FjsonA[i]['isSpecial'] = FjsonA[i]['isSpecial'] == 1 ? "是" : "否";
                fdata = FjsonA;
            } else {
                $('#table_clubSelect').bootstrapTable("removeAll");
            }
        },
        error: function (xhr) {
            console.log('ajax er');
            $.alert({
                title: '錯誤',
                content: 'Ajax 發生錯誤',
                type: 'red',
                typeAnimated: true
            });
        }
    });
    club_data = data;
    return fdata;
}

var student_data;
var selectCheck;

function getStudents(need_class) {
    var data = "";
    $.ajax({
        url: "../backend/db.php",
        data: "mode=getStudents" +
            "&acc=" + $.cookie("LoginInfoAcc") +
            "&pw=" + $.cookie("LoginInfoPw") +
            "&class=" + need_class,
        type: "POST",
        async: false,
        success: function (msg) {
            console.log(msg);
            if (msg != "no_data") {
                var jsonA = JSON.parse(msg);
                console.log(jsonA);
                data = jsonA;
            } else {
                $('#table_clubSelect').bootstrapTable("removeAll");
            }
        },
        error: function (xhr) {
            console.log('ajax er');
            $.alert({
                title: '錯誤',
                content: 'Ajax 發生錯誤',
                type: 'red',
                typeAnimated: true
            });
        }
    });
    student_data = data;
    selectCheck = [student_data.length];
    for (var i = 0; i < student_data.length; i++)
        selectCheck[i] = false;
    return data;
}

function formatterDefinite(value, row, index) {
    return '<input type="number" class="form-control" placeholder="代號" maxlength="4" id="inputDefinite_' + index + '" oninput="checkCS(' + index + ')"/>';
}

function formatterAlternate1(value, row, index) {
    return '<input type="number" class="form-control" placeholder="代號" maxlength="4" id="inputAlternate1_' + index + '" oninput="checkCS(' + index + ')"/>';
}

function formatterAlternate2(value, row, index) {
    return '<input type="number" class="form-control" placeholder="代號" maxlength="4" id="inputAlternate2_' + index + '" oninput="checkCS(' + index + ')"/>';
}

function formatterAlternate3(value, row, index) {
    return '<input type="number" class="form-control" placeholder="代號" maxlength="4" id="inputAlternate3_' + index + '" oninput="checkCS(' + index + ')"/>';
}

function formatterIsOk(value, row, index) {
    return '<a id="iconSelectIsOk_' + index + '"><i class="fas fa-times" style="color: #b21f2d"/></a>';
}

function adminViewSwitch() {
    $('#classSwitch').hide();
    $('#classShow').hide();
    if ($.cookie('LoginInfoAdmin') == '1') {
        $('#classSwitch').show();
        $('#classShow').hide();
        changeGradeClass();
    } else {
        $('#classSwitch').hide();
        $('#classShow').show();
        var mClass = $.cookie('LoginInfoClass');
        var grade = mClass.substring(0, 1);
        grade_code = grade;
        class_code = mClass;
        $('#mClass').text((grade == '1' ? "一年級" : "二年級") + '-' + mClass);
        $('#table_clubList').bootstrapTable('load', getClubList(grade));
        $('#table_clubSelect').bootstrapTable('load', getStudents(mClass));
    }
}

function checkCS(row) {
    var inputD = $('#inputDefinite_' + row);
    var inputA1 = $('#inputAlternate1_' + row);
    var inputA2 = $('#inputAlternate2_' + row);
    var inputA3 = $('#inputAlternate3_' + row);

    if (inputD.val() != "") {
        inputA1.prop("disabled", true);
        inputA2.prop("disabled", true);
        inputA3.prop("disabled", true);
    } else {
        inputA1.prop("disabled", false);
        inputA2.prop("disabled", false);
        inputA3.prop("disabled", false);
    }
    if (inputA1.val() != "" || inputA2.val() != "" || inputA3.val() != "") {
        inputD.prop("disabled", true);
    } else {
        inputD.prop("disabled", false);
    }

    if ((inputD.val().length == 4 || (inputA1.val().length == 4 && inputA2.val().length == 4 && inputA3.val().length == 4)) && !(inputD.val() == "" && (inputA1.val() == inputA2.val() || inputA2.val() == inputA3.val() || inputA1.val() == inputA3.val()))) {
        $('#iconSelectIsOk_' + row).html('<i class="fas fa-check" style="color: #1e7e34"/>');
        selectCheck[row] = true;
    } else {
        $('#iconSelectIsOk_' + row).html('<i class="fas fa-times" style="color: #b21f2d"/>');
        selectCheck[row] = false;
    }
    var canEnable = true;
    for (var i = 0; i < selectCheck.length; i++) {
        if (!selectCheck[i]) {
            canEnable = false;
        }
    }
    $('#btn_CS_submit').prop("disabled", !canEnable);
}

function selectVerify() {
    var codeErrorArray = [];
    for (var i = 0; i < student_data.length; i++) {
        var inputD = $('#inputDefinite_' + i);
        var inputA1 = $('#inputAlternate1_' + i);
        var inputA2 = $('#inputAlternate2_' + i);
        var inputA3 = $('#inputAlternate3_' + i);
        var hasClubCode = [false, false, false, false];
        for (var k = 0; k < club_data.length; k++) {
            if (inputD.val() == club_data[k]['id']) {
                hasClubCode[0] = true;
                continue;
            }
            if (inputA1.val() == club_data[k]['id']) {
                hasClubCode[1] = true;
                continue;
            }
            if (inputA2.val() == club_data[k]['id']) {
                hasClubCode[2] = true;
                continue;
            }
            if (inputA3.val() == club_data[k]['id']) {
                hasClubCode[3] = true;
                continue;
            }
        }
        if (!(hasClubCode[0] || (hasClubCode[1] && hasClubCode[2] && hasClubCode[3])))
            codeErrorArray.push(i);
    }
    if (codeErrorArray.length != 0) {
        var context_cEA = '';
        for (var i = 0; i < codeErrorArray.length; i++) {
            context_cEA += student_data[codeErrorArray[i]]['sid'] + " " + student_data[codeErrorArray[i]]['name'] + "<br>";
        }
        $.alert({
            title: '社團代碼錯誤',
            content: context_cEA,
            type: 'red',
            typeAnimated: true
        });
    } else {
        var CSDcode = [student_data.length];
        for (var i = 0; i < student_data.length; i++) {
            var inputD = $('#inputDefinite_' + i);
            CSDcode[i] = inputD.val();
        }
        var result = new Set();
        var repeat = new Set();
        CSDcode.forEach(item => {
            result.has(item) ? repeat.add(item) : result.add(item);
        });
        repeat = Array.from(repeat);
        for (var i = 0; i < club_data.length; i++) {
            if (club_data[i]['isSpecial'] == 1) {
                for (var k = 0; k < repeat.length; k++) {
                    if (repeat[k] == club_data[i]['id']) {
                        repeat.splice(k, 1);
                        k--;
                    }
                }
            }
        }
        for (var k = 0; k < repeat.length; k++) {
            if (repeat[k] == '') {
                repeat.splice(k, 1);
                k--;
            }
        }
        if (repeat.length != 0) {
            var context_repeat = '<em><b>確定中選</b>之社團,除<b>特殊社團</b>,其他社團每班限<b>一位同學</b><br><b>志願</b>則不再此限</em><br><br>';
            for (var i = 0; i < club_data.length; i++) {
                for (var k = 0; k < repeat.length; k++) {
                    if (club_data[i]['id'] == repeat[k]) {
                        context_repeat += '<b>' + club_data[i]['id'] + ' ' + club_data[i]['name'] + '</b> 重複於 ';
                        for (var n = 0; n < student_data.length; n++) {
                            var inputD = $('#inputDefinite_' + n);
                            if (club_data[i]['id'] == inputD.val()) {
                                context_repeat += student_data[n]['sid'] + ' ' + student_data[n]['name'] + ' , ';
                            }
                        }
                        context_repeat += '<br>';
                    }
                }
            }
            $.alert({
                title: '社團重複',
                content: context_repeat,
                type: 'red',
                typeAnimated: true,
                columnClass: 'm'
            });
        } else {
            var jsonA = new Array();
            for (var i = 0; i < student_data.length; i++) {
                var inputD = $('#inputDefinite_' + i);
                var inputA1 = $('#inputAlternate1_' + i);
                var inputA2 = $('#inputAlternate2_' + i);
                var inputA3 = $('#inputAlternate3_' + i);

                var myObj = new Object();
                myObj.sid = student_data[i]['sid'];
                myObj.definite = inputD.val();
                myObj.alternate1 = inputA1.val();
                myObj.alternate2 = inputA2.val();
                myObj.alternate3 = inputA3.val();

                jsonA.push(myObj);
            }
            var jsonStr = JSON.stringify(jsonA);

            console.log(jsonStr);

            $.ajax({
                url: "../backend/db.php",
                data: "mode=uploadSelect" +
                    "&acc=" + $.cookie("LoginInfoAcc") +
                    "&pw=" + $.cookie("LoginInfoPw") +
                    "&class=" + class_code +
                    "&json_data=" + jsonStr,
                type: "POST",
                success: function (msg) {
                    console.log(msg);
                    if (msg.substr(-2, 2) == "ok") {
                        $.alert({
                            title: '上傳完成',
                            content: '選填成功',
                            typeAnimated: true
                        });
                        $('#table_clubSelect').bootstrapTable('load', getStudents(class_code));
                    }
                },
                error: function (xhr) {
                    console.log('ajax er');
                    $.alert({
                        title: '錯誤',
                        content: 'Ajax 發生錯誤',
                        type: 'red',
                        typeAnimated: true
                    });
                }
            });
        }
    }
}