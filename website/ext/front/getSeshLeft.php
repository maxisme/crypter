<?php
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

$id = trim($_POST['id']);

if($_SESSION[$id.'SECURE'] == 1 && !empty($id)){
	echo $id."|";
	//not using access() as then would never expire.
	if($_SESSION[$id.'EXPIRES'] >= time()){
		echo $_SESSION[$id.'EXPIRES'] - time();
	}else{ 
		//kill password session
		unset($_SESSION[$id]);
		die("-1");
	}
}else{
	die("-1");
}
?>