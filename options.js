// Saves options to chrome.storage
function save_options() {
    var url = document.getElementById('enable_on_url').value;
    var idletime = parseInt(document.getElementById('idle_time').value);
    chrome.storage.local.set({
        enableOnUrl: url,
        idleTime: idletime
    }, function () {
        // Update status to let user know options were saved.
        if (idletime < 15) {
            idletime = 15; // this is the min allowed by idle API
        }
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 1000);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.local.get({
        enableOnUrl: 'https://*/*',
        idleTime: 60
    }, function (items) {
        document.getElementById('enable_on_url').value = items.enableOnUrl;
        document.getElementById('idle_time').value = items.idleTime;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);