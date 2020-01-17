<?php
function request($key)
{
    $tmp = filter_input(INPUT_POST, $key);
    if (!$tmp) $tmp = filter_input(INPUT_GET, $key);
    return $tmp;
}
?>
