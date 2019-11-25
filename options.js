function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        preferred_formatting: document.querySelector("#preferred_formatting").value
    });
}

function restoreOptions() {

    function setCurrentChoice(result) {
        document.querySelector("#preferred_formatting").value = result.preferred_formatting || "ddswswswsdd";
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    var getting = browser.storage.sync.get("preferred_formatting");
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);