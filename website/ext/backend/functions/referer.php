<?php 
function fromFB(){
	$fb = "https://www.facebook.com/";
	if(substr($_SERVER['HTTP_REFERER'],0,strlen($fb)) != $fb && $_SERVER['HTTP_REFERER']){
		return false;
	}
	return true;
}
?>