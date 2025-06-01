const DEFAULT_COLOR_1 = '#00ff00'; // GREEN
const DEFAULT_COLOR_2 = '#ff0000'; // RED

const directionSelector = /** @type {HTMLSelectElement} */ (document.getElementById('direction'));
const inputColor1 = /** @type {HTMLInputElement} */ (document.getElementById('color1'));
const inputColor2 = /** @type {HTMLInputElement} */ (document.getElementById('color2'));

const displayCSSText = /** @type {HTMLElement} */ (document.getElementById('display-css-text'));

/**
 * @type {{[directionValue: string] : string}}
 */
const directionDict = {
  left: 'to left',
  right: 'to right',
  top: 'to top',
  bottom: 'to bottom',
};

/**
 * @param {string} color1
 * @param {string} color2
 * @param {string} directionValue
 */
function generateGradientText(directionValue, color1, color2) {
  const direction = directionDict[directionValue];
  if (direction) return `linear-gradient(${direction}, ${color1}, ${color2})`;
  return `linear-gradient(to right, ${color1}, ${color2})`;
}

/**
 * @param {HTMLElement} body
 * @param {HTMLElement} display
 * @param {HTMLInputElement} input1
 * @param {HTMLInputElement} input2
 * @param {string} direction
 */
function update(body, display, direction, input1, input2) {
  const cssText = generateGradientText(direction, input1.value, input2.value);

  body.style.background = cssText;
  display.textContent = `${body.style.background};`;
}

/**
 * @param {HTMLElement} body
 * @param {HTMLElement} display
 * @param {HTMLInputElement} input1
 * @param {HTMLInputElement} input2
 * @param {string} direction
 */
function init(body, display, direction, input1, input2) {
  input1.value = DEFAULT_COLOR_1;
  input2.value = DEFAULT_COLOR_2;

  update(body, display, direction, input1, input2);
}

addEventListener('DOMContentLoaded', () => {
  init(document.body, displayCSSText, directionSelector.value, inputColor1, inputColor2);

  inputColor1.addEventListener('input', () =>
    update(document.body, displayCSSText, directionSelector.value, inputColor1, inputColor2),
  );
  inputColor2.addEventListener('input', () =>
    update(document.body, displayCSSText, directionSelector.value, inputColor1, inputColor2),
  );

  directionSelector.addEventListener('change', () =>
    update(document.body, displayCSSText, directionSelector.value, inputColor1, inputColor2),
  );
});
