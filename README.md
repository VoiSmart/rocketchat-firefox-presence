# *** WARNING ***
Firefox (49 as now) has a bugged chrome.idle.queryState API,
so this plugin will not work until release 51

See https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/idle/queryState

# Chat Presence

Uses the idle status from browser API to set presence.

On Rocket.Chat this snippet must be added into the client:

```javascript
window.addEventListener("message", function (event) {
    if (event.source !== window) { return; }

    if (event.data.type && (event.data.type == "idlestatus")) {
        // disabling the built in timer, use me!
        UserPresence.stopTimer();
        UserPresence.startTimer = function () { }

        var state = event.data.state;

        if (state === "idle") {
            UserPresence.setAway();
        } else if (state === "active") {
            UserPresence.setOnline();
        } else if (state === "locked") {
            UserPresence.setAway();
        }
    }
});
```

## Icons
<div>
Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="http://www.flaticon.com" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
</div>
