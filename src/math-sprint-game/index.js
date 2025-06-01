import { shuffle } from './shuffle';

// Pages
const gamePage = /** @type {HTMLDivElement} */ (document.getElementById('game-page'));
const scorePage = /** @type {HTMLDivElement} */ (document.getElementById('score-page'));
const splashPage = /** @type {HTMLDivElement} */ (document.getElementById('splash-page'));
const countdownPage = /** @type {HTMLDivElement} */ (document.getElementById('countdown-page'));
// Splash Page
const startForm = /** @type {HTMLFormElement} */ (document.getElementById('start-form'));
const radioContainers = /** @type {NodeListOf<HTMLDivElement>} */ (document.querySelectorAll('.radio-container'));
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = /** @type {HTMLHeadElement} */ (document.getElementById('countdown'));
// Game Page
const itemContainer = /** @type {HTMLDivElement} */ (document.getElementById('item-container'));
const wrongBtn = /** @type {HTMLButtonElement} */ (document.getElementById('wrong-btn'));
const rightBtn = /** @type {HTMLButtonElement} */ (document.getElementById('right-btn'));
// Score Page
const finalTimeEl = /** @type {HTMLHeadElement} */ (document.getElementById('final-time'));
const baseTimeEl = /** @type {HTMLHeadElement} */ (document.getElementById('base-time'));
const penaltyTimeEl = /** @type {HTMLHeadElement} */ (document.getElementById('penalty-time'));
const playAgainBtn = /** @type {HTMLButtonElement} */ (document.getElementById('play-again-btn'));

// Equations
let questionAmount = 0;
/**
 * @type {{value: string; evaluated: string}[]}
 */
let equationsArray = [];
/**
 * @type {string[]}
 */
let playerGuessArray = [];
/**
 * @type {{bestScore: string; questions: number}[]}
 */
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
/**
 * @type {{value: string; evaluated: string}}
 */
let equationObject = {
  value: '',
  evaluated: '',
};
/**
 * @type {string[]}
 */
const wrongFormat = [];

// Time
/**
 * @type {string | number | NodeJS.Timeout | undefined}
 */
let timer;
let timePlayed = 0;
let baseTime = '0';
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';

// Scroll
let valueY = 0;

// Refresh Splash Page Best Scores
function bestScoresToDOM() {
  bestScores.forEach((bestScore, index) => {
    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`;
  });
}

// Check Local Storage for Best Scores, Set bestScoreArray
function getSavedBestScores() {
  if (localStorage.getItem('bestScores')) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 25, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay },
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();
}

// Update Best Score Array
function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    // Select correct Best Score to update
    if (questionAmount == score.questions) {
      // Return Best Score as number with one decimal
      const savedBestScore = Number(bestScoreArray[index].bestScore);
      // Update if the new final score is less or replacing zero
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  // Update Splash Page
  bestScoresToDOM();
  // Save to Local Storage
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}

// Reset Game
function playAgain() {
  gamePage.addEventListener('click', startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}

// Show Score Page
function showScorePage() {
  // Show Play Again button after 1 second delay
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}

// Format & Display Time in DOM
function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime.toFixed(1)}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();
  // Scroll to Top, go to Score Page
  itemContainer.scrollTo({ top: 0, behavior: 'instant' });
  showScorePage();
}

// Stop Timer, Process Results, go to Score Page
function checkTime() {
  if (playerGuessArray.length == questionAmount) {
    clearInterval(timer);
    // Check for wrong guess, add penaltyTime
    equationsArray.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        // Correct Guess, No Penalty
      } else {
        // Incorrect Guess, Add Penalty
        penaltyTime += 0.5;
      }
    });
    finalTime = timePlayed + penaltyTime;
    console.log('time:', timePlayed, 'penalty:', penaltyTime, 'final:', finalTime);
    scoresToDOM();
  }
}

// Add a tenth of a second to timePlayed
function addTime() {
  timePlayed += 0.1;
  checkTime();
}

// Start timer when game page is clicked
function startTimer() {
  // Reset times
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener('click', startTimer);
}

/**
 * Scroll, Store user selection in playerGuessArray
 * @param {boolean} guessedTrue
 */
function select(guessedTrue) {
  // Scroll 80 more pixels
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // Add player guess to array
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
}

// Displays Game Page
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

/**
 * Get Random Number up to a certain amount
 * @param {number} max
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount);
  console.log('correct equations:', correctEquations);
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  console.log('wrong equations:', wrongEquations);
  // Loop through for each correct equation, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through for each wrong equation, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(2);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

// Add Equations to DOM
function equationsToDOM() {
  equationsArray.forEach((equation) => {
    // Item
    const item = document.createElement('div');
    item.classList.add('item');
    // Equation Text
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    // Append
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('h-1/2', 'w-full');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('h-[500px]', 'w-full');
  itemContainer.appendChild(bottomSpacer);
}

// Displays 3, 2, 1, GO!
function countdownStart() {
  countdown.textContent = '3';
  setTimeout(() => {
    countdown.textContent = '2';
  }, 1000);
  setTimeout(() => {
    countdown.textContent = '1';
  }, 2000);
  setTimeout(() => {
    countdown.textContent = 'GO!';
  }, 3000);
}

// Navigate from Splash Page to CountdownPage to Game Page
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart();
  populateGamePage();
  setTimeout(showGamePage, 4000);
}

// Get the value from selected radio button
function getRadioValue() {
  let radioValue = 0;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = Number(radioInput.value);
    }
  });
  return radioValue;
}

/**
 * Form that decides amount of Questions
 * @param {SubmitEvent} $event
 */
function selectQuestionAmount($event) {
  $event.preventDefault();
  questionAmount = getRadioValue();
  if (questionAmount) {
    showCountdown();
  }
}

// Switch selected input styling
startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    // Remove Selected Label Styling
    radioEl.classList.remove('bg-primary', 'text-white');
    // Add it back if radio input is checked
    if (/** @type {HTMLInputElement} */ (radioEl.children[1]).checked) {
      radioEl.classList.add('bg-primary', 'text-white');
    }
  });
});

// Event Listeners
gamePage.addEventListener('click', startTimer);
startForm.addEventListener('submit', selectQuestionAmount);
wrongBtn.addEventListener('click', () => select(false));
rightBtn.addEventListener('click', () => select(true));
playAgainBtn.addEventListener('click', playAgain);

// On Load
getSavedBestScores();
