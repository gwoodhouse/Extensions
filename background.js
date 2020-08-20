const MERGE_BUTTON_CLASS =        "btn-group-merge border-right-0 rounded-left-1 btn btn-primary BtnGroup-item js-details-target"
const CANNOT_MERGE_BUTTON_CLASS = "btn-group-merge border-right-0 rounded-left-1 btn btn-danger BtnGroup-item js-details-target"
const REFRESH_BUTTON_CLASS =      "btn"
const CONFIRM_BUTTON_CLASS =      "btn btn-primary BtnGroup-item js-merge-commit-button"

const JENKINS_CI_CLASS =          "text-emphasized mr-2"

const MERGE_PULL_REQUEST_CONTENT ="Merge pull request"
const REFRESH_BUTTON_CONTENT =    "Update branch"
const CONFIRM_BUTTON_CONTENT =    "Confirm merge"

const JENKINS_CI_CONTENT =        "Jenkins CI"


//************************************ Perform immediately ***************************************//

var currentlyRefreshing

chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {
                    // hostEquals: 'rbcgithub.fg.rbc.com'
                },
            })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });

chrome.runtime.onMessage.addListener(
    function(message, sender, callback) {
        console.log("Received message" + message + ", " + sender + "," + callback)

        if(message.type == "begin") {
            beginRefreshAndMerge();
        } else if(message.type == "end") {
            endRefresh();
        } else if(message.type == "status") {
            // Do nothing, just give state
        }
        callback({message: currentlyRefreshing});
    }
)

function beginRefreshAndMerge() {
    console.log('Begging Refresh')
    if(currentlyRefreshing) return;
    currentlyRefreshing = true;

    refreshOrMergePr();
}

function endRefresh() {
    currentlyRefreshing = false;
}

function refreshOrMergePr() {
    let refreshButton = getElement(REFRESH_BUTTON_CLASS, REFRESH_BUTTON_CONTENT)
    let mergeButton = getElement(MERGE_BUTTON_CLASS, MERGE_PULL_REQUEST_CONTENT)
    let cannotMergeButton = getElement(CANNOT_MERGE_BUTTON_CLASS, MERGE_PULL_REQUEST_CONTENT)
    let waiting = getElement(JENKINS_CI_CLASS, JENKINS_CI_CONTENT)

    if(refreshButton) {
        console.log('Refresh present')
        refreshButton.click();
        setTimeout(refreshOrMergePr, 5000)
    } if(waiting) {
        console.log('Waiting for Jenkins')
        setTimeout(refreshOrMergePr, 5000);
    } else if(cannotMergeButton) {
        console.log('Cannot merge present')
        alert('PR needs attention')
    } else if(mergeButton) {
        console.log('Merge present')
        mergeButton.click();

        setTimeout(function() {
                getButton(CONFIRM_BUTTON_CLASS, CONFIRM_BUTTON_CONTENT).click()
        }, 1000)

    } else {
        console.log('Can\'t find any button - wait');
        setTimeout(refreshOrMergePr, 5000);
    }
}

function getElement(clazz, content) {
    let elementArray = document.getElementsByClassName(clazz)

    if(elementArray.length > 0) {
        console.log(clazz + "Element array " + elementArray.length)
        for(var i = 0; i < elementArray.length; i++) {
            if(elementArray[i].innerText === content) {
                return elementArray[i];
            } else {
                console.log("Found \'" + elementArray[i].innerText + "\'")
            }
        }
    }
}