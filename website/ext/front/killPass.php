<?php
//kills session password

session_start();
include '../backend/functions/referer.php';

if(!fromFB()){
	die("<script> alert('ILLEGAL ACCESS:12');</script>");
}

//allows facebook to handle sessions on crypter
if (isset($_SERVER['HTTP_ORIGIN'])) {
	header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
	header('Access-Control-Allow-Credentials: true');
}

$id = $_POST['id'];
if(isset($id)){
	//turn off session secure
	unset($_SESSION[$id.'SECURE']);
	 
	unset($_SESSION[$id]);
	die("1");
}
?>