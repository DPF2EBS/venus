<?php
$filename = 'http://venus.dp/build/svgchart.latest.min.js';
header("Pragma: public");
header("Expires: 0");
header("Content-Type: application/x-javascript");
header("Content-Disposition: attachment;filename=svgchart.latest.min.js");
readfile($filename);
exit(); 
?>