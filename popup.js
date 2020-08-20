
(function() {
    let autoMerge = document.getElementById('mergeButton');

    console.log("Loading Popup");

    getCurrentTab(function(tab) {
        chrome.runtime.sendMessage(
            {type: 'status', tabId: tab.id },
            function(response) {
                onMessageResponse(autoMerge, response.message)
            }
        )
    })

    autoMerge.onclick = function(element) {
        console.log("button clicked");
        if(autoMerge.innerText === "Auto Merge") {

            getCurrentTab(function(tab) {
                chrome.runtime.sendMessage(
                    {type: 'begin', tabId: tab.id},
                    (response) => {
                        onMessageResponse(autoMerge, response.message)
                    }
                );
            });
        } else {
            getCurrentTab(function(tab) {
                chrome.runtime.sendMessage(
                    {type: 'end', tabId: tab.id},
                    (response) => {
                        onMessageResponse(autoMerge, response.message)
                    }
                );
            });
        }
    };
})();

function getCurrentTab(callback) {
    chrome.tabs.query(
        { active: true, currentWindow: true },
        function(tabs) {
            callback(tabs[0])
        }
    )
}

function onMessageResponse(autoMerge, active) {
    if (active === true) {
         autoMerge.textContent = "Stop Auto Merge"
         autoMerge.style.background = "red"
    } else {
         autoMerge.textContent = "Auto Merge"
         autoMerge.style.background = "green"
    }
}

