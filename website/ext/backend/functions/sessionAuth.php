<?php 
session_start();

function ipbetweenrange($needle, $start, $end) {
  if((ip2long($needle) >= ip2long($start)) && (ip2long($needle) <= ip2long($end))) {
    return true;
  }
  return false;
}

function correctIP($ip){
	//check against facebook IPs
	if(ipbetweenrange($ip, '66.220.144.0', '66.220.144.0') ||
	   ipbetweenrange($ip, '69.63.176.0', '69.63.191.255') ||
	   ipbetweenrange($ip, '204.15.20.0', '204.15.23.255')){
		return true;
	}
	
	//check against crypter IP
	if($ip == gethostbyname("crypter.co.uk") || $ip = "192.168.0.10"){
		return true;
	}
	 
	return false;
}

function extendPassSession($id){
	$_SESSION[$id.'EXPIRES'] = time() + 59;
}

function createSession($id, $name, $value){ 
	$ip = $_SERVER['REMOTE_ADDR'];
	if(correctIP($ip)){
		$_SESSION['IPaddress'] = $ip;
		$_SESSION['userAgent'] = $_SERVER['HTTP_USER_AGENT'];
		extendPassSession($id);
		$_SESSION[$name] = $value;
		return true;
	}else{
		return false; 
	}
}

function accessSession($name, $id = ""){
	if(empty($id)){
		$id = $name;
	}
	
	if($_SESSION['userAgent'] != $_SERVER['HTTP_USER_AGENT'] || 
		$_SESSION['IPaddress'] != $_SERVER['REMOTE_ADDR'] ||
		($_SESSION[$id.'EXPIRES'] < time() && $_SESSION[$id.'SECURE'] == 1) || 
		!correctIP($_SERVER['REMOTE_ADDR']))
	{
		unset($_SESSION[$name]);
		return "";
	}
	extendPassSession($id);
	return $_SESSION[$name];
}

?>