// Setup container
let imageContainer = document.createElement('div');
imageContainer.id = 'imageContainer';
imageContainer.style.cssText = `
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 2147483647;
`;
document.body.appendChild(imageContainer);

let active;
const BUBBEL = 'https://avatars.githubusercontent.com/u/134689455?v=4';
let imageUrl;
let intensity;
let imageSize = 40;

try {
  chrome.storage.sync.get("rainActive", (result) => {
    active = result.rainActive ? true : false;
  });
} catch {
  active = false;
}

// Get the stored image url
try {
  chrome.storage.sync.get("rainImageUrl", (result) => {
    if (!result.rainImageUrl || result.rainImageUrl === "") {
      imageUrl = BUBBEL;
    } else {
      imageUrl = result.rainImageUrl;
    }
  });
} catch {
  imageUrl = BUBBEL
}

// Get the stored image size
try {
  chrome.storage.sync.get("rainImageSize", (result) => {
    if (result.rainImageSize) {
      imageSize = result.rainImageSize;
    }
  });
} catch {
  imageSize = 40;
}

// Get the stored intensity
try {
  chrome.storage.sync.get("rainIntensity", (result) => {
    if (result.rainIntensity) {
      intensity = result.rainIntensity;
       if (active) { setRainInterval(); }
    }
  });
} catch {
  intensity = 100;
  if (active) { setRainInterval(); }
}

// Set an interval for creating images
let rainInterval;
function setRainInterval() {
  rainInterval = setInterval(() => {
    const image = createImage();
    animateImage(image);
  }, intensity);
}

// Receive changes from the control panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "updateActiveState":
      active = message.newValue;
      if (active) {
        setRainInterval();
      } else {
        clearInterval(rainInterval);
      }
    break;
    case "updateIntensity":
      intensity = message.newValue;
      if (active) {
        clearInterval(rainInterval);
        setRainInterval()
      }
    break;
    case "updateImageSize":
      imageSize = message.newValue;
      if (active) {
        clearInterval(rainInterval);
        setRainInterval()
      }
    break;
    case "updateImage":
      imageUrl = message.newValue === "" ? BUBBEL : message.newValue;
      imageSize = 40;
    break;  
  }
});

imageContainer = document.getElementById("imageContainer");

// Function to create a new image element
function createImage() {
  let pos = Math.random() * 100;

  const newImage = document.createElement("img");
  newImage.src = imageUrl;
  newImage.style.cssText = `
    position: absolute;
    width: ${imageSize}px;
    top: 0;
    left: ${pos}%;
    transform: translateX(-50%);
    transition: top 1s ease-in;
  `;
  imageContainer.appendChild(newImage);
  return newImage;
}

// Function to animate the image from top to bottom and destroy it
function animateImage(image) {
  setTimeout(() => {
    image.style.top = "110vh"; // Adjust the final position as needed
    image.addEventListener("transitionend", () => {
        imageContainer.removeChild(image); // Remove the image when animation ends
    });
  }, 100); // Delay the animation start
}
