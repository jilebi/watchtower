var Watchtower = function () {
  var tabSettings = settings.tabSettings;
  this.openTabs = [];
  this.activeTabIndex = 0;
  this.init = function () {
    this.closeAllTabs();
    this.initiateTabs();
    //this.displayManager();
  };
  this.addToOpenTabs = function(tabInfo) {
    this.openTabs.push(tabInfo);
  }
  this.closeAllTabs = function () {
    /* Close all existing tabs */
    var queryInfo = {};
    queryInfo.url = settings.tabSelector;

    chrome.tabs.query(queryInfo, function (tabs) {
      for (var i = 0; i < tabs.length; i++) {
        chrome.tabs.remove(tabs[i].id);
      }
    });
    /* End close all existing tabs */
  };
  this.initiateTabs = function () {

    for (var i = 0; i < tabSettings.length; i++) {
      var createProps = {};
      createProps.url = tabSettings[i].url;
      console.log("dumping tabSettings[" + i + "]", tabSettings[i]);
      //mark only the first tab as active
      createProps.active = (i == 0) ? true : false;
      console.log("dumping createProps in iteration " + i + " :", createProps);
      (function (i, that) {
        console.log("before: openTabs = ", that.openTabs);
        chrome.tabs.create(createProps, function (tab) {
          console.log("Tab with id :" + tab.id + " created for i " + i);
          console.log("createProps = ", createProps);
          var tabInfo = {};
          tabInfo.tabId = tab.id;
          tabInfo.tabIndex = i;
          tabInfo.url = tabSettings[i].url;
          tabInfo.duration = tabSettings[i].duration;
          tabInfo.kaput = false;
          console.log("openTabs = ", that.openTabs);
          that.openTabs.push(tabInfo);
          if (i == (tabSettings.length - 1)) {
            that.displayManager();
          }
        });
      })(i, this);
    }
  };

  this.displayManager = function () {
    console.log("in displayManager()");
    console.log("In displayManager()", this.openTabs[this.activeTabIndex]);
    var jumpToTab = this.openTabs[this.activeTabIndex];
    var tabId = jumpToTab.tabId;
    var jumpToTabProps = {
      "active": true
    };
    chrome.tabs.update(tabId, jumpToTabProps, function () {
      //set the stage for the next tab
      if (this.activeTabIndex == (tabSettings.length - 1)) {
        this.activeTabIndex = 0;
      } else {
        this.activeTabIndex++;
      }
      window.setTimeout(this.displayManager, (jumpToTab.duration * 1000));
    });
  }
}


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
      "url": "http://apache.org",
      "duration": "5",
      "refresh": true
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


new Watchtower().init();
