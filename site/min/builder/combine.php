<?php
$filename = $_GET["personaljs"];
$type = $_GET["type"];
header("Pragma: public");
header("Expires: 0");
header("Content-Type: application/x-javascript");
header("Content-Disposition: attachment;filename=".$type);
readfile($filename);
exit();
?>