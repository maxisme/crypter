<?php
include 'functions/sessionAuth.php';

$password = addslashes(htmlspecialchars(trim($_POST['token'])));
$id = $_POST['id'];

if(isset($_POST['token']) && isset($id)){
	if(createSession($id, $id, $password)){ 
		die("1");
	}
}
?>