const facts = document.querySelectorAll(".fact");
const button = document.getElementById("shutter");

let shown = 0;

button.onclick = function () {
  if (shown < facts.length) {
    // Still facts left to show
    facts[shown].style.display = "block";
    shown = shown + 1;
  } else {
    // All facts are showing, so hide them and start over
    for (let i = 0; i < facts.length; i++) {
      facts[i].style.display = "none";
    }
    shown = 0;
  }
};
