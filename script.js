

const QUESTIONS = [
  { q: "What does 'HTTP' stand for?", options: ["HyperText Transfer Protocol", "High Transfer Text Program", "Home Tool Transport Process", "HyperLink Text Transmission"], correct: 0 },
  { q: "Which planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Mars", "Saturn"], correct: 2 },
  { q: "In what year did the Berlin Wall fall?", options: ["1987", "1989", "1991", "1993"], correct: 1 },
  { q: "What is the chemical symbol for gold?", options: ["Go", "Gd", "Au", "Ag"], correct: 2 },
  { q: "Who wrote '1984'?", options: ["Aldous Huxley", "Ray Bradbury", "George Orwell", "H.G. Wells"], correct: 2 },
  { q: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3 },
  { q: "How many bits are in a byte?", options: ["4", "8", "16", "32"], correct: 1 },
  { q: "Which language runs natively in the browser?", options: ["Python", "JavaScript", "C++", "Ruby"], correct: 1 },
  { q: "What is the smallest prime number?", options: ["0", "1", "2", "3"], correct: 2 },
  { q: "Which country invented paper?", options: ["Egypt", "Greece", "China", "India"], correct: 2 },
  { q: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], correct: 2 },
  { q: "What is the tallest mountain on Earth?", options: ["K2", "Kilimanjaro", "Mount Everest", "Denali"], correct: 2 },
  { q: "Who painted the Mona Lisa?", options: ["Michelangelo", "Leonardo da Vinci", "Van Gogh", "Picasso"], correct: 1 },
  { q: "How many colors are in a rainbow?", options: ["5", "6", "7", "8"], correct: 2 },
  { q: "Which company created the iPhone?", options: ["Samsung", "Apple", "Google", "Nokia"], correct: 1 }
];

const QUESTION_COUNT = 10;
const TIME_PER_QUESTION = 15;
const HIGHSCORE_KEY = "quizexe_highscore";

// ---------- state ----------
let currentIndex = 0;
let score = 0;
let timeLeft = TIME_PER_QUESTION;
let timerId = null;
let answered = false;
let shuffledQuestions = [];
let playerName = "PLAYER1";

// ---------- DOM refs ----------
const screens = {
  start: document.getElementById("screen-start"),
  quiz: document.getElementById("screen-quiz"),
  result: document.getElementById("screen-result")
};

const nameInput = document.getElementById("player-name");
const btnStart = document.getElementById("btn-start");
const btnNext = document.getElementById("btn-next");
const btnRestart = document.getElementById("btn-restart");
const nameError = document.getElementById("name-error");

const hudScore = document.getElementById("hud-score");
const hudProgress = document.getElementById("hud-progress");
const hudTimer = document.getElementById("hud-timer");
const hudBox = document.querySelector(".hud");
const progressFill = document.getElementById("progress-fill");

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const feedbackText = document.getElementById("feedback-text");

const resultHeading = document.getElementById("result-heading");
const scoreBlock = document.getElementById("score-block");
const resultMessage = document.getElementById("result-message");

const highscoreValue = document.getElementById("highscore-value");
const statusLeft = document.getElementById("status-left");

// ---------- helpers ----------

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getHighScore() {
  return parseInt(localStorage.getItem(HIGHSCORE_KEY) || "0", 10);
}

function setHighScore(value) {
  localStorage.setItem(HIGHSCORE_KEY, String(value));
}

function loadHighScoreDisplay() {
  highscoreValue.textContent = getHighScore();
}

// ---------- game flow ----------

function startGame() {
  playerName = nameInput.value.trim().toUpperCase();
  if (!playerName) {
    nameError.hidden = false;
    nameInput.focus();
    return;
  }
  nameError.hidden = true;
  score = 0;
  currentIndex = 0;
  shuffledQuestions = shuffle(QUESTIONS).slice(0, QUESTION_COUNT);
  showScreen("quiz");
  statusLeft.textContent = `RUNNING QUIZ.EXE AS ${playerName}...`;
  loadQuestion();
}

function loadQuestion() {
  answered = false;
  timeLeft = TIME_PER_QUESTION;
  feedbackText.textContent = "\u00A0";
  btnNext.disabled = true;
  hudBox.classList.remove("timer-warning");

  const item = shuffledQuestions[currentIndex];
  questionText.textContent = item.q;
  hudScore.textContent = score;
  hudProgress.textContent = `Q ${String(currentIndex + 1).padStart(2, "0")}/${shuffledQuestions.length}`;
  progressFill.style.width = `${(currentIndex / shuffledQuestions.length) * 100}%`;
  hudTimer.textContent = timeLeft;

  optionsContainer.innerHTML = "";
  const letters = ["A", "B", "C", "D"];
  item.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = `<span class="opt-letter">${letters[i]}</span><span>${opt}</span>`;
    btn.addEventListener("click", () => selectAnswer(i));
    optionsContainer.appendChild(btn);
  });

  startTimer();
}

function startTimer() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft--;
    hudTimer.textContent = timeLeft;
    if (timeLeft <= 5) {
      hudBox.classList.add("timer-warning");
    }
    if (timeLeft <= 0) {
      clearInterval(timerId);
      selectAnswer(-1);
    }
  }, 1000);
}

function selectAnswer(selectedIndex) {
  if (answered) return;
  answered = true;
  clearInterval(timerId);

  const item = shuffledQuestions[currentIndex];
  const optionButtons = optionsContainer.querySelectorAll(".option-btn");

  optionButtons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === item.correct) {
      btn.classList.add("correct");
    } else if (i === selectedIndex) {
      btn.classList.add("incorrect");
    }
  });

  if (selectedIndex === item.correct) {
    score++;
    feedbackText.textContent = "> CORRECT.";
  } else if (selectedIndex === -1) {
    feedbackText.textContent = "> TIME'S UP.";
  } else {
    feedbackText.textContent = "> INCORRECT.";
  }

  hudScore.textContent = score;
  btnNext.disabled = false;
  btnNext.focus();
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= shuffledQuestions.length) {
    endGame();
  } else {
    loadQuestion();
  }
}

function endGame() {
  clearInterval(timerId);
  progressFill.style.width = "100%";

  const prevHigh = getHighScore();
  const isNewHigh = score > prevHigh;
  if (isNewHigh) {
    setHighScore(score);
  }

  scoreBlock.textContent = `${String(score).padStart(2, "0")} / ${shuffledQuestions.length}`;

  let heading, message;
  const pct = score / shuffledQuestions.length;
  if (pct === 1) {
    heading = "FLAWLESS RUN";
    message = `PERFECT SCORE, ${playerName}. NOTHING LEFT TO PROVE.`;
  } else if (pct >= 0.7) {
    heading = "PROCESS COMPLETE";
    message = `SOLID RUN, ${playerName}. SYSTEM APPROVES.`;
  } else if (pct >= 0.4) {
    heading = "PROCESS COMPLETE";
    message = `NOT BAD, ${playerName}. ROOM TO OPTIMIZE.`;
  } else {
    heading = "SYSTEM FAILURE";
    message = `REBOOT AND TRY AGAIN, ${playerName}.`;
  }

  if (isNewHigh) {
    message += " NEW HIGH SCORE!";
  }

  resultHeading.textContent = heading;
  resultMessage.textContent = message;
  statusLeft.textContent = "READY.";
  loadHighScoreDisplay();

  showScreen("result");
}

function restartGame() {
  nameInput.value = playerName === "PLAYER1" ? "" : playerName;
  showScreen("start");
  loadHighScoreDisplay();
}

// ---------- events ----------

btnStart.addEventListener("click", startGame);
nameInput.addEventListener("keydown", e => {
  if (e.key === "Enter") startGame();
});
nameInput.addEventListener("input", () => { nameError.hidden = true; });
btnNext.addEventListener("click", nextQuestion);
btnRestart.addEventListener("click", restartGame);

// ---------- init ----------
loadHighScoreDisplay();