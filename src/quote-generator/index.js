import DefaultQuotes from './default.quotes.json';

const quoteContainerEle = /** @type {HTMLDivElement} */ (document.getElementById('quote-container'));
const quoteContentEle = /** @type {HTMLSpanElement} */ (document.getElementById('quote-content'));
const quoteAuthorEle = /** @type {HTMLSpanElement} */ (document.getElementById('quote-author'));
const newQuoteBtn = /** @type {HTMLButtonElement} */ (document.getElementById('new-quote-btn'));
const twitterBtn = /** @type {HTMLButtonElement} */ (document.getElementById('twitter-btn'));
const loaderEle = /** @type {HTMLDivElement} */ (document.getElementById('loader'));

const apiUrl = 'https://jacintodesign.github.io/quotes-api/data/quotes.json';

/**
 * @type {Quote[]}
 */
let apiQuotes = [];

/**
 * @param {number} min
 * @param {number} max
 */
function getRandomIntInclusive(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

/**
 * @param {number} milliseconds
 * @default 1000s or 1 second
 */
async function delay(milliseconds = 1000) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * @param {Function} callback
 * @param {any[]} params
 */
function loading(callback, ...params) {
  loaderEle.hidden = false;
  quoteContainerEle.hidden = true;

  callback.apply(params);

  loaderEle.hidden = true;
  quoteContainerEle.hidden = false;
}

/**
 * @param {{ (): Promise<void>; }} callback
 * @param {any[]} params
 */
async function loadingAsync(callback, ...params) {
  loaderEle.hidden = false;
  quoteContainerEle.hidden = true;

  await callback.apply(params);

  loaderEle.hidden = true;
  quoteContainerEle.hidden = false;
}

function getNewQuote() {
  const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];

  if (quote.text.length > 120) quoteContentEle.classList.add('text-[2rem]');
  else quoteContentEle.classList.remove('text-[2rem]');

  quoteContentEle.textContent = quote.text;
  quoteAuthorEle.textContent = quote.author || 'Unknown';
}

function tweetQuote() {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteContentEle.textContent} - ${quoteAuthorEle.textContent}`;
  window.open(twitterUrl, '_blank');
}

async function init() {
  apiQuotes = [...DefaultQuotes];

  try {
    const response = await fetch(apiUrl);
    await delay(getRandomIntInclusive(100, 1500));
    const data = await response.json();
    apiQuotes = [...data, ...apiQuotes];
  } catch (error) {
    console.log(error);
  }

  getNewQuote();
}

addEventListener('DOMContentLoaded', () => {
  loadingAsync(init);

  newQuoteBtn.addEventListener('click', () => loading(getNewQuote));
  twitterBtn.addEventListener('click', tweetQuote);
});
