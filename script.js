let tape = {};
let head = 0;
let currentState = "0";
let program = [];
let isHalted = true;
let isRunning = false; // New state tracker
let runInterval = null;

const tapeEl = document.getElementById("tape");
const tapeWrapper = document.getElementById("tape-wrapper");
const statusEl = document.getElementById("status");
const speedInput = document.getElementById("speed");
const speedDisplay = document.getElementById("speed-val");
const btnToggle = document.getElementById("btnToggle");
const btnStep = document.getElementById("btnStep");

speedInput.addEventListener("input", () => {
  speedDisplay.textContent = speedInput.value;
  // If running, dynamically update speed
  if (isRunning) {
    pauseAuto();
    runAuto();
  }
});

function renderTape(autoScroll = true) {
  tapeEl.innerHTML = "";
  const indices = Object.keys(tape).map(Number);
  const min = indices.length ? Math.min(...indices, head) - 5 : head - 5;
  const max = indices.length ? Math.max(...indices, head) + 5 : head + 5;

  for (let i = min; i <= max; i++) {
    const cell = document.createElement("div");
    cell.className = "cell" + (i === head ? " active" : "");
    cell.id = i === head ? "head-cell" : "";
    cell.textContent = tape[i] || "_";
    tapeEl.appendChild(cell);
  }

  if (autoScroll) {
    const activeCell = document.getElementById("head-cell");
    if (activeCell) {
      activeCell.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }
}

function init() {
  stopMachine();
  const input = document.getElementById("inputString").value;
  tape = {};
  input.split("").forEach((char, idx) => (tape[idx] = char));
  head = 0;
  currentState = "0";
  isHalted = false;

  const lines = document.getElementById("code").value.split("\n");
  program = lines
    .filter((l) => l.trim())
    .map((line) => {
      const parts = line.split(",").map((p) => p.trim());
      return {
        curS: parts[0],
        read: parts[1],
        nextS: parts[2],
        write: parts[3],
        dir: parts[4],
      };
    });

  btnStep.disabled = false;
  btnToggle.disabled = false;
  updateStatus("READY");
  renderTape();
}

function step() {
  if (isHalted) return;
  const currentSymbol = tape[head] || "_";
  const rule = program.find(
    (r) => r.curS === currentState && r.read === currentSymbol
  );

  if (!rule) {
    isHalted = true;
    updateStatus("CRASH");
    stopMachine();
    return;
  }

  tape[head] = rule.write;
  currentState = rule.nextS;

  if (rule.dir === "R") head++;
  else if (rule.dir === "L") head--;

  if (currentState === "halt") {
    isHalted = true;
    updateStatus("HALTED");
    stopMachine();
  } else {
    updateStatus("PROCESSING");
  }
  renderTape(true);
}

// Logical switch for the toggle button
function handleToggle() {
  if (isRunning) {
    pauseAuto();
  } else {
    runAuto();
  }
}

function runAuto() {
  if (isHalted) return;
  isRunning = true;
  btnToggle.textContent = "Pause";
  btnToggle.classList.add("btn-running");
  btnStep.disabled = true;

  const speedVal = parseInt(speedInput.value);
  const delay = 1050 - speedVal * 100;

  runInterval = setInterval(step, delay);
}

function pauseAuto() {
  isRunning = false;
  clearInterval(runInterval);
  btnToggle.textContent = "Resume";
  btnToggle.classList.remove("btn-running");
  btnStep.disabled = false;
}

function stopMachine() {
  isRunning = false;
  clearInterval(runInterval);
  btnToggle.textContent = "Run";
  btnToggle.classList.remove("btn-running");
}

function updateStatus(msg) {
  statusEl.innerHTML = `<strong>${msg}</strong> | STATE: <span style="color:var(--accent)">${currentState}</span> | HEAD: ${head}`;
}

// Drag logic
let isDown = false;
let startX, scrollLeft;
tapeWrapper.addEventListener("mousedown", (e) => {
  isDown = true;
  startX = e.pageX - tapeWrapper.offsetLeft;
  scrollLeft = tapeWrapper.scrollLeft;
});
tapeWrapper.addEventListener("mouseleave", () => (isDown = false));
tapeWrapper.addEventListener("mouseup", () => (isDown = false));
tapeWrapper.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  const x = e.pageX - tapeWrapper.offsetLeft;
  const walk = (x - startX) * 2;
  tapeWrapper.scrollLeft = scrollLeft - walk;
});

document.getElementById("btnInit").addEventListener("click", init);
document.getElementById("btnStep").addEventListener("click", step);
btnToggle.addEventListener("click", handleToggle);

init();
