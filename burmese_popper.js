
document.addEventListener('mouseup', function(event) {
    var selectedText = window.getSelection().toString();
    var target = event.target;

    // if there is selected text
    if (selectedText) {
        if (target.getAttribute('id') === 'burmese-my') {
            // when click on the popover, copy the text to clipboard
            var copyText = target.childNodes[0];
            copyText.select();
            document.execCommand('copy');
            return;
        }

        const THRESHOLD = 0.05;
        const detector  = new google_myanmar_tools.ZawgyiDetector();
        const converter = new google_myanmar_tools.ZawgyiConverter();
        const score     = detector.getZawgyiProbability(selectedText);

        if (score === -Infinity) {
            // No Burmese detected
            return;
        }

        var zawgyi = false;
        if (score > THRESHOLD) {
            // Zawgyi detected
            selectedText = converter.zawgyiToUnicode(selectedText);
        } else if (score <= THRESHOLD) {
            // Unicode detected
            selectedText = converter.unicodeToZawgyi(selectedText);
            zawgyi = true;
        } else {
            return;
        }

        const doc = document.documentElement;
        const scrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        const scrollTop = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

        const viewportOffset = target.getBoundingClientRect();
        const top = (viewportOffset.top + scrollTop) - target.offsetHeight - 15;
        const left = viewportOffset.left + scrollLeft;

        var elem = createPopupOver();
        // Adjust the position of the popover
        elem.style.top  = top + 'px';
        elem.style.left = left + 'px';
        if (zawgyi) {
            elem.style.fontFamily = 'Zawgyi-One';
        }
        elem.innerHTML  = '<input type="text" value="' + selectedText + '" style="position:absolute;left:-9999px" />' + selectedText
    } else {
        // When there is no selected text, remove popover
        removePopOver();
    }
});

document.addEventListener('mousedown', function() {
    removePopOver();
});

/**
 * Create popover element
 */
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
            + 'z-index: 10000;';
        elem.setAttribute('id', 'burmese-my')
        document.body.appendChild(elem);
    }

    return elem;
}

/**
 * Remove popover element
 */
function removePopOver() {
    var selectedText = window.getSelection().toString();
    if (!selectedText) {
        var elem = document.querySelector('#burmese-my');
        if (elem) {
            elem.parentNode.removeChild(elem);
        }
    }
}
