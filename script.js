/* =============================================================
   COMP 484 — Project 3: The Status Manager
   script.js — DOM & BOM Manipulation
   ============================================================= */


/* -------------------------------------------------------------
   TASK 1: VERIFICATION
   console.log() sends a message to the browser's Developer
   Console (F12). This confirms the script file is linked
   correctly and executed by the browser on page load.
   The window object (BOM) exposes the console interface.
   ------------------------------------------------------------- */
console.log("Status Manager Started");


/* -------------------------------------------------------------
   TASK 2 NOTE: The .hidden class is defined in style.css as:
       display: none;
   This removes the element from the page entirely — it takes
   up no space and is invisible. You can see it applied to
   #status-output in index.html. JavaScript will toggle this
   class on and off in Task 5 to show and hide that element.
   ------------------------------------------------------------- */


// Boot chime — plays on the user's first click.
// Browsers block audio until there's a user gesture, so we
// listen for the first click and remove the listener after.
window.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", function bootOnce() {
    SFX.boot();
    document.removeEventListener("click", bootOnce);
  }, { once: true });
});


/* -------------------------------------------------------------
   GLOBAL VARIABLES
   intervalId is declared here (in the global scope) so both
   startFlashing() and stopFlashing() can access it.
   Required by Task 10 — setInterval returns an ID we must
   store so clearInterval can cancel it later.
   ------------------------------------------------------------- */
let intervalId    = null;
let flashCounter  = 0;
let elapsedSeconds = 0;
let elapsedId     = null;


/* -------------------------------------------------------------
   DOM ELEMENT REFERENCES
   We grab all required elements once and store them in const
   variables. This is more efficient than querying the DOM
   repeatedly inside functions.
   ------------------------------------------------------------- */
const mainTitle    = document.querySelector("#main-title");
const toggleButton = document.getElementById("toggle-button");
const statusOutput = document.querySelector("#status-output");
const timerButton  = document.getElementById("timer-button");
const controlPanel = document.getElementById("control-panel");
const itemList     = document.getElementById("item-list");

// Extra elements for the timer feedback panel (not part of assignment)
const timerState   = document.getElementById("timer-state");
const flashCount   = document.getElementById("flash-count");
const timerElapsed = document.getElementById("timer-elapsed");
const timerBarFill = document.getElementById("timer-bar-fill");
const stopButton   = document.getElementById("stop-button");


/* -------------------------------------------------------------
   TASK 3: MODIFY CONTENT ON LOAD
   innerHTML lets us read or replace the HTML content inside
   any element. Here we overwrite the <h1> text on page load.
   ------------------------------------------------------------- */
mainTitle.innerHTML = "DOM Project: Ready!";


/* -------------------------------------------------------------
   TASK 4: ATTRIBUTE MODIFICATION
   setAttribute(name, value) adds or updates any attribute on
   an element. Here we add a custom data-action attribute to
   the anchor tag to describe its intended behavior.
   ------------------------------------------------------------- */
toggleButton.setAttribute("data-action", "status-toggle");


/* -------------------------------------------------------------
   TASK 9: LOOPS AND NODE LISTS
   querySelectorAll() returns a NodeList of every matching
   element. We iterate with forEach() and set each item's
   inline color style to "blue" — runs once on page load.
   ------------------------------------------------------------- */
function highlightListItems() {
  const listItems = document.querySelectorAll("li");
  listItems.forEach(function (item) {
    item.style.color = "blue";
  });
}

highlightListItems();


/* -------------------------------------------------------------
   TASK 8: DYNAMIC ELEMENT CREATION
   createElement() creates a new DOM node in memory.
   We set its content, then use appendChild() to insert it
   inside #status-output. Called each time the status opens.
   ------------------------------------------------------------- */
function createTimestamp() {
  const span = document.createElement("span");
  span.innerHTML = new Date().toLocaleTimeString();
  statusOutput.appendChild(span);
}


/* -------------------------------------------------------------
   TASKS 5, 6, 7, 8: TOGGLE FUNCTIONALITY
   toggleStatus is bound to the toggle button's click event.
   It handles: preventing default anchor behavior (Task 6),
   toggling visibility (Task 5), inline styling (Task 7),
   and appending a timestamp element (Task 8).
   ------------------------------------------------------------- */
function toggleStatus(e) {
  // Task 6: Stops the anchor tag from jumping to href="#"
  e.preventDefault();

  // Task 5: Adds .hidden if missing, removes it if present
  statusOutput.classList.toggle("hidden");

  if (!statusOutput.classList.contains("hidden")) {
    // Task 7: Status is now visible — highlight the title
    mainTitle.style.backgroundColor = "yellow";
    // Task 8: Append a new timestamp each time it opens
    createTimestamp();
    SFX.statusOpen();
  } else {
    // Task 7: Status is hidden — reset title background
    mainTitle.style.backgroundColor = "";
    SFX.statusClose();
  }
}

// Task 5: Register the click event listener on the anchor tag
toggleButton.addEventListener("click", toggleStatus);


/* -------------------------------------------------------------
   TASK 10: TIMED ANIMATION
   setInterval() repeatedly calls a function at a fixed delay
   (in ms) and returns an ID. clearInterval() takes that ID
   to cancel execution. The .hidden toggle makes the control
   panel flash by alternately showing and hiding it.
   ------------------------------------------------------------- */

// Updates the badge and button states to reflect timer status
function updateTimerUI(running) {
  if (running) {
    timerState.textContent = "● RUNNING";
    timerState.className   = "state-badge state-running";
    timerButton.disabled   = true;
    stopButton.disabled    = false;
  } else {
    timerState.textContent = "● IDLE";
    timerState.className   = "state-badge state-idle";
    timerButton.disabled   = false;
    stopButton.disabled    = true;
  }
}

function startFlashing() {
  // Guard: don't stack multiple intervals if already running
  if (intervalId !== null) return;

  // Reset feedback counters
  flashCounter   = 0;
  elapsedSeconds = 0;
  flashCount.textContent   = "0";
  timerElapsed.textContent = "00:00";
  timerBarFill.style.width = "0%";

  SFX.timerStart();

  // Core Task 10: toggle .hidden on #control-panel every 500ms
  intervalId = setInterval(function () {
    controlPanel.classList.toggle("hidden");
    flashCounter++;
    flashCount.textContent   = flashCounter;
    timerBarFill.style.width = ((flashCounter % 20) / 20 * 100) + "%";
    SFX.timerTick();
  }, 500);

  // Separate interval for the elapsed time display
  elapsedId = setInterval(function () {
    elapsedSeconds++;
    const m = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0");
    const s = String(elapsedSeconds % 60).padStart(2, "0");
    timerElapsed.textContent = m + ":" + s;
  }, 1000);

  updateTimerUI(true);
}

function stopFlashing() {
  // Core Task 10: clearInterval cancels both running intervals
  clearInterval(intervalId);
  clearInterval(elapsedId);
  intervalId = null;
  elapsedId  = null;

  // Ensure control panel is visible after stopping
  controlPanel.classList.remove("hidden");
  timerBarFill.style.width = "0%";
  SFX.timerStop();
  updateTimerUI(false);
}

// Task 10: single click starts, double-click stops
timerButton.addEventListener("click", startFlashing);
timerButton.addEventListener("dblclick", stopFlashing);

// Extra stop button for usability (not part of assignment)
stopButton.addEventListener("click", stopFlashing);
