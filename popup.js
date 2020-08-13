let mergeButton = document.getElementById('mergeButton');

console.log("Setting Clicker");
mergeButton.onclick = function(element) {
    console.log("button clicked");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log("tabs: " + chrome.tabs);
        for(var i = 0; i < tabs.length; i++) {
            chrome.tabs.executeScript(
                tabs[i].id,
                {file: 'tabScript.js'}
            );
        }
    });
};
