var invalidpattern = /[^swdW]+/

function disableSaveIfNotValid() {
    if (invalidpattern.test(document.querySelector("#pattern").value)) {
        document.querySelector("#submitButton").disabled = true;
    } else {
        document.querySelector("#submitButton").disabled = false;
    }
}

function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        separators: document.querySelector("#separators").value,
        pattern: document.querySelector("#pattern").value,
        transform: document.querySelector("#transform").value
    });
}

function restoreOptions() {

    function setCurrentChoice(result) {
        document.querySelector("#separators").value = result.separators || "#.-=+_!$*:~?%^&;";
        document.querySelector("#pattern").value = result.pattern || "ddswswswsdd";
        document.querySelector("#transform").value = result.transform || "";
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    var getting = browser.storage.sync.get();
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("#pattern").addEventListener("input", disableSaveIfNotValid);