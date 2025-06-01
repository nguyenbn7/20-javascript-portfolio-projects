let display = document.getElementById('display');
let operatorBtns = [
  .../** @type {HTMLCollectionOf<HTMLButtonElement>} */ (document.getElementsByClassName('operator-btns')),
];
let numberBtns = [
  .../** @type {HTMLCollectionOf<HTMLButtonElement>} */ (document.getElementsByClassName('number-btns')),
];
let decimalBtn = /** @type {HTMLButtonElement | null} */ (document.getElementById('decimal-btn'));
let clearBtn = /** @type {HTMLButtonElement | null} */ (document.getElementById('clear-btn'));

let firstValue = 0;
let operatorValue = '';
let awaitingNextValue = false;

function addDecimal() {
  if (awaitingNextValue) return;

  if (display && !display.textContent?.includes('.')) {
    display.textContent = `${display.textContent}.`;
  }
}

/**
 * @param {string} number
 */
function sendNumberValue(number) {
  if (awaitingNextValue && display) {
    display.textContent = number;
    awaitingNextValue = false;
    return;
  }

  if (display) {
    const currentDisplayValue = display.textContent?.trim();
    display.textContent = currentDisplayValue === '0' ? number : currentDisplayValue + number;
  }
}

function clearAll() {
  firstValue = 0;
  operatorValue = '';
  awaitingNextValue = false;
  if (display) {
    display.textContent = '0';
  }
}

/**
 * @param {string} operator
 */
function addOperator(operator) {
  const currentValue = Number(display?.textContent);

  if (operatorValue && awaitingNextValue) {
    operatorValue = operator;
    return;
  }

  if (!firstValue) {
    firstValue = currentValue;
  } else {
    const calculation = calculate[operatorValue](firstValue, currentValue);
    if (display) {
      display.textContent = '' + calculation;
    }
    firstValue = calculation;
  }

  awaitingNextValue = true;
  operatorValue = operator;
}

/**
 * @type {{[operator: string]: (first: number, second: number) => number}}
 */
const calculate = {
  '/': (/** @type {number} */ firstNumber, /** @type {number} */ secondNumber) => firstNumber / secondNumber,
  '*': (/** @type {number} */ firstNumber, /** @type {number} */ secondNumber) => firstNumber * secondNumber,
  '+': (/** @type {number} */ firstNumber, /** @type {number} */ secondNumber) => firstNumber + secondNumber,
  '-': (/** @type {number} */ firstNumber, /** @type {number} */ secondNumber) => firstNumber - secondNumber,
  '=': (/** @type {number} */ firstNumber, /** @type {number} */ secondNumber) => secondNumber,
};

addEventListener('DOMContentLoaded', () => {
  numberBtns.forEach((ele) => {
    if (display) {
      ele.addEventListener('click', () => sendNumberValue(ele.textContent ?? ''));
    }
  });

  operatorBtns.forEach((ele) => {
    ele.addEventListener('click', () => {
      addOperator(ele.value);
    });
  });

  decimalBtn?.addEventListener('click', addDecimal);
  clearBtn?.addEventListener('click', clearAll);
});
