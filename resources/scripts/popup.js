// Пример входных данных для функции showPopup(items):
// items = [
//     {
//         'icon': 'delete',
//         'text': 'Удалить',
//         'attrs': {
//             'class': 'danger',
//             'data-action': 'deleteDetector',
//             'data-detector-id': 1
//         }
//     }
// ]
function showPopup(items, positionX, positionY) {
    hideAllPopups();

    let popup = document.createElement('div');
    popup.classList.add('popup');

    // Добавляем уголок
    let popupCorner = document.createElement('div');
    popupCorner.classList.add('popup__corner');
    popup.append(popupCorner);

    // Добавляем пункты меню
    let popupMain = document.createElement('div');
    popupMain.classList.add('popup__main');

    for (let item of items) {
        let popupButton = document.createElement('button');
        for (let attr of Object.keys(item['attrs'])) {
            popupButton.setAttribute(attr, item['attrs'][attr]);
        }

        popupButton.innerHTML = ICONS[item['icon']] + item['text'];

        popupMain.append(popupButton);
    }

    popup.append(popupMain);
    
    // Добавляем popup в body
    document.body.append(popup);

    // Устанавливаем положение popup
    if (popup.offsetWidth + positionX + 10 < document.body.offsetWidth) {
        popupCorner.style.left = '12px';
        positionX -= 12 + popupCorner.offsetWidth / 2;
    }
    else{
        popupCorner.style.left = 'auto';
        popupCorner.style.right = '12px';
        positionX += 12 + popupCorner.offsetWidth / 2;
        positionX -= popup.offsetWidth;
    }

    if (true) {
        popupCorner.style.top = -popupCorner.offsetHeight + 'px';
        positionY += popupCorner.offsetHeight / 2;
    }

    popup.style.top = positionY + 'px';
    popup.style.left = positionX + 'px';
    
    setTimeout(function() {
        popup.classList.add('visible');
    }, 0);
}

function hideAllPopups() {
    let popups = document.getElementsByClassName('popup');

    for(let popup of popups) {
        popup.classList.remove('visible');
        popup.style.transform = 'translateY(0)';
        setTimeout(function() {
            popup.remove();
        }, 100);
    }
}

function popupBlurHandler(e) {
    let popup = e.target;

    while (!popup.classList.contains('popup')) {
        popup = popup.parentElement;

        if (popup === null) {
            hideAllPopups();
            window.removeEventListener('mousedown', popupBlurHandler);
            return;
        }
    }
}