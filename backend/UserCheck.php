<?php
function UserCheck($acc_in, $pw_in, $needAdmin, PDO $mDB)
{
    if ($acc_in != "" && $pw_in != "") {
        $sql = "SELECT password,isAdmin FROM `users` WHERE `account`=:acc";
        $rs = $mDB->prepare($sql);
        $rs->bindValue(':acc', $acc_in, PDO::PARAM_STR);
        $rs->execute();
        list($pw_r, $isAdmin_r) = $rs->fetch(PDO::FETCH_NUM);
        if($pw_r==$pw_in){
            if(!$needAdmin || ($needAdmin && $isAdmin_r)){
                return true;
            }else
                return false;
        }else
            return false;
    } else
        return false;
}
?>