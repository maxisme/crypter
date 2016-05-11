<?php 
//stores encrypted code in session so as not passed through $_GET
include '../backend/functions/sessionAuth.php';
include '../backend/functions/referer.php';

if(!fromFB()){
	die("<script> alert('ILLEGAL ACCESS:12');</script>");
}else if(!isset($_POST['id'])){
	die("ILLEGAL ACCESS:2");
}else if(!isset($_POST['code'])){ 
	die("ILLEGAL ACCESS:3");
}else if(!isset($_POST['codeID'])){ 
	die("ILLEGAL ACCESS:4"); 
}

//allows facebook to handle sessions on crypter
header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
header('Access-Control-Allow-Credentials: true');
 
$id = trim($_POST['id']);
$codeID = trim($_POST['codeID']);
$code = trim($_POST['code']);

echo $id."|"; 

if(empty(accessSession($id))){
	//if no session password
	die("NP");
} 

if(createSession($id, $codeID, $code)){
	die("SS".$code);
}else{
	die("Error session #1");
}

?>
