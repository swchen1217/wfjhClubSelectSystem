<?php
require("config.php");
require("request.php");
require("UserCheck.php");

mb_internal_encoding('UTF-8');

$mode = request("mode");
$acc = request("acc");
$pw = request("pw");
$email = request("email");
$old_pw = request("old_pw");
$new_pw = request("new_pw");
$operate_acc = request("operate_acc");
$new_name = request("new_name");
$new_isAdmin = request("new_isAdmin", true);
$new_create_time = request("new_create_time");
$new_create_time = request("new_create_time");
$new_class = request("new_class");

if ($mode == "login_check") {
    $sql = "SELECT password,name,isAdmin,class FROM `users` WHERE `account`=:acc";
    $rs = $db->prepare($sql);
    $rs->bindValue(':acc', $acc, PDO::PARAM_STR);
    $rs->execute();
    list($pw_r, $name_r, $isAdmin_r, $class_r) = $rs->fetch(PDO::FETCH_NUM);
    if ($pw_r == $pw) {
        echo 'ok,' . $name_r . ',' . $isAdmin_r . ',' . $class_r;
    } else
        echo "pw_error";
    exit;
}

//MD5
if ($mode == "get_create_time") {
    $sql = 'SELECT `created` FROM `users` WHERE `account`=:acc';
    $rs = $db->prepare($sql);
    $rs->bindValue(':acc', $acc, PDO::PARAM_STR);
    $rs->execute();
    if ($rs->rowCount() != 0) {
        list($create_time) = $rs->fetch(PDO::FETCH_NUM);
        echo date('YmdHis', strtotime($create_time));
    } else {
        echo 'no_acc';
    }
    exit;
}

// Manage
if ($mode == "get_user_list") {
    if (UserCheck($acc, $pw, true, $db)) {
        $sql = "SELECT account, name, isAdmin, class, created FROM `users` WHERE 1=1";
        $rs = $db->prepare($sql);
        $rs->execute();
        $json = array();
        while ($row = $rs->fetch(PDO::FETCH_ASSOC))
            $json[] = $row;
        echo json_encode($json);
    }
    exit;
}
if ($mode == "chguser") {
    if (UserCheck($acc, $pw, true, $db)) {
        $data = "";
        if ($new_name != "")
            $data .= "`name`=:name,";
        if ($new_isAdmin != "")
            $data .= "`isAdmin`=:isAdmin,";
        if ($new_class != "")
            $data .= "`class`=:class,";
        if ($new_pw != "")
            $data .= "`password`=:password,";
        $data = substr($data, 0, -1);
        $sql = 'UPDATE `users` SET' . $data . ' WHERE `account`=:acc';
        $rs = $db->prepare($sql);
        $rs->bindValue(':acc', $operate_acc, PDO::PARAM_STR);
        if ($new_name != "")
            $rs->bindValue(':name', $new_name, PDO::PARAM_STR);
        if ($new_isAdmin != "")
            $rs->bindValue(':isAdmin', $new_isAdmin, PDO::PARAM_STR);
        if ($new_class != "")
            $rs->bindValue(':class', $new_class, PDO::PARAM_STR);
        if ($new_pw != "")
            $rs->bindValue(':password', $new_pw, PDO::PARAM_STR);
        $rs->execute();
        echo "ok";
    } else {
        echo "error";
    }
    exit;
}
if ($mode == "newuser") {
    if (UserCheck($acc, $pw, true, $db)) {
        $sql = 'INSERT INTO `users` (`account`, `password`, `name`, `isAdmin`, `class`, `created`) VALUES (:account, :password, :name, :isAdmin, :class, :created)';
        $rs = $db->prepare($sql);
        $rs->bindValue(':account', $operate_acc, PDO::PARAM_STR);
        $rs->bindValue(':password', $new_pw, PDO::PARAM_STR);
        $rs->bindValue(':name', $new_name, PDO::PARAM_STR);
        $rs->bindValue(':isAdmin', $new_isAdmin, PDO::PARAM_STR);
        $rs->bindValue(':class', $new_class, PDO::PARAM_STR);
        $rs->bindValue(':created', $new_create_time, PDO::PARAM_STR);
        $rs->execute();
        echo "ok";
    } else {
        echo "error";
    }
    exit;
}
if ($mode == "deluser") {
    if (UserCheck($acc, $pw, true, $db)) {
        $sql = 'DELETE FROM `users` WHERE `account`=:acc';
        $rs = $db->prepare($sql);
        $rs->bindValue(':acc', $operate_acc, PDO::PARAM_STR);
        $rs->execute();
        echo "ok";
    } else {
        echo "error";
    }
    exit;
}
if ($mode == "chgpw") {
    $sql = 'SELECT `password` FROM `users` WHERE `account`=:acc';
    $rs = $db->prepare($sql);
    $rs->bindValue(':acc', $acc, PDO::PARAM_STR);
    $rs->execute();
    list($pw_r) = $rs->fetch(PDO::FETCH_NUM);
    if ($pw_r != $old_pw) {
        echo "old_pw_error";
    } else {
        $sql2 = 'UPDATE `users` SET `password`=:npw WHERE `account`=:acc';
        $rs2 = $db->prepare($sql2);
        $rs2->bindValue(':npw', $new_pw, PDO::PARAM_STR);
        $rs2->bindValue(':acc', $acc, PDO::PARAM_STR);
        $rs2->execute();
        echo "ok";
    }
    exit;
}
?>