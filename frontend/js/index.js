function init() {
    PermissionStr = ["班級使用者", "管理員"];

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
    $('#table_user').bootstrapTable({
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
            title: '帳號',
            formatter: LinkFormatterUM
        }, {
            field: 'name',
            title: '名稱'
        }, {
            field: 'isAdmin',
            title: '權限<i class="fas fa-info-circle" data-toggle="tooltip" data-placement="right" data-html="true" ' +
                'title="<h6>權限說明：</h6>' +
                '0 班級使用者<br>' +
                '1 管理員" style="margin-left: 3px"></i>'
        }, {
            field: 'class',
            title: '班級',
        }, {
            field: 'created',
            title: '建立時間',
        }]
    });
    $('[data-toggle="tooltip"]').tooltip();
    $('#table_club').bootstrapTable({
        dataType: "json",
        classes: "table table-bordered table-striped table-sm",
        striped: true,
        pagination: true,
        uniqueId: 'id',
        sortName: 'id',
        pageNumber: 1,
        pageSize: 5,
        search: true,
        showPaginationSwitch: true,
        columns: [{
            field: 'id',
            title: '代碼',
            formatter: LinkFormatterCM
        }, {
            field: 'name',
            title: '名稱'
        }, {
            field: 'teacher',
            title: '教師'
        }, {
            field: 'grade',
            title: '年級'
        }, {
            field: 'isSpecial',
            title: '特殊社團'
        }, {
            field: 'maxPeople',
            title: '人數限制'
        }]
    });
    $('#table_second_clubs').bootstrapTable({
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
            field: 'rest',
            title: '餘額'
        }]
    });
    $('#tablb_second_submit').bootstrapTable({
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
            field: 'cid',
            title: '確定中選',
            width: 100,
            formatter: formatterCid,
        }, {
            field: 'isOk',
            formatter: formatterIsOkNd,
        }]
    });
    $('#table_SR').bootstrapTable({
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
            field: 'cid',
            title: '社團代碼'
        }, {
            field: 'cname',
            title: '社團名稱'
        }]
    });
    $('#table_An_manage').bootstrapTable({
        dataType: "json",
        classes: "table table-bordered table-striped table-sm",
        striped: true,
        uniqueId: 'sid',
        sortName: 'sid',
        columns: [{
            field: 'id',
            title: 'ID'
        }, {
            field: 'title',
            title: '標題'
        }, {
            field: 'content',
            title: '內容'
        }, {
            field: 'posttime',
            title: '發布時間'
        }, {
            field: 'del',
            title: '刪除',
            width: 70,
            formatter: '<button id="btn_del_an" class="btn btn-danger">刪除</button>',
            events: operateEvents
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

    if (hash == '') {
        $('#Content_Announcement').show();
        var an = getAnData();
        if (an != '') {
            for (var i = 0; i < an.length; i++) {
                var card = document.createElement("div");
                card.className = "card";
                var header = document.createElement("h5");
                header.className = "card-header";
                var body = document.createElement("div");
                body.className = "card-body";
                var text = document.createElement("p");
                text.className = "card-text";
                var time = document.createElement("p");
                time.style.textAlign = "right";

                header.innerText = an[i]['title'];
                text.innerHTML = an[i]['content'];
                time.innerText = '張貼時間:' + an[i]['posttime'];

                body.appendChild(text);
                body.appendChild(time);
                card.appendChild(header);
                card.appendChild(body);
                var Announcement = document.getElementById("Content_Announcement");
                Announcement.appendChild(card);
            }
        } else {
            var title = document.createElement("h1");
            title.innerText = '目前沒有公告喔~~';
            title.style.textAlign = 'center';
            title.style.marginTop = '50px';
            title.style.marginBottom = '200px';
            var Announcement = document.getElementById("Content_Announcement");
            Announcement.appendChild(title);
        }
    }
    if (hash == '#ClubSelect' && login_check() && PermissionCheck(false, true)) {
        $('#Content_ClubSelect').show();
        $("#title_bar").hide();

        if ($.cookie('LoginInfoAcc'))
            adminViewSwitch();

        if (getSystem('CSenable') == 'false')
            ShowAlart('alert-warning', '現在非選填時間', false, false);

    }
    if (hash == '#SelectResult' && login_check() && PermissionCheck(false, true)) {
        $('#Content_SelectResult').show();
        $("#title_bar").hide();

        initSRclub();

        if (getSystem('display_result') == 'false') {
            $('#SR').hide();
            ShowAlart('alert-warning', '選社結果尚未公佈', false, false);
        } else {
            if ($.cookie('LoginInfoAcc'))
                SRAdminViewSwitch();
            $('#SR').show();
        }
    }
    if (hash == '#SelectManage' && login_check() && PermissionCheck(true, true)) {
        $('#Content_SelectManage').show();
        $("#title_bar").hide();

        $('#table_An_manage').bootstrapTable('load', getAnData());

        if (getSystem('CSenable') == 'true')
            $('#SM-CSenable').prop("checked", true);
        else
            $('#SM-CSenable').prop("checked", false);
        //$('#SM-maxGCPN').val(getSystem('maxGCPN'));
        if (getSystem('display_result') == 'true')
            $('#SM-display_result').prop("checked", true);
        else
            $('#SM-display_result').prop("checked", false);

        stepCheck();
    }
    if (hash == '#ClubManage' && login_check() && PermissionCheck(true, true)) {
        $('#Content_ClubManage').show();
        $("#title_bar").hide();

        $('#table_club').bootstrapTable('load', getAllClub());

        var getURl = new URL(location.href);
        if (getURl.searchParams.has('id')) {
            var id = getURl.searchParams.get('id');
            var clubs = getAllClub();
            var clubinfo;
            for (let i = 0; i < clubs.length; i++) {
                if (clubs[i]['id'] == id) {
                    clubinfo = clubs[i];
                    break;
                }
            }
            if (clubinfo != undefined) {
                $('#chgclub-ShowId').val(clubinfo['id']);
                $('#chgclub-ShowName').val(clubinfo['name']);
                $('#chgclub-ShowTeacher').val(clubinfo['teacher']);
                $('#chgclub-ShowGrade').val(clubinfo['grade']);
                $('#chgclub-ShowIsSpecial').val(clubinfo['isSpecial']);
                $('#chgclub-ShowMaxP').val(clubinfo['maxPeople']);

                if (clubinfo['grade'] == '1')
                    $('#btnR_clubChgInputGrade1').prop("checked", true);
                else
                    $('#btnR_clubChgInputGrade2').prop("checked", true);

                if (clubinfo['isSpecial'] == '是')
                    $('#chgclub-InputIsSpecial').prop("checked", true);
                else
                    $('#chgclub-InputIsSpecial').prop("checked", false);
            }
        }
    }
    if (hash == '#UserManage' && login_check() && PermissionCheck(true, true)) {
        $('#Content_User_manage').show();
        $("#title_bar").hide();

        $('#table_user').bootstrapTable('load', getUsers(true));

        var getURl = new URL(location.href);
        if (getURl.searchParams.has('acc')) {
            var acc = getURl.searchParams.get('acc');
            var users = getUsers(false);
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
                $('#chguser-ShowPermission').val(userinfo['isAdmin']);
                $('#chguser-ShowClass').val(userinfo['class']);

                setClassCheck();
            }
        }
    }
    if (hash == '#ChangePw') {
        $('#Content_Change_pw').show();
    }
}

function login_check() {
    if ($.cookie('LoginInfoAcc')) {
        return true;
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
    // e      Event
    // value  undefined
    // row    rowdata
    // index  row
    'click #btn_del_an': function (e, value, row, index) {
        console.log(row['id']);
        $.confirm({
            title: '確認刪除!!',
            content: '即將刪除公告',
            type: 'red',
            autoClose: 'cancel|10000',
            buttons: {
                confirm: {
                    text: '刪除',
                    btnClass: 'btn-blue',
                    action: function () {
                        $.ajax({
                            url: "../backend/db.php",
                            data: "mode=delAn" +
                                "&acc=" + $.cookie("LoginInfoAcc") +
                                "&pw=" + $.cookie("LoginInfoPw") +
                                "&id=" + row['id']
                            ,
                            type: "POST",
                            success: function (msg) {
                                if (msg == "ok") {
                                    ShowAlart('alert-success', '刪除成功', false, true);
                                    setTimeout(function () {
                                        $('#table_An_manage').bootstrapTable('load', getAnData());
                                    }, 500);
                                } else {
                                    ShowAlart('alert-danger', '錯誤!!', false, false);
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
                },
                cancel: {
                    text: '取消'
                },
            }
        });


    }
};

function LinkFormatterUM(value, row, index) {
    return "<a href='?acc=" + value + "#UserManage'>" + value + "</a>";
}

function LinkFormatterCM(value, row, index) {
    return "<a href='?id=" + value + "#ClubManage'>" + value + "</a>";
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
        $('#table_clubSelect').bootstrapTable('load', getStudentsData(class_code));
        getSelectData(class_code);
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

function getStudentsData(need_class) {
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
        $('#table_clubList').bootstrapTable('load', getClubList(grade_code));
        $('#table_clubSelect').bootstrapTable('load', getStudentsData(class_code));
        getSelectData(class_code);
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
    if (getSystem('CSenable') == 'false')
        location.reload();
    var codeErrorArray = [];
    var cantSpecialClub = [];
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
                if (club_data[k]['isSpecial'] == '1') {
                    cantSpecialClub.push(i);
                }
                continue;
            }
            if (inputA2.val() == club_data[k]['id']) {
                hasClubCode[2] = true;
                if (club_data[k]['isSpecial'] == '1') {
                    cantSpecialClub.push(i);
                }
                continue;
            }
            if (inputA3.val() == club_data[k]['id']) {
                hasClubCode[3] = true;
                if (club_data[k]['isSpecial'] == '1') {
                    cantSpecialClub.push(i);
                }
                continue;
            }
        }
        if (!(hasClubCode[0] || (hasClubCode[1] && hasClubCode[2] && hasClubCode[3])))
            codeErrorArray.push(i);
    }
    if (codeErrorArray.length != 0) {
        var content_cEA = '';
        for (var i = 0; i < codeErrorArray.length; i++) {
            content_cEA += student_data[codeErrorArray[i]]['sid'] + " " + student_data[codeErrorArray[i]]['name'] + "<br>";
        }
        $.alert({
            title: '社團代碼錯誤',
            content: content_cEA,
            type: 'red',
            typeAnimated: true
        });
    } else if (cantSpecialClub.length != 0) {
        var content_cSC = '';
        for (var i = 0; i < cantSpecialClub.length; i++) {
            content_cSC += student_data[cantSpecialClub[i]]['sid'] + " " + student_data[cantSpecialClub[i]]['name'] + "<br>";
        }
        $.alert({
            title: '志願不可為特殊社團',
            content: content_cSC,
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
                        $('#table_clubSelect').bootstrapTable('load', getStudentsData(class_code));
                        getSelectData(class_code);
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

function getSelectData(rq_class) {
    $.ajax({
        url: "../backend/db.php",
        data: "mode=getSelectData" +
            "&acc=" + $.cookie("LoginInfoAcc") +
            "&pw=" + $.cookie("LoginInfoPw") +
            "&class=" + rq_class,
        type: "POST",
        async: false,
        success: function (msg) {
            console.log(msg);
            if (msg != "no_data") {
                var jsonA = JSON.parse(msg);
                console.log(jsonA);
                for (var i = 0; i < student_data.length; i++) {
                    var sid = student_data[i]['sid'];
                    var inputD = $('#inputDefinite_' + i);
                    var inputA1 = $('#inputAlternate1_' + i);
                    var inputA2 = $('#inputAlternate2_' + i);
                    var inputA3 = $('#inputAlternate3_' + i);

                    for (var k = 0; k < jsonA.length; k++) {
                        if (sid == jsonA[k]['sid']) {
                            inputD.val(jsonA[k]['definite'] == 0 ? "" : jsonA[k]['definite']);
                            inputA1.val(jsonA[k]['alternate1'] == 0 ? "" : jsonA[k]['alternate1']);
                            inputA2.val(jsonA[k]['alternate2'] == 0 ? "" : jsonA[k]['alternate2']);
                            inputA3.val(jsonA[k]['alternate3'] == 0 ? "" : jsonA[k]['alternate3']);
                            checkCS(i);
                        }
                    }
                }
            }
            if (getSystem('CSenable') == 'false') {
                $('#btn_CS_submit').prop("disabled", true);
                for (var i = 0; i < student_data.length; i++) {
                    $('#inputDefinite_' + i).prop("disabled", true);
                    $('#inputAlternate1_' + i).prop("disabled", true);
                    $('#inputAlternate2_' + i).prop("disabled", true);
                    $('#inputAlternate3_' + i).prop("disabled", true);
                }
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

function getUsers(format) {
    var data = "";
    $.ajax({
        url: "../backend/user.php",
        data: "mode=get_user_list&acc=" + $.cookie("LoginInfoAcc") + "&pw=" + $.cookie("LoginInfoPw"),
        type: "POST",
        async: false,
        success: function (msg) {
            console.log(msg);
            var jsonA = JSON.parse(msg);
            if (format) {
                for (let i = 0; i < jsonA.length; i++) {
                    jsonA[i]['isAdmin'] += "(" + PermissionStr[jsonA[i]['isAdmin']] + ")";
                    jsonA[i]['class'] = jsonA[i]['class'] == '-1' ? '-' : jsonA[i]['class']
                }
            }
            console.log(jsonA);
            data = jsonA;
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
    return data;
}

function setClassCheck() {
    var chgPs = $('#chguser-ShowPermission');
    var chgPi = $('#chguser-InputPermission');
    var chgCi = $('#chguser-InputClass');
    var newPi = $('#newuser-InputPermission');
    var newCi = $('#newuser-InputClass');

    if ((chgPs.val() == "1" && chgPi.val() != "0") || chgPi.val() == "1")
        chgCi.prop("disabled", true);
    else
        chgCi.prop("disabled", false);

    if (newPi.val() == "1")
        newCi.prop("disabled", true);
    else
        newCi.prop("disabled", false);
}

function FormSubmitListener() {
    $('#form-chguser').submit(function () {
        var getURl = new URL(location.href);
        var acc = getURl.searchParams.get('acc');
        var n_name = $('#chguser-InputName').val();
        var n_permission = $('#chguser-InputPermission').val();
        var n_class = $('#chguser-InputClass').val();
        var n_pw = $('#chguser-InputPw').val();
        var n_pw_re = $('#chguser-InputPwRe').val();

        if (acc == null) {
            $.alert({
                title: '錯誤',
                content: '尚未選擇欲更改之帳號',
                type: 'red',
                typeAnimated: true
            });
        } else {
            var users = getUsers(false);
            var userinfo;
            for (let i = 0; i < users.length; i++) {
                if (users[i]['account'] == acc) {
                    userinfo = users[i];
                    break;
                }
            }
            var old_name = userinfo['name'];
            var old_class = userinfo['class'];
            var old_permission = userinfo['isAdmin'];
            if (n_name == '' && n_permission == '-1' && n_class == '' && n_pw == '') {
                $.alert({
                    title: '錯誤',
                    content: '無任何欲修改之資料',
                    type: 'red',
                    typeAnimated: true
                });
            } else {
                var ConfrimContent = "";
                var chguserParams = "";
                ConfrimContent += "欲修改資訊如下 請確認:<br>帳號: " + acc + "<br>";
                chguserParams += "&operate_acc=" + acc;
                if (n_name != "") {
                    chguserParams += "&new_name=" + n_name;
                    ConfrimContent += "名稱: <var>" + old_name + "</var> 更改為 <var>" + n_name + "</var><br>";
                }
                if (n_permission != '-1') {
                    chguserParams += "&new_isAdmin=" + n_permission;
                    ConfrimContent += "權限: <var>" + old_permission + "(" + PermissionStr[old_permission] + ")</var> 更改為 <var>" + n_permission + "(" + PermissionStr[n_permission] + ")</var><br>";
                }
                if (n_class != "") {
                    chguserParams += "&new_class=" + n_class;
                    ConfrimContent += "班級: <var>" + old_class + "</var><br>更改為 <var>" + n_class + "</var><br>";
                }
                if (n_pw != "") {
                    if (n_pw != '' && n_pw_re != '') {
                        if (n_pw == n_pw_re) {
                            var create_time = moment(userinfo['created']).format('YYYYMMDDHHmmss');
                            var mMD5 = md5(create_time + n_pw);
                            chguserParams += "&new_pw=" + mMD5;
                            ConfrimContent += "<b>密碼更改</b><br>";
                        } else {
                            $.alert({
                                title: '錯誤',
                                content: '確認新密碼不符合!!請重新輸入',
                                type: 'red',
                                typeAnimated: true
                            });
                            return false;
                        }
                    } else {
                        $.alert({
                            title: '錯誤',
                            content: '密碼未輸入完整!!請重新輸入',
                            type: 'red',
                            typeAnimated: true
                        });
                        return false;
                    }
                }
                console.log(chguserParams);
                $.confirm({
                    title: '更改確認!',
                    content: ConfrimContent,
                    buttons: {
                        confirm: {
                            text: '確認',
                            btnClass: 'btn-blue',
                            action: function () {
                                HideAlert();
                                $.ajax({
                                    url: "../backend/user.php",
                                    data: "mode=chguser&acc=" + $.cookie("LoginInfoAcc") + "&pw=" + $.cookie("LoginInfoPw") + chguserParams,
                                    type: "POST",
                                    success: function (msg) {
                                        console.log(msg);
                                        $('#chguser-InputName').val('');
                                        $('#chguser-InputPermission').val(-1);
                                        $('#chguser-InputClass').val('');
                                        $('#chguser-InputPw').val('');
                                        $('#chguser-InputPwRe').val('');
                                        if (msg == "ok") {
                                            ShowAlart('alert-success', '修改成功', false, true);
                                            if (acc == $.cookie("LoginInfoAcc")) {
                                                location.replace("./login.html")
                                            } else {
                                                setTimeout(function () {
                                                    location.replace("./index.html#UserManage")
                                                }, 1500);
                                            }
                                        } else {
                                            ShowAlart('alert-danger', '權限錯誤!!', false, false);
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
                        },
                        cancel: {
                            text: '取消'
                        }
                    }
                });
            }
        }
        return false;
    });
    $('#form-newuser').submit(function () {
        var n_acc = $('#newuser-InputAcc').val();
        var n_name = $('#newuser-InputName').val();
        var n_permission = $('#newuser-InputPermission').val();
        var n_class = $('#newuser-InputClass').val();
        var n_pw = $('#newuser-InputPw').val();
        var n_pw_re = $('#newuser-InputPwRe').val();
        if (n_permission == '1')
            n_class = '-1';
        if (n_acc != '' && n_name != '' && n_class != '' && n_permission != "-1" && n_pw != '' && n_pw_re != '') {
            if (n_pw == n_pw_re) {
                var create_time = moment().format('YYYYMMDDHHmmss');
                var create_time2 = moment().format('YYYY-MM-DD HH:mm:ss');
                var mMD5 = md5(create_time + n_pw);
                $.confirm({
                    title: '新增帳號!!',
                    content: '確認新增此帳號??',
                    buttons: {
                        confirm: {
                            text: '確認',
                            btnClass: 'btn-blue',
                            action: function () {
                                HideAlert();
                                $.ajax({
                                    url: "../backend/user.php",
                                    data: "mode=newuser" +
                                        "&acc=" + $.cookie("LoginInfoAcc") +
                                        "&pw=" + $.cookie("LoginInfoPw") +
                                        "&operate_acc=" + n_acc +
                                        "&new_name=" + n_name +
                                        "&new_isAdmin=" + n_permission +
                                        "&new_class=" + n_class +
                                        "&new_pw=" + mMD5 +
                                        "&new_create_time=" + create_time2
                                    ,
                                    type: "POST",
                                    success: function (msg) {
                                        console.log(msg);
                                        $('#newuser-InputAcc').val('');
                                        $('#newuser-InputPermission').val(-1);
                                        $('#newuser-InputName').val('');
                                        $('#newuser-InputClass').val('');
                                        $('#newuser-InputPw').val('');
                                        $('#newuser-InputPwRe').val('');
                                        if (msg == "ok")
                                            ShowAlart('alert-success', '新增成功', false, true);
                                        else
                                            ShowAlart('alert-danger', '錯誤!!', false, false);
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
                        },
                        cancel: {
                            text: '取消'
                        }
                    }
                });
            } else {
                $.alert({
                    title: '錯誤',
                    content: '確認新密碼不符合!!請重新輸入',
                    type: 'red',
                    typeAnimated: true
                });
            }
        } else {
            $.alert({
                title: '錯誤',
                content: '輸入未完整!!',
                type: 'red',
                typeAnimated: true
            });
        }
        return false;
    });
    $('#form-chgclub').submit(function () {
        var getURl = new URL(location.href);
        var id = getURl.searchParams.get('id');
        var n_name = $('#chgclub-InputName').val();
        var n_teacher = $('#chgclub-InputTeacher').val();
        var n_grade = $("[name='radio_chg']:checked").val();
        var n_isSpecial = $('#chgclub-InputIsSpecial').prop("checked");
        var n_maxP = $('#chgclub-InputMaxP').val();

        if (id == null) {
            $.alert({
                title: '錯誤',
                content: '尚未選擇欲更改之社團',
                type: 'red',
                typeAnimated: true
            });
        } else {
            var clubs = getAllClub();
            var clubinfo;
            for (let i = 0; i < clubs.length; i++) {
                if (clubs[i]['id'] == id) {
                    clubinfo = clubs[i];
                    break;
                }
            }
            var old_name = clubinfo['name'];
            var old_teacher = clubinfo['teacher'];
            var old_grade = clubinfo['grade'];
            var old_isSpecial = clubinfo['isSpecial'];
            var old_maxP = clubinfo['maxPeople'];
            if (n_name == '' && n_teacher == '' && n_grade == old_grade && n_isSpecial == (old_isSpecial == '是') && n_maxP == '') {
                $.alert({
                    title: '錯誤',
                    content: '無任何欲修改之資料',
                    type: 'red',
                    typeAnimated: true
                });
            } else {
                var ConfrimContent = "";
                var chguserParams = "";
                ConfrimContent += "欲修改資訊如下 請確認:<br>代碼: " + id + "<br>";
                chguserParams += "&operate_id=" + id;
                if (n_name != "") {
                    chguserParams += "&new_name=" + n_name;
                    ConfrimContent += "名稱: <var>" + old_name + "</var> 更改為 <var>" + n_name + "</var><br>";
                }
                if (n_teacher != '') {
                    chguserParams += "&new_teacher=" + n_teacher;
                    ConfrimContent += "教師: <var>" + old_teacher + "</var> 更改為 <var>" + n_teacher + "</var><br>";
                }
                if (n_grade != old_grade) {
                    chguserParams += "&new_grade=" + n_grade;
                    ConfrimContent += "年級: <var>" + old_grade + "</var>更改為 <var>" + n_grade + "</var><br>";
                }
                if (n_isSpecial != (old_isSpecial == '是')) {
                    chguserParams += "&new_isSpecial=" + n_isSpecial;
                    ConfrimContent += "特殊社團: <var>" + old_isSpecial + "&nbsp;</var>更改為 <var>" + (n_isSpecial ? '是' : '否') + "</var><br>";
                }
                if (n_maxP != '') {
                    chguserParams += "&new_maxP=" + n_maxP;
                    ConfrimContent += "人數限制: <var>" + old_maxP + "</var> 更改為 <var>" + n_maxP + "</var><br>";
                }

                console.log(chguserParams);
                $.confirm({
                    title: '更改確認!',
                    content: ConfrimContent,
                    buttons: {
                        confirm: {
                            text: '確認',
                            btnClass: 'btn-blue',
                            action: function () {
                                HideAlert();
                                $.ajax({
                                    url: "../backend/db.php",
                                    data: "mode=chgclub&acc=" + $.cookie("LoginInfoAcc") + "&pw=" + $.cookie("LoginInfoPw") + chguserParams,
                                    type: "POST",
                                    success: function (msg) {
                                        console.log(msg);
                                        if (msg == "ok") {
                                            ShowAlart('alert-success', '修改成功', false, true);
                                            setTimeout(function () {
                                                location.replace("./index.html#ClubManage")
                                            }, 1500);
                                        } else {
                                            ShowAlart('alert-danger', '權限錯誤!!', false, false);
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
                        },
                        cancel: {
                            text: '取消'
                        }
                    }
                });
            }
        }
        return false;
    });
    $('#form-newclub').submit(function () {
        var n_name = $('#newclub-InputName').val();
        var n_teacher = $('#newclub-InputTeacher').val();
        var n_grade = $("[name='radio_new']:checked").val();
        var n_isSpecial = $('#newclub-InputIsSpecial').prop("checked");
        var n_maxP = $('#newclub-InputMaxP').val();

        if (n_name != '' && n_teacher != '') {
            $.confirm({
                title: '新增社團!!',
                content: '確認新增此社團??',
                buttons: {
                    confirm: {
                        text: '確認',
                        btnClass: 'btn-blue',
                        action: function () {
                            HideAlert();
                            $.ajax({
                                url: "../backend/db.php",
                                data: "mode=newclub" +
                                    "&acc=" + $.cookie("LoginInfoAcc") +
                                    "&pw=" + $.cookie("LoginInfoPw") +
                                    "&new_name=" + n_name +
                                    "&new_teacher=" + n_teacher +
                                    "&new_grade=" + n_grade +
                                    "&new_isSpecial=" + n_isSpecial +
                                    "&new_maxP=" + n_maxP
                                ,
                                type: "POST",
                                success: function (msg) {
                                    console.log(msg);
                                    $('#newclub-InputName').val('');
                                    $('#newclub-InputTeacher').val('');
                                    $('#newclub-InputMaxP').val('');
                                    if (msg == "ok") {
                                        ShowAlart('alert-success', '新增成功', false, true);
                                        setTimeout(function () {
                                            location.reload();
                                        }, 1500);
                                    } else
                                        ShowAlart('alert-danger', '錯誤!!', false, false);
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
                    },
                    cancel: {
                        text: '取消'
                    }
                }
            });
        } else {
            $.alert({
                title: '錯誤',
                content: '輸入未完整!!',
                type: 'red',
                typeAnimated: true
            });
        }
        return false;
    });
    $('#form-newAn').submit(function () {
        var title = $('#newAn-InputTitle').val();
        var content = $('#newAn-InputContent').val();
        var hyperlink = $('#newAn-InputHyperlink').val();

        if (title != '' && content != '') {
            $.confirm({
                title: '張貼公告!!',
                content: '確認張貼此公告??',
                buttons: {
                    confirm: {
                        text: '確認',
                        btnClass: 'btn-blue',
                        action: function () {
                            $.ajax({
                                url: "../backend/db.php",
                                data: "mode=newAn" +
                                    "&acc=" + $.cookie("LoginInfoAcc") +
                                    "&pw=" + $.cookie("LoginInfoPw") +
                                    "&title=" + title +
                                    "&content=" + content +
                                    "&hyperlink=" + hyperlink,
                                type: "POST",
                                success: function (msg) {
                                    console.log(msg);
                                    if (msg == "ok") {
                                        $.alert({
                                            title: '成功',
                                            content: '張貼成功!!',
                                            type: 'blue',
                                            typeAnimated: true
                                        });
                                        $('#modal-newAn').modal('hide');
                                        setTimeout(function () {
                                            $('#table_An_manage').bootstrapTable('load', getAnData());
                                        }, 500);
                                    } else
                                        ShowAlart('alert-danger', '錯誤!!', false, false);
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
                    },
                    cancel: {
                        text: '取消'
                    }
                }
            });
        } else {
            $.alert({
                title: '錯誤',
                content: '輸入未完整!!',
                type: 'red',
                typeAnimated: true
            });
        }
        return false;
    });
    $('#form-Chgpw').submit(function () {
        HideAlert();
        var acc = $('#InputAcc').val();
        var oldpw = $('#InputOldPw').val();
        var npw = $('#InputNewPw').val();
        var npwr = $('#InputNewPwRe').val();
        if (npw == "" || npwr == "" || acc == "" || oldpw == "") {
            $.alert({
                title: '錯誤',
                content: '未輸入完整!!請再試一次',
                type: 'red',
                typeAnimated: true
            });
        } else if (npw != npwr) {
            $('#InputNewPw').val('');
            $('#InputNewPwRe').val('');
            $.alert({
                title: '錯誤',
                content: '確認新密碼不符合!!請再試一次',
                type: 'red',
                typeAnimated: true
            });
        } else {
            $.ajax({
                url: "../backend/user.php",
                data: "mode=get_create_time&acc=" + acc,
                type: "POST",
                success: function (msg_st) {
                    console.log(msg_st);
                    if (msg_st == 'no_acc') {
                        console.log('no_acc');
                        $('#InputAcc').val('');
                        $('#InputOldPw').val('');
                        $('#InputNewPw').val('');
                        $('#InputNewPwRe').val('');
                        ShowAlart('alert-danger', '帳號錯誤!!,此帳號尚未註冊', false, true);
                    } else {
                        var oldpwMd5 = md5(msg_st + oldpw);
                        var newpwMd5 = md5(msg_st + npw);
                        /*console.log(msg_st+oldpw);
                        console.log(msg_st+npw);
                        console.log(oldpwMd5);
                        console.log(newpwMd5);*/
                        $.ajax({
                            url: "../backend/user.php",
                            data: "mode=chgpw&old_pw=" + oldpwMd5 + "&new_pw=" + newpwMd5 + "&acc=" + acc,
                            type: "POST",
                            success: function (msg_nd) {
                                console.log(msg_nd);
                                if (msg_nd == "old_pw_error") {
                                    ShowAlart('alert-danger', '舊密碼錯誤', false, false);
                                }
                                if (msg_nd == "ok") {
                                    if (acc == $.cookie("LoginInfoAcc")) {
                                        location.replace("./login.html")
                                    }
                                    $('#InputAcc').val('');
                                    $('#InputOldPw').val('');
                                    $('#InputNewPw').val('');
                                    $('#InputNewPwRe').val('');
                                    ShowAlart('alert-success', '更改成功!!!', false, true);
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
        return false;
    });
}

function ButtonOnClickListener() {
    $('#btn_chguser-del').click(function () {
        var getURl = new URL(location.href);
        var acc = getURl.searchParams.get('acc');
        if (acc == null) {
            $.alert({
                title: '錯誤',
                content: '尚未選擇欲刪除之帳號',
                type: 'red',
                typeAnimated: true
            });
        } else {
            var users = getUsers(false);
            var userinfo;
            for (let i = 0; i < users.length; i++) {
                if (users[i]['account'] == acc) {
                    userinfo = users[i];
                    break;
                }
            }
            var name = userinfo['name'];
            $.confirm({
                title: '確認刪除!!',
                content:
                    '即將刪除:' + acc + '(' + name + ')' +
                    '<label>請再次輸入你的密碼確認刪除此帳號</label>' +
                    '<input type="password" placeholder="輸入密碼" class="pw form-control" required/>'
                ,
                type: 'red',
                autoClose: 'cancel|10000',
                buttons: {
                    confirm: {
                        text: '刪除',
                        btnClass: 'btn-red',
                        action: function () {
                            var pw = this.$content.find('.pw').val();
                            if (pw != '') {
                                $.ajax({
                                    url: "../backend/user.php",
                                    data: "mode=get_create_time" +
                                        "&acc=" + $.cookie("LoginInfoAcc"),
                                    type: "POST",
                                    success: function (msg) {
                                        if (msg != 'no_acc') {
                                            mMd5 = md5(msg + pw);
                                            if (mMd5 == $.cookie("LoginInfoPw")) {
                                                $.ajax({
                                                    url: "../backend/user.php",
                                                    data: "mode=deluser" +
                                                        "&acc=" + $.cookie("LoginInfoAcc") +
                                                        "&pw=" + $.cookie("LoginInfoPw") +
                                                        "&operate_acc=" + acc
                                                    ,
                                                    type: "POST",
                                                    success: function (msg) {
                                                        if (msg == "ok") {
                                                            ShowAlart('alert-success', '刪除成功', false, true);
                                                            if (acc == $.cookie("LoginInfoAcc")) {
                                                                location.replace("./login.html")
                                                            } else {
                                                                setTimeout(function () {
                                                                    location.replace("./index.html#UserManage")
                                                                }, 1500);
                                                            }
                                                        } else {
                                                            ShowAlart('alert-danger', '錯誤!!', false, false);
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
                                            } else {
                                                $.alert('密碼錯誤');
                                            }
                                        } else {
                                            $.alert('錯誤');
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
                            } else {
                                $.alert('未輸入密碼');
                                return false;
                            }
                        }
                    },
                    cancel: {
                        text: '取消'
                    },
                }
            });
        }
    });
    $('#btn_chgclub-del').click(function () {
        var getURl = new URL(location.href);
        var id = getURl.searchParams.get('id');
        if (id == null) {
            $.alert({
                title: '錯誤',
                content: '尚未選擇欲刪除之社團',
                type: 'red',
                typeAnimated: true
            });
        } else {
            var clubs = getAllClub();
            var clubinfo;
            for (let i = 0; i < clubs.length; i++) {
                if (clubs[i]['id'] == id) {
                    clubinfo = clubs[i];
                    break;
                }
            }
            var name = clubinfo['name'];
            $.confirm({
                title: '確認刪除!!',
                content: '即將刪除:' + id + '(' + name + ')',
                type: 'red',
                autoClose: 'cancel|10000',
                buttons: {
                    confirm: {
                        text: '刪除',
                        btnClass: 'btn-blue',
                        action: function () {
                            $.ajax({
                                url: "../backend/db.php",
                                data: "mode=delclub" +
                                    "&acc=" + $.cookie("LoginInfoAcc") +
                                    "&pw=" + $.cookie("LoginInfoPw") +
                                    "&operate_id=" + id
                                ,
                                type: "POST",
                                success: function (msg) {
                                    if (msg == "ok") {
                                        ShowAlart('alert-success', '刪除成功', false, true);
                                        setTimeout(function () {
                                            location.reload();
                                        }, 1500);
                                    } else {
                                        ShowAlart('alert-danger', '錯誤!!', false, false);
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
                    },
                    cancel: {
                        text: '取消'
                    },
                }
            });
        }
    });
    $('#btn_checkNotSelected').click(function () {
        checkNotSelected(true);
    });
    $('#btn_definite_distribute').click(function () {
        $.ajax({
            url: "../backend/db.php",
            data: "mode=definite_distribute" +
                "&acc=" + $.cookie("LoginInfoAcc") +
                "&pw=" + $.cookie("LoginInfoPw"),
            type: "POST",
            async: false,
            success: function (msg) {
                console.log(msg);
                if (msg == 'ok') {
                    $.alert({
                        title: '確定中選社團分配',
                        content: '分配完成',
                        type: 'blue',
                        typeAnimated: true
                    });
                    stepCheck();
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
    });
    $('#btn_selects_draw').click(function () {
        $.ajax({
            url: "../backend/db.php",
            data: "mode=selects_draw" +
                "&acc=" + $.cookie("LoginInfoAcc") +
                "&pw=" + $.cookie("LoginInfoPw"),
            type: "POST",
            async: false,
            success: function (msg) {
                console.log(msg);
                if (msg == 'ok') {
                    $.alert({
                        title: '志願序抽籤',
                        content: '抽籤完成',
                        type: 'blue',
                        typeAnimated: true
                    });
                    stepCheck();
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
    });
    $('#btn_second_submit').click(function () {
        changeGradeClass_SM_SSubmit();
        $('#modal-second_submit').modal('show');
        $.ajax({
            url: "../backend/db.php",
            data: "mode=checkSecondOk" +
                "&acc=" + $.cookie("LoginInfoAcc") +
                "&pw=" + $.cookie("LoginInfoPw"),
            type: "POST",
            async: false,
            success: function (msg) {
                console.log(msg);
                stepCheck();
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
    });
    $('#btn_make_result').click(function () {
        $.ajax({
            url: "../backend/db.php",
            data: "mode=makeResult" +
                "&acc=" + $.cookie("LoginInfoAcc") +
                "&pw=" + $.cookie("LoginInfoPw"),
            type: "POST",
            async: false,
            success: function (msg) {
                console.log(msg);
                stepCheck();
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
    });
    $('#btn_re_second').click(function () {
        $.ajax({
            url: "../backend/db.php",
            data: "mode=re_second" +
                "&acc=" + $.cookie("LoginInfoAcc") +
                "&pw=" + $.cookie("LoginInfoPw"),
            type: "POST",
            async: false,
            success: function (msg) {
                console.log(msg);
                stepCheck();
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
    });
    $('#btn_dl_result_class').click(function () {
        window.open("../backend/db.php?mode=exportResult&acc=" + $.cookie("LoginInfoAcc") + "&pw=" + $.cookie("LoginInfoPw") + "&SRmode=class");
    });
    $('#btn_dl_result_club').click(function () {
        window.open("../backend/db.php?mode=exportResult&acc=" + $.cookie("LoginInfoAcc") + "&pw=" + $.cookie("LoginInfoPw") + "&SRmode=club");
    });
    $('#btn_reset_select').click(function () {
        $.confirm({
            title: '確認重設??',
            content:
                '重設將會刪除所有選填資料' +
                '<label>請再次輸入你的密碼確認重設資料</label>' +
                '<input type="password" placeholder="輸入密碼" class="pw form-control" required/>'
            ,
            type: 'red',
            autoClose: 'cancel|10000',
            buttons: {
                confirm: {
                    text: '重設',
                    btnClass: 'btn-red',
                    action: function () {
                        var pw = this.$content.find('.pw').val();
                        if (pw != '') {
                            $.ajax({
                                url: "../backend/user.php",
                                data: "mode=get_create_time" +
                                    "&acc=" + $.cookie("LoginInfoAcc"),
                                type: "POST",
                                success: function (msg) {
                                    if (msg != 'no_acc') {
                                        mMd5 = md5(msg + pw);
                                        if (mMd5 == $.cookie("LoginInfoPw")) {
                                            $.ajax({
                                                url: "../backend/db.php",
                                                data: "mode=reset_select" +
                                                    "&acc=" + $.cookie("LoginInfoAcc") +
                                                    "&pw=" + $.cookie("LoginInfoPw"),
                                                type: "POST",
                                                success: function (msg) {
                                                    if (msg == "ok") {
                                                        ShowAlart('alert-success', '重設成功', false, true);
                                                        setTimeout(function () {
                                                            location.reload();
                                                        }, 1500);
                                                    } else {
                                                        ShowAlart('alert-danger', '錯誤!!', false, false);
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
                                        } else {
                                            $.alert('密碼錯誤');
                                        }
                                    } else {
                                        $.alert('錯誤');
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
                        } else {
                            $.alert('未輸入密碼');
                            return false;
                        }
                    }
                },
                cancel: {
                    text: '取消'
                },
            }
        });
    });
    $('#btn_reset_result').click(function () {
        $.confirm({
            title: '確認重設??',
            content:
                '重設將會刪除所有選社結果' +
                '<label>請再次輸入你的密碼確認重設資料</label>' +
                '<input type="password" placeholder="輸入密碼" class="pw form-control" required/>'
            ,
            type: 'red',
            autoClose: 'cancel|10000',
            buttons: {
                confirm: {
                    text: '重設',
                    btnClass: 'btn-red',
                    action: function () {
                        var pw = this.$content.find('.pw').val();
                        if (pw != '') {
                            $.ajax({
                                url: "../backend/user.php",
                                data: "mode=get_create_time" +
                                    "&acc=" + $.cookie("LoginInfoAcc"),
                                type: "POST",
                                success: function (msg) {
                                    if (msg != 'no_acc') {
                                        mMd5 = md5(msg + pw);
                                        if (mMd5 == $.cookie("LoginInfoPw")) {
                                            $.ajax({
                                                url: "../backend/db.php",
                                                data: "mode=reset_result" +
                                                    "&acc=" + $.cookie("LoginInfoAcc") +
                                                    "&pw=" + $.cookie("LoginInfoPw"),
                                                type: "POST",
                                                success: function (msg) {
                                                    if (msg == "ok") {
                                                        ShowAlart('alert-success', '重設成功', false, true);
                                                        setTimeout(function () {
                                                            location.reload();
                                                        }, 1500);
                                                    } else {
                                                        ShowAlart('alert-danger', '錯誤!!', false, false);
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
                                        } else {
                                            $.alert('密碼錯誤');
                                        }
                                    } else {
                                        $.alert('錯誤');
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
                        } else {
                            $.alert('未輸入密碼');
                            return false;
                        }
                    }
                },
                cancel: {
                    text: '取消'
                },
            }
        });
    });
    $('#btn_An_new').click(function () {
        $('#modal-newAn').modal('show');
    });
    $('#btn_SM_dlStu').click(function () {
        window.open("../backend/db.php?mode=exportSMStu&acc=" + $.cookie("LoginInfoAcc") + "&pw=" + $.cookie("LoginInfoPw"));
    });
    $('#btn_stu_import').click(function () {
        $('#modal-import').modal('show');
    });
    $('#btn_stu_del').click(function () {
        $.confirm({
            title: '確認刪除所有學生資料??',
            content:
                '將會刪除所有學生資料' +
                '<label>請再次輸入你的密碼確認刪除資料</label>' +
                '<input type="password" placeholder="輸入密碼" class="pw form-control" required/>'
            ,
            type: 'red',
            autoClose: 'cancel|10000',
            buttons: {
                confirm: {
                    text: '重設',
                    btnClass: 'btn-red',
                    action: function () {
                        var pw = this.$content.find('.pw').val();
                        if (pw != '') {
                            $.ajax({
                                url: "../backend/user.php",
                                data: "mode=get_create_time" +
                                    "&acc=" + $.cookie("LoginInfoAcc"),
                                type: "POST",
                                success: function (msg) {
                                    if (msg != 'no_acc') {
                                        mMd5 = md5(msg + pw);
                                        if (mMd5 == $.cookie("LoginInfoPw")) {
                                            $.ajax({
                                                url: "../backend/db.php",
                                                data: "mode=del_stu" +
                                                    "&acc=" + $.cookie("LoginInfoAcc") +
                                                    "&pw=" + $.cookie("LoginInfoPw"),
                                                type: "POST",
                                                success: function (msg) {
                                                    if (msg == "ok") {
                                                        ShowAlart('alert-success', '刪除成功', false, true);
                                                        setTimeout(function () {
                                                            location.reload();
                                                        }, 1500);
                                                    } else {
                                                        ShowAlart('alert-danger', '錯誤!!', false, false);
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
                                        } else {
                                            $.alert('密碼錯誤');
                                        }
                                    } else {
                                        $.alert('錯誤');
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
                        } else {
                            $.alert('未輸入密碼');
                            return false;
                        }
                    }
                },
                cancel: {
                    text: '取消'
                },
            }
        });
    });
    $('#btn_stu_submit').click(function () {
        $.confirm({
            title: '檔案上傳',
            content: '確認匯入學生資料??',
            buttons: {
                confirm: {
                    text: '確認',
                    btnClass: 'btn-blue',
                    action: function () {
                        HideAlert();
                        var file_data = $('#customFile').prop('files')[0];
                        var form_data = new FormData();
                        form_data.append('file', file_data);
                        form_data.append('mode', 'stu_import');
                        form_data.append('acc', $.cookie("LoginInfoAcc"));
                        form_data.append('pw', $.cookie("LoginInfoPw"));

                        $.ajax({
                            url: '../backend/db.php',
                            cache: false,
                            contentType: false,
                            processData: false,
                            data: form_data,
                            type: 'post',
                            success: function(msg){
                                console.log(msg);
                                if(msg=='ok'){
                                    $.alert({
                                        title: '成功',
                                        content: '上傳成功!!',
                                        type: 'blue',
                                        typeAnimated: true
                                    });
                                    $('#modal-import').modal('hide');
                                }else{
                                    $.alert({
                                        title: '錯誤',
                                        content: '上傳失敗!!',
                                        type: 'red',
                                        typeAnimated: true
                                    });
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
                },
                cancel: {
                    text: '取消'
                }
            }
        });
    });
}

function getAllClub() {
    var data = "";
    $.ajax({
        url: "../backend/db.php",
        data: "mode=getAllClub" +
            "&acc=" + $.cookie("LoginInfoAcc") +
            "&pw=" + $.cookie("LoginInfoPw"),
        type: "POST",
        async: false,
        success: function (msg) {
            if (msg != "no_data") {
                var jsonA = JSON.parse(msg);
                for (var i = 0; i < jsonA.length; i++)
                    jsonA[i]['isSpecial'] = jsonA[i]['isSpecial'] == 1 ? "是" : "否";
                data = jsonA;
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
    return data;
}

function getSystem(id) {
    var data = "";
    $.ajax({
        url: "../backend/db.php",
        data: "mode=getSystem" +
            "&acc=" + $.cookie("LoginInfoAcc") +
            "&pw=" + $.cookie("LoginInfoPw") +
            "&id=" + id,
        type: "POST",
        async: false,
        success: function (msg) {
            data = msg;
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
    return data;
}

function setSystem(id, value, alert = false) {
    $.ajax({
        url: "../backend/db.php",
        data: "mode=setSystem" +
            "&acc=" + $.cookie("LoginInfoAcc") +
            "&pw=" + $.cookie("LoginInfoPw") +
            "&id=" + id +
            "&value=" + value,
        type: "POST",
        async: false,
        success: function (msg) {
            if (alert) {
                $.alert({
                    title: '選社設定',
                    content: '設定成功',
                    type: 'blue',
                    typeAnimated: true
                });
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

function CSsetting(target) {
    if (target == 'CSenable')
        setSystem("CSenable", $('#SM-CSenable').prop("checked").toString(), true);
    /*if (target == 'maxGCPN')
        setSystem('maxGCPN', $('#SM-maxGCPN').val(), true);*/
    if (target == 'display_result')
        setSystem("display_result", $('#SM-display_result').prop("checked").toString(), true);
}

function checkNotSelected(alert) {
    $.ajax({
        url: "../backend/db.php",
        data: "mode=checkNotSelected" +
            "&acc=" + $.cookie("LoginInfoAcc") +
            "&pw=" + $.cookie("LoginInfoPw"),
        type: "POST",
        async: false,
        success: function (msg) {
            console.log(msg);
            if (msg != 'no_data') {
                var jsonA = JSON.parse(msg);
                if (alert) {
                    var content_stuList = '';
                    for (var i = 0; i < jsonA.length; i++)
                        content_stuList += jsonA[i]['sid'] + " " + jsonA[i]['name'] + "<br>";
                    $.alert({
                        title: '未選社學生',
                        content: content_stuList,
                        type: 'red',
                        typeAnimated: true
                    });
                }
            } else {
                if (alert) {
                    $.alert({
                        title: '檢查未選社學生',
                        content: '全部完成',
                        type: 'blue',
                        typeAnimated: true
                    });
                }
                if (getSystem('definite_distributed') == 'false') {
                    $('#btn_definite_distribute').prop('disabled', false);
                }
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

function stepCheck() {
    if (getSystem('definite_distributed') != 'false') {
        $('#btn_checkNotSelected').prop('disabled', true);
        $('#btn_reset_select').prop('disabled', true);
        $('#btn_reset_result').prop('disabled', false);
        $('#btn_definite_distribute').prop('disabled', true);
        $('#btn_selects_draw').prop('disabled', false);
        $('#SM-CSenable').prop("checked", false);
        $('#SM-CSenable').prop("disabled", true);
        $('#icon-CSenable-lock').show();
    }
    if (getSystem('selects_drew') != 'false') {
        $('#btn_selects_draw').prop('disabled', true);
        $('#btn_second_submit').prop('disabled', false);
        //$('#btn_maxGCPN').prop('disabled', true);
        //$('#icon-maxGCPN-lock').show();
    }
    if (getSystem('makeResultEnable') != 'false') {
        $('#btn_make_result').prop('disabled', false);
    }
    if (getSystem('second') == 'false') {
        $('#btn_second_submit').prop('disabled', true);
    }
    if (getSystem('makeResultEnable') == 'false') {
        $('#btn_make_result').prop('disabled', true);
        $('#btn_re_second').prop('disabled', true);
        $('#btn_dl_result_class').prop('disabled', true);
        $('#btn_dl_result_club').prop('disabled', true);
    }
    if (getSystem('madeResult') != 'false') {
        $('#btn_make_result').prop('disabled', true);
        $('#btn_re_second').prop('disabled', false);
        $('#btn_dl_result_class').prop('disabled', false);
        $('#btn_dl_result_club').prop('disabled', false);
    }
}

var secondStudents;
var selectCheckNd;

function getSecondStudents(grade) {
    var data = "";
    $.ajax({
        url: "../backend/db.php",
        data: "mode=getSecondStudents" +
            "&acc=" + $.cookie("LoginInfoAcc") +
            "&pw=" + $.cookie("LoginInfoPw") +
            "&grade=" + grade,
        type: "POST",
        async: false,
        success: function (msg) {
            console.log(msg);
            if (msg != "no_data") {
                var jsonA = JSON.parse(msg);
                console.log(jsonA);
                data = jsonA;
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
    selectCheckNd = [data.length];
    for (var i = 0; i < data.length; i++)
        selectCheckNd[i] = false;
    secondStudents = data;
    return data;
}

var secondClubs;

function getSecondClubs(grade) {
    var data = "";
    $.ajax({
        url: "../backend/db.php",
        data: "mode=getSecondClubs" +
            "&acc=" + $.cookie("LoginInfoAcc") +
            "&pw=" + $.cookie("LoginInfoPw") +
            "&grade=" + grade,
        type: "POST",
        async: false,
        success: function (msg) {
            console.log(msg);
            if (msg != "no_data") {
                var jsonA = JSON.parse(msg);
                console.log(jsonA);
                data = jsonA;
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
    secondClubs = data;
    return data;
}

function formatterCid(value, row, index) {
    return '<input type="number" class="form-control" placeholder="代號" maxlength="4" id="inputCid_' + index + '" oninput="checkCSnd(' + index + ')"/>';
}

function formatterIsOkNd(value, row, index) {
    return '<a id="iconSelectIsOknd_' + index + '"><i class="fas fa-times" style="color: #b21f2d"/></a>';
}

function changeGradeClass_SM_SSubmit() {
    setTimeout(function () {
        var grade = $('#SM_second_submit_grade_select li .active').text();
        var gc = -1;
        if (grade == "一年級")
            gc = 1;
        else if (grade == "二年級")
            gc = 2;
        $('#tablb_second_submit').bootstrapTable('load', getSecondStudents(gc));
        $('#table_second_clubs').bootstrapTable('load', getSecondClubs(gc));
        getSelectDataNd(gc);
    }, 100);
}

function checkCSnd(row) {
    var inputCid = $('#inputCid_' + row);

    if (inputCid.val().length == 4) {
        $('#iconSelectIsOknd_' + row).html('<i class="fas fa-check" style="color: #1e7e34"/>');
        selectCheckNd[row] = true;
    } else {
        $('#iconSelectIsOknd_' + row).html('<i class="fas fa-times" style="color: #b21f2d"/>');
        selectCheckNd[row] = false;
    }

    var canEnable = true;
    for (var i = 0; i < selectCheckNd.length; i++) {
        if (!selectCheckNd[i]) {
            canEnable = false;
        }
    }
    $('#btn_SM_SSubmit').prop("disabled", !canEnable);
}

function secondVerify() {
    var codeErrorArray = [];
    for (var i = 0; i < secondStudents.length; i++) {
        var inputCid = $('#inputCid_' + i);
        var hasClubCode = false;
        for (var k = 0; k < secondClubs.length; k++) {
            if (inputCid.val() == secondClubs[k]['id']) {
                hasClubCode = true;
            }
        }
        if (!hasClubCode)
            codeErrorArray.push(i);
    }
    if (codeErrorArray.length != 0) {
        var content_cEA = '';
        for (var i = 0; i < codeErrorArray.length; i++) {
            content_cEA += secondStudents[codeErrorArray[i]]['sid'] + " " + secondStudents[codeErrorArray[i]]['name'] + "<br>";
        }
        $.alert({
            title: '社團代碼錯誤',
            content: content_cEA,
            type: 'red',
            typeAnimated: true
        });
    } else {
        var selected = new Array(secondClubs.length);
        for (var i = 0; i < selected.length; i++)
            selected[i] = 0;
        for (var k = 0; k < secondStudents.length; k++) {
            var inputCid = $('#inputCid_' + k);
            for (var n = 0; n < secondClubs.length; n++) {
                if (secondClubs[n]['id'] == inputCid.val()) {
                    selected[n]++;
                }
            }
        }
        for (var i = 0; i < selected.length; i++)
            console.log(selected[n]);
        var content_over = '';
        for (var i = 0; i < secondClubs.length; i++) {
            if (selected[i] > secondClubs[i]['rest']) {
                content_over += secondClubs[i]['id'] + '(' + secondClubs[i]['name'] + ') : ';
                for (var k = 0; k < secondStudents.length; k++) {
                    var inputCid = $('#inputCid_' + k);
                    if (secondClubs[i]['id'] == inputCid.val())
                        content_over += secondStudents[k]['sid'] + ' ' + secondStudents[k]['name'] + ',';
                }
                content_over += '<br>';
            }
        }
        if (content_over != '') {
            $.alert({
                title: '社團餘額不足',
                content: content_over,
                type: 'red',
                typeAnimated: true,
                columnClass: 'm'
            });
        } else {
            var jsonA = new Array();
            for (var i = 0; i < secondStudents.length; i++) {
                var inputCid = $('#inputCid_' + i);

                var myObj = new Object();
                myObj.sid = secondStudents[i]['sid'];
                myObj.cid = inputCid.val();

                jsonA.push(myObj);
            }
            var jsonStr = JSON.stringify(jsonA);

            console.log(jsonStr);

            $.ajax({
                url: "../backend/db.php",
                data: "mode=uploadSecond" +
                    "&acc=" + $.cookie("LoginInfoAcc") +
                    "&pw=" + $.cookie("LoginInfoPw") +
                    "&json_data=" + jsonStr,
                type: "POST",
                success: function (msg) {
                    console.log(msg);
                    if (msg.substr(-2, 2) == "ok") {
                        $.alert({
                            title: '上傳完成',
                            content: '登錄成功',
                            typeAnimated: true
                        });
                        stepCheck();
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

function getSelectDataNd(grade) {
    $.ajax({
        url: "../backend/db.php",
        data: "mode=getSecendData" +
            "&acc=" + $.cookie("LoginInfoAcc") +
            "&pw=" + $.cookie("LoginInfoPw") +
            "&grade=" + grade,
        type: "POST",
        async: false,
        success: function (msg) {
            console.log(msg);
            if (msg != "no_data") {
                var jsonA = JSON.parse(msg);
                console.log(jsonA);
                for (var i = 0; i < secondStudents.length; i++) {
                    var sid = secondStudents[i]['sid'];
                    var inputCid = $('#inputCid_' + i);

                    for (var k = 0; k < jsonA.length; k++) {
                        if (sid == jsonA[k]['sid']) {
                            inputCid.val(jsonA[k]['cid'] == 0 ? "" : jsonA[k]['cid']);
                            checkCSnd(i);
                        }
                    }
                }
            }
            if (getSystem('second') == 'false') {
                $('#btn_SM_SSubmit').prop("disabled", true);
                for (var i = 0; i < secondStudents.length; i++) {
                    $('#inputCid_' + i).prop("disabled", true);
                }
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

function SRAdminViewSwitch() {
    $('#SR-classShow').hide();
    $('#SR-admin_view').hide();
    if ($.cookie('LoginInfoAdmin') == '1') {
        $('#SR-admin_view').show();
        changeSRShowMode();
    } else {
        $('#SR-classShow').show();
        var mClass = $.cookie('LoginInfoClass');
        var grade = mClass.substring(0, 1);
        $('#SR-mClass').text((grade == '1' ? "一年級" : "二年級") + '-' + mClass);
        $('#table_SR').bootstrapTable('load', getSRData('class', mClass));
    }
}

var SRShowMode;

function changeSRShowMode() {
    setTimeout(function () {
        var mode = $('#SR_show_mode_switch li .active').text();
        console.log(mode);
        $('.SRNdView').hide();
        if (mode == "依班級") {
            SRShowMode = 'class';
            $('#SR_grade_select').show();
            $('#SR_classSwitch').show();
            changeSRGrade();
        } else if (mode == "依社團") {
            SRShowMode = 'club';
            $('#SR_clubSwitch').show();
            $('#select_SR_club').val('-1');
            $('#table_SR').bootstrapTable("removeAll");
        }
    }, 100);
}

function changeSRGrade() {
    setTimeout(function () {
        var grade = $('#SR_grade_select li .active').text();
        var grade_num = -1;
        console.log(grade);
        if (grade == "一年級") {
            grade_num = 1;
            $('#SR_class_selectG1').show();
            $('#SR_class_selectG2').hide();
        } else if (grade == "二年級") {
            grade_num = 2;
            $('#SR_class_selectG2').show();
            $('#SR_class_selectG1').hide();
        }
        changeSRClass(grade_num);
    }, 100);
}

function changeSRClass(grade) {
    setTimeout(function () {
        var class_num = -1;
        if (grade == 1) {
            class_num = parseInt($('#SR_class_selectG1 li .active').text(), 10);
        } else if (grade == 2) {
            class_num = parseInt($('#SR_class_selectG2 li .active').text(), 10);
        }
        console.log(class_num);
        $('#table_SR').bootstrapTable('load', getSRData('class', class_num));
    }, 100);
}

function initSRclub() {
    var allClub = getAllClub();
    for (var i = 0; i < allClub.length; i++) {
        var opt_tmp = "<option value='" + allClub[i]['id'] + "'>" + allClub[i]['id'] + ' (' + allClub[i]['name'] + ")</option>";
        $('#select_SR_club').append(opt_tmp);
    }
}

function selectSRclub() {
    var selected = $('#select_SR_club').val();
    console.log(selected);
    $('#table_SR').bootstrapTable('load', getSRData('club', selected));
}

function getSRData(mode, target) {
    var data = "";
    $.ajax({
        url: "../backend/db.php",
        data: "mode=getSRData" +
            "&acc=" + $.cookie("LoginInfoAcc") +
            "&pw=" + $.cookie("LoginInfoPw") +
            "&SRmode=" + mode +
            "&target=" + target,
        type: "POST",
        async: false,
        success: function (msg) {
            console.log(msg);
            if (msg != "no_data") {
                var jsonA = JSON.parse(msg);
                console.log(jsonA);
                data = jsonA;
            } else {
                $('#table_SR').bootstrapTable("removeAll");
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
    return data;
}

function getAnData() {
    var data = "";
    $.ajax({
        url: "../backend/db.php",
        data: "mode=getAnData",
        type: "POST",
        async: false,
        success: function (msg) {
            console.log(msg);
            if (msg != "no_data") {
                var jsonA = JSON.parse(msg);
                console.log(jsonA);
                for (var i = 0; i < jsonA.length; i++) {
                    if (jsonA[i]['hyperlink'] != '') {
                        var hyperlink = '<br><br><b>連結</b>:';
                        var tmp = jsonA[i]['hyperlink'].split(',');
                        for (var k = 0; k < tmp.length; k++) {
                            if (tmp[k].substr(0, 4) != 'http')
                                tmp[k] = 'http://' + tmp[k];
                            hyperlink += '<br><a href="' + tmp[k] + '">' + tmp[k] + '</a>';
                        }
                        jsonA[i]['content'] += hyperlink;
                    }
                }
                data = jsonA;
            } else {
                $('#table_An_manage').bootstrapTable("removeAll");
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
    return data;
}

function stuImportSubmitCheck() {
    if($(".custom-file-input").val().split("\\").pop()!="")
        $("#btn_stu_submit").prop('disabled',false);
    else
        $("#btn_stu_submit").prop('disabled',true);
}