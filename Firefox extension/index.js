var self = require('sdk/self');
var pageMod = require("sdk/page-mod");

pageMod.PageMod({
  include: "*.facebook.com",
  contentScriptFile: [ "./jquery.min.js", "./aes.js", "./blurbox.js", "./background.js" ]
});
