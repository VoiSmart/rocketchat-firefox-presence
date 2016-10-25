/*
 * Listen to idle events and forward to the configured webpage
 */

var timer;
var lastPolledStatus;
var pollInterval = 1000;
var idleTime = 60; // this is the default

chrome.storage.local.get({
    enableOnUrl: 'https://*/*',
    idleTime: idleTime
}, function (items) {
    idleTime = items.idleTime;
    if (idleTime < 15) {
        idleTime = 15; // this is the min allowed by idle API
    }
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
        var url = items.enableOnUrl;
        var msg = "{type: \"idlestatus\", state: \"" + state + "\"}";
        var code = "window.postMessage(" + msg + ", \"*\");";

        chrome.tabs.query({ url: url }, function (tabs) {
            tabs.forEach(function (tab) {
                chrome.tabs.executeScript(tab.id, { code: code });
            });
        });
    });
};


