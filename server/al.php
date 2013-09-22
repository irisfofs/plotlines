<?php

$url = $_POST['url'];
$data = $_POST;

$options = array(
    'http' => array(
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($data)
    ),
);
$context = stream_context_create($options);
echo file_get_contents($url, false, $context);

?>
