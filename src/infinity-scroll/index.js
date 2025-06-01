import LoaderSVG from './loader.svg';

const loaderImage = /** @type {HTMLImageElement} */ (document.getElementById('loader-image'));

loaderImage.src = LoaderSVG;

const imageContainer = /** @type {HTMLDivElement} */ (document.getElementById('image-container'));
const loader = /** @type {HTMLDivElement} */ (document.getElementById('loader'));

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
/**
 * @type {UnplashPhoto[]}
 */
let photosArray = [];

// Unsplash API
const count = 30;
// Normally, don't store API Keys like this, but an exception made here because it is free, and the data is publicly available!
const apiKey = import.meta.env.VITE_UNPLASH_API_KEY;
const apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${count}`;

// Check if all images were loaded
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

// Helper Function to Set Attributes on DOM Elements
/**
 * @param {HTMLImageElement | HTMLAnchorElement} element
 * @param {{ [qualifiedName: string]: string }} attributes
 */
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Create Elements For Links & Photos, Add to DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  // Run function for each object in photosArray
  photosArray.forEach((photo) => {
    // Create <a> to link to full photo
    const item = document.createElement('a');
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank',
    });
    // Create <img> for photo
    const img = document.createElement('img');
    img.classList.add('w-full', 'mt-[5px]');

    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
    // Event Listener, check when each is finished loading
    img.addEventListener('load', imageLoaded);
    // Put <img> inside <a>, then put both inside imageContainer Element
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

// Get photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
  } catch (error) {
    // Catch Error Here
  }
}

// Check to see if scrolling near bottom of page, Load More Photos
addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
    ready = false;
    getPhotos();
  }
});

// On Load
getPhotos();
