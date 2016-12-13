window.addEventListener("message", function (event) {
    if ((event.source != window) || (event.data.name != 'rocketchat_presence')) {
        return;
    }

    if (event.data.type === "idlestatus") {
        var state = event.data.state;
        if (state === "idle") {
            UserPresence.setAway();
        } else if (state === "active") {
            UserPresence.setOnline();
        } else if (state === "locked") {
            UserPresence.setAway();
        }

    }
    else if (event.data.rocketchat_presence_extension) {
        // disabling the built in timer, use me!
        UserPresence.stopTimer();
        UserPresence.startTimer = function () { }
    }
});
