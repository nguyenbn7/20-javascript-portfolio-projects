/**
 * @type {Song[]}
 */
const songs = [
  {
    fileName: 'jacinto-1.mp3',
    displayName: 'Electric Chill Machine',
    displayImage: 'jacinto-1.jpg',
    artist: 'Jacinto Design',
  },
  {
    fileName: 'jacinto-2.mp3',
    displayName: 'Seven Nation Army (Remix)',
    displayImage: 'jacinto-2.jpg',
    artist: 'Jacinto Design',
  },
  {
    fileName: 'jacinto-3.mp3',
    displayName: 'Goodnight, Disco Queen',
    displayImage: 'jacinto-3.jpg',
    artist: 'Jacinto Design',
  },
  {
    fileName: 'metric-1.mp3',
    displayName: 'Front Row (Remix)',
    displayImage: 'metric-1.jpg',
    artist: 'Metric/Jacinto Design',
  },
];

const base = `${import.meta.env.BASE_URL}music-player`;

const PLAY_ICON = '<i class="fa-solid fa-play"></i>';
const PAUSE_ICON = '<i class="fa-solid fa-pause"></i>';
const PLAY_BTN_TITLE = 'Play';
const PAUSE_BTN_TITLE = 'Pause';

const displayImage = /** @type {HTMLImageElement} */ (document.getElementById('song-image'));
const displayName = /** @type {HTMLElement} */ (document.getElementById('song-name'));
const displayArtist = /** @type {HTMLElement} */ (document.getElementById('song-artist'));
const songPlayer = /** @type {HTMLAudioElement} */ (document.getElementById('player'));
const mainBtn = /** @type {HTMLButtonElement} */ (document.getElementById('main'));
const prevBtn = /** @type {HTMLButtonElement} */ (document.getElementById('prev'));
const nextBtn = /** @type {HTMLButtonElement} */ (document.getElementById('next'));
const progressContainer = /** @type {HTMLDivElement} */ (document.getElementById('progress-container'));
const progress = /** @type {HTMLDivElement} */ (document.getElementById('progress'));
const displayCurrentTime = /** @type {HTMLSpanElement} */ (document.getElementById('current-time'));
const displayDuration = /** @type {HTMLSpanElement} */ (document.getElementById('duration'));

let playing = false;
let index = 0;

function playSong() {
  playing = true;
  songPlayer.play();
  mainBtn.title = PAUSE_BTN_TITLE;
  mainBtn.innerHTML = PAUSE_ICON;
}

function pauseSong() {
  playing = false;
  songPlayer.pause();
  mainBtn.title = PLAY_BTN_TITLE;
  mainBtn.innerHTML = PLAY_ICON;
}

/**
 * @param {Song} song
 */
function loadSong(song) {
  displayName.textContent = song.displayName;
  displayArtist.textContent = song.artist;
  songPlayer.src = `${base}/music/${song.fileName}`;
  progress.style.width = '0';
  displayImage.src = `${base}/images/${song.displayImage}`;
}

function nextSong() {
  loadSong(songs[++index % songs.length]);

  if (!playing) return;

  playSong();
}

function prevSong() {
  loadSong(songs[(--index + songs.length) % songs.length]);

  if (!playing) return;

  playSong();
}

/**
 * @param {Event} $event
 */
function updateProgressBar($event) {
  const songPlayer = /** @type {HTMLAudioElement} */ ($event.target);

  const { duration, currentTime } = songPlayer;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;

  displayCurrentTime.textContent = getDurationString(currentTime);
}

/**
 * @param {number} duration
 */
function getDurationString(duration) {
  const durationMins = Math.floor(duration / 60);
  const durationSecs = Math.round(duration % 60);

  return `${durationMins}:${durationSecs.toLocaleString(undefined, {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })}`;
}

/**
 * @param {HTMLAudioElement} songPlayer
 */
function loadSongMetaData(songPlayer) {
  displayDuration.textContent = getDurationString(songPlayer.duration);
  displayCurrentTime.textContent = '0:00';
}

/**
 * @param {MouseEvent} $event
 * @this {HTMLDivElement}
 */
function setProgressBar($event) {
  const width = this.clientWidth;
  const clickX = $event.offsetX;
  const { duration } = songPlayer;
  songPlayer.currentTime = (clickX / width) * duration;
}

/**
 * @param {HTMLAudioElement} songPlayer
 * @param {HTMLDivElement} progressContainer
 * @param {HTMLButtonElement} prevBtn
 * @param {HTMLButtonElement} nextBtn
 * @param {HTMLButtonElement} mainBtn
 */
function init(songPlayer, prevBtn, nextBtn, mainBtn, progressContainer) {
  loadSong(songs[index]);

  songPlayer.preload = 'metadata';
  songPlayer.autoplay = false;
  songPlayer.addEventListener('loadedmetadata', () => loadSongMetaData(songPlayer));
  songPlayer.addEventListener('timeupdate', updateProgressBar);
  songPlayer.addEventListener('ended', nextSong);

  prevBtn.addEventListener('click', prevSong);
  nextBtn.addEventListener('click', nextSong);
  mainBtn.title = PLAY_BTN_TITLE;
  mainBtn.innerHTML = PLAY_ICON;
  mainBtn.addEventListener('click', () => (playing ? pauseSong() : playSong()));

  progressContainer.addEventListener('click', setProgressBar);
}

addEventListener('DOMContentLoaded', () => init(songPlayer, prevBtn, nextBtn, mainBtn, progressContainer));
