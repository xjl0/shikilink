(()=>{"use strict";chrome.runtime.onInstalled.addListener((e=>{console.log("[background.js] onInstalled",e)})),chrome.runtime.onConnect.addListener((e=>{console.log("[background.js] onConnect",e)})),chrome.runtime.onStartup.addListener((()=>{console.log("[background.js] onStartup")})),chrome.runtime.onSuspend.addListener((()=>{console.log("[background.js] onSuspend")})),chrome.tabs.onUpdated.addListener((function(e,n,o){o.active&&chrome.tabs.sendMessage(e,{type:"page-rendered"}),o.active&&"complete"===n.status&&chrome.tabs.sendMessage(e,{type:"page-rendered-anime365"})}))})();
//# sourceMappingURL=background.js.map