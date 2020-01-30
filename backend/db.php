<?php

require("config.php");
require("request.php");
require("UserCheck.php");

mb_internal_encoding('UTF-8');

$setting = [['display_result', 'false'], ['CSenable', 'false'], ['maxGCPN', 30], ['definite_distributed', 'false'], ['selects_drew', 'false']];

$mode = request("mode");
$LastModified = request("LastModified");
$json_data = request("json_data");
$id = request("id");
$value = request("value", true);
$acc = request("acc");
$pw = request("pw");
$grade = request("grade");
$class = request("class");
$operate_id = request("operate_id");
$new_name = request("new_name");
$new_teacher = request("new_teacher");
$new_grade = request("new_grade");
$new_isSpecial = request("new_isSpecial", true);

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
        $id_c = false;
        if ($new_name != "")
            $data .= "`name`=:name,";
        if ($new_teacher != "")
            $data .= "`teacher`=:teacher,";
        if ($new_grade != "") {
            $data .= "`grade`=:grade,";
            $id_c = true;
            $data .= '`sort_id`="' . getSortId($db) . '",';
        }
        if ($new_isSpecial != null) {
            $data .= "`isSpecial`=:isSpecial,";
            $id_c = true;
        }
        if ($id_c != false)
            $data .= "`id`=:idn,";
        $data = substr($data, 0, -1);
        $id_n = ($new_grade != "" ? $new_grade : substr($operate_id, 0, 1)) . ($new_isSpecial != null ? ($new_isSpecial == 'true' ? '1' : '2') : substr($operate_id, 1, 1)) . ($new_grade != "" && $new_grade != substr($operate_id, 0, 1) ? getId($new_grade, $db) : substr($operate_id, -2));
        $sql = 'UPDATE `clubs` SET' . $data . ' WHERE `id`=:id';
        $rs = $db->prepare($sql);
        $rs->bindValue(':id', $operate_id, PDO::PARAM_STR);
        if ($new_name != "")
            $rs->bindValue(':name', $new_name, PDO::PARAM_STR);
        if ($new_teacher != "")
            $rs->bindValue(':teacher', $new_teacher, PDO::PARAM_STR);
        if ($new_grade != "")
            $rs->bindValue(':grade', $new_grade, PDO::PARAM_STR);
        if ($new_isSpecial != null)
            $rs->bindValue(':isSpecial', filter_var($new_isSpecial, FILTER_VALIDATE_BOOLEAN), PDO::PARAM_BOOL);
        if ($id_c != false)
            $rs->bindValue(':idn', $id_n, PDO::PARAM_STR);
        $rs->execute();
        echo "ok";
    } else {
        echo "error";
    }
    exit;
}

if ($mode == "newclub") {
    if (UserCheck($acc, $pw, true, $db)) {
        $new_id = $new_grade . ($new_isSpecial == 'true' ? '1' : '2') . getId($new_grade, $db);

        $sql2 = 'INSERT INTO `clubs` (id, name, teacher, grade, isSpecial,sort_id) VALUES (:id, :name, :teacher, :grade, :isSpecial,' . getSortId($db) . ')';
        $rs2 = $db->prepare($sql2);
        $rs2->bindValue(':id', $new_id, PDO::PARAM_STR);
        $rs2->bindValue(':name', $new_name, PDO::PARAM_STR);
        $rs2->bindValue(':teacher', $new_teacher, PDO::PARAM_STR);
        $rs2->bindValue(':grade', $new_grade, PDO::PARAM_STR);
        $rs2->bindValue(':isSpecial', filter_var($new_isSpecial, FILTER_VALIDATE_BOOLEAN), PDO::PARAM_BOOL);
        $rs2->execute();
        echo "ok";
    } else
        echo "error";
    exit;
}

if ($mode == "delclub") {
    if (UserCheck($acc, $pw, true, $db)) {
        $sql = 'DELETE FROM `clubs` WHERE `id`=:id';
        $rs = $db->prepare($sql);
        $rs->bindValue(':id', $operate_id, PDO::PARAM_STR);
        $rs->execute();
        echo "ok";
    } else {
        echo "error";
    }
    exit;
}

function getId($grade, PDO $mDB)
{
    $sqlM = 'SELECT id FROM `clubs` WHERE grade=:grade order by sort_id desc';
    $rsM = $mDB->prepare($sqlM);
    $rsM->bindValue(':grade', $grade, PDO::PARAM_STR);
    $rsM->execute();
    $last_num = 0;
    if ($rsM->rowCount() != 0) {
        list($id_r) = $rsM->fetch(PDO::FETCH_NUM);
        $last_num = substr($id_r, -2);
    }
    $new_num = sprintf("%02d", $last_num += 1);
    return $new_num;
}

function getSortId(PDO $mDB)
{
    $sqlM2 = 'SELECT sort_id FROM `clubs` WHERE 1=1 order by sort_id desc';
    $rsM2 = $mDB->prepare($sqlM2);
    $rsM2->execute();
    $last_num = 0;
    if ($rsM2->rowCount() != 0) {
        list($sid_r) = $rsM2->fetch(PDO::FETCH_NUM);
        $last_num = $sid_r;
    }
    $new_num = $last_num += 1;
    return $new_num;
}

if ($mode == "getSystem") {
    if (UserCheck($acc, $pw, false, $db)) {
        echo getSystem($id, $db);
    }
}

if ($mode == "setSystem") {
    if (UserCheck($acc, $pw, true, $db)) {
        setSystem($id, $value, $db);
        echo 'ok';
    }
}

function getSystem($mId, PDO $mDB)
{
    createSystemSetting($mDB);
    $sql = "SELECT value FROM `system` WHERE `id`=:id";
    $rs = $mDB->prepare($sql);
    $rs->bindValue(':id', $mId, PDO::PARAM_STR);
    $rs->execute();
    list($r) = $rs->fetch(PDO::FETCH_NUM);
    return $r;
}

function setSystem($mId, $mValue, PDO $mDB)
{
    createSystemSetting($mDB);
    $sql = "UPDATE `system` SET `value`=:value WHERE id=:id";
    $rs = $mDB->prepare($sql);
    $rs->bindValue(':value', $mValue, PDO::PARAM_STR);
    $rs->bindValue(':id', $mId, PDO::PARAM_STR);
    $rs->execute();
}

function createSystemSetting(PDO $mDB)
{
    global $setting;
    for ($i = 0; $i < count($setting); $i++) {
        $sql = "SELECT * FROM `system` WHERE `id`=" . $setting[$i][0];
        $rs = $mDB->prepare($sql);
        $rs->execute();
        if ($rs->rowCount() == 0) {
            $sql2 = "INSERT INTO `system`(`id`, `value`) VALUES ('" . $setting[$i][0] . "','" . $setting[$i][1] . "')";
            $rs2 = $mDB->prepare($sql2);
            $rs2->execute();
        }
    }
}

if ($mode == "checkNotSelected") {
    if (UserCheck($acc, $pw, true, $db)) {
        $sql = "SELECT students.sid,students.name FROM `students` left join selects on students.sid=selects.sid where selects.sid is null ";
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
    }
}

if ($mode == "definite_distribute") {
    if (UserCheck($acc, $pw, true, $db)) {
        //INSERT INTO result (sid, cid) SELECT sid,definite FROM selects WHERE selects.definite!="0"
        $sql = "INSERT INTO result (sid, cid) SELECT sid,definite FROM selects WHERE selects.definite!='0'";
        $rs = $db->prepare($sql);
        $rs->execute();
        setSystem('definite_distributed', 'true', $db);
        setSystem('CSenable', 'false', $db);
        echo 'ok';
    }
}

if ($mode == "selects_draw") {
    if (UserCheck($acc, $pw, true, $db)) {
        //取得一般社團代碼
        $sql = "SELECT id FROM `clubs` WHERE `isSpecial`=0";
        $rs = $db->prepare($sql);
        $rs->execute();
        $club_list = array();
        $club_rest_num = array();
        while (list($row) = $rs->fetch(PDO::FETCH_NUM)) {
            $club_list[] = $row;
        }
        $rs = null;

        foreach ($club_list as $value)
            echo $value . ',';
        echo '<br>';

        //maxGCPN-確定中選人數
        for ($i = 0; $i < count($club_list); $i++) {
            $sql = "SELECT clubs.id FROM `result` INNER JOIN clubs on result.cid=clubs.id WHERE clubs.isSpecial=0 AND clubs.id='" . $club_list[$i] . "'";
            $rs = $db->prepare($sql);
            $rs->execute();
            $club_rest_num[$i] = getSystem('maxGCPN', $db) - $rs->rowCount();
            $rs = null;
        }

        //A1
        for ($i = 0; $i < count($club_list); $i++) {
            $sid_r = array();
            //A1人數
            $sql = "SELECT selects.sid FROM `selects` LEFT JOIN result ON selects.sid=result.sid WHERE result.sid IS NULL AND selects.alternate1='".$club_list[$i]."'";
            $rs = $db->prepare($sql);
            $rs->execute();
            $A1_num = $rs->rowCount();
            while (list($row) = $rs->fetch(PDO::FETCH_NUM)) {
                $sid_r[] = $row;
            }
            $rs = null;

            //中選or抽籤
            if ($A1_num <= $club_rest_num[$i]) {
                echo 'cp,'.$A1_num.',';
                //複製
                $sql = "INSERT INTO result (sid, cid) SELECT sid,selects.alternate1 FROM selects WHERE selects.alternate1='" . $club_list[$i] . "'";
                $rs = $db->prepare($sql);
                $rs->execute();
                $rs = null;
                $club_rest_num[$i]-=$A1_num;
            } else {
                echo 'draw,'.$club_rest_num[$i].',';
                //抽籤
                if($club_rest_num[$i]>0){
                    $draw=(array)array_rand($sid_r,$club_rest_num[$i]);
                    foreach ($draw as $value)
                        echo $sid_r[$value].',';
                    for($k=0;$k<count($draw);$k++){
                        //寫入
                        $sql = "INSERT INTO `result`(`sid`, `cid`) VALUES ('".$sid_r[$k]."','".$club_list[$i]."')";
                        $rs = $db->prepare($sql);
                        $rs->execute();
                        $rs = null;
                    }
                    $club_rest_num[$i]-=count($draw);
                }
            }
        }

        echo '<br>';

        //A2
        for ($i = 0; $i < count($club_list); $i++) {
            $sid_r = array();
            //A2人數
            $sql = "SELECT selects.sid FROM `selects` LEFT JOIN result ON selects.sid=result.sid WHERE result.sid IS NULL AND selects.alternate2='".$club_list[$i]."'";
            $rs = $db->prepare($sql);
            $rs->execute();
            $A2_num = $rs->rowCount();
            while (list($row) = $rs->fetch(PDO::FETCH_NUM)) {
                $sid_r[] = $row;
            }
            $rs = null;

            //中選or抽籤
            if ($A2_num <= $club_rest_num[$i]) {
                echo 'cp,'.$A2_num.',';
                //複製
                $sql = "INSERT INTO result (sid, cid) SELECT sid,selects.alternate2 FROM selects WHERE selects.alternate2='" . $club_list[$i] . "'";
                $rs = $db->prepare($sql);
                $rs->execute();
                $rs = null;
                $club_rest_num[$i]-=$A2_num;
            } else {
                echo 'draw,'.$club_rest_num[$i].',';
                //抽籤
                if($club_rest_num[$i]>0){
                    $draw=(array)array_rand($sid_r,$club_rest_num[$i]);
                    foreach ($draw as $value)
                        echo $sid_r[$value].',';
                    for($k=0;$k<count($draw);$k++){
                        //寫入
                        $sql = "INSERT INTO `result`(`sid`, `cid`) VALUES ('".$sid_r[$k]."','".$club_list[$i]."')";
                        $rs = $db->prepare($sql);
                        $rs->execute();
                        $rs = null;
                    }
                    $club_rest_num[$i]-=count($draw);
                }
            }
        }



    }
}

?>