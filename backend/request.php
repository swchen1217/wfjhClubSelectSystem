<?php
function request($key,$unsafe=false)
{
    if(!$unsafe){
        $tmp = filter_input(INPUT_POST, $key);
        if (!$tmp) $tmp = filter_input(INPUT_GET, $key);
    }else{
        $tmp=$_REQUEST[$key];
    }
    return $tmp;
}
?>
