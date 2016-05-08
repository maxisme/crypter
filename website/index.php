<!doctype html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Facebook Chat Encrypter - Crypter</title>
    <meta name="description"
          content="Encrypt your Facebook messages with Crypter a light weight extension for Facebook.">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="keywords"
          content="facebook chat encrypter,facebook,encrypter,chat,conversation,encryption,password, crypter,messages,messenger, encrypt facebook chat, encrypt, encrypt facebook messages">
    <link rel="shortcut icon" href="icons/icon.ico" type="image/x-icon"/>
    <script src="ext/scripts/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/vivus/0.2.3/vivus.min.js"></script>
    <link href='https://fonts.googleapis.com/css?family=Slabo+27px' rel='stylesheet' type='text/css'>
    <link href='https://fonts.googleapis.com/css?family=Old+Standard+TT' rel='stylesheet' type='text/css'>
    <link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/pinmkidoanlggfdghggiabinldfblgfe">
    <script>
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

        ga('create', 'UA-72744051-1', 'auto');
        ga('send', 'pageview');
        $(document).ready(function () {
            new Vivus('lock', {
                file: 'icons/icon.svg',
                duration: 900,
                start: "autostart",
                onReady: function (myVivus) {
                    myVivus.el.setAttribute('height', '150');
                },
                animTimingFunction: Vivus.EASE_OUT
            });


            if (navigator.userAgent.indexOf("Chrome") != -1) {
                $("#browser").html("Chrome");
                //alert('Chrome');
            }else if (navigator.userAgent.indexOf("Firefox") != -1) {
                $("#browser").html("Firefox");
                $(".download").replaceWith('<a id="download" href="https://addons.mozilla.org/en-US/firefox/addon/facebook-chat-encrypter/">+ ADD TO FIREFOX +</a>');
                //alert('Firefox');
            } else {
                $(".download").replaceWith("<a id='download' style='text-decoration:line-through;'>DOWNLOAD</a><br><br><br><span style='font-size:11px;'>Unfortunately this Extension is for Firefox and Chrome only.</span>");
            }

        });
    </script>
    <script type="application/javascript">
        <!--
        function install(aEvent) {
            for (var a = aEvent.target; a.href === undefined;) a = a.parentNode;
            var params = {
                "Foo": {
                    URL: aEvent.target.href,
                    IconURL: aEvent.target.getAttribute("iconURL"),
                    Hash: aEvent.target.getAttribute("hash"),
                    toString: function () {
                        return this.URL;
                    }
                }
            };
            InstallTrigger.install(params);

            return false;
        }
        -->
    </script>
    <style>
        li {
            list-style-type: none;
            font-size: 12px;
        }

        * {
            margin: 0;
            font-family: 'Old Standard TT', serif;
        }

        #download {
            cursor: pointer;
            padding: 10px;
            border: 1px #D7D7D7 solid;
            text-decoration: none;
            color: #D7D7D7;
            font-size: 20px;
        }

        #install-button:hover {
            color: #393939;
        }

        #info {
            font-size: 25px;
            width: 70%;
        }

        h1 {
            text-transform: uppercase;
            letter-spacing: 10px;
            font-size: 40px;
            font-family: 'Slabo 27px', serif;
        }

        h2 {
            font-size: 25px;
            font-family: 'Slabo 27px', serif;
        }

        .download {
            cursor: pointer;
            padding: 10px;
            border: 1px #D7D7D7 solid;
            text-decoration: none;
            color: #D7D7D7;
            font-size: 20px;
        }

        #download:hover {
            color: #393939;
        }

        #menu img {
            padding: 6px;
        }

        a {
            text-decoration: none;
            color: #3b5998
        }

        a:hover {
            text-decoration: underline;
        }

        .info {
            color: #4E4E4E;
        }

        .greyit {
            -webkit-filter: grayscale(1);
            filter: grayscale(1);
        }
    </style>
</head>

<body>
<script>
    function changeIframe() {
        var width = $(window).width();
        var height = $(window).height();

        $("iframe").width(width / 2);
        $("iframe").height(height / 2);
    }
    $(document).ready(function () {
        $("#FF").hover(function () {
            $(this).removeClass("greyit");
        }, function () {
            $(this).addClass("greyit");
        });

        $("#Fb").hover(function () {
            $(this).removeClass("greyit");
        }, function () {
            $(this).addClass("greyit");
        });

        $("#Ch").hover(function () {
            $(this).removeClass("greyit");
        }, function () {
            $(this).addClass("greyit");
        });

        $("#Em").hover(function () {
            $(this).removeClass("greyit");
        }, function () {
            $(this).addClass("greyit");
        });

        $("#Gi").hover(function () {
            $(this).removeClass("greyit");
        }, function () {
            $(this).addClass("greyit");
        });
        changeIframe();
        $(window).resize(function () {
            changeIframe();
        });
    });

</script>
<page>
    <div align="center">
        <br><br>
        <div id="lock"></div>
        <br><br><br>
        <h1>Facebook Chat Encrypter</h1>
        <br><br>
        <span class="download" onclick="chrome.webstore.install()" id="install-button">+ ADD TO CHROME +</span><br><br>

        <div align="center" id="menu">
            <a target="_blank" href="https://addons.mozilla.org/en-US/firefox/addon/facebook-chat-encrypter/"><img
                    class="greyit" height="30px" id="FF" src="icons/FFC.png"/></a>

            <a target="_blank"
               href="https://chrome.google.com/webstore/detail/facebook-chat-encrypter/pinmkidoanlggfdghggiabinldfblgfe"><img
                    height="30px" class="greyit" id="Ch" src="icons/ChromeC.png"/></a>

            <a target="_blank" href="https://github.com/maxisme/crypter"><img class="greyit" id="Gi" height="30px"
                                                                              src="icons/gitC.png"/></a>

            <a href="mailto:hello@crypter.co.uk"><img class="greyit" id="Em" height="30px" src="icons/EmailC.png"/></a>

            <a target="_blank" href="https://www.facebook.com/Crypter-957674850954965/?fref=ts"><img id="Fb"
                                                                                                     class="greyit"
                                                                                                     height="30px"
                                                                                                     src="icons/FBC.png"/></a>
        </div>
        <br>
        <div id="info">
            Interestingly/unfortunately Facebook (after the publicity from: <a target="_blank"
                                                                               href="http://techcrunch.com/2016/02/03/crypter-encrypts-your-facebook-chats-for-maximum-security/?sr_share=facebook">TechCrunch</a>,
            <a target="_blank" href="http://bgr.com/2016/02/03/facebook-messenger-chat-encryption/">BGR</a>, <a
                target="_blank"
                href="http://www.lifehacker.co.uk/2016/02/02/send-encrypted-facebook-messages-with-crypter">lifehacker</a>)
            have 'clocked on' to Crypter and to our regret, no longer encrypts. We will be working extremely hard on
            another way around, so still download the extension as an update will be pushed out automatically. We at
            Crypter are really sorry about this. If you want to try give us a hand visit <a target="_blank"
                                                                                            href="https://github.com/maxisme/crypter">GitHub</a>.<br><br>
            <span style="font-size:30px">This <span id="browser">Chrome/Firefox</span> extension locally encrypts and decrypts your Facebook messages using AES encryption along with a preset password.</span>
            <br><br>
            <span style="color:#333;">...</span>
            <br><br>

            <h2>ABOUT</h2><br>
            <div class="info">
                Crypter works by first agreeing upon a password between the sender and receiver (we recommend using our
                online self destructing messaging service <a href="https://pulverize.xyz">⊗.cf</a>). This password is
                then used to locally encrypt messages on the sender side, creates ciphered text, which is sent across
                the Facebook server, and is then used again to locally decrypt the ciphered text on the receivers’ side.
                It is powered by the Crypto-JS library using AES (Advanced Encryption Standard) encryption methods.
            </div>
            <br>
            <div class="info">
                We had an “if you can’t beat them, join them” attitude, to designing Crypter. Instead of inviting users
                to join a brand new chat application we decided to apply it to an already established one – Facebook.
                And at the same time making sure that we don’t interrupt with our users existing habits.
            </div>
            <br>
            <div class="info">
                Unencrypted conversations leave people’s private conversations vulnerable to interception from private
                companies and Governments without user consent. This is a growing concern with laws such as the
                ‘Snooper’s Charter’ being introduced in the UK and SOPA and PIPA in the US. These would allow our
                Governments’ to intercept our private messages without the need of a warrant from law enforcement or
                consent from the users.
                <br>
            </div>
            <br>
            <div class="info">
                Because of the issue Crypter solves, it leaves itself open to be useful in a multitude of ways. In
                countries where Governments can persecute and kill for inciting protest, having a tool like Crypter
                would be incredibly beneficial for the oppressed. They can now use social media to spread and share
                ideas. Having something akin to Crypter could have completely rewritten history in respect to events
                like the Arab Spring.
            </div>
            <br>
            <div class="info">
                In times where it’s of concern that social media companies sell your data to advertising companies in
                order to provide targeted advertising, using Crypter could be immensely valuable. Your messages become
                totally illegible to prying eyes rendering them useless to advertising companies.
            </div>
            <br>
            <div class="info">
                It’s human nature to want privacy. In light of Edward Snowden’s Global Surveillance disclosures, people
                don’t want their messages stored and analysed regardless of whether their topic of discussion is
                illegal. Crypter can put millions of people at ease.
            </div>
            <br>
            <div class="info">
                Crypter solves the issue of getting unwanted hands on your Facebook messenger data, and we believe this
                to be incredibly important in 2016 where Internet privacy is at the forefront of debate. It’s a current,
                global issue affecting 1.55 billion people worldwide. Having an unobtrusive application like Crypter
                emerge into the market now would immensely aid efforts to increase Internet autonomy.<br><br>
            </div>

            <h2>HOW TO SET THE PASSWORD</h2><br>
            <div class="info">
                To set the session password, click on the lock icon when the text field is empty. You and the person
                you’re chatting to must have the same password to ensure you can encrypt and decrypt messages correctly.
            </div>
            <br><br>
            <h2>HOW TO ENCRYPT</h2><br>
            <div class="info">
                To encrypt your message, type in your desired message as normal and then press the lock button. This
                will then convert your message into ciphered text and you can send it as normal.
                <br><br>
            </div>
            <h2>HOW TO DECRYPT</h2><br>
            <div class="info">
                To decrypt a message you’ve received, press the lock that appears in the chat box. To turn it back into
                the encrypted lock, double click the message.
            </div>
            <br><br>
            <div class="info">
                You can also have the app both auto encrypt and decrypt messages by clicking the check box where you set
                the password.<br><br>
            </div>
            <h2>VIDEO & SCREENSHOTS</h2><br>
            <div class="info">
                <li>A VERY DULL CONVERSATION<br>
                    <iframe width="420" height="300" src="https://www.youtube.com/embed/Vt9b6yFfkP4" frameborder="0" allowfullscreen></iframe>
                    <br></li>
                <br>
            </div>
            <div class="info">
                <li>ENCRYPTED<br><a target="_blank" href="screenshots/encrypted.jpg"><img height="300px" src="screenshots/encrypted.jpg"></a>
                </li>
                <br>
            </div>
            <div class="info">
                <li>DECRYPTED<br><a target="_blank" href="screenshots/decrypted.jpg">
                        <img height="300px" src="screenshots/decrypted.jpg"></a>
                </li>
                <br>
            </div>
            <div class="info">
                <li>WITHOUT THE EXTENSION<br><a target="_blank" href="screenshots/no_extension.jpg">
                        <img height="300px" src="screenshots/no_extension.jpg"></a>
                </li>
                <br><br>
            </div>
            <h2>TS & CS</h2><br>
            <div class="info">
                Use of the Service is at your own risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis
                without any representation or endorsement made and without warranty of any kind whether expressed or
                implied, including but not limited to the implied warranties of satisfactory quality, fitness for a
                particular purpose, non-infringement, compatibility, security and accuracy.<br>To the extent permitted
                by law, the Service, will not be liable for any indirect or consequential loss or damage whatsoever
                (including without limitation, loss of business, opportunity, data, profits) arising out of or in
                connection with the use of the Service.
            </div>
            <p id="copyright"><br>Copyright © <?php echo date("Y"); ?> <a href="/">Crypter</a>. All Rights Reserved.</p>
            <br>
            <p style="font-size:10px">
                Buying a server from <a target="_blank" href="http://www.vultr.com/?ref=6882054">Vultr</a> will help us
                with our server costs!<br>
                <a target="_blank" href="http://www.vultr.com/?ref=6882054">
                    <img width="20%" src="https://www.vultr.com/media/badge_onwhite.svg"/>
                </a>
            </p>
        </div>
</page>
</body>
</html>
<?php
?>