<?php
date_default_timezone_set('Asia/Taipei');

define("DB_HOST","localhost");
define("DB_USER","server");
define("DB_PASS","uhbSDDhWcaRJEFUH");
define("DB_DBNAME","wfcss");

$db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_DBNAME.';charset=utf8', DB_USER, DB_PASS);
?>