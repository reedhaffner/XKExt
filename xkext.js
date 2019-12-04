async function getRandomPassword() {
    return new Promise((resolve, reject) => {
        var prefs = browser.storage.sync.get()
        prefs.then(settings => {
            var request = new XMLHttpRequest();
            request.overrideMimeType("text/html");
            request.open('GET', `https://xkapi.hfnr.cc/api?separators=${escape(settings.separators)}&pattern=${settings.pattern}&transform=${settings.transform}`, false);
            request.send(null);
            if (request.status === 200) {
                resolve({
                    password: request.responseText,
                    shouldCopy: settings.copy
                })
            }
        })
    })
}

browser.menus.create({
    id: "xkext",
    title: "Create XKPassword",
    contexts: ["editable", "password"],
    onclick(info, tab) {
        getRandomPassword().then(pi => {
            browser.tabs.executeScript(tab.id, {
                code: `
                    try {
                        // Preferred method of inserting the password.
                        browser.menus.getTargetElement(${info.targetElementId}).value = '${pi.password}';
                    } catch (err) {
                        // Fallback method, which just copies then pastes then resets the clipboard to its previous value.
                        if(confirm("Something went wrong autofilling the password. Would you like to copy it to your clipboard?")) {
                            navigator.clipboard.writeText('${pi.password}');
                        }
                    }`,
            }).then(() => {
                if (pi.shouldCopy) {
                    navigator.clipboard.writeText(pi.password);
                }
            });
        })
    }
})

browser.runtime.onMessage.addListener(e => {
    browser.tabs.query({
        currentWindow: true,
        active: true
    }).then(tabs => {
        getRandomPassword().then(pi => {
            browser.tabs.sendMessage(tabs[0].id, ({ pass: pi.password, element: e.element }));
        })
    });
});
