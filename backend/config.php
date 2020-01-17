<?php
date_default_timezone_set('Asia/Taipei');

define("DB_HOST","localhost");
define("DB_USER","server");
define("DB_PASS","uhbSDDhWcaRJEFUH");
define("DB_DBNAME","ntuh.yl_mdms");


define("MAIL_USER",'ntuhyl.mdms@gmail.com');
define("MAIL_PASS",'ntuhntuh');

define("SERVER_IP_API","http://swchen1217.ddns.net/ntuh_yl_RT_mdms_api");
define("SERVER_IP_WEB","http://swchen1217.ddns.net/ntuh_yl_RT_mdms_web");

$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_DBNAME.';charset=utf8', DB_USER, DB_PASS);
?>