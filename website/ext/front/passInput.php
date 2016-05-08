<?php
//input password HTML
include '../backend/functions/sessionAuth.php';
include '../backend/functions/referer.php';

if(!fromFB()){
	die("<script> alert('ILLEGAL ACCESS:21');</script>");
}else if(!isset($_GET['id'])){
	die("<script> alert('ILLEGAL ACCESS:22');</script>");
}

$id = trim($_GET['id']);

//only store password in input if not in secure mode
if($_SESSION[$id.'SECURE'] != 1){
	$pass = accessSession($id);
}
?>
<script src="../scripts/jquery.min.js"></script>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="https://www.facebook.com/2008/fbml">
<style>
*{  
	padding:0px;
	margin:0px; 
}
</style>
<div align="center">
    <input value="<?php echo $pass;?>" autocomplete="off" id="pass1" style="outline:none; text-align: center; border:2px solid #000;font-size:17px;border-radius:5px;" type="password"/> 
</div> 
<script>
var didPressEnterPass = "MvLJjXe3PDINNARdRXn888CTUBR2Xi";
var isPassword = "SPURptHQnzIbCXsJpKdP4i2M5H7lwQ";
var noPassword = "smIgy5LDDIwfgamCriz190JviCaBA1";

function passwordStrength(string){ 
	var strength = 0;
	if(string.length > 4){ //string is greater than 4 charachters
		strength++;
	}
	
	if(string.length > 9){ //string is greater than 10 charachters
		strength++;
	}
	
	if(string.length > 14){ //string is greater than 15 charachters
		strength++;
	}
	
	if(strength > 0){ //only if string is greater than 4 charachters
		var upperCase= new RegExp('[A-Z]');
		var numbers = new RegExp('[0-9]');
		var lowerCase= new RegExp('[a-z]');
		
		if(string.match(upperCase) && string.match(lowerCase)){ 
			strength++;
		}
		
		if(string.match(numbers)){
			strength++;
		}
	}
	return strength;
}

function setStrengthIndicator(){
	//set password strength indicator
	var passwordVal = $("#pass1").val();
	var strength = passwordStrength(passwordVal);
	var length = passwordVal.length;
	
	if(strength > 4 ){
		//good password
		$("#pass1").css("border-color","#4adf94");
	}else if(strength > 2){
		//allright password
		$("#pass1").css("border-color","#FECEAB");
	}else if(strength > 1){
		//allright password
		$("#pass1").css("border-color","#FF847C");
	}else if(length > 0){
		//shocking password
		$("#pass1").css("border-color","#E84A5F");
	}else{
		//no text
		$("#pass1").css("border-color","#000");
	}
}

$(document).ready(function() {	
	var SearchInput = $('input');
	var strLength= SearchInput.val().length;
	SearchInput.focus();
	SearchInput[0].setSelectionRange(strLength, strLength);
	var id = '<?php echo $id;?>';
	if(id){ 
		//initial check of input
		setStrengthIndicator();
		if($("#pass1").val().length > 0){
			parent.postMessage(isPassword,"https://www.facebook.com");
		}else{
			parent.postMessage(noPassword,"https://www.facebook.com");
		}
		
		$("input").keyup(function(){
			var content = $("#pass1").val();
			if(content.length > 0){
				$.ajax({
					type: "POST",
					xhrFields : {
						withCredentials : true
					}, 
					url: "../backend/setPass.php",
					data:{ token: content, id: id },
					success: function(data){
						if(data != 1){
							parent.postMessage(noPassword,"https://www.facebook.com");
							alert("ERROR #2: "+data);
						}else{
							parent.postMessage(isPassword,"https://www.facebook.com");
						}
					}
				});
			}else{
				//no password in input
				parent.postMessage(noPassword,"https://www.facebook.com");
			}
		});  
		$( document ).on( 'input', '#pass1', function (e) {
			setStrengthIndicator();
		});
		
		document.getElementById("pass1").onkeydown = function(evt) { 
			if(evt.keyCode == 13){
				parent.postMessage(didPressEnterPass,"https://www.facebook.com"); 
			}
		}
			
	}else{
		alert("ERROR sessionInput #1");
	}
});
</script>
