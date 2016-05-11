# Crypter
This extension locally encrypts and decrypts your Facebook messages using AES encryption along with a preset password. 
-----

##Function
####Overview
Crypter 2.0 is built differently to the original. Crypter was originally client side which actually deemed it pretty useless, because we have since learnt that Facebook are [monitoring your every key-press](http://www.wired.co.uk/news/archive/2013-12/17/facebook-is-tracking-what-you-dont-do) which means that Facebook could monitor what the user was typing before the user had even encrypted and sent a message. Now Crypter works with iFrames from our [website](https://github.com/maxisme/crypter/tree/crypter-2.0/website/ext), this ensures that Facebook cannot see what you are typing due to the Cross Domain policy. Crypter applies iFrames to the password box the chat box and also to both incoming and outgoing messages to prevent unwanted eyes at any point. Unfortunately this means that every time there is a new message Crypter has to load a whole new webpage which causes a slight loading lag.

####Extra Security
Extra security is a new function added to Crypter within the settings panel. When activated it is next to impossible to work out the password to the conversation as everything is now done server side. It will also re-encrypt all the messages after 1 minute of no activity.

-----

##About

Crypter ([crypter.co.uk](https://crypter.co.uk)) is an extension for Google Chrome and Mozilla Firefox. It allows users to send encrypted messages using the well-established messaging service Facebook messenger. It was designed and created by University of Sussex Computer Science student Max Mitchell (max@maxis.me).

It works by first agreeing upon a password between the sender and receiver (we recommend using our online self destructing messaging service [⊗.cf](http://⊗.cf)). This password is then used to locally encrypt messages on the sender side, creates ciphered text, which is sent across the Facebook server, and is then used again to locally decrypt the ciphered text on the receivers’ side. It is powered by the Crypto-JS library using AES (Advanced Encryption Standard) encryption methods.

We had an “if you can’t beat them, join them” attitude, to designing Crypter. Instead of inviting users to join a brand new chat application we decided to apply it to an already established one – Facebook. And at the same time making sure that we don’t interrupt with our users existing habits.

Unencrypted conversations leave people’s private conversations vulnerable to interception from private companies and Governments without user consent. This is a growing concern with laws such as the ‘Snooper’s Charter’ being introduced in the UK and SOPA and PIPA in the US. These would allow our Governments’ to intercept our private messages without the need of a warrant from law enforcement or consent from the users.

Because of the issue Crypter solves, it leaves itself open to be useful in a multitude of ways. In countries where Governments can persecute and kill for inciting protest, having a tool like Crypter would be incredibly beneficial for the oppressed. They can now use social media to spread and share ideas. Having something akin to Crypter could have completely rewritten history in respect to events like the Arab Spring.

In times where it’s of concern that social media companies sell your data to advertising companies in order to provide targeted advertising, using Crypter could be immensely valuable. Your messages become totally illegible to prying eyes rendering them useless to advertising companies.

It’s human nature to want privacy. In light of Edward Snowden’s Global Surveillance disclosures, people don’t want their messages stored and analysed regardless of whether their topic of discussion is illegal. Crypter can put millions of people at ease.

Crypter solves the issue of getting unwanted hands on your Facebook messenger data, and we believe this to be incredibly important in 2016 where Internet privacy is at the forefront of debate. It’s a current, global issue affecting 1.55 billion people worldwide. Having an unobtrusive application like Crypter emerge into the market now would immensely aid efforts to increase Internet autonomy.