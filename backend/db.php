<?php

require("config.php");
require("request.php");
require("UserCheck.php");

mb_internal_encoding('UTF-8');

$mode = request("mode");
$LastModified = request("LastModified");
$json_data = request("json_data");
$id = request("id");
$acc = request("acc");
$pw = request("pw");
$grade = request("grade");
$class = request("class");
$operate_id = request("operate_id");
$new_name = request("new_name");
$new_teacher = request("new_teacher");
$new_grade = request("new_grade");
$new_isSpecial = request("new_isSpecial",true);

if ($mode == "getClubList") {
    if (UserCheck($acc, $pw, false, $db)) {
        $sql = 'SELECT id, name, teacher, isSpecial FROM `clubs` WHERE grade=:grade';
        $rs = $db->prepare($sql);
        $rs->bindValue(':grade', $grade, PDO::PARAM_STR);
        $rs->execute();
        if ($rs->rowCount() == 0) {
            echo "no_data";
        } else {
            $ToJson = array();
            while ($row = $rs->fetch(PDO::FETCH_ASSOC)) {
                $ToJson[] = $row;
            }
            echo json_encode($ToJson);
        }
    } else {
        echo "user_error";
    }
    exit;
}

if ($mode == "getStudents") {
    if (UserCheck($acc, $pw, false, $db)) {
        $sql = 'SELECT sid, class, number, name FROM `students` WHERE class=:class';
        $rs = $db->prepare($sql);
        $rs->bindValue(':class', $class, PDO::PARAM_STR);
        $rs->execute();
        if ($rs->rowCount() == 0) {
            echo "no_data";
        } else {
            $ToJson = array();
            while ($row = $rs->fetch(PDO::FETCH_ASSOC)) {
                $ToJson[] = $row;
            }
            echo json_encode($ToJson);
        }
    } else {
        echo "user_error";
    }
    exit;
}

if ($mode == "uploadSelect") {
    //ini_set('display_errors','0');
    $data = json_decode($json_data, true);
    $count = 0;
    while ($data[$count] != null)
        $count++;
    echo "count : " . $count . ",";
    if (UserCheck($acc, $pw, false, $db)) {
        $sql = 'SELECT * FROM `selected` WHERE class=:class';
        $rs = $db->prepare($sql);
        $rs->bindValue(':class', $class, PDO::PARAM_STR);
        $rs->execute();
        if ($rs->rowCount() == 0) {
            $sql2 = 'INSERT INTO `selected`(`class`) VALUES (:class)';
            $rs2 = $db->prepare($sql2);
            $rs2->bindValue(':class', $class, PDO::PARAM_STR);
            $rs2->execute();

            for ($i = 0; $i < $count; $i++) {
                $sql3 = 'INSERT INTO `selects`(sid, definite, alternate1, alternate2, alternate3) VALUES (:sid,:definite,:alternate1,:alternate2,:alternate3)';
                $rs3 = $db->prepare($sql3);
                $rs3->bindValue(':sid', $data[$i]['sid'], PDO::PARAM_STR);
                $rs3->bindValue(':definite', $data[$i]['definite'], PDO::PARAM_STR);
                $rs3->bindValue(':alternate1', $data[$i]['alternate1'], PDO::PARAM_STR);
                $rs3->bindValue(':alternate2', $data[$i]['alternate2'], PDO::PARAM_STR);
                $rs3->bindValue(':alternate3', $data[$i]['alternate3'], PDO::PARAM_STR);
                $rs3->execute();
            }
        } else {
            for ($i = 0; $i < $count; $i++) {
                $sql4 = 'UPDATE `selects` SET `definite`=:definite,`alternate1`=:alternate1,`alternate2`=:alternate2,`alternate3`=:alternate3 WHERE sid=:sid';
                $rs4 = $db->prepare($sql4);
                $rs4->bindValue(':sid', $data[$i]['sid'], PDO::PARAM_STR);
                $rs4->bindValue(':definite', $data[$i]['definite'], PDO::PARAM_STR);
                $rs4->bindValue(':alternate1', $data[$i]['alternate1'], PDO::PARAM_STR);
                $rs4->bindValue(':alternate2', $data[$i]['alternate2'], PDO::PARAM_STR);
                $rs4->bindValue(':alternate3', $data[$i]['alternate3'], PDO::PARAM_STR);
                $rs4->execute();
            }
        }
        echo "ok";
    } else {
        echo "user_error";
    }
    exit;
}

if ($mode == "getSelectData") {
    if (UserCheck($acc, $pw, false, $db)) {
        $sql = 'SELECT selects.sid,definite,alternate1,alternate2,alternate3 FROM `selects` inner join students on selects.sid = students.sid where class=:class';
        $rs = $db->prepare($sql);
        $rs->bindValue(':class', $class, PDO::PARAM_STR);
        $rs->execute();
        if ($rs->rowCount() == 0) {
            echo "no_data";
        } else {
            $ToJson = array();
            while ($row = $rs->fetch(PDO::FETCH_ASSOC)) {
                $ToJson[] = $row;
            }
            echo json_encode($ToJson);
        }
    } else {
        echo "user_error";
    }
    exit;
}

if ($mode == "getAllClub") {
    if (UserCheck($acc, $pw, true, $db)) {
        $sql = 'SELECT id, name, teacher, grade, isSpecial FROM `clubs` WHERE 1=1';
        $rs = $db->prepare($sql);
        $rs->execute();
        if ($rs->rowCount() == 0) {
            echo "no_data";
        } else {
            $ToJson = array();
            while ($row = $rs->fetch(PDO::FETCH_ASSOC)) {
                $ToJson[] = $row;
            }
            echo json_encode($ToJson);
        }
    } else {
        echo "user_error";
    }
    exit;
}

if ($mode == "chgclub") {
    if (UserCheck($acc, $pw, true, $db)) {
        $data = "";
        if ($new_name != "")
            $data .= "`name`=:name,";
        if ($new_teacher != "")
            $data .= "`teacher`=:teacher,";
        if ($new_grade != "")
            $data .= "`grade`=:grade,";
        if ($new_isSpecial != "")
            $data .= "`isSpecial`=:isSpecial,";
        $data = substr($data, 0, -1);
        $sql = 'UPDATE `clubs` SET' . $data . ' WHERE `id`=:id';
        $rs = $db->prepare($sql);
        $rs->bindValue(':id', $operate_id, PDO::PARAM_STR);
        if ($new_name != "")
            $rs->bindValue(':name', $new_name, PDO::PARAM_STR);
        if ($new_teacher != "")
            $rs->bindValue(':teacher', $new_teacher, PDO::PARAM_STR);
        if ($new_grade != "")
            $rs->bindValue(':grade', $new_grade, PDO::PARAM_STR);
        if ($new_isSpecial != "")
            $rs->bindValue(':isSpecial', $new_isSpecial, PDO::PARAM_STR);
        $rs->execute();
        echo "ok";
    } else {
        echo "error";
    }
    exit;
}
/*if ($mode == "newuser") {
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
if ($mode = "deluser") {
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
}*/

?>