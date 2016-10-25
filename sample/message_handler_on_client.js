window.addEventListener("message", function (event) {
    if (event.source != window) { return; }

    if (event.data.type && (event.data.type == "idlestatus")) {
        // disabling the built in timer, use me!
        UserPresence.stopTimer();
        UserPresence.startTimer = function () { }

        var state = event.data.state.state;
        console.log("Idle status received: " + state);

        if (state == "idle") {
            UserPresence.setAway();
        } else if (state == "active") {
            UserPresence.setOnline();
        } else if (state == "locked") {
            UserPresence.setAway();
        }

    }
});
