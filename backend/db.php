<?php
// $db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_DBNAME.';charset=utf8', DB_USER, DB_PASS);

// Auth
/*
if(UserCheck($acc,$pw,false,$db)){

}else {
    echo "user_error";
}
*/

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
    $data=json_decode($json_data,true);
    $count=0;
    while($data[$count]!=null)
        $count++;
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

            for($i=0;$i<$count;$i++){
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
            for($i=0;$i<$count;$i++){
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

?>