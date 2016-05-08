<?php 
include 'functions/sessionAuth.php';
include 'functions/crypt.php';

if(!isset($_POST['id'])){
	die("1");
}else if(!isset($_POST['text'])){
	die("1");
}

$id = trim($_POST['id']);
$text = trim($_POST['text']);
$pass = accessSession($id);

echo encrypt($text, $pass);
?>