// Task 1: Verification Log
console.log("Status Manager Started");

// Global variable setup (required for Task 10 using setInterval/clearInterval)
let intervalId = null;

// Use const to target required elements for easier access later in the script
const mainTitle    = document.querySelector("#main-title");
const toggleButton = document.getElementById("toggle-button");
const statusOutput = document.querySelector("#status-output");
const timerButton  = document.getElementById("timer-button");
const controlPanel = document.getElementById("control-panel");
const itemList     = document.getElementById("item-list");

// Extra UI references for timer feedback panel
const timerState   = document.getElementById("timer-state");
const flashCount   = document.getElementById("flash-count");
const timerElapsed = document.getElementById("timer-elapsed");
const timerBarFill = document.getElementById("timer-bar-fill");

// Secondary counters (not part of assignment, just UI feedback)
let flashCounter   = 0;
let elapsedSeconds = 0;
let elapsedId      = null;

/* ======================================= */
// --- Task 3: Selecting and Changing Inner HTML ---
mainTitle.innerHTML = "DOM Project: Ready!";

/* ======================================= */
// --- Task 4: Attribute Modification ---
toggleButton.setAttribute("data-action", "status-toggle");

/* ======================================= */
// --- Task 9: Looping and Applying Changes ---
function highlightListItems() {
  const listItems = document.querySelectorAll("li");
  listItems.forEach(function (item) {
    item.style.color = "blue";
  });
}

highlightListItems();

/* ======================================= */
// --- Task 8: Dynamic Element Creation (helper function) ---
function createTimestamp() {
  const span = document.createElement("span");
  span.innerHTML = new Date().toLocaleTimeString();
  statusOutput.appendChild(span);
}

/* ======================================= */
// --- Tasks 5, 6, 7 & 8: Toggle Functionality ---
function toggleStatus(e) {
  e.preventDefault();
  statusOutput.classList.toggle("hidden");

  if (!statusOutput.classList.contains("hidden")) {
    mainTitle.style.backgroundColor = "#3d3010";
    createTimestamp();
  } else {
    mainTitle.style.backgroundColor = "";
  }
}

toggleButton.addEventListener("click", toggleStatus);

/* ======================================= */
// --- Task 10: Timed Animation ---

function updateTimerUI(running) {
  if (running) {
    timerState.textContent = "● RUNNING";
    timerState.className   = "state-badge state-running";
    timerButton.innerHTML  = '<span class="btn-bracket">[</span> Stop Timer <span class="btn-bracket">]</span>';
  } else {
    timerState.textContent = "● IDLE";
    timerState.className   = "state-badge state-idle";
    timerButton.innerHTML  = '<span class="btn-bracket">[</span> Start Timer <span class="btn-bracket">]</span>';
  }
}

function startFlashing() {
  if (intervalId !== null) return;

  flashCounter   = 0;
  elapsedSeconds = 0;
  flashCount.textContent   = "0";
  timerElapsed.textContent = "00:00";
  timerBarFill.style.width = "0%";

  intervalId = setInterval(function () {
    controlPanel.classList.toggle("hidden");
    flashCounter++;
    flashCount.textContent = flashCounter;
    timerBarFill.style.width = ((flashCounter % 20) / 20 * 100) + "%";
  }, 500);

  elapsedId = setInterval(function () {
    elapsedSeconds++;
    const m = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0");
    const s = String(elapsedSeconds % 60).padStart(2, "0");
    timerElapsed.textContent = m + ":" + s;
  }, 1000);

  updateTimerUI(true);
}

function stopFlashing() {
  clearInterval(intervalId);
  clearInterval(elapsedId);
  intervalId = null;
  elapsedId  = null;
  controlPanel.classList.remove("hidden");
  timerBarFill.style.width = "0%";
  updateTimerUI(false);
}

timerButton.addEventListener("click", startFlashing);
timerButton.addEventListener("dblclick", stopFlashing);
