browser.menus.create({
    id: "xkext",
    title: "Create XKPassword",
    contexts: ["editable", "password"],
    onclick(info, tab) {

        function setCurrentChoice(result) {
            var request = new XMLHttpRequest();
            request.open('GET', `https://xkapi.hfnr.cc/api?separators=-&pattern=${result.preferred_formatting}&transform=random`, false);
            request.send(null);

            if (request.status === 200) {
                browser.tabs.executeScript(tab.id, {
                    frameId: info.frameId,
                    code: `browser.menus.getTargetElement(${info.targetElementId}).value = '${request.responseText}';`,
                });
                browser.notifications.create({
                    "type": "basic",
                    "iconUrl": browser.extension.getURL("icons/icon-48.png"),
                    "title": "XK Password Generated",
                    "message": `Click here to copy to clipboard.`,
                });
                browser.notifications.onClicked.addListener((id) => {
                    browser.tabs.executeScript(tab.id, {
                        frameId: info.frameId,
                        code: `navigator.clipboard.writeText('${request.responseText}');`,
                    });
                })
            }
        }

        function onError(error) {
            console.log(`Error: ${error}`);
        }

        var getting = browser.storage.sync.get("preferred_formatting");
        getting.then(setCurrentChoice, onError);

    }
})
