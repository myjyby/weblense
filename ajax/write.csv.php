<?php

if (get_magic_quotes_gpc()) {
	$data = stripslashes($_POST["data"]);
}else{
	$data = $_POST["data"];
}

$file = fopen("../data/table.tsv","a");
	fwrite($file, $data."\n");
fclose($file);
?>