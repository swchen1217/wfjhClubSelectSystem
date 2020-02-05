<?php

require("config.php");
require("request.php");
require("UserCheck.php");

mb_internal_encoding('UTF-8');

$setting = [['display_result', 'false'], ['CSenable', 'false'], ['definite_distributed', 'false'], ['selects_drew', 'false'], ['second', 'false'], ['second_count', '0'], ['makeResultEnable', 'false'], ['madeResult', 'false']];

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
$SRmode = request("SRmode");
$target = request("target");
$title = request("title");
$content = request("content");
$hyperlink = request("hyperlink");
$new_maxP = request("new_maxP");

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
        $sql = 'SELECT id, name, teacher, grade, isSpecial,maxPeople FROM `clubs` WHERE 1=1';
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
        if ($new_maxP != "")
            $data .= "`maxPeople`=:maxPeople,";
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
        if ($new_maxP != "")
            $rs->bindValue(':maxPeople', $new_maxP, PDO::PARAM_STR);
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

        $sql2 = 'INSERT INTO `clubs` (id, name, teacher, grade, isSpecial,sort_id,maxPeople) VALUES (:id, :name, :teacher, :grade, :isSpecial,' . getSortId($db) . ',:maxPeople)';
        $rs2 = $db->prepare($sql2);
        $rs2->bindValue(':id', $new_id, PDO::PARAM_STR);
        $rs2->bindValue(':name', $new_name, PDO::PARAM_STR);
        $rs2->bindValue(':teacher', $new_teacher, PDO::PARAM_STR);
        $rs2->bindValue(':maxPeople', $new_maxP, PDO::PARAM_STR);
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
    exit;
}

if ($mode == "setSystem") {
    if (UserCheck($acc, $pw, true, $db)) {
        setSystem($id, $value, $db);
        echo 'ok';
    }
    exit;
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
    exit;
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
    exit;
}

if ($mode == "selects_draw") {
    if (UserCheck($acc, $pw, true, $db)) {
        //取得一般社團代碼
        $sql = "SELECT id,maxPeople FROM `clubs` WHERE `isSpecial`=0";
        $rs = $db->prepare($sql);
        $rs->execute();
        $club_list = array();
        $club_rest_num = array();
        while (list($id_r, $maxP_r) = $rs->fetch(PDO::FETCH_NUM)) {
            $club_list[] = $id_r;
            $club_rest_num[] = $maxP_r;
        }
        $rs = null;

        /*foreach ($club_list as $value)
            echo $value . ',';
        echo '<br>';*/

        //maxPeople-確定中選人數
        for ($i = 0; $i < count($club_list); $i++) {
            $sql = "SELECT clubs.id FROM `result` INNER JOIN clubs on result.cid=clubs.id WHERE clubs.isSpecial=0 AND clubs.id='" . $club_list[$i] . "'";
            $rs = $db->prepare($sql);
            $rs->execute();
            $club_rest_num[$i] -= $rs->rowCount();
            $rs = null;
        }

        //A1
        for ($i = 0; $i < count($club_list); $i++) {
            $sid_r = array();
            //A1人數
            $sql = "SELECT selects.sid FROM `selects` LEFT JOIN result ON selects.sid=result.sid WHERE result.sid IS NULL AND selects.alternate1='" . $club_list[$i] . "'";
            $rs = $db->prepare($sql);
            $rs->execute();
            $A1_num = $rs->rowCount();
            while (list($row) = $rs->fetch(PDO::FETCH_NUM)) {
                $sid_r[] = $row;
            }
            $rs = null;

            //中選or抽籤
            if ($A1_num <= $club_rest_num[$i]) {
                //echo 'cp,' . $A1_num . ',' . $club_rest_num[$i] . ',';
                //複製
                $sql = "INSERT INTO result (sid, cid) SELECT sid,selects.alternate1 FROM selects WHERE selects.alternate1='" . $club_list[$i] . "'";
                $rs = $db->prepare($sql);
                $rs->execute();
                $rs = null;
                $club_rest_num[$i] -= $A1_num;
            } else {
                //echo 'draw,' . $A1_num . ',' . $club_rest_num[$i] . ',';
                //抽籤
                if ($club_rest_num[$i] > 0) {
                    $draw = (array)array_rand($sid_r, $club_rest_num[$i]);
                    /*foreach ($draw as $value)
                        echo $sid_r[$value] . ',';*/
                    for ($k = 0; $k < count($draw); $k++) {
                        //寫入
                        $sql = "INSERT INTO `result`(`sid`, `cid`) VALUES ('" . $sid_r[$k] . "','" . $club_list[$i] . "')";
                        $rs = $db->prepare($sql);
                        $rs->execute();
                        $rs = null;
                    }
                    $club_rest_num[$i] -= count($draw);
                }
            }
        }

        //echo '<br>';

        //A2
        for ($i = 0; $i < count($club_list); $i++) {
            $sid_r = array();
            //A2人數
            $sql = "SELECT selects.sid FROM `selects` LEFT JOIN result ON selects.sid=result.sid WHERE result.sid IS NULL AND selects.alternate2='" . $club_list[$i] . "'";
            $rs = $db->prepare($sql);
            $rs->execute();
            $A2_num = $rs->rowCount();
            while (list($row) = $rs->fetch(PDO::FETCH_NUM)) {
                $sid_r[] = $row;
            }
            $rs = null;

            //中選or抽籤
            if ($A2_num <= $club_rest_num[$i]) {
                //echo 'cp,' . $A2_num . ',' . $club_rest_num[$i] . ',';
                //複製
                $sql = "INSERT INTO result (sid, cid) SELECT sid,selects.alternate2 FROM selects WHERE selects.alternate2='" . $club_list[$i] . "'";
                $rs = $db->prepare($sql);
                $rs->execute();
                $rs = null;
                $club_rest_num[$i] -= $A2_num;
            } else {
                //echo 'draw,' . $A2_num . ',' . $club_rest_num[$i] . ',';
                //抽籤
                if ($club_rest_num[$i] > 0) {
                    $draw = (array)array_rand($sid_r, $club_rest_num[$i]);
                    /*foreach ($draw as $value)
                        echo $sid_r[$value] . ',';*/
                    for ($k = 0; $k < count($draw); $k++) {
                        //寫入
                        $sql = "INSERT INTO `result`(`sid`, `cid`) VALUES ('" . $sid_r[$k] . "','" . $club_list[$i] . "')";
                        $rs = $db->prepare($sql);
                        $rs->execute();
                        $rs = null;
                    }
                    $club_rest_num[$i] -= count($draw);
                }
            }
        }

        //echo '<br>';

        //A3
        for ($i = 0; $i < count($club_list); $i++) {
            $sid_r = array();
            //A3人數
            $sql = "SELECT selects.sid FROM `selects` LEFT JOIN result ON selects.sid=result.sid WHERE result.sid IS NULL AND selects.alternate3='" . $club_list[$i] . "'";
            $rs = $db->prepare($sql);
            $rs->execute();
            $A3_num = $rs->rowCount();
            while (list($row) = $rs->fetch(PDO::FETCH_NUM)) {
                $sid_r[] = $row;
            }
            $rs = null;

            //中選or抽籤
            if ($A3_num <= $club_rest_num[$i]) {
                //echo 'cp,' . $A3_num . ',' . $club_rest_num[$i] . ',';
                //複製
                $sql = "INSERT INTO result (sid, cid) SELECT sid,selects.alternate3 FROM selects WHERE selects.alternate3='" . $club_list[$i] . "'";
                $rs = $db->prepare($sql);
                $rs->execute();
                $rs = null;
                $club_rest_num[$i] -= $A3_num;
            } else {
                //echo 'draw,' . $A3_num . ',' . $club_rest_num[$i] . ',';
                //抽籤
                if ($club_rest_num[$i] > 0) {
                    $draw = (array)array_rand($sid_r, $club_rest_num[$i]);
                    /*foreach ($draw as $value)
                        echo $sid_r[$value] . ',';*/
                    for ($k = 0; $k < count($draw); $k++) {
                        //寫入
                        $sql = "INSERT INTO `result`(`sid`, `cid`) VALUES ('" . $sid_r[$k] . "','" . $club_list[$i] . "')";
                        $rs = $db->prepare($sql);
                        $rs->execute();
                        $rs = null;
                    }
                    $club_rest_num[$i] -= count($draw);
                }
            }
        }

        /*echo '<br>';

        foreach ($club_rest_num as $value)
            echo $value . ',';*/

        $sql = "SELECT selects.sid FROM `selects` LEFT JOIN result ON selects.sid=result.sid WHERE result.sid IS NULL";
        $rs = $db->prepare($sql);
        $rs->execute();
        setSystem('second_count', $rs->rowCount(), $db);

        setSystem('selects_drew', 'true', $db);
        echo 'ok';
    }
    exit;
}

if ($mode == "reset_result") {
    if (UserCheck($acc, $pw, true, $db)) {
        $sql = "TRUNCATE TABLE `result`";
        $rs = $db->exec($sql);
        $rs = null;
        $sql = "TRUNCATE TABLE `second`";
        $rs = $db->exec($sql);
        $rs = null;
        setSystem('CSenable', 'false', $db);
        setSystem('definite_distributed', 'false', $db);
        setSystem('selects_drew', 'false', $db);
        setSystem('madeResult', 'false', $db);
        setSystem('makeResultEnable', 'false', $db);
        setSystem('second', 'true', $db);
        setSystem('second_count', '0', $db);
        echo 'ok';
    }
    exit;
}

if ($mode == "reset_select") {
    if (UserCheck($acc, $pw, true, $db)) {
        $sql = "TRUNCATE TABLE `selects`";
        $rs = $db->exec($sql);
        $rs = null;
        $sql = "TRUNCATE TABLE `selected`";
        $rs = $db->exec($sql);
        $rs = null;
        setSystem('CSenable', 'false', $db);
        echo 'ok';
    }
    exit;
}

if ($mode == "getSecondStudents") {
    if (UserCheck($acc, $pw, true, $db)) {
        $sql = 'SELECT students.sid,students.class,students.number,students.name FROM students LEFT JOIN result ON students.sid=result.sid WHERE result.sid IS NULL and students.grade=:grade';
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

if ($mode == "getSecondClubs") {
    if (UserCheck($acc, $pw, true, $db)) {
        $ToJson = array();
        $sql = "SELECT id,name,maxPeople FROM `clubs` WHERE `isSpecial`=0 and grade=:grade";
        $rs = $db->prepare($sql);
        $rs->bindValue(':grade', $grade, PDO::PARAM_STR);
        $rs->execute();
        while ($row = $rs->fetch(PDO::FETCH_ASSOC)) {
            $sql2 = "SELECT clubs.id,clubs.name FROM `result` INNER JOIN clubs on result.cid=clubs.id WHERE clubs.id='" . $row['id'] . "'";
            $rs2 = $db->prepare($sql2);
            $rs2->execute();
            $rest = $row['maxPeople'] - $rs2->rowCount();
            if ($rest > 0) {
                $ToJson[] = array_merge($row, array('rest' => $rest));
            }
        }
        echo json_encode($ToJson);
        $rs = null;
    } else {
        echo "user_error";
    }
    exit;
}

if ($mode == "uploadSecond") {
    $data = json_decode($json_data, true);
    $count = 0;
    while ($data[$count] != null)
        $count++;
    if (UserCheck($acc, $pw, true, $db)) {
        for ($i = 0; $i < $count; $i++) {
            $sql = 'SELECT * FROM `second` WHERE sid=:sid';
            $rs = $db->prepare($sql);
            $rs->bindValue(':sid', $data[$i]['sid'], PDO::PARAM_STR);
            $rs->execute();
            if ($rs->rowCount() == 0) {
                $sql2 = 'INSERT INTO `second`(sid, cid) VALUES (:sid,:cid)';
                $rs2 = $db->prepare($sql2);
                $rs2->bindValue(':sid', $data[$i]['sid'], PDO::PARAM_STR);
                $rs2->bindValue(':cid', $data[$i]['cid'], PDO::PARAM_STR);
                $rs2->execute();
                $rs2 = null;
            } else {
                $sql2 = 'UPDATE `second` SET `cid`=:cid WHERE sid=:sid';
                $rs2 = $db->prepare($sql2);
                $rs2->bindValue(':sid', $data[$i]['sid'], PDO::PARAM_STR);
                $rs2->bindValue(':cid', $data[$i]['cid'], PDO::PARAM_STR);
                $rs2->execute();
                $rs2 = null;
            }
        }
        echo "ok";
    } else {
        echo "user_error";
    }
    exit;
}

if ($mode == "getSecendData") {
    if (UserCheck($acc, $pw, false, $db)) {
        $sql = 'SELECT second.sid,cid FROM `second` inner join students on second.sid = students.sid where grade=:grade';
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

if ($mode == "checkSecondOk") {
    if (UserCheck($acc, $pw, false, $db)) {
        $sql = 'SELECT * FROM `second`';
        $rs = $db->prepare($sql);
        $rs->execute();
        if ($rs->rowCount() == getSystem('second_count', $db))
            setSystem('makeResultEnable', 'true', $db);
    } else
        echo "user_error";
    exit;
}

if ($mode == "makeResult") {
    if (UserCheck($acc, $pw, true, $db)) {
        $sql = "INSERT INTO result (sid, cid) SELECT sid,cid FROM second WHERE 1=1";
        $rs = $db->prepare($sql);
        $rs->execute();
        $rs = null;
        setSystem('madeResult', 'true', $db);
        setSystem('second', 'false', $db);

        $sql = "SELECT students.sid,students.class,students.number,students.name,clubs.id,clubs.name 
                    FROM (result INNER JOIN students
                        ON result.sid = students.sid)
                        INNER JOIN clubs
                            ON result.cid = clubs.id
                    ORDER BY students.sid";
        $rs = $db->prepare($sql);
        $rs->execute();

        $time = date('YmdHi');
        if (!is_dir("./export"))
            mkdir('./export');

        if ($rs->rowCount() != 0) {
            $fp = fopen('./export/wfcss_class_' . $time . '.csv', 'w');
            while ($row = $rs->fetch(PDO::FETCH_NUM)) {
                $row[3] = iconv('utf-8', 'Big5', $row[3]);
                $row[5] = iconv('utf-8', 'Big5', $row[5]);
                fputcsv($fp, $row);
            }
            fclose($fp);
        }
        $rs = null;

        $sql = "SELECT students.sid,students.class,students.number,students.name,clubs.id,clubs.name 
                    FROM (result INNER JOIN students
                        ON result.sid = students.sid)
                        INNER JOIN clubs
                            ON result.cid = clubs.id
                    ORDER BY clubs.id,students.sid";
        $rs = $db->prepare($sql);
        $rs->execute();
        if ($rs->rowCount() != 0) {
            $fp = fopen('./export/wfcss_club_' . $time . '.csv', 'w');
            while ($row = $rs->fetch(PDO::FETCH_NUM)) {
                $row[3] = iconv('utf-8', 'Big5', $row[3]);
                $row[5] = iconv('utf-8', 'Big5', $row[5]);
                fputcsv($fp, $row);
            }
            fclose($fp);
        }
        $rs = null;

        echo 'ok';
    }
    exit;
}

if ($mode == "re_second") {
    if (UserCheck($acc, $pw, true, $db)) {
        $sql = "delete result from result inner join second on result.sid=second.sid";
        $rs = $db->prepare($sql);
        $rs->execute();
        setSystem('madeResult', 'false', $db);
        setSystem('second', 'true', $db);
        setSystem('makeResultEnable', 'false', $db);
        echo 'ok';
    }
    exit;
}

if ($mode == "getSRData") {
    if (UserCheck($acc, $pw, false, $db)) {
        if ($SRmode == "class") {
            $sql = "SELECT students.sid,students.class,students.number,students.name,clubs.id,clubs.name 
                    FROM (result INNER JOIN students
                        ON result.sid = students.sid)
                        INNER JOIN clubs
                            ON result.cid = clubs.id
                    WHERE students.class=:class
                    ORDER BY students.sid";
            $rs = $db->prepare($sql);
            $rs->bindValue(':class', $target, PDO::PARAM_STR);
            $rs->execute();
            if ($rs->rowCount() == 0) {
                echo "no_data";
            } else {
                $ToJson = array();
                while ($row = $rs->fetch(PDO::FETCH_NUM)) {
                    $ToJson[] = array('sid' => $row[0], 'class' => $row[1], 'number' => $row[2], 'name' => $row[3], 'cid' => $row[4], 'cname' => $row[5]);
                }
                echo json_encode($ToJson);
            }
            $rs = null;
        } else if ($SRmode == "club") {
            $sql = "SELECT students.sid,students.class,students.number,students.name,clubs.id,clubs.name 
                    FROM (result INNER JOIN students
                        ON result.sid = students.sid)
                        INNER JOIN clubs
                            ON result.cid = clubs.id
                    WHERE clubs.id=:cid
                    ORDER BY students.sid";
            $rs = $db->prepare($sql);
            $rs->bindValue(':cid', $target, PDO::PARAM_STR);
            $rs->execute();
            if ($rs->rowCount() == 0) {
                echo "no_data";
            } else {
                $ToJson = array();
                while ($row = $rs->fetch(PDO::FETCH_NUM)) {
                    $ToJson[] = array('sid' => $row[0], 'class' => $row[1], 'number' => $row[2], 'name' => $row[3], 'cid' => $row[4], 'cname' => $row[5]);
                }
                echo json_encode($ToJson);
            }
            $rs = null;
        }
    } else {
        echo "user_error";
    }
    exit;

    //SELECT students.sid,students.class,students.number,students.name,clubs.id,clubs.name
    //FROM (result
    //INNER JOIN students
    //ON result.sid = students.sid)
    //INNER JOIN clubs
    //ON result.cid = clubs.id
    //WHERE students.class=''
    //ORDER BY students.sid

    //SELECT students.sid,students.class,students.number,students.name,clubs.id,clubs.name
    //FROM (result
    //INNER JOIN students
    //ON result.sid = students.sid)
    //INNER JOIN clubs
    //ON result.cid = clubs.id
    //WHERE clubs.id=''
    //ORDER BY students.sid
}

if ($mode == "exportResult") {
    if (UserCheck($acc, $pw, true, $db)) {
        $fileList = glob('./export/wfcss_' . $SRmode . '_*.csv');
        foreach ($fileList as $key => $value)
            $fileList[$key] = substr($value, -16, 12);
        rsort($fileList);
        $filename = './export/wfcss_' . $SRmode . '_' . $fileList[0] . '.csv';
        header('content-disposition:attachment;filename=' . substr($filename, 9));    //告訴瀏覽器通過何種方式處理檔案
        header('content-length:' . filesize($filename));    //下載檔案的大小
        readfile($filename);
    } else {
        echo "user_error";
    }
    exit;
}

if ($mode == "getAnData") {
    $sql = "SELECT * FROM `announcement` WHERE 1=1 ORDER BY id DESC";
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
    $rs = null;
    exit;
}

if ($mode == "delAn") {
    if (UserCheck($acc, $pw, true, $db)) {
        $sql = 'DELETE FROM `announcement` WHERE `id`=:id';
        $rs = $db->prepare($sql);
        $rs->bindValue(':id', $id, PDO::PARAM_STR);
        $rs->execute();
        echo "ok";
    } else {
        echo "error";
    }
    exit;
}

if ($mode == "newAn") {
    if (UserCheck($acc, $pw, true, $db)) {
        $sql = "INSERT INTO `announcement` (title, content, hyperlink, posttime) VALUES (:title, :content, :hyperlink,'" . date('Y-m-d H:i:s') . "')";
        $rs = $db->prepare($sql);
        $rs->bindValue(':title', $title, PDO::PARAM_STR);
        $rs->bindValue(':content', $content, PDO::PARAM_STR);
        $rs->bindValue(':hyperlink', $hyperlink != null ? $hyperlink : '', PDO::PARAM_STR);
        $rs->execute();
        echo "ok";
    } else
        echo "error";
    exit;
}

if ($mode == "exportSMStu") {
    if (UserCheck($acc, $pw, true, $db)) {
        $sql = 'SELECT students.sid,students.class,students.number,students.name FROM students LEFT JOIN result ON students.sid=result.sid WHERE result.sid IS NULL';
        $rs = $db->prepare($sql);
        $rs->execute();
        if ($rs->rowCount() != 0) {
            $ToJson = array();
            if (!is_dir("./export"))
                mkdir('./export');
            if(is_file("./export/tmp_SM_stu.csv"))
                unlink('./export/tmp_SM_stu.csv');
            $fp = fopen('./export/tmp_SM_stu.csv', 'w');
            while ($row = $rs->fetch(PDO::FETCH_ASSOC)) {
                $row['name'] = iconv('utf-8', 'Big5', $row['name']);
                fputcsv($fp, $row);
            }
            fclose($fp);
        }
        $rs = null;
        header('content-disposition:attachment;filename=tmp_SM_stu.csv');    //告訴瀏覽器通過何種方式處理檔案
        header('content-length:' . filesize("./export/tmp_SM_stu.csv"));    //下載檔案的大小
        readfile("./export/tmp_SM_stu.csv");
    }
}

if ($mode == "del_stu") {
    if (UserCheck($acc, $pw, true, $db)) {
        $sql = "TRUNCATE TABLE `students`";
        $rs = $db->exec($sql);
        $rs = null;
        echo 'ok';
    }
    exit;
}

if ($mode == "stu_import") {
    if (UserCheck($acc, $pw, true, $db)) {
        
        echo 'ok';
    }
    exit;
}
?>