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
/*
function encrypt($data, $secret){
	$iv = "asfaisodfnisdnfa";
	
	$encrypted = openssl_encrypt($data, "aes-256-cbc", $secret, 0, $iv);
	return base64_encode($iv.":".$encrypted);
}

function decrypt($encryptedData, $secret){
	
	$data = base64_decode($encryptedData);
	$dataArray = explode(":",$data); 
	
	$data = $dataArray[1];
	
	$iv = $dataArray[0];
	return openssl_decrypt($data, "aes-256-cbc", $secret, 0, $iv); 
}*/

/*function encrypt($data, $secret){
	$iv = "asfaisodfnisdnfa";
    return base64_encode($iv.openssl_encrypt($data, 'aes-256-cbc', $secret, 0, $iv));
}

function decrypt($encryptedData, $secret){
	$iv = "asfaisodfnisdnfa";
    $data = base64_decode($encryptedData);
    return openssl_decrypt(substr($data, strlen($iv)), 'aes-256-cbc', $secret, 0, $iv);
}*/

/*$mess="ji";
$pass = "pass";

$e = encrypt($mess, $pass); 
echo "Encoded <br>$e";
echo "<br>Decrypted: ".decrypt($e,$pass)."<br>  
<br>
<br>
"; 
echo "->".decrypt('uko6Q4wFYsOWDBPshgfdzA==:437b6e49d40755ff19f60630f19d5e1d:e0b8e82ddcd12131',"123"); */
 
/*
function encrypt($data, $secret){
	$iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
	$iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);
	return $iv.openssl_encrypt($data, 'aes-256-cbc', $secret, 0, $iv);
}

function decrypt($encryptedData, $secret){
	$iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
	$data = $encryptedData;
	$iv = substr($data, 0, $iv_size);
	return openssl_decrypt(substr($data, $iv_size), 'aes-256-cbc', $secret, 0, $iv);
}
*/
?>