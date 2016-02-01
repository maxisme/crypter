/*
Crypter
crypter.co.uk
© 2016 by Maximilian Mitchell. All rights reserved.
*/
function preloadimages(arr){
    var newimages=[]
    var arr=(typeof arr!="object")? [arr] : arr
    for (var i=0; i<arr.length; i++){
        newimages[i]=new Image()
        newimages[i].src=arr[i]
    }
}
preloadimages(['https://crypter.co.uk/icons/lock_empty.png', 'https://crypter.co.uk/icons/lock_should.png','https://crypter.co.uk/icons/lock_encrypted.png','https://crypter.co.uk/icons/lock_open.png']);

function getIndicesOf(searchStr, str) {
	//counts how many times searchStr occurs in str
    var startIndex = 0, searchStrLen = searchStr.length;
    var index, indices = [];
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

function showPopUp(it){
	//shows the password box
	bb.show();
	$("#pass1").focus();
	//sets the check boxes
	if(it.attr("fb_de") && it.attr("fb_en")){
		//stored checkboxes
		if(it.attr("fb_de") == "1"){
			$("#check12").prop('checked', true);
		}else{
			$("#check12").prop('checked', false);
		}
		
		if(it.attr("fb_en") == "1"){
			$("#check13").prop('checked', true);
		}else{
			$("#check13").prop('checked', false);
		}
	}else{
		//default to have encrypted unchecked and decrypted checked
		$("#check12").prop('checked', true);
		$("#check13").prop('checked', false);
	}
	
	//sets the password
	if(getPass(it)){
		$("#pass1").val(getPass(it));
	}else{
		$("#pass1").val("");
	}
	
	//sets who the user is chatting to
	$("#fbChatName").html(getFbChatName(it));
}

//called when user submits the settings in the pop up menu
function setSub(){
	if(!thisChat){
		alert("Error #1 please contact info@crypter.co.uk with instructions of what you did before receiving this alert.");
	}
	if($("#pass1").val().length > 0){
		//set password 
		thisChat.attr("fb_t", CryptoJS.AES.encrypt($("#pass1").val(),""));
		
		//set checkboxes
		if($("#check12").is(":checked")){
			thisChat.attr("fb_de","1");
		}else{
			thisChat.attr("fb_de","0");
		}
		if($("#check13").is(":checked")){
			thisChat.attr("fb_en","1");
		}else{
			thisChat.attr("fb_en","0");
		}
		
		//decrypt all icons after set
		if(thisToDecrypt != null){
			thisToDecrypt.click();
			thisToDecrypt = null;
		}
		if($("#check12").is(":checked")){
			//decrypt all previous locks 
			$(".decrypt").each(function() {
				$(this).click();
			});
		}
		//remove password from input
		$("#pass1").val("");
		bb.hide();
		
		//focus on chat textarea
		thisChat.closest( ".fbNubFlyoutFooter" ).find("textarea").focus();
	}else{
		alert("Please set a password.");
	}
}

function getFbChatName(it){
	//gets the name of the person you are chatting too
	return it.parents(".fbNubFlyoutInner").find('.titlebarText').text();
}

function getPass(it){
	var sti = it.parents(".fbNubFlyoutInner").find('.crypter').attr("fb_t");
	if(sti){
		var dec = CryptoJS.AES.decrypt(sti,"").toString(CryptoJS.enc.Utf8);
		if(dec){
			return dec;
		}else{
			return null;
		}
	}else{
		return null;
	}
}

function linkify(inputText) {
	//turns links into a tags in string
    var replacedText, replacePattern1, replacePattern2, replacePattern3;
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a style="color:#bc2122" href="$1" target="_blank">$1</a>');
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a style="color:#bc2122" href="http://$2" target="_blank">$2</a>');
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a style="color:#bc2122" href="mailto:$1">$1</a>');
    return replacedText;
}

function getspans(html, pnter){
	//counts the number of spans to a point.
	//also depends on the class _5yl5 being the parent(x2) class of every message
	var spans = getIndicesOf("_5yl5", html);
	var new_arr = spans.filter(function(x) {
		return x < pnter;
	});
	return new_arr.length;
}

//-------------- GET CHAT LOCKS ---------

//function is dependant on facebook having Add Photos embeded at each chat box so that to recognise it is a chat
function setLockOnChat(){
	  $( "form" ).each(function(index) {
		  var html = $(this).parent("span").html();
		  if(html){
			  if (html.indexOf('Add Photos') >= 0 && $(this).parent("span").parent("div").parent("div").html().indexOf("crypter") == -1){
				  var textarea = $(this).closest( ".fbNubFlyoutFooter" ).find("textarea");
				  textarea.addClass("textA");
				  $(this).parent("span").after('<span style="cursor:pointer;display:table;" class="_552o"><img style="vertical-align:middle;display:table-cell;padding-top: 4px;" class="crypter" src="https://crypter.co.uk/icons/lock_empty.png" height ="15px" /></span>');
			  }
		  }
	  });
}

var thisToDecrypt, thisChat;
var tag = "--crypter.co.uk--"

//-------------- GET DECRYPT BUTTONS ---------
//this function depends on; the class ._5yl5 being the parent(x2) class of every message and .fbNubFlyoutInner is a parent class of both the crypter button
function setDecryptButton(){
	var html = $("body").html();
	var pnters = getIndicesOf(tag, html);
	var pntsToDecrypt = [];
	for(var x = 0; x < pnters.length; x++){
		if(x > 0){
			var isstartspan = html.substring(pnters[x-1] -6, pnters[x-1]);
		}
		pntersn = pnters[x] +tag.length;
		var isendspan = html.substring(pntersn, pntersn+7); //7 is the length of <span>
		var isdec = html.substring( pntersn+7, pntersn+7+16); //end of the message
		//console.log(isstartspan+' |--| '+isendspan+' |--| '+isdec);
		if(isstartspan == "<span>" && isendspan == "</span>" && isdec != "</span><a style="){
			//hasn't already added decrypt tag
			var spanN = getspans($("body").html(), pntersn);
			var crypt = html.substring(pnters[x-1] +tag.length, pnters[x]);
			var span = $( "._5yl5").eq(spanN - 1);
			if(span.html().indexOf(tag) !=-1 //message contains tag
				&& (pnters[x] - pnters[x -1]) >= 44){ //distance between pointers is greater than 44 (~ minimum length of an encrypted string)
				if($.inArray(spanN - 1, pntsToDecrypt) === -1){
					pntsToDecrypt.push(spanN - 1,crypt);
				}
			}
		}
	}
	
	//go through the array and insert the decrypt tag
	$.each( pntsToDecrypt, function( key, value ) {
		if(key % 2 == 0){
			var span = $( "._5yl5").eq(pntsToDecrypt[key]);
			var crypt = pntsToDecrypt[key+1];
			if(span.parent('div').html().indexOf("decrypt") == -1){
				var hasdecrypted = false;
				span.parent("div").parent("div").parent("div").css({"width":"auto"});
				if(span.parents(".fbNubFlyoutInner").find('.crypter').attr("fb_de") == 1 && getPass(span)){
					//auto decrypt
					var decrypt = CryptoJS.AES.decrypt(crypt, getPass(span)).toString(CryptoJS.enc.Utf8);
					if(decrypt && decrypt.length > 0){
						if(decrypt.length > 0){
							//succesfully auto decrypted
							//change color of message
							span.css({ 'color': '#bc2122'});
							//set unencrypted message
							span.html("<span class='recrypt' id='"+crypt+"'>"+linkify(decrypt)+"</span>");
							hasdecrypted = true;
						}
					}
				}
				
				if(hasdecrypted == false){
					//set black padlock for message
					span.html("<a id='"+crypt+"' class='decrypt'><img style='position:relative; top: 3px;' src='https://crypter.co.uk/icons/lock_should_black.png' height='15px' /></a>");
				}
			} 
		}
	});
}

//----- pop up setup --------------
$("body").append('<div align="center" id="popup" style="width: 500px; display: none;"></div>');
if(navigator.userAgent.indexOf("Firefox") != -1 ) {
	//changes review link
	$("#popup").html('<h1 style="font-size:20px;">ENTER A SESSION PASSWORD</h1><h2>For your chat with <span id="fbChatName"></span></h2><span style="font-weight:normal"><br><form autocomplete="off"><input style="display:none"><input type="password" style="display:none"><input autocomplete="off" id="pass1" style="outline:none; text-align: center; border:1px solid #000" type="password"/><br><br><label><input id="check13" type="checkbox"><span style="font-size:12px;font-weight:normal">Auto-Encrypt</span></label><br><label><input id="check12" type="checkbox" checked><span style="font-size:12px;font-weight:normal">Auto-Decrypt</span></label><br><br></form><button id="sub1">Set</button><br><br><span style="cursor:pointer;" id="showExtra"><a target="_blank" href="https://crypter.co.uk">crypter.co.uk</a> | <a target="_blank" href="http://⊗.cf?crypter">⊗.cf</a> | <a id=\'reviewUs\' style="color:#bc2122" target=\'_blank\' href=\'https://addons.mozilla.org/en-US/firefox/addon/facebook-chat-encrypter/reviews/add\'>review</a></span></span>');
}else{
	//changes review link
	$("#popup").html('<h1 style="font-size:20px;">ENTER A SESSION PASSWORD</h1><h2>For your chat with <span id="fbChatName"></span></h2><span style="font-weight:normal"><br><form autocomplete="off"><input style="display:none"><input type="password" style="display:none"><input autocomplete="off" id="pass1" style="outline:none; text-align: center; border:1px solid #000" type="password"/><br><br><label><input id="check13" type="checkbox"><span style="font-size:12px;font-weight:normal">Auto-Encrypt</span></label><br><label><input id="check12" type="checkbox" checked><span style="font-size:12px;font-weight:normal">Auto-Decrypt</span></label><br><br></form><button id="sub1">Set</button><br><br><span style="cursor:pointer;" id="showExtra"><a target="_blank" href="https://crypter.co.uk">crypter.co.uk</a> | <a target="_blank" href="http://⊗.cf?crypter">⊗.cf</a> | <a id=\'reviewUs\' style="color:#bc2122" target=\'_blank\' href=\'https://chrome.google.com/webstore/detail/facebook-chat-encrypter/pinmkidoanlggfdghggiabinldfblgfe/reviews\'>review</a></span></span>');
}
var bb = $('#popup').blurbox({
	blur: 0,  
	animateBlur: true, 
	duration: 0,
	autosize: true, 
	closeOnBackgroundClick: true
});

//change icons when user is typing
$( document ).on( 'keyup', '.textA', function(e){
	var message = $(this).val();
	if(getIndicesOf(tag, message).length == 2 && getPass($(this))
		&& message.substring(0, tag.length) == tag
		&& message.substring(message.length - tag.length, message.length) == tag){
			//message is encrypted and formatted
			if($(this).attr("src") != "https://crypter.co.uk/icons/lock_encrypted.png"){
				$(this).parent("div").parent("div").find(".crypter").attr("src","https://crypter.co.uk/icons/lock_encrypted.png");
			}
	}else if($(this).parents(".fbNubFlyoutInner").find('.crypter').attr("fb_en") == 1 && message.length > 0 && getPass($(this))){
		//message is on auto encrypt mode
		if($(this).attr("src") != "https://crypter.co.uk/icons/lock_encrypted.png"){
			$(this).parent("div").parent("div").find(".crypter").attr("src","https://crypter.co.uk/icons/lock_encrypted.png");
		}
	}else if(message.length > 0 && getPass($(this))){
		//message is not yet encrypted
		if($(this).attr("src") != "https://crypter.co.uk/icons/lock_should.png"){
			$(this).parent("div").parent("div").find(".crypter").attr("src","https://crypter.co.uk/icons/lock_should.png");
		}
	}else{
		//either no password has been set or there is no text in the text area
		if($(this).attr("src") != "https://crypter.co.uk/icons/lock_empty.png"){
			$(this).parent("div").parent("div").find(".crypter").attr("src","https://crypter.co.uk/icons/lock_empty.png");
		}
	}
});


setLockOnChat();
setDecryptButton();	
var fubAmmount;
$(document).ready(function() {
	
	setLockOnChat();
	setDecryptButton();	
	//failsafe set locks after a second
	setTimeout(function(){
		setLockOnChat();
		setDecryptButton();	
	},1000);
	
	var fubAmmount = $(".fbNubFlyoutTitlebar").length; //number of message chats
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			setTimeout(function(){
				if($(".fbNubFlyoutTitlebar").length != fubAmmount){
					fubAmmount = $(".fbNubFlyoutTitlebar").length;
					setLockOnChat();
				}
			}, 100);
			
			setTimeout(function(){
				var text = mutation.target.innerText || mutation.target.textContent;
				if(text.indexOf(tag) != -1){
					//get string between two tags -> encrypted message
					var subStr = text.match(tag+"(.*)"+tag);
					var hash = subStr[1];
					if (subStr[1].length >= 42){ //~ min length of encrypted message
						setDecryptButton();
					}
				}
			}, 150);
		});
	});
	observer.observe(document.querySelector(".fbNubGroup"), {
		childList: true,
		subtree: true,
		attributes: false,
		characterData: false,
	});

});

$( document ).on( 'click', '.decrypt', function(){
	if(getPass($(this))){
		//console.log($(this).attr("id"));
		var decrypt = CryptoJS.AES.decrypt($(this).attr("id"), getPass($(this))).toString(CryptoJS.enc.Utf8);
		if(decrypt && decrypt.length > 0){
			//change color of message
			$(this).parent("span").css({ 'color': '#bc2122'});
			//set unencrypted message
			$(this).parent("span").html("<span class='recrypt' id='"+$(this).attr("id")+"'>"+linkify(decrypt)+"</span>");
			//remove decrypt icon
			$(this).hide();
		}else{
			$(this).animate({opacity: 0}, 500);
			$(this).animate({opacity: 1}, 500);
		}
	}else{
		thisToDecrypt = $(this);
		//set new password
		thisChat = $(this).parents(".fbNubFlyoutInner").find('.crypter');
		showPopUp($(this));
	}
});

$( document ).on( 'click', '.crypter', function(){
	if(getPass($(this))){
		var bottomBit = $(this).closest( ".fbNubFlyoutFooter" );
		var messageContent = bottomBit.find("textarea").val();
		if(messageContent.length > 0){
			if(getIndicesOf(tag, messageContent).length < 2){
				$(this).attr("src","https://crypter.co.uk/icons/lock_encrypted.png");
				//encrypt message
				var encrypt = tag+CryptoJS.AES.encrypt(messageContent, getPass($(this)))+tag;
				//replace text
				bottomBit.find("textarea").val(encrypt);
				//focus back on textarea
				bottomBit.find("textarea").focus();	
				setTimeout(function(){
					var e = $.Event('keydown', { keyCode: 13 });
					bottomBit.find("textarea").trigger(e);
				}, 100);
			}else{
				alert("already encrypted");
				bottomBit.find("textarea").focus();
			}
		}else{
			//set new password
			thisChat = $(this);
			showPopUp($(this));
		}
	}else{
		thisToDecrypt = $(this);
		//password not set
		thisChat = $(this);
		showPopUp($(this));
	}
});

//decrypt-lock hover animation
$(document).on({
	mouseenter: function () {
		$(this).find("img").attr("src","https://crypter.co.uk/icons/lock_open.png");
	},
	mouseleave: function () {
		$(this).find("img").attr("src","https://crypter.co.uk/icons/lock_should_black.png");
	}
}, ".decrypt");

//encrypt-lock hover fade (emulating facebook) 
$(document).on({
	mouseenter: function () {
		if($(this).attr("src") == "https://crypter.co.uk/icons/lock_empty.png"){
			$(this).animate({opacity: 0.5}, 200);
		}
	},
	mouseleave: function () {
		$(this).animate({opacity: 1}, 200);
	}
}, ".crypter");

//submitting password form
$( document ).on( 'click', '#sub1', function(){
	setSub();
});

//double click recrypt
$( document ).on( 'dblclick', '.recrypt', function(){
	$(this).parent("span").css({ 'color': '#373e4d'});
	var encrypt = tag+$(this).attr("id")+tag;
	$(this).parent("span").html("<span>"+encrypt+"</span>");
	setDecryptButton();
});

//prevents facebook reload on enter when entering password
$( document ).on( 'keypress', '#pass1', function (e) {
	if (e.which == 13) {
		setSub();
		return false;
	}
});

document.addEventListener('keydown', function(evt){
	var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null); 
	if(evt.keyCode == 13 
		&& $(node).parents(".fbNubFlyoutInner").find('.crypter').attr("fb_en") == 1
		&& $(node).hasClass('textA')){
			var val = evt.target.value;
			if(!(getIndicesOf(tag, val).length == 2
				&& val.substring(0, tag.length) == tag
				&& val.substring(val.length - tag.length, val.length) == tag) && val.length > 0){
					var encrypted = tag+CryptoJS.AES.encrypt(val, getPass($(node)))+tag;
					var target = evt.target || evt.srcElement;
					target.value = encrypted;
			}
	}
}, true);

