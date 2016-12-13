/*
 * Listen to idle events and forward to the configured webpage
 */

var alarm_name = 'rocketchat-presence';
var idleTime = 60; // this is the default
var timer;
var lastPolledStatus;
var pollInterval = 5000;
var idleTime = 60; // this is the default


var postMessageToTabs = function(url, msg) {
    chrome.tabs.query({url: url}, function (tabs) {
        tabs.forEach(function (tab) {
            var code = 'window.postMessage(' + msg + ', "*");';
            chrome.tabs.executeScript(tab.id, {code: code});
        });
    });
}

browser.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name !== alarm_name) {
        return;
    }

    chrome.storage.local.get({
        enableOnUrl: 'https://*/*'
    }, function (items) {
        var msg = "{name: 'rocketchat_presence', type: 'extension_enabled'}";
        postMessageToTabs(items.enableOnUrl, msg);
    });
});

var openPreferences = function() {
    browser.runtime.openOptionsPage();
};

browser.browserAction.onClicked.addListener(openPreferences);

chrome.storage.local.get({
    enableOnUrl: 'https://*/*',
    idleTime: idleTime
}, function (items) {
    idleTime = items.idleTime;
    if (idleTime < 15) {
        idleTime = 15; // this is the min allowed by idle API
    }
    browser.alarms.create(alarm_name, { periodInMinutes: 1 });
    timer = setInterval(poller, pollInterval);
});

poller = function () {
    chrome.storage.local.get({
        enableOnUrl: 'https://*/*',
        idleTime: idleTime
    }, function (items) {
        idleTime = items.idleTime;
        if (idleTime < 15) {
            idleTime = 15; // this is the min allowed by idle API
        }
        chrome.idle.queryState(idleTime, function (state) {
            if (state != lastPolledStatus) {
                lastPolledStatus = state;
                setState(state);
            }
        });
    });
};

setState = function (state) {
    console.log("New idle state is " + state);

    chrome.storage.local.get({
        enableOnUrl: 'https://*/*'
    }, function (items) {
        var msg = '{name: "rocketchat_presence",' +
                  ' type: "idlestatus", state: "' + state + '"}';
        postMessageToTabs(items.enableOnUrl, msg);
    });
};
