
document.addEventListener('mouseup', function(event) {
    var selectedText = window.getSelection().toString();
    if (selectedText) {
        console.log(event.target.offsetTop, event.target.offsetLeft);
        console.log(selectedText);
        var elem = createPopupOver();
        elem.style.top = event.target.offsetTop + 'px';
        elem.style.left = event.target.offsetLeft + 'px';
        elem.innerHTML = selectedText
    } else {
        removePopOver();
    }
});

document.addEventListener('mousedown', function() {
    removePopOver();
});

function removePopOver() {
    var selectedText = window.getSelection().toString();
    if (!selectedText) {
        var elem = document.querySelector('#burmese-my');
        if (elem) {
            elem.parentNode.removeChild(elem);
        }
    }
}

function createPopupOver() {
    var elem = document.querySelector('#burmese-my');
    if (elem) {
        return elem;
    } else {
        elem = document.createElement('div');
        elem.style.cssText = 'position:absolute;padding:5px;z-index:1000;background:red;color:white';
        elem.setAttribute('id', 'burmese-my')
        document.body.appendChild(elem);
    }

    return elem;
}
