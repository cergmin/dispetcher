function LunaCheck(value) {
    if (/[^0-9-\s]+/.test(value)) return false;

    var nCheck = 0, nDigit = 0, bEven = false;
    value = value.replace(/\D/g, "");

    for (var n = value.length - 1; n >= 0; n--) {
        var cDigit = value.charAt(n),
            nDigit = parseInt(cDigit, 10);

        if (bEven) {
            if ((nDigit *= 2) > 9) nDigit -= 9;
        }

        nCheck += nDigit;
        bEven = !bEven;
    }

    return (nCheck % 10) == 0;
}

function getDetectorData(detectorID) {
    const data = {
        '0000-0000-0000-0000': {
            'id': '0000-0000-0000-0000',
            'name': 'Мега супер датчик',
            'status': ['offline', 'red', 'оффлайн'],
            'values': [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 90, 90, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0]
        },
        '3241-6183-2987-4921': {
            'id': '3241-6183-2987-4921',
            'name': 'Датчик #1',
            'status': ['online', 'green', 'онлайн'],
            'values': [13, 42, 43, 64, 78, 30, 25, 0, 42]
        },
        '7894-9471-3891-4896': {
            'id': '7894-9471-3891-4896',
            'name': 'Датчик #2',
            'status': ['online', 'green', 'онлайн'],
            'values': [13, 42, 43, 64, 78, 30, 25, 0, 26, 29, 41, 49, 35, 60, 69, 78, 83, 90, 100, 98]
        }
    };

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (detectorID in data) {
                resolve(data[detectorID]);
            }
            else{
                reject({
                    'id': detectorID,
                    'status': ['error', 'red', 'ошибка']
                });
            }
        }, 100 + 500 * Math.random());
    });
}

function connectToDetector(detectorID) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (detectorID === '0000-0000-0000-0000') {
                resolve();
            }
            else if (detectorID === '3241-6183-2987-4921') {
                resolve();
            }
            else if (detectorID === '7894-9471-3891-4896') {
                reject('Датчик с таким ID уже добавлен');
            }
            else{
                reject('Не найден датчик с таким ID');
            }
        }, 500 + 1000 * Math.random());
    });
}

function deleteDetector(detectorID) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 500 + 1000 * Math.random());
    });
}

function addDetectorElement(detectorID, name='') {
    if (name === '') {
        name = 'Датчик';
    }

    let detector = document.createElement('div');
    detector.classList.add('detector');
    detector.setAttribute('data-detector-id', detectorID);
    detector.innerHTML = `<svg class="detector__chart" viewBox="0 0 400 200" preserveAspectRatio="none">
                          </svg>
                          <div class="detector__header">
                              <span class="status yellow">подключение</span>
                              <h2>${name}</h2>
                              <button class="btn-icon">
                                  <img src="./resources/images/kebab.svg">
                              </button>
                          </div>
                          <div class="detector__footer">
                              <h2>Нагрузка:</h2>
                              <h2>Среднее:</h2>
                          </div>`;
    
    document.getElementsByClassName('detectors_list')[0].append(detector);
    
    getDetectorData(detectorID).then(updateDetector, updateDetector);

}

function createSVGChart(data, width, height, headerHeight, footerHeight, color) {
    let dataMaxValue = 100;
    let path = `M 0 ${height} `;

    for(let i = 0; i < data.length; i++) {
        let pointX = i * width / (data.length - 1);
        let pointY = data[i] / dataMaxValue * (height - headerHeight - footerHeight) + footerHeight;

        path += `L ${pointX} ${height - pointY} `;
    }

    path += `L ${width} ${height}`;

    return `<path fill="url(#${color})" stroke="#07102c" d="${path}"/>`;
}

function updateDetector(detectorData) {
    let detectorID = detectorData['id'];
    let detector = document.querySelector('.detector[data-detector-id="' + detectorID +'"]');
    let detectorHeader = detector.getElementsByClassName('detector__header')[0];
    let detectorFooter = detector.getElementsByClassName('detector__footer')[0];
    let detectorChart = detector.getElementsByClassName('detector__chart')[0];

    // Обновление статуса
    detectorHeader.getElementsByClassName('status')[0].innerText = detectorData.status[2];
    detectorHeader.getElementsByClassName('status')[0].classList = 'status ' + detectorData.status[1];

    if ('name' in detectorData) {
        // Обновление имения датчика
        detectorHeader.getElementsByTagName('h2')[0].innerText = detectorData.name;
    }

    if ('values' in detectorData) {
        // Обновление текущего и среднего значений
        let currentValue = detectorData['values'][detectorData['values'].length - 1];
        let averageValue = Math.round(
            detectorData['values'].reduce((a, b) => (a + b)) / detectorData['values'].length
        );

        detectorFooter.getElementsByTagName('h2')[0].innerHTML = `Нагрузка: <span>${currentValue}%</span>`;
        detectorFooter.getElementsByTagName('h2')[1].innerHTML = `Среднее: <span>${averageValue}%</span>`;
        
        // Обновление графика
        let detectorChartColor = 'blueGradient';
        
        if (detectorData.status[0] === 'offline') {
            detectorChartColor = 'grayGradient';
        }

        let detectorChartPath = createSVGChart(
            detectorData.values,
            detectorChart.clientWidth,
            detectorChart.clientHeight,
            detectorHeader.clientHeight + 10,
            detectorFooter.clientHeight + 10,
            detectorChartColor
        );

        detectorChart.innerHTML = detectorChartPath;
        detectorChart.setAttribute('viewBox', `0 0 ${detectorChart.clientWidth} ${detectorChart.clientHeight}`);
        detectorChart.setAttribute('preserveAspectRatio', 'none');
    }

    // Добавление data-action для открытия popup
    let popupButton = detectorHeader.getElementsByTagName('button')[0];
    popupButton.setAttribute('data-action', 'showPopup');
    popupButton.setAttribute(
        'data-popup-items',
        JSON.stringify(
            [
                {
                    'icon': 'reload',
                    'text': 'Обновить',
                    'attrs': {
                        'data-action': 'updateDetector',
                        'data-detector-id': detectorID
                    }
                },
                {
                    'icon': 'info',
                    'text': 'Подробнее',
                    'attrs': {
                        'data-action': 'aboutDetector',
                        'data-detector-id': detectorID
                    }
                },
                {
                    'icon': 'edit',
                    'text': 'Редактировать',
                    'attrs': {
                        'data-action': 'editDetector',
                        'data-detector-id': detectorID
                    }
                },
                {
                    'icon': 'delete',
                    'text': 'Удалить',
                    'attrs': {
                        'class': 'danger',
                        'data-action': 'deleteDetector',
                        'data-detector-id': detectorID
                    }
                }
            ]
        )
    );
}

function detectorIDInputHandler() {
    let value = this.value;
    let infoBox = this.parentElement.getElementsByTagName('span')[0];

    // Сохранение позиции каретки
    let caretPositon = this.selectionStart;
    
    if (value.length <= caretPositon) {
        caretPositon = 20; // Позиция конца строки
    }
    
    // Форматирование введёного значения
    let newValue = '';

    value = value.replace(/\D+/g, '');
    newValue = value.substr(0, 4);

    for (let i = 1; i <= 4; i++) {
        if (value.length > 4 * i) {
            newValue += '-' + value.substr(4 * i, 4);
        }
        else{
            break;
        }
    }
    
    this.value = newValue;

    // Восстановление позиции каретки
    this.selectionStart = caretPositon;
    this.selectionEnd = caretPositon;

    // Проверка правильности введёного id с помощью алгоритма Луна
    this.classList.remove('error');
    infoBox.classList.remove('error');
    if (value.length === 16 && !LunaCheck(value)) {
        this.classList.add('warning');
        infoBox.classList.add('warning');
        infoBox.innerText = 'Значение содержит ошибку';
    }
    else{
        this.classList.remove('warning');
        infoBox.classList.remove('warning');
        infoBox.innerText = '';
    }
}

function buttonClickHandler(e) {
    let button = e.target;

    while (button.tagName !== 'BUTTON') {
        button = button.parentElement;

        if (button === null) {
            return;
        }
    }

    hideAllPopups();

    let buttonPositionX = button.getBoundingClientRect().left;
    let buttonPositionY = button.getBoundingClientRect().top;
    let buttonWidth = button.clientWidth;
    let buttonHeight = button.clientHeight;

    let action = button.getAttribute('data-action');
    let modalID = null;
    let popupItems = null;
    let detectorID = null;
    let detectorName = null;

    switch (action) {
        case 'addDetector':
            button.classList.add('loading');
            button.setAttribute('disabled', '');
            detectorID = document.getElementById('detector_id').value;
            detectorName = document.getElementById('detector_name').value;

            connectToDetector(detectorID).then(
                () => {
                    button.classList.remove('loading');
                    button.removeAttribute('disabled');
                    
                    hideModal('add_detector_modal');
                    setTimeout(function() {
                        toast('Датчик успешно добавлен!');
                        addDetectorElement(detectorID, detectorName);
                    }, 100);
                },
                (error) => {
                    button.classList.remove('loading');
                    button.removeAttribute('disabled');

                    document.getElementById('detector_id').classList.add('error');
                    document.getElementById('detector_id_infobox').classList.add('error');
                    document.getElementById('detector_id_infobox').innerText = error
                }
            );

            break;
        case 'updateDetector':
            detectorID = button.getAttribute('data-detector-id');
            updateDetector({
                'id': detectorID,
                'status': ['updating', 'yellow', 'обновление']
            });

            getDetectorData(detectorID).then(updateDetector, updateDetector);
            break;
        case 'deleteDetector':
            detectorID = button.getAttribute('data-detector-id');
            updateDetector({
                'id': detectorID,
                'status': ['deleting', 'red', 'удаление']
            });

            deleteDetector(detectorID).then(
                () => {
                    toast(
                        'Датчик успешно удалён! (отменить)',
                        duration=6000
                    );
                    document.querySelector('.detector[data-detector-id="' + detectorID + '"]').remove();
                }
            );
            break;
        case 'showModal':
            modalID = button.getAttribute('data-modal-id');
            showModal(modalID);
            break;
        case 'hideModal':
            modalID = button.getAttribute('data-modal-id');
            hideModal(modalID);
            break;
        case 'showPopup':
            popupItems = button.getAttribute('data-popup-items');
            popupItems = JSON.parse(popupItems);
            showPopup(
                popupItems,
                buttonPositionX + buttonWidth / 2,
                buttonPositionY + buttonHeight
            );
            window.addEventListener('mousedown', popupBlurHandler);
    }
}

window.addEventListener('load', function() {
    let detectors = document.getElementsByClassName('detector');
    for(let detector of detectors) {
        getDetectorData(
            detector.getAttribute('data-detector-id')
        ).then(updateDetector, updateDetector)
    }

    document.addEventListener('click', buttonClickHandler);

    let detectorIDInput = document.getElementById('detector_id');
    detectorIDInput.addEventListener('input', detectorIDInputHandler);
});