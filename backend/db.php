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
$josn_data = request("josn_data");
$id = request("id");
$acc = request("acc");
$pw = request("pw");
$grade = request("grade");

if($mode=="getClubList"){
    if(UserCheck($acc,$pw,false,$db)){
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
    }else {
        echo "user_error";
    }
}

?>