<?php 
include '../backend/functions/sessionAuth.php';
include '../backend/functions/referer.php';
include '../backend/functions/crypt.php';

if(!fromFB()){
	die("<script> alert('ILLEGAL ACCESS:21');</script>");
}else if(!isset($_GET['id'])){
	die("<script> alert('ILLEGAL ACCESS:22');</script>");
}else if(!isset($_GET['codeID'])){
	die("<script> alert('ILLEGAL ACCESS:23');</script>");
}

$id = trim($_GET['id']);
$code = accessSession($_GET['codeID'], $id);
$pass = accessSession($id);
?> 
<html>
<meta charset="utf-8">
<!-- replace jquery with javascript --> 
<script src="../scripts/jquery.min.js"></script> 
<script src='../scripts/anchorme.min.js'></script>
<style>
*{
	margin:0px;
	padding:0px;
	color:#bc2122; 
	word-wrap: break-word;
	white-space: pre-wrap;
    border-collapse: collapse;
	text-shadow: rgba(255, 255, 255, .5) 0 1px 0; 
	line-height: 1.28;
	font-family: helvetica, arial, sans-serif;
	font-size: 12px;
}
</style>
<script>

//turn domains into links
function linkify(inputText) {
	return anchorme.js(inputText,{"target":"_blank"});
}

function postM(message){
	parent.postMessage(message, "https://www.facebook.com");
}

$(document).ready(function(e) {
	var didDecrypt = "ZYQyNttlfPLMqmXOR28xfMzEab7VLY";
	var shouldRecrypt = "sQITRDUdH9QeBalmb6WZbI6NWdvkhw";
	var failedToDecrypt = "37YhBLoyB8CC5JGrVyh3EMPNsuSrco";
	
	var el =$("span");
	var contents = linkify("<?php echo preg_replace( "/\r|\n/", "", nl2br(htmlspecialchars(decrypt($code, $pass))))?>");
	
	if(contents.length > 0){
		//get message
		el.html(contents);
		
		var width = el.width();
		var height = el.height();
		
		console.log(width+"|"+height);
		
		//post encrypted message to facebook
		postM(didDecrypt+el.width()+"|"+el.height()+"|<?php echo $code?>");
		
		//double click recrypt
		$("body").dblclick(function(e) {
			postM(shouldRecrypt+"<?php echo $code?>");
			console.log("6");
		});
	}else{
		postM(failedToDecrypt+"<?php echo $code?>");
		console.log("5 no code");
	}
});
</script>

<span>
</span>

</html>