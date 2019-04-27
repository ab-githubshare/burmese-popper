
document.addEventListener('mouseup', function(event) {
    var selectedText = window.getSelection().toString();
    if (selectedText) {
        if (event.target.getAttribute('id') === 'burmese-my') {
            var copyText = event.target.childNodes[0];
            copyText.select();
            document.execCommand('copy');
            console.log(copyText.value);
            return;
        }

        const THRESHOLD = 0.05;
        const detector  = new google_myanmar_tools.ZawgyiDetector();
        const converter = new google_myanmar_tools.ZawgyiConverter();
        const score     = detector.getZawgyiProbability(selectedText);

        if (score === -Infinity) {
            return;
        }

        if (score > THRESHOLD) {
            console.log('zawgyi');
            selectedText = converter.zawgyiToUnicode(selectedText);
        } else if (score <= THRESHOLD) {
            console.log('uni');
            selectedText = converter.unicodeToZawgyi(selectedText);
        } else {
            return;
        }

        const viewportOffset = event.target.getBoundingClientRect();
        const top  = viewportOffset.top - event.target.offsetHeight - 15;
        const left = viewportOffset.left;

        var elem = createPopupOver();
        elem.style.top  = top + 'px';
        elem.style.left = left + 'px';
        elem.innerHTML  = '<input type="text" value="' + selectedText + '" style="position:absolute;left:-9999px" />' + selectedText
    } else {
        removePopOver();
    }
});

document.addEventListener('mousedown', function() {
    removePopOver();
});

function createPopupOver() {
    var elem = document.querySelector('#burmese-my');
    if (elem) {
        return elem;
    } else {
        elem = document.createElement('div');
        elem.style.cssText = 'background: #333;'
            + 'box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 5px;'
            + 'border-radius: 5px;'
            + 'border: 1px #333 solid;'
            + 'position: absolute;'
            + 'color: #fff;'
            + 'padding: 8px 8px 10px;'
            + 'z-index: 1000;';
        elem.setAttribute('id', 'burmese-my')
        document.body.appendChild(elem);
    }

    return elem;
}

function removePopOver() {
    var selectedText = window.getSelection().toString();
    if (!selectedText) {
        var elem = document.querySelector('#burmese-my');
        if (elem) {
            elem.parentNode.removeChild(elem);
        }
    }
}
