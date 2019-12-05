function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        right: rect.right + window.scrollX,
        bottom: rect.bottom + window.scrollY
    };
}

function getPassword(result) {

}

function getPwd() {
    var getting = browser.storage.sync.get();
    getting.then(e => getPassword(e));
}


function getPwdInputs() {
    var ary = [];
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].type.toLowerCase() === "password") {
            ary.push(inputs[i]);
        }
    }
    return ary;
}

for (var i = 0; i < getPwdInputs().length; i++) {
    var element = getPwdInputs()[i]
    var styling = getComputedStyle(element)
    var positioning = getOffset(element)
    getPwdInputs()[i].classList.add(`xkext-${i}`)
    var aElem = document.createElement('a')
    aElem.innerHTML = 'XK'
    aElem.style = `cursor: pointer;position: absolute; top: ${positioning.top}px; left:${positioning.right}px;transform: translateX(-100%);line-height: ${styling.lineHeight};padding: ${styling.paddingTop} ${styling.paddingLeft}; margin-top: ${styling.borderTopWidth};`
    aElem.id = `xkext-${i}`
    aElem.classList = ['xkext-generate-button']
    document.body.appendChild(aElem)
}

var xkextButtons = document.getElementsByClassName('xkext-generate-button');

for (var k = 0; k < xkextButtons.length; k++) {
    xkextButtons[k].addEventListener('click', e => {
        browser.runtime.sendMessage({
            element: e.target.id
        });
    })
}

browser.runtime.onMessage.addListener((e) => {
    document.getElementsByClassName(e.element)[0].value = e.pass;
    navigator.clipboard.writeText(e.pass);
});
