<?php 
function decrypt($jsonString, $passphrase){
	$array = explode(":",$jsonString);
	
	$salt = hex2bin($array[2]);
	$iv = hex2bin($array[1]);
	$ct = base64_decode($array[0]);
	
    $concatedPassphrase = $passphrase.$salt;
    $md5 = array();
    $md5[0] = md5($concatedPassphrase, true);
    $result = $md5[0];
    for ($i = 1; $i < 3; $i++) {
        $md5[$i] = md5($md5[$i - 1].$concatedPassphrase, true);
        $result .= $md5[$i];
    }
    $key = substr($result, 0, 32);
    $data = openssl_decrypt($ct, 'aes-256-cbc', $key, true, $iv);
    return json_decode($data, true);
}

function encrypt($value, $passphrase){
    $salt = openssl_random_pseudo_bytes(8);
    $salted = '';
    $dx = '';
    while (strlen($salted) < 48) {
        $dx = md5($dx.$passphrase.$salt, true);
        $salted .= $dx;
    }
    $key = substr($salted, 0, 32);
    $iv  = substr($salted, 32,16);
    $encrypted_data = openssl_encrypt(json_encode($value), 'aes-256-cbc', $key, true, $iv);
	$data = base64_encode($encrypted_data).":".bin2hex($iv).":".bin2hex($salt);
    return $data;
}
?>