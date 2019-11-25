browser.menus.create({
    id: "xkext",
    title: "Create XKPassword",
    contexts: ["editable", "password"],
    onclick(info, tab) {

        function getPassword(result) {
            var request = new XMLHttpRequest();
            request.open('GET', `https://xkapi.hfnr.cc/api?separators=-&pattern=${result.preferred_formatting}&transform=random`, false);
            request.send(null);

            if (request.status === 200) {
                browser.tabs.executeScript(tab.id, {
                    code: `
                    try {
                        // Preferred method of inserting the password.
                        browser.menus.getTargetElement(${info.targetElementId}).value = '${request.responseText}';
                    } catch (err) {
                        // Fallback method, which just copies then pastes then resets the clipboard to its previous value.
                        if(confirm("Something went wrong autofilling the password. Would you like to copy it to your clipboard?")) {
                            navigator.clipboard.writeText('${request.responseText}');
                        }
                    }`,
                }).then(() => {
                    navigator.clipboard.readText().then(text => {
                        if (text != request.responseText) {
                            browser.notifications.create({
                                "type": "basic",
                                "iconUrl": browser.extension.getURL("icons/icon-48.png"),
                                "title": "XK Password Generated",
                                "message": `Click here to copy to clipboard.`,
                            });
                            browser.notifications.onClicked.addListener((id) => {
                                browser.tabs.executeScript(tab.id, {
                                    code: `navigator.clipboard.writeText('${request.responseText}');`,
                                });
                            })
                        }
                    })
                });
            }
        }

        function onError(error) {
            console.log(`Error: ${error}`);
        }

        var getting = browser.storage.sync.get();
        getting.then(getPassword, onError);

    }
})
