
var opt = {
  type: "basic",
  title: "Watchtower",
  message: "Watchtower is starting ...",
  iconUrl: "../icons/watchtower-48.png"
}
chrome.notifications.create(null, opt, null);

var settings = {
  "tabSettings": [
    {
      "url": "http://sketchduty.com",
      "duration": "5",
      "refresh" : true
    },
    {
      "url": "https://github.com",
      "duration": "5"
    },
    {
      "url": "https://google.com",
      "duration": "5"
    }
  ],
  "tabSelector": ["http://sketchduty.com/*", "https://github.com/*"]
}

/* Close all existing tabs */
var queryInfo = {};
queryInfo.url = settings.tabSelector;

chrome.tabs.query(queryInfo, function (tabs) {
  for (var i = 0; i < tabs.length; i++) {
    chrome.tabs.remove(tabs[i].id);
  }
});
/* End close all existing tabs */


var tabSettings = settings.tabSettings;
var openTabs = [];
var activeTabIndex = 0;

for (var i = 0; i < tabSettings.length; i++) {
  var createProps = {};
  createProps.url = tabSettings[i].url;
  console.log("dumping tabSettings[" + i + "]", tabSettings[i]);
  //mark only the first tab as active
  createProps.active = (i == 0) ? true : false;
  console.log("dumping createProps in iteration " + i + " :", createProps);
  (function (i) {
    chrome.tabs.create(createProps, function (tab) {
      console.log("Tab with id :" + tab.id + " created for i " + i);
      console.log("createProps = ", createProps);
      var tabInfo = {};
      tabInfo.tabId = tab.id;
      tabInfo.tabIndex = i;
      tabInfo.url = tabSettings[i].url;
      tabInfo.duration = tabSettings[i].duration;
      tabInfo.kaput = false;
      openTabs.push(tabInfo);
      if (i == (tabSettings.length - 1)) {
        displayManager();
      }
    });
  })(i);
}


var displayManager = function () {
  console.log("In displayManager()", openTabs[activeTabIndex]);
  var jumpToTab = openTabs[activeTabIndex];
  var tabId = jumpToTab.tabId;
  var jumpToTabProps = {
    "active": true
  };
  chrome.tabs.update(tabId, jumpToTabProps, function () {
    //set the stage for the next tab
    if (activeTabIndex == (tabSettings.length - 1)) {
      activeTabIndex = 0;
    } else {
      activeTabIndex++;
    }

    
    window.setTimeout(displayManager, (jumpToTab.duration * 1000));
  });
};