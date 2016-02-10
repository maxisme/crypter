/*
Crypter
crypter.co.uk
© 2016 by Maximilian Mitchell. All rights reserved.
*/
var currentVersion = "1.0";

//get actual version from url
var actualVersion;
$.get( "https://crypter.co.uk/version.php", function( data ) {
	console.log(data);
	actualVersion = data;
});

// Icons
function getIcon(name) {
	return chrome.extension.getURL('images/' + name + '.png');
}
var icon = {
	lock_empty: getIcon('lock_empty'),
	lock_encrypted: getIcon('lock_encrypted'),
	lock_open: getIcon('lock_open'),
	lock_should: getIcon('lock_should'),
	lock_should_black: getIcon('lock_should_black')
};

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
	
	//set version status
	if(actualVersion){
		if(actualVersion != currentVersion){
			$("#circleID").html('<span class="theCircle" style="position:relative;top:4px;cursor:pointer;display: block; border-radius: 50%; height:8px; width:8px; background-color:transparent; border: 1px solid #bc2122;" id="statusCircle">&nbsp;</span>');
		}else{
			$("#circleID").html('<span class="theCircle" style="position:relative;top:4px;cursor:pointer;display: block; border-radius: 50%; height:8px; width:8px; background-color:transparent; border: 1px solid #21bc6e;" id="statusCircle">&nbsp;</span>');
		}
	}
	
	bb.autosize();
}

//called when user submits the settings in the pop up menu
function setSub(){
	if(!thisCrypter){
		alert("Error #1 please contact info@crypter.co.uk with instructions of what you did before receiving this alert.");
	}
	if($("#pass1").val().length > 0){
		var focusCrypter = thisCrypter;
		
		//set password 
		thisCrypter.attr("fb_t", CryptoJS.AES.encrypt($("#pass1").val(),""));
		
		//set checkboxes
		if($("#check12").is(":checked")){
			thisCrypter.attr("fb_de","1");
		}else{
			thisCrypter.attr("fb_de","0");
		}
		if($("#check13").is(":checked")){
			thisCrypter.attr("fb_en","1");
		}else{
			thisCrypter.attr("fb_en","0");
		}
		
		thisCrypter = null;
		
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
		
		focusCrypter.parents( ".fbNubFlyoutInner" ).find("._5rpu").focus();
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
				  var textarea = $(this).closest( ".fbNubFlyoutFooter" ).find("._5rpu");
				  textarea.addClass("textA");
				  $(this).parent("span").after('<span style="cursor:pointer;display:table;" class="_552o"><img style="cursor:pointer;vertical-align:middle;display:table-cell;padding-top: 4px;" class="crypter" src="' + icon.lock_empty + '" height ="15px" /></span>');
			  }
		  }
	  });
}

var thisToDecrypt;
var thisCrypter;
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
					span.html('<a id="' + crypt + '" class="decrypt"><img style="position:relative; top: 3px;" src="' + icon.lock_should_black + '" height="15px" /></a>');
				}
			} 
		}
	});
}

//--iframe popup --> future addition

//----- pop up setup --------------
$("body").append('<div align="center" id="popup" style="width: 500px; display: none;"></div>');

var reviewLink;
if(navigator.userAgent.indexOf("Firefox") != -1 ) {
	//firefox
	reviewLink = "https://addons.mozilla.org/en-US/firefox/addon/facebook-chat-encrypter/reviews/add";
}else{
	//chrome
	reviewLink = "https://chrome.google.com/webstore/detail/facebook-chat-encrypter/pinmkidoanlggfdghggiabinldfblgfe/reviews";
}


$("#popup").html('<h1 style="font-size:20px;">ENTER A SESSION PASSWORD</h1><h2>For your chat with <span id="fbChatName"></span></h2><span style="font-weight:normal"><br><form autocomplete="off"><input style="display:none"><input type="password" style="display:none"><input autocomplete="off" id="pass1" style="outline:none; text-align: center; border:1px solid #000" type="password"/><br><br><label><input id="check13" type="checkbox"><span style="font-size:12px;font-weight:normal">Auto-Encrypt</span></label><br><label><input id="check12" type="checkbox" checked><span style="font-size:12px;font-weight:normal">Auto-Decrypt</span></label><br><br></form><button id="sub1">Set</button><br><br><span id="showExtra"><a target="_blank" href="https://crypter.co.uk">crypter.co.uk</a> | <a target="_blank" href="http://⊗.cf?crypter">⊗.cf</a> | <a id=\'reviewUs\' target=\'_blank\' href=\''+reviewLink+'\'>review</a><br><span style=\'cursor:pointer;\' id="circleID"></span></span></span>');

var bb = $('#popup').blurbox({
	blur: 0,  
	animateBlur: true, 
	duration: 0,
	autosize: true, 
	closeOnBackgroundClick: true
});

//change icons when user is typing
$( document ).on( 'keyup', '.textA', function(e){
	var message = $(this).text();
	var crypter = $(this).parents(".fbNubFlyoutInner").find(".crypter");
	if(getIndicesOf(tag, message).length == 2 && getPass($(this))
		&& message.substring(0, tag.length) == tag
		&& message.substring(message.length - tag.length, message.length) == tag){
			//message is encrypted and formatted
		if(crypter.attr("src") != icon.lock_encrypted){
			crypter.attr("src", icon.lock_encrypted);
		}
	}else if($(this).parents(".fbNubFlyoutInner").find('.crypter').attr("fb_en") == 1 && message.length > 0 && getPass($(this))){
			crypter.attr("src", icon.lock_encrypted);
	}else if(message.length > 0 && getPass($(this))){
		if(crypter.attr("src") != icon.lock_should){
			crypter.attr("src", icon.lock_should);
		}
	}else{
		//either no password has been set or there is no text in the text area
		if(crypter.attr("src") != icon.lock_empty){
			crypter.attr("src", icon.lock_empty);
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
			}, 100);
		});
	});
	observer.observe(document.querySelector(".fbNubGroup"), {
		childList: true,
		subtree: true,
		attributes: true,
		characterData: true,
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
		thisCrypter = $(this).parents(".fbNubFlyoutInner").find('.crypter');
		showPopUp($(this));
	}
});

$( document ).on( 'click', '.crypter', function(){
	if(getPass($(this))){
		var bottomBit = $(this).parents(".fbNubFlyoutInner").find(".fbNubFlyoutFooter" );
		var messageContent = bottomBit.find(".textA").text();
		if(messageContent.length > 0){
			if(getIndicesOf(tag, messageContent).length < 2){
				$(this).attr("src", icon.lock_encrypted);
				//encrypt message
				var encrypt = tag+CryptoJS.AES.encrypt(messageContent, getPass($(this)))+tag;
				//replace text
				console.log(encrypt);
				var textarea = $(".textA > div > div > span", bottomBit);
				textarea.html('<span data-text="true">'+encrypt+'</span>');
				//focus back on textarea
				$("._5rpu", bottomBit).focus().sendkeys(' {Backspace}');
				
				bb.hide()
				// Below needed to block plaintext message from being sent.
				evt.stopPropagation();
				evt.preventDefault();
				return false;
			}else{
				alert("already encrypted");
				bottomBit.find("._5rpu").focus();
			}
		}else{
			//set new password
			thisCrypter = $(this);
			showPopUp($(this));
		}
	}else{
		thisToDecrypt = $(this);
		//password not set
		thisCrypter = $(this);
		showPopUp($(this));
	}
});

//decrypt-lock hover animation
$(document).on({
	mouseenter: function () {
		$(this).find("img").attr("src", icon.lock_open);
	},
	mouseleave: function () {
		$(this).find("img").attr("src", icon.lock_should_black);
	}
}, ".decrypt");

//encrypt-lock hover fade (emulating facebook) 
$(document).on({
	mouseenter: function () {
		if($(this).attr("src") == icon.lock_empty){
			$(this).animate({opacity: 0.5}, 200);
		}
	},
	mouseleave: function () {
		$(this).animate({opacity: 1}, 200);
	}
}, ".crypter");

//version status fade 
$(document).on({
	mouseenter: function () {
		$(this).animate({opacity: 0.5}, 200);
	},
	mouseleave: function () {
		$(this).animate({opacity: 1}, 200);
	}
}, ".theCircle");

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

//replace dot with indfo on updating
$( document ).on( 'click', '#circleID', function (e) {
	if(actualVersion != currentVersion){
		if(navigator.userAgent.indexOf("Firefox") != -1 ) {
			$("#circleID").replaceWith('<span id="circleID"><div>_</div><span style="color:#bc2122"><strong>Crypter is not up to date!</strong></span><li>Go to: <strong>about:addons</strong></li><li>Click on the <i>gear</i> icon</li><li>Click <i>Check for Updates</i></li></span>');
			$("#circleID").replaceWith('<span id="circleID"><div>_</div><span style="color:#bc2122">Crypter is not up to date!</span><br>Go to <strong>about:addons</strong> then <i>click</i> the <strong>gear icon</strong> and <i>click</i> <strong>"Check for Updates"</strong></span>');
		}else{
			$("#circleID").replaceWith('<span id="circleID"><div>_</div><span style="color:#bc2122">Crypter is not up to date!</span><br>Go to <strong>chrome://extensions</strong> then <i>check</i> <strong>"Developer mode"</strong> and <i>click</i> <strong>"Update extensions now"</strong></span>');
		}
	}
	bb.autosize();
});
var entered = false;
document.addEventListener('keydown', function(evt){
	var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
	//console.log($(node).text());
	if(evt.keyCode == 13 
		&& $(node).parents(".fbNubFlyoutInner").find('.crypter').attr("fb_en") == 1
		&& $(node).hasClass('textA')){
			var val = $(node).text();
			//console.log(val);
			console.log(val);
			if(!(getIndicesOf(tag, val).length == 2
				&& val.substring(0, tag.length) == tag
				&& val.substring(val.length - tag.length, val.length) == tag) && val.length > 0){
					entered = true;
					var encrypted = tag+CryptoJS.AES.encrypt(val, getPass($(node)))+tag;
					var bottomBit = $(node).parents(".fbNubFlyoutInner");
					var textarea = $(".textA > div > div > span", bottomBit);
					textarea.html('<span data-text="true">'+encrypted+'</span>');
					//focus back on textarea
					$("._5rpu", bottomBit).focus().sendkeys(' {Backspace}');
					// TO DO: simulate pressing Enter to automatically send the message
					
					// Below needed to block plaintext message from being sent.
					evt.stopPropagation();
					evt.preventDefault();
					return false;
			}
	}
}, true);

document.addEventListener('keyup', function(evt){
	var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
	if(entered){
		console.log("pressend enter");
		var bottomBit = $(node).parents(".fbNubFlyoutInner");
		entered = false;
		//$("._5rpu", bottomBit).focus().trigger(jQuery.Event('keypress', {which: 13}));
		//$("._5rpu", bottomBit).focus().sendkeys('{enter}{enter}');
		evt.stopPropagation();
		evt.preventDefault();
		return false;
	}
},true);