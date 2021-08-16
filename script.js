const numberButtons = document.querySelectorAll(".button_number");
const operatorsButtons = document.querySelectorAll(".operators");
const clearButton = document.querySelector(".button_delete");
const equalButton = document.getElementById("button_equal");
const input = document.getElementById("input");

let arrNumbers = [];
let arrOperators = [];

calculator();

function calculator() {
    //фокус на окне ввода при загрузке страницы
    window.addEventListener('load', () => {
        input.focus();
    })
    //валидация введенных в окно символов
    input.addEventListener('input', onChangeInput);
    clearButton.addEventListener('click', clearInput);
    onClickButtons();
    onCalcResult();
}

function onChangeInput(event) {
    //при вводе букв
    let validationRes = validateInput(event.data);
    if (!validationRes) {
        deleteInputSymbol();
    }
    //при вводе двух знаков подряд (++, --)
    let wrongInputRes = onWrongInput(event.data);
    if (wrongInputRes) {
        deleteInputSymbol();
    }
}

function deleteInputSymbol() {
    let temp = input.value.slice(0, -1);
    input.value = temp;
}

function onWrongInput() {
    let regexp = /[,.\-+*\/]{2,}/;
    return regexp.test(input.value);
}

function validateInput() {
    let regexp = /^[0-9.,+\-*/]+$/;
    return regexp.test(input.value);
}

function clearInput() {
    input.value = '';
}

// вывод чисел на экран при нажитии кнопок
function onClickButtons() {
    for (let i = 0; i < numberButtons.length; i++) {
        numberButtons[i].addEventListener('click', () => {
            input.value += numberButtons[i].value;
        })
    }
    for (let i = 0; i < operatorsButtons.length; i++) {
        operatorsButtons[i].addEventListener('click', () => {
            input.value += operatorsButtons[i].value;
        })
    }
}

function onCalcResult() {
    equalButton.addEventListener('click', onClickEqual);
    //запуск функции расчета результата при нажатии Enter на цифровой клавиатуре
    document.addEventListener('keyup', (e) => {
        if (e.keyCode == '13') {
            onClickEqual();
        }
    })
}

function checkZeroDivision() {
    return /(\/0)+/.test(input.value);
}

function onClickEqual() {
    //проверка деления на ноль
    let zeroDivisionResult = checkZeroDivision();
    if (zeroDivisionResult) {
        input.value = "Zero division error";
        return
    }

    let inputValue = replaceComma();
    //два массива один с числами, другой со знаками
    arrNumbers = inputValue.split(/[+\-*/]/);
    arrOperators = inputValue.split(/[0-9\.]+/);
    //отрезаем пустые элементы массива со знаками
    arrOperators.splice(arrOperators.length - 1, 1);
    arrOperators.splice(0, 1);

    //проходим по всем знакам в математическом порядке и делаем операции с необходимыми числами из массива чисел

    ifMultiply();
    ifDivision();
    ifSumAndMinus();

    input.value = arrNumbers.join('');
}

function ifMultiply() {
    if (arrOperators.includes('*')) {
        for (let i = 0; i < arrOperators.length; i++) {
            if (arrOperators[i] == '*') {
                let temp = arrNumbers[i] * arrNumbers[i + 1];
                arrNumbers.splice(i, 2, temp);
                arrOperators.splice(i, 1);
                i--;
            }
        }
    }
}

function ifDivision() {
    if (arrOperators.includes('/')) {
        for (let i = 0; i < arrOperators.length; i++) {
            if (arrOperators[i] == '/') {
                let temp = +arrNumbers[i] / +arrNumbers[i + 1];
                arrNumbers.splice(i, 2, temp);
                arrOperators.splice(i, 1);
                i--;
            }
        }
    }
}

function ifSumAndMinus() {
    if (arrOperators.includes('+') || arrOperators.includes('-')) {
        for (let i = 0; i < arrOperators.length; i++) {
            if (arrOperators[i] == '+') {
                let temp = +arrNumbers[i] + +arrNumbers[i + 1];
                arrNumbers.splice(i, 2, temp);
                arrOperators.splice(i, 1);
                i--;
            }
            if (arrOperators[i] == '-') {
                let temp = +arrNumbers[i] - +arrNumbers[i + 1];
                arrNumbers.splice(i, 2, temp);
                arrOperators.splice(i, 1);
                i--;
            }
        }
    }
}

//замена введенной запятой на точку
function replaceComma() {
    let inputValue = input.value;
    if (inputValue.includes(",")) {
        let inputValue1 = inputValue.replace(/,/g, '.');
        return inputValue1;
    }
    return inputValue;
}