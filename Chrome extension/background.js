/*
Crypter
crypter.co.uk
© 2016 by Maximilian Mitchell. All rights reserved.
*/

//--------- DEPENDENT FACEBOOK CLASSES ---------

/*
var /
window:	variable name:				comment:
0		._5rpu						Editable div/textarea -> gets changed to .textA 	
1		._552h						Body of message box 
2		._552n						Bar underneath text area
3		.fbNubFlyoutFooter			Outer body of message
4		._5w1r						Outer message tag
5		._1p1v						"Type a message..." tag -> deleted when lock icon appears
6		._5rpb						parent div of text area. changes with textarea height
7		.fbDock						All chat pop ups
8		.fbNubFlyoutOuter			Pop up chat ->  used to calculate max-width of messages
9		.fbNubFlyoutTitlebar		title section -> used to check how many chats	
10		._vzk:first					finds tag with title add photos -> used to put lock at bottom
11		.fbNubFlyoutInner			pop up chat inner
12		._6gd						bottom bar message block 
13		.titlebarText				title bar text
14		._d97						inner width is max width of message iframe 
*/

logM("Crypter has started");

//dynamically acquire facebook variables, as they are likely to change in the future.
$.getJSON("https://crypter.co.uk/ext/FBvariables.php", function( json ) {
	for (var x = 0; x < json.length; ++x) {
		window[x] = json[x];
	}
}).error(function(err) { 
	logM("error loading FBvariables :"+err);
});

var tag = "--crypter.co.uk--";

//--------- VERSION ---------

var currentVersion = "1.0";
//get actual version from url
var actualVersion;
$.get( "https://crypter.co.uk/version.php", function( data ) {
	actualVersion = data;
});

//--------- FIND BROWSER ---------
var brser;
if(navigator.userAgent.indexOf("Firefox") != -1 ) {
	brser = "FF";
}else if(navigator.userAgent.indexOf("Chrome") != -1 ) {
	brser = "CH";
}else if(navigator.userAgent.indexOf("Safari") != -1 ) {
	brser = "SF";
}

//--------- IMAGES ------------------

function getIcon(file) {
	if(brser == "FF"){
		return self.data.url('images/' + file);
	}else if(brser == "CH"){
		return chrome.extension.getURL('images/' + file);
	}else if(brser == "SF"){
		return safari.extension.baseURI+ 'images/' + file;
	}
}

var lock_empty = getIcon('lock_empty2.png');
var lock_encrypted = getIcon('lock_encrypted.png');
var lock_should_black = getIcon('lock_should_black.png');
var lock_open = getIcon('lock_open.png');
var gif = getIcon('335.gif'); 
var settingsIcon = getIcon('tool.svg');


//--------- EXTRAS ------------------

//counts how many times searchStr occurs in str
function getIndicesOf(searchStr, str) {
    var startIndex = 0, searchStrLen = searchStr.length;
    var index, indices = [];
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

//random integer between two points
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

//gets the ID of the chat
function getID(it){
	return it.parents(window[8]).find('.crypter').attr("id");
}

//checks if string is encrypted with crypter
function isEncryptedString(str){
	if(getIndicesOf(tag, str).length == 2 //string has two tags
		&& str.substring(0, tag.length) == tag //first part of the string is a tag
		&& str.substring(str.length - tag.length, str.length) == tag  //last part of the string is a tag
		&& (str.length - 2*(tag.length)) > 40 //minimum length of encrypted string within tags
	){
		return true;
	}else{
		return false;
	}
}

//backslashes 'special' charachters
function cleanString(str){
	return str.replace(/([;\\\/&,\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, '\\\$1')
}

//checks if the iframe containing an incoming message already exists
function isLoadingMessage(it){
	var id = it.attr("id");
	if($("#"+cleanString(id)+"12ads3").length != 0){
		it.attr("src",gif);
		return true; 
	}else{
		return false;
	}
}

//finds the name of the chat you are in.
function getFbChatName(it){
	//gets the name of the person you are chatting too
	return it.parents(window[8]).find(window[13]).text();
}

//sets whether session password should be a secure one
function securePassAjax(id, val){
	$.ajax({
		url : "https://crypter.co.uk/ext/front/securePass.php",
		xhrFields : {
		  withCredentials : true
		},
		crossDomain: true,
		method: "POST",
		data: { id : id, val : val},
		success : function(data) {
			if(data != 1){
				logM("Failed to set security");
			}
		}, 
		error:function(){
			logM('Failed AJAX security');
		}
	});
}

//kills everything to do with crypter including recrypting messages.
function killCrypter(it) {
	var chat = it.parents(window[8]);
	chat.find('.iFrameChat').remove();
	it.attr("src",lock_empty);
	
	var crypter = chat.find('.crypter');
	crypter.attr("fb_en","");
	crypter.attr("fb_de","");
	crypter.attr("fb_sec","");
	
	chat.find(window[6]).attr("style","");
	
	//remove possible lock in chat input
	chat.find('.tempLock').remove();
	
	//replace countdown with conversation name
	chat.find(window[13]).html(chat.find(window[13]).attr("originalTitle"));
	 
	//recrypt all messages 
	chat.find('.decryptIframe').each(function() {
		var id = $(this).attr("id");
		var actualID = id.substring(0, id.length - 6);
		recrypt(actualID);
	});
	
	//remove password session
	var id = crypter.attr("id");
	$.ajax({
		url : "https://crypter.co.uk/ext/front/killPass.php",
		xhrFields : {
		  withCredentials : true
		},
		crossDomain: true,
		method: "POST",
		data: { id : id },
		success : function(data) {
			if(data != 1){
				logM("Error killing session pass");
			}
		},
		error:function(){
			logM('Failed AJAX');
		}
	 });
}

function recrypt(id) {
	var cleanID = cleanString(id);
	var idOfiFrame = $("#"+cleanID+"12ads3");
	idOfiFrame.replaceWith('<a id="'+id+'" class="decrypt"><img style="position:relative; top: 3px;" src="'+lock_should_black+'" height="15px"></a>');
	//remove from alreadyDecrypted array
	alreadyDecrypted.splice(alreadyDecrypted.indexOf(cleanID),1);
}

//--------- PASSWORD SESSION BOX FUNCTIONS ------------------
var popupHeight;

//OPEN POP UP
function showPopUp(it){
	bb.show();
	
	//get dimensions
	popupHeight = it.parents(window[11]).height();
	
	//close settings bit
	$("#crypterOptions").hide();
	showing = false;
	$( ".coggle" ).addClass( "off" );
	
	//set point off screen for slide out settings
	pntOffScreen = -($('#popup').width() / 2); 
	$(".slide").each(function() {
	  $(this).css("position", "relative");
	  $(this).css("opacity", "-2");
	  $(this).css("left", pntOffScreen);
	});
	
	$("#pass1").focus();
	
	//sets the check boxes
	if(it.attr("fb_de") && it.attr("fb_sec")){
		//stored checkboxes
		if(it.attr("fb_de") == "1"){
			$("#autoDecrypt").prop('checked', true);
		}else{
			$("#autoDecrypt").prop('checked', false);
		}
		
		if(it.attr("fb_sec") == "1"){
			$("#addSecurity").prop('checked', true);
		}else{
			$("#addSecurity").prop('checked', false);
		}
	}else{
		//default checkboxes
		$("#autoDecrypt").prop('checked', true); 
		$("#addSecurity").prop('checked', false); 
	}
	
	//allways have crypter turned on when opening
	$("#crypterOn").prop('checked', true);
	
	//gets the name the user is chatting to
	if(!$("#fbChatName").html()){
		$("#fbChatName").html(getFbChatName(it));
	}
	
	if($("#putIframe").html().indexOf(it.attr("id")) == -1){
		$("#putIframe").html('<iframe onload="this.style.background=\'\';" scrolling="no" style=" width:100%;height:25px;overflow:hidden;" id="iframePass" frameBorder="0" src="https://crypter.co.uk/ext/front/passInput.php?id='+it.attr("id")+'"></iframe>');
	}
	
	//set version status
	$("#circleID").html('');
	if(actualVersion){
		if(actualVersion.trim() != currentVersion.trim()){
			logM("You have version "+actualVersion+" out of "+currentVersion);
			$("#circleID").html('<span class="theCircle" style="position:relative;top:4px;cursor:pointer;display: block; border-radius: 50%; height:8px; width:8px; background-color:transparent; border: 1px solid #bc2122;" id="statusCircle">&nbsp;</span>');
		}
	}else{
		logM("ERROR no actual version!");
	}
	
	$("#crypterOptions").css("display","none");
	
	bb.autosize();
}

//SUBMIT POP UP
var getSessionTimeLeftInterval;
var storedTitleBar;
function setSub(){
	if(!thisCrypter){
		alert("Error #1 please contact info@crypter.co.uk with instructions of what you did before receiving this alert.");
	}
	
	var id = getID(thisCrypter);
	
	var iframe = thisCrypter.parents(window[8]).find('.iFrameChat');
	
	//allocate page with stored password
	var insecure = 1;
	if($("#addSecurity").is(':checked')){
		insecure=0;
	}
	var src = 'https://crypter.co.uk/ext/front/chatInput.php?id='+id+'&in='+insecure;
	//refresh iframe
	iframe.attr("src", src);

	
	//set checkboxes
	if($("#autoDecrypt").is(":checked")){ //auto decrypt
		thisCrypter.attr("fb_de","1");
	}else{
		thisCrypter.attr("fb_de","0");
	}
	
	if($("#crypterOn").is(":checked")){ //turn on crypter
		thisCrypter.attr("fb_en","1");
	}else{
		thisCrypter.attr("fb_en","0");
		killCrypter(thisCrypter);
	}
	
	if($("#addSecurity").is(":checked")){ //turn on added security
		clearInterval(getSessionTimeLeftInterval);
		
		//make local variable
		var crypter = thisCrypter;
		
		crypter.attr("fb_sec","1");
		securePassAjax(id,"1");
		
		//timer
		getSessionTimeLeftInterval = setInterval(function(){
			if(crypter.attr("fb_sec") == "1"){ //check again incase turned off security
				$.ajax({
					url : "https://crypter.co.uk/ext/front/getSeshLeft.php",
					xhrFields : {
					  withCredentials : true
					},
    				crossDomain: true,
					method: "POST",
					data: { id : id },
					success : function(data) {
						var arr = data.split('|')
						idN = arr[0];
						time = arr[1];
						if(time != -1){
							var titleBar = $("#"+idN).parents(window[8]).find(window[13]);
							
							if(titleBar.html()){
								if(titleBar.html().indexOf("crypterCD") == -1){ //not already showing timer
									//store html of titlebar
									titleBar.attr("originalTitle",titleBar.html());
									titleBar.prepend('<span class="crypterCD" style="color:#333; font-size:inherit">'+time+' </span> ');
								}
							}
							
							//put timer on chat
							$("#"+idN).parents(window[8]).find(".crypterCD").html(time);
						}else if(idN){
							//timer finished
							clearInterval(getSessionTimeLeftInterval);
							killCrypter($("#"+idN));
						}else{
							clearInterval(getSessionTimeLeftInterval);
							logM("error fetching time left for session");
						}
					},
					error:function(){
						clearInterval(getSessionTimeLeftInterval);
						logM('Failed AJAX sesh time');
					}
				});
			}else{
				clearInterval(getSessionTimeLeftInterval);
			}
		}, 1000);
	}else{
		clearInterval(getSessionTimeLeftInterval);
		thisCrypter.attr("fb_sec","0");
		securePassAjax(id,"0");
		
		//reset count down with chat name 
		thisCrypter.parents(window[8]).find(window[13]).html(storedTitleBar);
	}
	
	if($("#crypterOn").is(":checked")){
		setTextarea(thisCrypter);
		thisCrypter.attr("src",lock_encrypted);
		
		//decrypt last clicked lock.
		if(thisToDecrypt != null){
			logM("tried to decrypt");
			thisToDecrypt.click();
			thisToDecrypt = null;
		}
	}else{
		clearInterval(getSessionTimeLeftInterval);
		killCrypter(thisCrypter);
	}
	
	bb.hide();
	
	thisCrypter = null;
}

//---SETTINGS FUNCTIONS---

//spinning cog animation
function animateCog(x) {
  if (x) {
	 $( ".coggle" ).removeClass( "off" );
  } else {
	$( ".coggle" ).addClass( "off" );
  }
}

//animate a setting option (slide & fade in)
function animateLine(it, x) {
  if (!x) {
    it.animate({
      left: "0",
      opacity: "1"
    }, 200, "easeOutExpo");
  }else{
    it.animate({
      left: pntOffScreen,
      opacity: "0"
    }, 200, "easeInExpo");
  }
}

//animate all setting options
function animateAllLines(showing){
	$(".slide").each(function() {
	  var item = $(this);
	  x += 100;
	  setTimeout(function() {
		animateLine(item, showing);
	  }, x);
	});
}

//animate pop up box
function resizePopUp(movement, showing){
	//size pop up
	var storedH = $("#blurbox-wrapper").height();
	$("#blurbox-wrapper").animate({
	 	height: storedH + movement
	}, 300, "easeOutQuart",function(){
		if(showing){
			$("#crypterOptions").hide();
		}else{
			$("#crypterOptions").show();
			animateAllLines(showing);
		}
		bb.autosize();
	});
	
	//move #restOfOptions back up
	$("#restOfOptions").css("position", "relative");
	$("#restOfOptions").animate({
	  top: movement
	}, 300, "easeOutQuart", function() {
		$("#restOfOptions").css("position", "");
		$("#restOfOptions").css("top", "");
	});
}


var x= 0;
var showing = false;
var clicked = false;
var movement;
$( document ).on( 'click', '#openCrypterOptions', function (e) {
	if(!clicked){
		clicked = true;
		x = 0;
		animateCog(true);
		
		if(!showing){
			movement = $("#crypterOptions").height();
		}
		
		if(showing){
			animateAllLines(true);
			//delay animate pop up after animating lines
			setTimeout(function() {
				resizePopUp(-movement, true);
			}, 800);
		}else{
			//resize pop up
			resizePopUp(movement, false);
		}
		
		setTimeout(function() {
			if(showing){
				showing = false;
				animateCog(false);
			}else{
				showing = true;
			}
			clicked = false;
		}, 200 * (x / 100));
	}
});

//fade cog on hover
$(document).on({
	mouseenter: function () {
		 $(this).animate({
			opacity: "0.7"
		  }, 250, "linear");
	},
	mouseleave: function () {
		$(this).animate({
		  opacity: "1"
		}, 250, "linear");
	}
}, "#openCrypterOptions");

//update circle functions
$( document ).on( 'click', '#circleID', function (e) {
	if(actualVersion != currentVersion){
		logM("You have version "+actualVersion+" out of "+currentVersion);
		if(brser == "FF"){
			$("#circleID").replaceWith('<span id="circleID"><div>_</div><span style="color:#bc2122"><strong>Crypter is not up to date! You have version '+currentVersion+'</strong></span><li>Go to: <strong>about:addons</strong></li><li>Click on the gear icon</li><li>Click Check for Updates</li></span>');
			$("#circleID").replaceWith('<span id="circleID"><div>_</div><span style="color:#bc2122">Crypter is not up to date! You have version '+currentVersion+'</span><br>Go to <strong>about:addons</strong> then click the <strong>gear icon</strong> and click <strong>Check for Updates</strong></span>');
		}else if(brser == "CH"){
			$("#circleID").replaceWith('<span id="circleID"><div>_</div><span style="color:#bc2122">Crypter is not up to date! You have version '+currentVersion+'</span><br>Go to <strong>chrome://extensions</strong> then check <strong>Developer mode</strong> and click <strong>Update extensions now</strong></span>');
		}else if(brser == "SF"){
			$("#circleID").replaceWith('<span id="circleID"><div>_</div><span style="color:#bc2122">Crypter is not up to date! You have version '+currentVersion+'</span><br>Choose <strong>Preferences</strong> from the Safari menu, then click <strong>Extensions</strong>. Then Select <strong>Updates</strong> in the lower-left corner of the window (It appears only when updates are available). Finally click the <strong>Update</strong> button next to Crypter.</span>');
		}
	}
	bb.autosize();
});

//----------pop up HTML--------
$("body").append('<div align="center" id="popup" style="width: 500px; display: none;overflow-y:hidden;overflow-x:hidden;overflow:hidden"></div>');

var reviewLink;
if(brser == "FF"){
	//firefox
	reviewLink = "https://addons.mozilla.org/en-US/firefox/addon/facebook-chat-encrypter/reviews/add";
}else if(brser == "CH"){
	//chrome
	reviewLink = "https://chrome.google.com/webstore/detail/facebook-chat-encrypter/pinmkidoanlggfdghggiabinldfblgfe/reviews";
}else if(brser == "SF"){
	
}

var pntOffScreen; 
$("#popup").html('<style>#contentForPass{overflow:hidden;}'
+'#putIframe {background:url('+gif+') center center no-repeat;background-size: 18px 18px;}'

+'.onoffswitch { position: relative; width: 28px; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; } .onoffswitch-checkbox { display: none; } .onoffswitch-label { display: block; overflow: hidden; cursor: pointer; height: 5px; padding: 0; line-height: 5px; border: 0px solid #FFFFFF; border-radius: 12px; background-color: #787878; } .onoffswitch-label:before { content: ""; display: block; width: 15px; margin: -5px; background: #424242; position: absolute; top: 0; bottom: 0; right: 19px; border-radius: 15px; box-shadow: 0 6px 12px 0px #757575; } .onoffswitch-checkbox:checked + .onoffswitch-label { background-color: #359C67; } .onoffswitch-checkbox:checked + .onoffswitch-label, .onoffswitch-checkbox:checked + .onoffswitch-label:before { border-color: #359C67; } .onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner { margin-left: 0; } .onoffswitch-checkbox:checked + .onoffswitch-label:before { right: 0px; background-color: #20D977; box-shadow: 3px 6px 18px 0px rgba(0, 0, 0, 0.2); } .settingTitle { line-height: 25px; } #cog { -webkit-animation: cog 3.5s infinite; -moz-animation: cog 3.5s infinite; -ms-animation: cog 3.5s infinite; animation: cog 3.5s infinite; -webkit-animation-timing-function: linear; -moz-animation-timing-function: linear; -ms-animation-timing-function: linear; animation-timing-function: linear } @-webkit-keyframes cog { 100% { -webkit-transform: rotate(360deg) } } @-moz-keyframes cog { 100% { -webkit-transform: rotate(360deg) } } @-ms-keyframes cog { 100% { -webkit-transform: rotate(360deg) } } @keyframes cog { 100% { -webkit-transform: rotate(360deg); -moz-transform: rotate(360deg); -ms-transform: rotate(360deg); transform: rotate(360deg) } } #cog.off{ -moz-animation-name: none; -webkit-animation-name: none; -ms-animation-name: none; animation-name: none; }'
+'</style>'

+'<h1 style="font-size:20px;">ENTER A SESSION PASSWORD</h1><h2>For your chat with <span id="fbChatName"></span></h2>'
+'<span style="font-weight:normal"><br><form autocomplete="off"><input style="display:none"><input type="password" style="display:none;"><div align="centre" id="putIframe"></div>'

+'<a id="openCrypterOptions" style="position:relative;top:8px;font-size:10px;color:#666"><img id="cog" class="coggle off" height="15px" src="'+settingsIcon+'"/></a><br>'

+'<span style="display:none; font-size:10px;position:relative;top:3px;" id="crypterOptions">'
	+'<span class="settingTitle slide"><strong>Crypter</strong></span> <div class="onoffswitch slide"> <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="crypterOn" checked> <label class="onoffswitch-label" for="crypterOn"></label> </div> <span class="settingTitle slide">Auto-Decrypt</span> <div class="onoffswitch slide"> <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="autoDecrypt" checked> <label class="onoffswitch-label" for="autoDecrypt"></label> </div> <span class="settingTitle slide">Extra Security</span> <div class="onoffswitch slide"> <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="addSecurity" checked> <label class="onoffswitch-label" for="addSecurity"></label> </div>'
	//+'<span style="font-size:8px">*: Doesn\'t store passwords on the client - Takes longer to encrypt message but adds security.<br>**:Decrypts messages and returns content through Crypter - This takes longer to decrypt messages but prevents potential facebook bots from reading messages</span>'
+'</span>' 
+'<span id="restOfOptions">'
	+'<br></form><button id="submitCrypter" disabled> Set </button><br><br><span id="showExtra"><a href="mailto:hello@crypter.co.uk?subject=I have found a bug!">Report Bug</a> | <a target="_blank" href="https://crypter.co.uk">Crypter</a> | <a target="_blank" href="https://pulverize.xyz?crypter">Share A Self Destructing Password</a> | <a id=\'reviewUs\' target=\'_blank\' href=\''+reviewLink+'\'>Review Us</a><br><span style=\'cursor:pointer;\' id="circleID"></span></span></span></span>'
+'</span>'
);

//blurbox element pop up - Used to align centre the div and tint black background
var bb = $('#popup').blurbox({
	blur: 0,  
	animateBlur: true, 
	duration: 0, 
	autosize: true, 
	closeOnBackgroundClick: true
});


//-------------- SET CUSTOM CHAT TEXTAREA -----------
function setTextarea(it){
	if(it.parents(window[8]).find(".iFrameChat").length > 0){
		//show from hidden
		it.parents(window[8]).find(".iFrameChat").show();
	}else{
		var textarea = it.closest(window[3]).find(".textA");
		if(it.parents(window[8]).find('.crypter').attr("fb_en") == 1){
			var width = textarea.outerWidth();
			var height = textarea.outerHeight();
			
			//whether to use secure or insecure chat.
			var insecure = 1;
			if($("#addSecurity").is(':checked')){
				insecure=0;
			}
			
			textarea.before('<iframe onload="this.style.background=\'\';" scrolling="no" style="background:url(\''+gif+'\') left center no-repeat; background-color:#fff; background-size: 15px 15px;z-index:1000;border:none;position:absolute;overflow:hidden; width:'+width+'px; height:'+height+'px;"  class="iFrameChat" frameBorder="0" src="https://crypter.co.uk/ext/front/chatInput.php?id='+getID(it)+'&in='+insecure+'"></iframe>');
			textarea.before().css({
				'width': textarea.parents(window[1]).width() -1
			});
		  }else{
			  textarea.before().src = textarea.before().src;
		  }
	}
}

//-------------- SET LOCK ON CHAT -----------
function setLockOnChat(it){
	if(!it){
		it = $(window[7]);
	}
	
	$( $(it).find(window[2]) ).each(function(index) {
		var randomChatNum = getRandomInt(0,999999);
		var html = $(this).parents("div").html();
		if(html.indexOf('Add Photos') && html.indexOf('class="crypter"') == -1){ 
			var textArea = $(this).closest(window[3]).find(window[0]);
			textArea.addClass("textA");
			$(this).find(window[10]).after('<span style="cursor:pointer;display:table;" class="'+window[12]+'"><img style="cursor:pointer;vertical-align:middle;display:table-cell;" id="lock'+ randomChatNum +'" class="crypter" src="'+lock_empty+'" height ="15px" /></span>');
		}
	}); 
}


//-------------- SET DECRYPT ICONS -----------
var thisToDecrypt;
var chatWidth;
function setDecryptButton(parent){
	
	if(!parent){
		parent = $(window[7]);
	}
	
	$($(parent).find(window[4]).find("span:last-child")).each(function(){
		if(isEncryptedString($(this).html())){
			
			//get chat width with the idea that always the encrypted message will take up
			//more than one line
			if (!chatWidth) {
			    chatWidth = $(this).parents(window[14]).width();
				logM("new chat width:"+chatWidth);
            }
			
			var span = $(this);
			
			//remove tags from string
			var re = new RegExp(tag, 'g');
			var crypt = $(this).html().replace(re, '');
			
			//assign lock logo to replace encrypted message
			span.html("<a id='"+crypt+"' class='decrypt'><img style='position:relative; top: 3px;' src='"+lock_should_black+"' height='15px' /></a>");
			
			setTimeout(function(){
				span.parents(window[4]).css("width","");
				span.parents(window[4]).parent().css("width","auto");
			},0);
			
			var crypterLock = span.parents(window[8]).find('.crypter');
			
			if(crypterLock.attr("fb_de") == 1 && crypterLock.attr("fb_en") == 1){
				//auto decrypt
				span.find('.decrypt').click();
			}
			
		}
	});
}

//-------------- ON PAGE READY FUNCTIONS -----------

function setLockInChat(it, opacity){
	if(it.parents(window[8]).html().indexOf("tempLock") == -1){//allow only one padlock
		logM("No lock");
		var iframe = it.parents(window[8]).find(".iFrameChat");
		if(iframe){
			iframe.after('<span style="position:relative;top:-3px;" class="tempLock"><img class="" src="'+lock_should_black+'" style="opacity:'+opacity+';position:relative;top:3px;height: 15px;"><span style="height:17px;border-left: 1px solid #000" class="cursorFlash">&nbsp;</span></span>');
			iframe.hide();
			//remove "type a message..." div
			it.parents(window[8]).find(window[5]).html("");
		}else{
			logM("no iframe");
		}
	}else{
		logM("already lock in chat");
	}
}

setLockOnChat();
setDecryptButton();	
var fubAmmount, thisCrypter;
var disableTypeAJAX = false;
var alreadyDecrypted = [];
$(document).ready(function() {
	var storedHeight = 0;
	var dfltHt, heightOfMesBody, _552hHeightStored;
	window.addEventListener("message", function(evt) {
		var message = evt.data;
		if(message.substring(0,12) == "setImmediate" || evt.origin == "https://facebook.com"){ //ignore facebook events
			////logM(evt.origin);
		}else{
			logM(message);
			//codes
			var failedToDecrypt 	= "37YhBLoyB8CC5JGrVyh3EMPNsuSrco";
			var noPasswordSet 		= "UO0s1s8Q53FVq2Y8b4T4mDYI6udEHb";
			var didDecrypt 			= "ZYQyNttlfPLMqmXOR28xfMzEab7VLY";
			var encryptedMessage 	= "QLD97dkv5ZUGHn6IcYNyO0r7rQE2mG";
			var didPressEnterPass 	= "MvLJjXe3PDINNARdRXn888CTUBR2Xi";
			var shouldRecrypt 		= "sQITRDUdH9QeBalmb6WZbI6NWdvkhw";
			var messageDivHeight	= "0NArJMm57fmJdCwLeYQ2oxgqDrKjrL";
			var isPassword 			= "SPURptHQnzIbCXsJpKdP4i2M5H7lwQ";
			var noPassword 			= "smIgy5LDDIwfgamCriz190JviCaBA1";
			var pressedEnter 		= "vLmKIRXqXPOhw0qvf0iCqgN4LLFeBB";
			
			var substri = message.substring(0,30);
			var actualMessage = message.substring(30, message.length);
			if(substri == pressedEnter){			//RECEIVED ENTER PRESS FROM CHAT INPUT
				//go to normal height - prevents error when entering big
				//bit of text and pressing enter but does not return back to normal height.
				var id = $("#"+actualMessage);
				setTimeout(function(){
					id.parents(window[8]).find(window[1]).css("min-height","");
				},100);
				
				disableTypeAJAX = true;
				//replace iframe with lock
				setLockInChat(id, 0.6);
			}else if(substri == encryptedMessage){	//RECEIVED LOCAL ENCRYPTED STRING
				disableTypeAJAX = false;
				var result = actualMessage.split('|');
				var id = cleanString(result[1]);
				var idDecrypt = $("#"+id);
				var message = result[2];
				
				//replace facebook with fake message
				var chat = idDecrypt.parents(window[8]); 
				var textarea = chat.find($(".textA span:last-child"));
				textarea.html('<span style="position:absolute;top:0px;color:#fff" data-text="true">'+message+'</span>');
				chat.find(".textA").css("overflow","hidden");
				
				//change opacity of lock
				var img = idDecrypt.parents(window[8]).find(".tempLock").find('img');
				if(img){
					img.animate({
    					opacity: 1
					},400);
				}else{
					setLockInChat(idDecrypt, 1);
				}
				
				//set to default height *jumpy*
				setTimeout(function(){
					chat.find(window[1]).find("div:first").css("overflow-y","hidden");
					chat.find(window[1]).parent().css("overflow","hidden");
				},0);
				
				setTimeout(function(){
					chat.find(window[1]).find("div:first").css("overflow-y","");
				},10);
				
				setTimeout(function(){
					chat.find(window[1]).find("div:first").css("overflow-y","hidden");
				},20);
				
				//send fake key press to make facebook think user is typing 
				setTimeout(function(){
					$(".textA", chat).focus().sendkeys('{Backspace}'); //{Backspace}
				},10);
			}else if(substri == didDecrypt){		//FINISHED DECRYPTING MESSAGE
				var result = actualMessage.split('|');
				var width = result[0];
				var height = result[1];
				var id = cleanString(result[2]);
				if (alreadyDecrypted.indexOf(id) == -1) { //iframe is called twice!!! leads to dimension error
					if(!width){
						logM("error no width");
					}else{
						logM("width:"+width+" height:"+height);
					}
					
					var idDecrypt = $("#"+id);
					var idOfiFrame = $("#"+id+"12ads3");
					 
					//replace lock with iframe message
					if(idOfiFrame.length == 1){ //check iframe does not already exist
						$(idOfiFrame).attr("status","done");
						$(idDecrypt).replaceWith($(idOfiFrame));
						$(idOfiFrame).css("visibility","visible");
						alreadyDecrypted.push(id);
					}else{
						$(idOfiFrame).remove();
					}
					
					//set width and height
					$(idOfiFrame).css("width", width);
					$(idOfiFrame).css("max-width", chatWidth);
					$(idOfiFrame).css("height", height);
				}else{
					logM("already decrypted");
				}
			}else if(substri == failedToDecrypt){	//ERROR DECRYPTING MESSAGE
				var idDecrypt = $("#"+cleanString(actualMessage));
				var idOfiFrame = $("#"+cleanString(actualMessage)+"12ads3");
				
				$(idDecrypt).find("img").attr("src",lock_should_black);
				idDecrypt.animate({opacity: 0}, 500);
				idDecrypt.animate({opacity: 1}, 500);
				//remove iframe
				$(idOfiFrame).remove();
			}else if(substri == noPasswordSet){		//NO PASSWORD SET
				var idDecrypt = $("#"+cleanString(actualMessage));
				var idOfiFrame = $("#"+cleanString(actualMessage)+"12ads3");
				
				//show pop up password enter box
				thisCrypter = idDecrypt.parents(window[8]).find('.crypter');
				showPopUp(thisCrypter);
				
				//remove loading gif
				$(idDecrypt).attr("src",lock_should_black);
				//remove iframe
				$(idOfiFrame).remove();
			}else if(substri == didPressEnterPass){	//RECEIVED ENTER PRESS FROM PASSWORD IFRAME
				setSub();
			}else if(substri == messageDivHeight){	//SETTING HEIGHT OF CHAT PANE IN CONJUCTION WITH CHAT IFRAME
				var result = actualMessage.split('|');
				var id = result[1];
				var idDecrypt = $("#"+cleanString(id)); 
				var height = result[2];
				
				//store original chat height
				if(!_552hHeightStored){
					_552hHeightStored = height;
				}
				
				setTimeout(function(){
					//change iframe height
					idDecrypt.parents(window[8]).find(".iFrameChat").css("height", height);
					idDecrypt.parents(window[8]).find(window[6]).css("height", height);
					
					
					idDecrypt.parents(window[8]).css("position", "absolute");
					idDecrypt.parents(window[8]).css("bottom", "0px");
					
					//var footerH = idDecrypt.parents(window[3]).outerHeight();
					//var titleH = idDecrypt.parents(window[9]).outerHeight();*/
				},0);
			}else if(substri == shouldRecrypt){		//RECEIVED DOUBLE CLICK ON IFRAME WITH MESSAGE
				recrypt(actualMessage);
			}else if(substri == isPassword){		//SET PASSWORD WITH AJAX IN IFRAME
				//enable button
				$("#submitCrypter").prop('disabled', false);
			}else if(substri == noPassword){		//NO PASSWORD IN IFRAME
				//disable button
				$("#submitCrypter").prop('disabled', true);
			}
		}
		
	});
	
	setLockOnChat();
	setDecryptButton();	
	
	//failsafe set locks after a second
	setTimeout(function(){
		setLockOnChat();
		setDecryptButton();	
	},1000);
	
	var storedDecrypted = [""];
	var fubAmmount = $(window[9]).length; //number of message chats
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			
			setTimeout(function(){
				if($(window[9]).length != fubAmmount){
					fubAmmount = $(window[9]).length;
					setLockOnChat();
				}
			}, 100);
			
			setTimeout(function(){
				var text = mutation.target.innerText || mutation.target.textContent;
				if(text.indexOf(tag) != -1 && storedDecrypted.indexOf(text) == -1){
					//store decrypt tag
					storedDecrypted.push(text);
					setDecryptButton(mutation.target);
				}
			}, 200);
		});
	});
	
	if(document.querySelector(window[7])){
		observer.observe(document.querySelector(window[7]), {
			childList: true,
			subtree: true,
			attributes: true,
			characterData: true,
		});
	}
	
	//cursor flash
	setInterval(function() {
		var elem = $('.cursorFlash');
		var chat = elem.parents(window[8]);
		if($(".textA", chat).is(":focus")){
			if (elem.css('visibility') == 'hidden') {
				elem.css('visibility', 'visible');
			} else {
				elem.css('visibility', 'hidden');
			}
		}
    }, 500);
	
});

//-------------- ACTIONS -----------

var incrementer = 0;
$( document ).on( 'click', '.decrypt', function(){
	thisToDecrypt = $(this);
	var codeID = getID($(this)) + incrementer++; //id of chat
	var id = getID($(this));
	$(this).find("img").attr("src",gif);
	var code = $(this).attr("id"); //code of message
	
	if($('#'+cleanString(code)+'12ads3').length == 0){ //make sure iframe is not already loading
		$.ajax({
			url : "https://crypter.co.uk/ext/front/storeCode.php",
			xhrFields : {
			  withCredentials : true
			},
			crossDomain: true,
			method: "POST",
			data: { id : id, codeID : codeID, code : code },
			success : function(data) {
				logM(data);
				var arr = data.split('|')
				id = arr[0];
				data = arr[1];
				if(data.substring(0,2) == "NP"){
					thisCrypter = $("#"+id).parents(window[8]).find('.crypter');
					showPopUp(thisCrypter);
				}else if(data.substring(0,2) == "SS"){
					//session code 
					$("body").append('<iframe onload="this.style.background=\'\';" scrolling="no" style="background:url(\''+gif+'\') center center no-repeat; background-size: 10px 10px; position:relative; top: 2px;overflow:hidden;visibility:hidden;width:100%;max-width:'+chatWidth+'px;" status="loading" id="'+code+'12ads3" class="decryptIframe" frameBorder="0" src="https://crypter.co.uk/ext/front/getMessage.php?codeID='+codeID+'&id='+id+'">');
				}else{ 
					logM("DECRYPTION ERROR ->"+data); 
				}
			},
			error:function(){
				logM('Failed temp code ajax');
			}
		 });
	}
});

$( document ).on( 'click', '.crypter', function(evt){
	thisToDecrypt = null;
	thisCrypter = $(this);
	showPopUp($(this));
});

//decrypt-lock hover animation
$(document).on({
	mouseenter: function () {
		if(!isLoadingMessage($(this))){
			$(this).find("img").attr("src",lock_open);
		}
	},
	mouseleave: function () {
		if(!isLoadingMessage($(this))){
			$(this).find("img").attr("src",lock_should_black);
		}
	}
}, ".decrypt");

//when checking off crypter allow "set" button
$( document ).on( 'change', '#crypterOn', function(evt){
	if(!$("#crypterOn").is(":checked")){
		$("#submitCrypter").prop('disabled', false);
	}
});

//encrypt-lock hover fade (emulating facebook) 
$(document).on({
	mouseenter: function () {
		if($(this).attr("src") == lock_empty){
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
$( document ).on( 'click', '#submitCrypter', function(e){
	setSub();
	
	//prevents any page reloads - random bug appeared where url would change to ?onoffswitch=on 
	return false;
});

$( document ).on( 'click', '.tempLock', function(){
	var chat = $(this).parents(window[8]);
	$(".textA", chat).focus();
});

//prevents facebook reload on enter when entering password
$( document ).on( 'keypress', '#pass1', function (e) {
	if (e.which == 13) {
		setSub();
		return false;
	}
});

var entered = false;
document.addEventListener('keydown', function(evt){
	var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
	//logM("facebook key:"+evt.keyCode);
	
	if(disableTypeAJAX){
		evt.stopPropagation();
		evt.preventDefault();
		return false;
	}
	
	if(evt.keyCode == 13){
		$(node).parents(window[8]).find(".tempLock").remove();
	}
	
	var html = $(node).parents(window[8]).html();
	
	if(html){
		if(html.indexOf("lock_encrypted.png") > -1 && evt.isTrusted){
			//lock icon is showing in textarea
			
			if(evt.keyCode == 13){
				var val = $(node).text();
				entered = true;
				setTextarea($(node));
			}else if(evt.keyCode == 8){ //backspace
				//delete lock icon
				var chat = $(node).parents(window[8]);
				var textarea = chat.find($(".textA span:last-child"));
				textarea.html('<br data-text="true">');
				
				$(node).parents(window[8]).find(".tempLock").remove();
			}else if(!evt.ctrlKey && !evt.altKey){
				//should allo
				evt.stopPropagation();
				evt.preventDefault();
				return false;
			}
			
			$(node).parents(window[8]).find(".iFrameChat").show();
			$(node).parents(window[8]).find(".iFrameChat").focus();
		}
	}
}, true);

document.addEventListener('keyup', function(evt){
	var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
	if(entered){ 
		entered = false;
		setTimeout(function(){
			$(node).parents(window[8]).find(".iFrameChat").focus();
		},10);
	}
},true);
	

//------------EASING ------------ -> no idea why I can't pick and choose functions...
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
    def: 'easeOutQuad',
    swing: function (x, t, b, c, d) {
        return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
    },
    easeInQuad: function (x, t, b, c, d) {
        return c*(t/=d)*t + b;
    },
    easeOutQuad: function (x, t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    },
    easeInOutQuad: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInCubic: function (x, t, b, c, d) {
        return c*(t/=d)*t*t + b;
    },
    easeOutCubic: function (x, t, b, c, d) {
        return c*((t=t/d-1)*t*t + 1) + b;
    },
    easeInOutCubic: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
    },
    easeInQuart: function (x, t, b, c, d) {
        return c*(t/=d)*t*t*t + b;
    },
    easeOutQuart: function (x, t, b, c, d) {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeInOutQuart: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    easeInQuint: function (x, t, b, c, d) {
        return c*(t/=d)*t*t*t*t + b;
    },
    easeOutQuint: function (x, t, b, c, d) {
        return c*((t=t/d-1)*t*t*t*t + 1) + b;
    },
    easeInOutQuint: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
        return c/2*((t-=2)*t*t*t*t + 2) + b;
    },
    easeInSine: function (x, t, b, c, d) {
        return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
    },
    easeOutSine: function (x, t, b, c, d) {
        return c * Math.sin(t/d * (Math.PI/2)) + b;
    },
    easeInOutSine: function (x, t, b, c, d) {
        return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
    },
    easeInExpo: function (x, t, b, c, d) {
        return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
    },
    easeOutExpo: function (x, t, b, c, d) {
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
    },
    easeInOutExpo: function (x, t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeInCirc: function (x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
    },
    easeOutCirc: function (x, t, b, c, d) {
        return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
    },
    easeInOutCirc: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    },
    easeInElastic: function (x, t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    easeOutElastic: function (x, t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    easeInOutElastic: function (x, t, b, c, d) {
        var s=1.70158;var p=0;var a=c;
        if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
        if (a < Math.abs(c)) { a=c; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (c/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    },
    easeInBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    easeOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    easeInOutBack: function (x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158; 
        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    easeInBounce: function (x, t, b, c, d) {
        return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
    },
    easeOutBounce: function (x, t, b, c, d) {
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        } else {
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
        }
    },
    easeInOutBounce: function (x, t, b, c, d) {
        if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
        return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
    }
});

function logM(str){
	console.log(str);
}