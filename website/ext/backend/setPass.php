<?php
//sets session password

include 'functions/sessionAuth.php';

$password = htmlspecialchars(trim($_POST['token']));
$id = $_POST['id'];

if(isset($_POST['token']) && isset($id)){
	if(createSession($id, $id, $password)){
		die("1");
	}
}
?>