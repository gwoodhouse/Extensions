let changeColor = document.getElementById('changeColor');

changeColor.onclick = function(element) {
    let color = element.target.value;
    chrome.tabs.query(undefined, function(tabs) {
        for(var i = 0; i < tabs.length; i++) {
            chrome.tabs.executeScript(
                tabs[i].id,
                {file: 'tabScript.js'}
            );
        }
    });
};

chrome.storage.sync.get('color', function(data) {
    changeColor.style.backgroundColor = data.color;
    changeColor.setAttribute('value', data.color);
});