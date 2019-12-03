browser.menus.create({
    id: "xkext",
    title: "Create XKPassword",
    contexts: ["editable", "password"],
    onclick(info, tab) {

        function getPassword(result) {
            var request = new XMLHttpRequest();
            request.open('GET', `https://xkapi.hfnr.cc/api?separators=${escape(result.separators)}&pattern=${result.pattern}&transform=${result.transform}`, false);
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
                    if (result.copy) {
                        navigator.clipboard.writeText(request.responseText);
                    }
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
