const activeCheckbox = document.getElementById("toggleActive");
// Check if the rain is active and set the checkbox
try {
  chrome.storage.sync.get("rainActive", (result) => {
    activeCheckbox.checked = result.rainActive ? true : false;
  });
} catch {
  activeCheckbox.checked = false;
}

// Send the updated state to all tabs and store it
activeCheckbox.addEventListener("change", async () => {
  await chrome.tabs.query({}, (tabs) => { tabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id, { action: "updateActiveState", newValue: activeCheckbox.checked });
  }); });

  chrome.storage.sync.set({ rainActive: activeCheckbox.checked });
});

const intensitySlider = document.getElementById("intensityControl");
const intensityDisplay = document.getElementById("intensityDisplay");

// Get the rain intensity and display it properly
try {
  chrome.storage.sync.get("rainIntensity", (result) => {
    if (result.rainIntensity) {
      intensitySlider.value = 1001 - result.rainIntensity;
      intensityDisplay.innerHTML = (1001 - intensitySlider.value) + " ms";
    }
  });
} catch {
  intensitySlider.value = 700;
  intensityDisplay.innerHTML = (1001 - intensitySlider.value) + " ms";
}

// When the slider moves
intensitySlider.oninput = async () => {
  intensityDisplay.innerHTML = (1001 - intensitySlider.value) + " ms";

  await chrome.tabs.query({}, (tabs) => { tabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id, { action: "updateIntensity", newValue: 1001 - intensitySlider.value });
  }); });

  chrome.storage.sync.set({ rainIntensity: 1001 - intensitySlider.value });
}

const sizeSlider = document.getElementById("sizeControl");
const sizeDisplay = document.getElementById("sizeDisplay");

// Get the image size and display it properly
try {
  chrome.storage.sync.get("rainImageSize", (result) => {
    sizeSlider.value = result.rainImageSize;
    sizeDisplay.innerHTML = sizeSlider.value + " px";
  });
} catch {
  sizeSlider.value = 40;
  sizeDisplay.innerHTML = sizeSlider.value + " px";
}

// When the slider moves
sizeSlider.oninput = async () => {
  sizeDisplay.innerHTML = sizeSlider.value + " px";

  await chrome.tabs.query({}, (tabs) => { tabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id, { action: "updateImageSize", newValue: sizeSlider.value });
  }); });

  chrome.storage.sync.set({ rainImageSize: sizeSlider.value });
}

const urlInput = document.getElementById("imageUrlInput");
const updateBtn = document.getElementById("imageUpdateBtn");
const bubbelBtn = document.getElementById("bubbelBtn");

// Send the new image to all tabs and store it
async function updateImage(url) {
  await chrome.tabs.query({}, (tabs) => { tabs.forEach(tab => {
    chrome.tabs.sendMessage(tab.id, { action: "updateImage", newValue: url });
  }); });

  chrome.storage.sync.set({ rainImageUrl: url });
}

updateBtn.addEventListener("click", () => {
  if (urlInput.value) {
    updateImage(urlInput.value);
  }
});
bubbelBtn.addEventListener("click", () => {
  updateImage(""); // Empty string represent Bubbel
});