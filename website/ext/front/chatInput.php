<?php
//textarea for conversation

include '../backend/functions/sessionAuth.php';
include '../backend/functions/referer.php';

if(!fromFB()){
	die("<script> alert('ILLEGAL ACCESS:12');</script>");
}else if(!isset($_GET['id'])){
	die("<script> alert('ILLEGAL ACCESS:12');</script>"); 
}

$id = trim($_GET['id']);
?>
<script src="../scripts/jquery.min.js"></script>
<script src="../scripts/aes.js"></script>
<script src="../scripts/aes.class.js"></script> 
<script src="../scripts/aes-json-format.js"></script> 
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="https://www.facebook.com/2008/fbml">
<style>
*{ 
	padding:0px;
	margin:0px;
	font-size: 12px;
    line-height: 16px;
	color: #bc2122;
	font-family: helvetica, arial, sans-serif; 
}

textarea::-webkit-input-placeholder {
	color: #dedede !important;
}
 
textarea:-moz-placeholder { /* Firefox 18- */
	color: #dedede !important;  
}
 
textarea::-moz-placeholder {  /* Firefox 19+ */
	color: #dedede !important;  
}
 
textarea:-ms-input-placeholder {  
	color: #dedede !important;  
}
</style>
<body onLoad="init()">
	<textarea rows=1 placeholder="Type a secure message..." id="crypterTextArea" style="background:#fff; border:dashed #fff 1px; height:auto; width:100%;outline:none;resize: none;overflow:hidden;" contentEditable="true"></textarea>
</body>
<script type="text/javascript">

var tag = "--crypter.co.uk--";
var encryptedMessage 	= "QLD97dkv5ZUGHn6IcYNyO0r7rQE2mG";
var messageDivHeight 	= "0NArJMm57fmJdCwLeYQ2oxgqDrKjrL";
var pressedEnter 		= "vLmKIRXqXPOhw0qvf0iCqgN4LLFeBB";
var noPassword 			= "smIgy5LDDIwfgamCriz190JviCaBA1";
	
//height
var observe;
if (window.attachEvent) {
  observe = function(element, event, handler) {
    element.attachEvent('on' + event, handler);
  };
} else {
  observe = function(element, event, handler) {
    element.addEventListener(event, handler, false);
  };
}
var firstHeight = 0;
var storeH = 0;
var storeH2 = 0;
function init() {
	var text = document.getElementById('crypterTextArea');
	function resize() {
		if (storeH != text.scrollHeight) {
			text.style.height = 'auto';
			text.style.height = text.scrollHeight + 'px';
			storeH = text.scrollHeight;
			if (storeH2 != storeH) {
				postM(messageDivHeight+"|<?php echo $id?>|"+storeH);
				storeH2 = storeH;
			}
		}
	}
	
	function delayedResize() {
		window.setTimeout(resize, 0);
	}
	
	observe(text, 'change', resize);
	observe(text, 'cut', delayedResize);
	observe(text, 'paste', delayedResize);
	observe(text, 'drop', delayedResize);
	observe(text, 'keydown', delayedResize);
	
	text.focus();
	text.select();
	resize();
}
 
function postM(message){
	parent.postMessage(message, "https://www.facebook.com");
}

function encrypt(text){
	<?php
	if($_GET['in'] == "1" && $_SESSION[$id.'SECURE'] != 1){?>
		//LOCAL ENCRYPTION
		var secret = '<?php echo accessSession($id)?>';
		var a = JSON.parse(CryptoJS.AES.encrypt(JSON.stringify(text), secret, {format: CryptoJSAesJson}).toString());
		var ct = a['ct']+":"+a['iv']+":"+a['s'];
		tellFB(ct);
	<?php 
	}else{?>
		//SERVER ENCRYPTION
		$.ajax({
			type: "POST",
			url: "../backend/encrypt.php",
			data:{ id: "<?php echo $id?>", text:text },
			success: function(data){
				tellFB(data);
			},
			error:function(){
				console.log('Error with server encryption');
			}
		});
	<?php 
	}?>
}

function tellFB(crypted){
	var el = document.getElementById("crypterTextArea");
	if(crypted != 1){
		postM(encryptedMessage+"|<?php echo $id?>|"+tag+crypted+tag);
		$(el).val('');
	}else{
		postM(noPassword);
	}
	$(el).focus();
}

$(document).ready(function(e) {
	
	var el = document.getElementById("crypterTextArea");
	el.focus();
	
	var storedCount = 0;
	var storedHeight = 0;
	el.onchange = function(evt){
		evt = evt || window.event;
		var text = $(el).val().trim(); 
		if(text.length == 0){
			el.focus();
		}
	}
	
	el.onkeydown = function(evt) {
		evt = evt || window.event;
		var text = $(el).val().trim(); 
		if(evt.keyCode == 13){
			if(text.length == 0){
				return false;
			}else if(!evt.shiftKey){
				if(text.length > 0){ 
					postM(pressedEnter+"<?php echo $id?>");
					encrypt(text);
				}
				return false;
			}
		}
	}
});
</script>