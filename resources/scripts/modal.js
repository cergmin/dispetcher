function modalContainerClickHandler(e) {
    if (e.target.classList.contains('modal_container')) {
        hideModal(e.target.id);
    }
}

function modalContainerKeyDownHandler(e) {
    if (e.code === 'Escape') {
        hideAllModals();
    }
}

function showModal(modalID) {
    let modalContainer = document.getElementById(modalID);

    modalContainer.classList.add('visible');
    modalContainer.onclick = modalContainerClickHandler;
    window.addEventListener('keydown', modalContainerKeyDownHandler);
}

function hideModal(modalID) {
    let modalContainer = document.getElementById(modalID);

    modalContainer.classList.remove('visible');
    modalContainer.onclick = null;
    window.removeEventListener('keydown', modalContainerKeyDownHandler);
}

function hideAllModals() {
    let modals = document.getElementsByClassName('modal_container');

    for (let modal of modals) {
        hideModal(modal.id);
    }
}