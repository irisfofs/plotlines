<?php
	
	$dirbase = "../cache/";

	echo file_get_contents($dirbase . $_GET['file']);

?>