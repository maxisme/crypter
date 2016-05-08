<?php
//sets secure session for password
include '../backend/functions/sessionAuth.php';
include '../backend/functions/referer.php';

if(!fromFB()){
	die("<script> alert('ILLEGAL ACCESS:12');</script>");
}

//allows facebook to handle sessions on crypter
if (isset($_SERVER['HTTP_ORIGIN'])) {
	header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
	header('Access-Control-Allow-Credentials: true');
}

$id = trim($_POST['id']);
if(($_POST['val'] == 1 || $_POST['val'] == 0) && !empty($id)){
	$val = $_POST['val'];
	createSession($id, $id."SECURE", $val);
	die("1");
}
?>