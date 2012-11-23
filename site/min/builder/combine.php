<?php
$filename = $_GET["personaljs"];
header("Pragma: public");
header("Expires: 0");
header("Content-Type: application/x-javascript");
header("Content-Disposition: attachment;filename=svgchart.personal.min.js");
readfile($filename);
exit();
?>