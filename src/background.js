chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "timeAndSpaceComplexity",
        title: "Time and space complexity",
        contexts: ["page", "frame", "selection", "editable"]
    }, () => {
        if (chrome.runtime.lastError) {
            console.error("Error creating context menu item:", chrome.runtime.lastError);
        } else {
            console.log("Context menu item created successfully");
        }
    });
});


chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['src/content.js']
    }, () => {
        if (chrome.runtime.lastError) {
        } else {
            chrome.tabs.sendMessage(tab.id, { action: "getTimeAndSpaceComplexity" }, (response) => {
                if (chrome.runtime.lastError) {
                } else {
                    if (response && response.status === "success") {
                        chrome.storage.local.set({ selectedText: response.selectedText }, () => {
                            if (chrome.runtime.lastError) {
                            } else {
                                const width = 400;
                                const height = 600;
                                
                                chrome.windows.create({
                                    url: chrome.runtime.getURL("dist/popup.html"),
                                    type: "popup",
                                    width: width,
                                    height: height
                                });
                            }
                        });
                    }
                }
            });
        }
    });
});
