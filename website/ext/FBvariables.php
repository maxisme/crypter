<?php 
  header("Access-Control-Allow-Origin: *");
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

$variables = array(
    "._5rpu",
    "._552h",
   	"._552n",
    ".fbNubFlyoutFooter",
    "._5w1r",
    "._1p1v",
    "._5rpb",
    ".fbDock",
    ".fbNubFlyoutOuter",
    ".fbNubFlyoutTitlebar",
    "._vzk:first",
	".fbNubFlyoutInner",
	"_6gd",
	".titlebarText",
	"._d97"
);
echo json_encode($variables);
?>