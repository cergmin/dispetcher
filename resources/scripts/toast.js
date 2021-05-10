function toast(msg, duration=3000) {
    hideAllToasts();

    let toast = document.createElement('div');
    toast.classList.add('toast');
    toast.classList.add('visible');

    let toastMessage = document.createElement('span');
    toastMessage.innerText = msg;
    toast.append(toastMessage);

    let toastCloseButton = document.createElement('button');
    toastCloseButton.classList.add('btn-icon');
    toastCloseButton.classList.add('toast_close_btn');
    toastCloseButton.id = 'toast_close_btn';
    toastCloseButton.innerHTML = ICONS.close;
    toast.append(toastCloseButton);

    toastCloseButton.addEventListener('click', hideAllToasts);

    document.body.append(toast);

    setTimeout(function() {
        hideToast(toast);
    }, duration);
}

function hideToast(toastElement) {
    toastElement.classList.remove('visible');
    setTimeout(function() {
        toastElement.remove();
    }, 200);
}

function hideAllToasts() {
    let toasts = document.getElementsByClassName('toast');

    for(let toast of toasts) {
        hideToast(toast);
    }
}