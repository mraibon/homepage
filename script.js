const facts = document.querySelectorAll(".fact");
const button = document.getElementById("shutter");
const flash = document.getElementById("flash");
const background = document.getElementById("background");
const movingBackground = document.getElementById("moving-background");

let shown = 0;
let flashTimer;
let trailTimer = null;

const imagesPerTrail = 5;
const trailInterval = 500;

// Each Shutter click selects the next image.
const movingImages = [
  "images/moving_image1.jpg",
  "images/moving_image2.jpg",
  "images/moving_image3.jpg",
  "images/moving_image4.jpg",
  "images/moving_image5.jpg",
];

// Positions for the fact-specific photo collage.
const spots = [
  { left: "3%", top: "14%", tilt: -6 },
  { left: "74%", top: "12%", tilt: 5 },
  { left: "4%", top: "calc(100% - 550px)", tilt: 4 },
  { left: "72%", top: "calc(100% - 550px)", tilt: -5 },
  { left: "38%", top: "calc(100% - 550px)", tilt: 3 },
  { left: "38%", top: "9%", tilt: -3 },
];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// Completely stop and clear the previous moving-photo trail.
function clearMovingTrail() {
  if (trailTimer !== null) {
    clearInterval(trailTimer);
    trailTimer = null;
  }

  movingBackground.querySelectorAll("img").forEach((pic) => {
    pic.style.animation = "none";
    pic.remove();
  });

  movingBackground.classList.remove("active");
  movingBackground.innerHTML = "";
}

// Add one photo that travels from left to right ONCE.
function addMovingPhoto(src) {
  const pic = document.createElement("img");

  pic.src = src;
  pic.alt = "";
  pic.draggable = false;

  pic.style.setProperty("--start-y", `${randomBetween(5, 75)}vh`);

  pic.style.setProperty("--tilt", `${randomBetween(-8, 8)}deg`);

  // Faster, single-pass animation.
  pic.style.setProperty("--duration", "5s");

  pic.style.setProperty("--delay", "0s");

  // Override any looping animation from the stylesheet.
  pic.style.animation = `photo-trail var(--duration) linear 1 forwards`;

  movingBackground.appendChild(pic);
}

// Add exactly 10 photos, then stop the timer permanently.
function startPhotoTrail(imageIndex) {
  clearMovingTrail();

  const src = movingImages[imageIndex % movingImages.length];
  let count = 0;

  function addNextPhoto() {
    if (count >= imagesPerTrail) {
      clearInterval(trailTimer);
      trailTimer = null;
      return;
    }

    addMovingPhoto(src);
    count++;

    // Stop creating photos immediately after number 10.
    if (count === imagesPerTrail) {
      clearInterval(trailTimer);
      trailTimer = null;
    }
  }

  // First photo appears immediately.
  addNextPhoto();

  // Add the remaining nine at 0.5-second intervals.
  if (count < imagesPerTrail) {
    trailTimer = setInterval(addNextPhoto, trailInterval);
  }
}

// Show the photos associated with the current fact.
function showCollage(imageList) {
  background.innerHTML = "";

  imageList.forEach((src, index) => {
    const pic = document.createElement("img");
    const spot = spots[index % spots.length];

    pic.src = src.trim();
    pic.alt = "";
    pic.draggable = false;

    pic.style.left = spot.left;
    pic.style.top = spot.top;
    pic.style.transform = `rotate(${spot.tilt}deg)`;

    background.appendChild(pic);

    setTimeout(
      () => {
        pic.style.opacity = "0.85";
      },
      150 + index * 200,
    );
  });
}

// Camera flash effect.
function triggerFlash() {
  clearTimeout(flashTimer);

  flash.classList.remove("flashing");
  void flash.offsetWidth;
  flash.classList.add("flashing");

  flashTimer = setTimeout(() => {
    flash.classList.remove("flashing");
  }, 850);
}

// Shutter button.
button.addEventListener("click", () => {
  triggerFlash();

  if (shown < facts.length) {
    const imageIndex = shown % movingImages.length;

    // Start a fresh moving-photo trail.
    startPhotoTrail(imageIndex);

    // Reveal the next fact.
    facts.forEach((fact) => {
      fact.style.display = "none";
    });

    // Reveal only the current fact.
    const currentFact = facts[shown];
    currentFact.style.display = "block";

    // Clear previous collage photos first.
    background.innerHTML = "";

    // Show photos only if this fact has associated images.
    const images = currentFact.dataset.images;

    if (images) {
      showCollage(images.split(","));
    }

    shown++;
  } else {
    clearMovingTrail();

    facts.forEach((fact) => {
      fact.style.display = "none";
    });

    // Remove all fact-specific collage photos.
    background.innerHTML = "";

    // Reset the sequence.
    shown = 0;
  }
});
