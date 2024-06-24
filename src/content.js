function getSelectionText() {
    let text = "";
    const activeElement = document.activeElement;

    strategy1_list = [
        "online-python.com",
        "online-ide.com",
        "leetcode.com"
    ]
    if (strategy1_list.some(strategy => window.location.href.includes(strategy))) {
        const selectedElement = window.getSelection().anchorNode;
        try{
            if (selectedElement) {
                const parentElement = selectedElement.closest('div');
                if (parentElement) {
                    text = parentElement.innerText;
                }
            }
        } catch(e) {
            console.log(" error: " + e.message);
        }
    }
    if(text.trim() === "") {
        if (activeElement.shadowRoot) {
            text = activeElement.shadowRoot.getSelection().toString();
        } else {
            text = window.getSelection().toString();
        }

        if (text.trim() === "") {
            const codeElements = document.querySelectorAll("code");
            codeElements.forEach(codeElement => {
                if (codeElement.contains(activeElement) || codeElement.querySelectorAll("*:focus").length > 0) {
                    text = codeElement.innerText;
                }
            });
        }

        if (text.trim() === "") {
            const selectedElement = window.getSelection().anchorNode;
            if (selectedElement) {
                const parentElement = selectedElement.closest('div');
                if (parentElement) {
                    text = parentElement.innerText;
                }
            }
        }

        if (text.trim() === "") {
            const monacoEditor = document.querySelector('.monaco-editor .view-lines');
            if (monacoEditor) {
                const selectedText = window.getSelection();
                if (selectedText.rangeCount > 0) {
                    const range = selectedText.getRangeAt(0);
                    text = range.toString();
                }
            }
        }
    }
    return text;
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTimeAndSpaceComplexity") {
        const selectedText = getSelectionText();
        sendResponse({ status: "success", selectedText: selectedText });
    }
});