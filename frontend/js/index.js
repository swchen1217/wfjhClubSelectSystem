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

function FormSubmitListener() {
    $('#form-HasToken').submit(function () {
        HideAlert();
        var npw = $('#InputNewPw_f').val();
        var npwr = $('#InputNewPwRe_f').val();
        if (npw == "" || npwr == "") {
            $.alert({
                title: '錯誤',
                content: '新密碼或確認新密碼未輸入!!請再試一次',
                type: 'red',
                typeAnimated: true
            });
        } else if (npw != npwr) {
            $('#InputNewPw_f').val('');
            $('#InputNewPwRe_f').val('');
            $.alert({
                title: '錯誤',
                content: '確認新密碼不符合!!請再試一次',
                type: 'red',
                typeAnimated: true
            });
        } else {
            $('#InputNewPw_f').val('');
            $('#InputNewPwRe_f').val('');
            var mMd5 = md5(smsg[2] + npw);
            console.log(smsg[2] + npw);
            console.log(mMd5);
            console.log(token);
            $.ajax({
                url: "../ntuh_yl_RT_mdms_api/user.php",
                data: "mode=rstpw_submit&token=" + token + "&new_pw=" + mMd5,
                type: "POST",
                success: function (msg) {
                    if (msg == "rstpw_ok") {
                        console.log('ok');
                        ShowAlart('alert-success', '設定成功!!!', false, true);
                        setTimeout(function () {
                            location.replace("./index.html#ChangePw")
                        }, 1500);
                    }
                    if (msg == "token_timeout") {
                        ShowAlart('alert-danger', "連結已過期,請重新<a href='index.html#ChangePw' class='alert-link'>申請</a>!!", true, false);
                    }
                    if (msg == "hasnot_token") {
                        ShowAlart('alert-danger', "此連結無效,請重新<a href='index.html#ChangePw' class='alert-link'>申請</a>!!", true, false);
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
                url: "../ntuh_yl_RT_mdms_api/user.php",
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
                        ShowAlart('alert-danger', '員工編號錯誤!!,此員工編號尚未註冊', false, true);
                    } else {
                        var oldpwMd5 = md5(msg_st + oldpw);
                        var newpwMd5 = md5(msg_st + npw);
                        /*console.log(msg_st+oldpw);
                        console.log(msg_st+npw);
                        console.log(oldpwMd5);
                        console.log(newpwMd5);*/
                        $.ajax({
                            url: "../ntuh_yl_RT_mdms_api/user.php",
                            data: "mode=chgpw&old_pw=" + oldpwMd5 + "&new_pw=" + newpwMd5 + "&acc=" + acc,
                            type: "POST",
                            success: function (msg_nd) {
                                console.log(msg_nd);
                                if (msg_nd == "old_pw_error") {
                                    ShowAlart('alert-danger', '舊密碼錯誤', false, false);
                                }
                                if (msg_nd == "ok") {
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
    $('#form-GetToken').submit(function () {
        HideAlert();
        var email = $('#InputEmail').val();
        if (email == "") {
            $.alert({
                title: '錯誤',
                content: 'E-mail未輸入!!請再試一次',
                type: 'red',
                typeAnimated: true
            });
        } else {
            $('#InputEmail').val('');
            $.ajax({
                url: "../ntuh_yl_RT_mdms_api/user.php",
                data: "mode=forget_pw&email=" + email,
                type: "POST",
                success: function (msg) {
                    if (msg == "寄信成功") {
                        console.log('ok');
                        ShowAlart('alert-success', '密碼重設資料已寄出!!!', false, true);
                    } else if (msg == "email_not_exist") {
                        ShowAlart('alert-danger', "無此E-mail!!", false, false);
                    } else {
                        ShowAlart('alert-warning', "寄信系統錯誤,請聯絡系統管理員")
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
    $('#form-chguser').submit(function () {
        var getURl = new URL(location.href);
        var acc = getURl.searchParams.get('acc');
        var n_name = $('#chguser-InputName').val();
        var n_permission = $('#chguser-InputPermission').val();
        var n_email = $('#chguser-InputEmail').val();
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
            var users = JSON.parse($.cookie("AllUserData"));
            var userinfo;
            for (let i = 0; i < users.length; i++) {
                if (users[i]['account'] == acc) {
                    userinfo = users[i];
                    break;
                }
            }
            var old_name = userinfo['name'];
            var old_permission = userinfo['permission'];
            var old_email = userinfo['email'];
            if (n_name == '' && n_permission == '-1' && n_email == '' && n_pw == '') {
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
                    chguserParams += "&new_permission=" + n_permission;
                    ConfrimContent += "權限: <var>" + old_permission + "(" + PermissionStr[old_permission] + ")</var> 更改為 <var>" + n_permission + "(" + PermissionStr[n_permission] + ")</var><br>";
                }
                if (n_email != "") {
                    chguserParams += "&new_email=" + n_email;
                    ConfrimContent += "E-mail: <var>" + old_email + "</var><br>更改為 <var>" + n_email + "</var><br>";
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
                                    url: "../ntuh_yl_RT_mdms_api/user.php",
                                    data: "mode=chguser&acc=" + $.cookie("LoginInfoAcc") + "&pw=" + $.cookie("LoginInfoPw") + chguserParams,
                                    type: "POST",
                                    success: function (msg) {
                                        $('#chguser-InputName').val('');
                                        $('#chguser-InputPermission').val(-1);
                                        $('#chguser-InputEmail').val('');
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
        var n_email = $('#newuser-InputEmail').val();
        var n_pw = $('#newuser-InputPw').val();
        var n_pw_re = $('#newuser-InputPwRe').val();
        if (n_acc != '' && n_name != '' && n_email != '' && n_permission != '-1' && n_pw != '' && n_pw_re != '') {
            if (n_pw == n_pw_re) {
                //todo ajax
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
                                    url: "../ntuh_yl_RT_mdms_api/user.php",
                                    data: "mode=newuser" +
                                        "&acc=" + $.cookie("LoginInfoAcc") +
                                        "&pw=" + $.cookie("LoginInfoPw") +
                                        "&operate_acc=" + n_acc +
                                        "&new_name=" + n_name +
                                        "&new_permission=" + n_permission +
                                        "&new_email=" + n_email +
                                        "&new_pw=" + mMD5 +
                                        "&new_create_time=" + create_time2
                                    ,
                                    type: "POST",
                                    success: function (msg) {
                                        $('#newuser-InputAcc').val('');
                                        $('#newuser-InputPermission').val(-1);
                                        $('#newuser-InputName').val('');
                                        $('#newuser-InputEmail').val('');
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
            var users = JSON.parse($.cookie("AllUserData"));
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
                        btnClass: 'btn-blue',
                        action: function () {
                            var pw = this.$content.find('.pw').val();
                            if (pw != '') {
                                $.ajax({
                                    url: "../ntuh_yl_RT_mdms_api/user.php",
                                    data: "mode=get_create_time" +
                                        "&acc=" + $.cookie("LoginInfoAcc"),
                                    type: "POST",
                                    success: function (msg) {
                                        if (msg != 'no_acc') {
                                            mMd5 = md5(msg + pw);
                                            if (mMd5 == $.cookie("LoginInfoPw")) {
                                                $.ajax({
                                                    url: "../ntuh_yl_RT_mdms_api/user.php",
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

    $('#btn_del_position').click(function () {
        console.log("del");
        HideAlert();
        $.confirm({
            title: '確認刪除!!',
            content: '確認刪除??',
            type: 'red',
            buttons: {
                confirm: {
                    text: '刪除',
                    btnClass: 'btn-red',
                    action: function () {
                        console.log($('#table_position').bootstrapTable('getAllSelections'));
                        var del_data = $('#table_position').bootstrapTable('getAllSelections');
                        for (var i = 0; i < del_data.length; i++) {
                            $.ajax({
                                url: "../ntuh_yl_RT_mdms_api/db.php",
                                data: "mode=del_position" +
                                    "&acc=" + $.cookie("LoginInfoAcc") +
                                    "&pw=" + $.cookie("LoginInfoPw") +
                                    "&position=" + del_data[i]['type'] + "-" + del_data[i]['item'],
                                type: "POST",
                                success: function (msg) {
                                    if (msg == 'ok') {
                                        //$('#table_position').bootstrapTable(' refresh',{data:getPositionData(),silent: true});
                                        console.log("del_ok")
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
                        ShowAlart('alert-success', '刪除成功', false, true);
                        setTimeout(function () {
                            location.reload();
                        }, 1000);
                    }
                },
                cancel: {
                    text: '取消'
                },
            }
        });
    });

    $('#btn_new_position').click(function () {
        console.log(maxNewPositionRow);
        for(var i=0;i<=maxNewPositionRow;i++){
            var type=$('#inputType_'+i).val();
            var item=$('#inputItem_'+i).val();
            if(type!="" && item!=""){
                var tmp=type+"-"+item;
                console.log(tmp);
                $.ajax({
                    url: "../ntuh_yl_RT_mdms_api/db.php",
                    data: "mode=new_position" +
                        "&acc=" + $.cookie("LoginInfoAcc") +
                        "&pw=" + $.cookie("LoginInfoPw") +
                        "&position=" + tmp,
                    type: "POST",
                    success: function (msg) {
                        if (msg == 'ok') {
                            ShowAlart('alert-success', '新增成功', false, true);
                        }else{
                            ShowAlart('alert-danger', '新增失敗', false, false);
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
        setTimeout(function () {
            location.reload();
        }, 1000);
    });
}

function PermissionCheck(needAdmin, isAlert) {
    HideAlert();
    var hasAdmin = $.cookie("LoginInfoAdmin");
    if((needAdmin && hasAdmin=='1') || needAdmin!=true){
        console.log("Pass");
        return true;
    }else{
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
        document.getElementById("QRModalTitle").innerText=DID;
        document.getElementById("QRModalContext1").innerHTML="<img src='../ntuh_yl_RT_mdms_api/make_qrcode.php?DID="+DID+"'/>";
        document.getElementById("QRModalContext2").innerHTML="<a href='../ntuh_yl_RT_mdms_api/make_qrcode.php?DID="+DID+"' download>下載QRCode<br>(87x87)</a>";

        $('#QRModal').modal('show');
    },
    /*'click #position_table_del': function (e, value, row, index) {
        console.log("del");
        console.log(row);
        HideAlert();
        $.confirm({
            title: '確認刪除!!',
            content: '確認刪除??',
            type: 'red',
            buttons: {
                confirm: {
                    text: '刪除',
                    btnClass: 'btn-red',
                    action: function () {
                        $.ajax({
                            url: "../ntuh_yl_RT_mdms_api/db.php",
                            data: "mode=del_position" +
                                "&acc=" + $.cookie("LoginInfoAcc")+
                                "&pw=" + $.cookie("LoginInfoPw")+
                                "&position="+row['type']+"-"+row['item'],
                            type: "POST",
                            success: function (msg) {
                                if(msg=='ok'){
                                    ShowAlart('alert-success', '刪除成功', false, true);
                                    //$('#table_position').bootstrapTable('refresh',{data:getPositionData(),silent: true});
                                }
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
                },
            }
        });
    }*/
};

function LinkFormatterUM(value, row, index) {
    return "<a href='?acc=" + value + "#UserManage'>" + value + "</a>";
}

var grade_num=-1;
function changeGradeClass() {
    setTimeout(function () {
        var grade=$('#CS_grade_select li .active').text();
        console.log(grade);
        if(grade=="一年級"){
            grade_num=1;
            $('#CS_class_selectG1').show();
            $('#CS_class_selectG2').hide();
        }else if(grade=="二年級"){
            grade_num=2;
            $('#CS_class_selectG2').show();
            $('#CS_class_selectG1').hide();
        }
        $('#table_clubList').bootstrapTable('load',getClubList(grade_num));
        changeClass();
    }, 100);
}

function changeClass() {
    setTimeout(function () {
        console.log(grade_num);
        var mClass=-1;
        if(grade_num==1){
            mClass=$('#CS_class_selectG1 li .active').text();
        }else if(grade_num==2){
            mClass=$('#CS_class_selectG2 li .active').text();
        }
        console.log(mClass);
        $('#table_clubSelect').bootstrapTable('load',getStudents(mClass));
    }, 100);
}

function getClubList(need_grade) {
    var data="";
    $.ajax({
        url: "../backend/db.php",
        data: "mode=getClubList" +
            "&acc=" + $.cookie("LoginInfoAcc") +
            "&pw=" + $.cookie("LoginInfoPw")+
            "&grade=" + need_grade,
        type: "POST",
        async: false,
        success: function (msg) {
            console.log(msg);
            if(msg!="no_data"){
                var jsonA = JSON.parse(msg);
                for(var i=0;i<jsonA.length;i++)
                    jsonA[i]['isSpecial']=jsonA[i]['isSpecial']==1?"是":"否";
                console.log(jsonA);
                data = jsonA;
            }else{
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
    return data;
}

function getStudents(need_class) {
    var data="";
    $.ajax({
        url: "../backend/db.php",
        data: "mode=getStudents" +
            "&acc=" + $.cookie("LoginInfoAcc") +
            "&pw=" + $.cookie("LoginInfoPw")+
            "&class=" + need_class,
        type: "POST",
        async: false,
        success: function (msg) {
            console.log(msg);
            if(msg!="no_data"){
                var jsonA = JSON.parse(msg);
                console.log(jsonA);
                data = jsonA;
            }else{
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
    return data;
}

