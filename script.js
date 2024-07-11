const progressBar = document.querySelector(".progress-bar");
const progressText = document.querySelector(".progress-text");
const startBtn = document.querySelector(".start");
const numQuestions = document.querySelector("#num-questions");
const category = document.querySelector("#category");
const difficulty = document.querySelector("#difficulty");
const timePerQuestion = document.querySelector("#time");
const quiz = document.querySelector(".quiz");
const startScreen = document.querySelector(".start-screen");
const submitBtn = document.querySelector(".submit");
const nextBtn = document.querySelector(".next");
const endScreen = document.querySelector(".end-screen");
const finalScore = document.querySelector(".final-score");
const totalScore = document.querySelector(".total-score");
const restartBtn = document.querySelector(".restart");

let questions = [];
let time;
let score = 0;
let currentQuestion;
let timer;
let answerSubmitted = false;

const questionSet = {
  general: [
    {
      question: "Quelle est la capitale de la France ?",
      answers: ["Paris", "Londres", "Berlin", "Madrid"],
      correct: "Paris",
    },
    {
      question: "Combien y a-t-il de continents ?",
      answers: ["5", "6", "7", "8"],
      correct: "7",
    },
    {
      question: "Quel est le plus grand océan du monde ?",
      answers: ["Atlantique", "Pacifique", "Arctique", "Indien"],
      correct: "Pacifique",
    },
    {
      question: "Quelle est la plus grande planète du système solaire ?",
      answers: ["Terre", "Mars", "Jupiter", "Saturne"],
      correct: "Jupiter",
    },
    {
      question: "Quelle est la langue la plus parlée au monde ?",
      answers: ["Anglais", "Espagnol", "Chinois", "Hindî"],
      correct: "Chinois",
    },
  ],
  science: [
    {
      question: "Quelle est la formule chimique de l'eau ?",
      answers: ["H2O", "O2", "CO2", "NaCl"],
      correct: "H2O",
    },
    {
      question: "Quelle planète est connue comme la planète rouge ?",
      answers: ["Terre", "Mars", "Jupiter", "Vénus"],
      correct: "Mars",
    },
    {
      question: "Quel est l'élément le plus abondant dans l'univers ?",
      answers: ["Oxygène", "Carbone", "Hydrogène", "Azote"],
      correct: "Hydrogène",
    },
    {
      question: "Quelle est la vitesse de la lumière ?",
      answers: ["300 000 km/s", "150 000 km/s", "450 000 km/s", "600 000 km/s"],
      correct: "300 000 km/s",
    },
    {
      question: "Quel est l'organe le plus grand du corps humain ?",
      answers: ["Cœur", "Poumon", "Peau", "Foie"],
      correct: "Peau",
    },
  ],
  history: [
    {
      question: "Qui a été le premier président des États-Unis ?",
      answers: ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "John Adams"],
      correct: "George Washington",
    },
    {
      question: "En quelle année a commencé la Première Guerre mondiale ?",
      answers: ["1912", "1914", "1916", "1918"],
      correct: "1914",
    },
    {
      question: "Qui a peint la Mona Lisa ?",
      answers: ["Vincent Van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
      correct: "Leonardo da Vinci",
    },
    {
      question: "Quel événement a déclenché la Seconde Guerre mondiale ?",
      answers: ["L'attaque de Pearl Harbor", "L'invasion de la Pologne", "Le débarquement en Normandie", "La bataille de Stalingrad"],
      correct: "L'invasion de la Pologne",
    },
    {
      question: "Quel empire était dirigé par Jules César ?",
      answers: ["Empire grec", "Empire égyptien", "Empire romain", "Empire perse"],
      correct: "Empire romain",
    },
  ],
};

function startQuiz() {
  score = 0;
  currentQuestion = 0;
  questions = questionSet[category.value].slice(0, numQuestions.value);
  totalScore.textContent = `/${questions.length}`;
  startScreen.classList.add("hide");
  quiz.classList.remove("hide");
  endScreen.classList.add("hide");
  loadQuestion();
}

function loadQuestion() {
  clearInterval(timer);
  answerSubmitted = false;
  submitBtn.textContent = "Soumettre";
  quiz.classList.remove("hide");
  quiz.classList.add("rotate-in-down-right");

  quiz.addEventListener("animationend", () => {
    quiz.classList.remove("rotate-in-down-right");
  }, { once: true });

  if (currentQuestion >= questions.length) {
    endQuiz();
    return;
  }

  const question = questions[currentQuestion];
  document.querySelector(".question").textContent = question.question;
  const answersWrapper = document.querySelector(".answer-wrapper");
  answersWrapper.innerHTML = "";
  question.answers.forEach(answer => {
    const div = document.createElement("div");
    div.className = "answer";
    div.textContent = answer;
    div.addEventListener("click", () => selectAnswer(div));
    answersWrapper.appendChild(div);
  });

  document.querySelector(".current").textContent = currentQuestion + 1;
  progressBar.style.width = "100%";
  time = timePerQuestion.value;
  progressText.textContent = `${time} sec`;
  timer = setInterval(updateTimer, 1000);
}

function selectAnswer(selectedDiv) {
  if (!answerSubmitted) {
    document.querySelectorAll(".answer").forEach(div => {
      div.classList.remove("selected");
    });
    selectedDiv.classList.add("selected");
    submitBtn.disabled = false;
  }
}

function updateTimer() {
  let currentWidth = parseFloat(progressBar.style.width);
  if (currentWidth <= 0) {
    clearInterval(timer);
    submitBtn.disabled = false;
    showCorrectAnswer();
    submitBtn.textContent = "Suivant"; 
    answerSubmitted = true; 
    return;
  }
  currentWidth -= (100 / timePerQuestion.value);
  progressBar.style.width = `${currentWidth}%`;
  time--;
  progressText.textContent = `${time} sec`;
}

nextBtn.addEventListener("click", () => {
  document.querySelector(".container").classList.add("page-turn");
  document.querySelector(".container").addEventListener("animationend", () => {
    document.querySelector(".container").classList.remove("page-turn");
    submitAnswer();
  }, { once: true });
});

function submitAnswer() {
  if (!answerSubmitted) {
    const selectedAnswer = document.querySelector(".answer.selected");
    const correctAnswer = questions[currentQuestion].correct;
    if (selectedAnswer) {
      if (selectedAnswer.textContent === correctAnswer) {
        selectedAnswer.classList.add("correct");
        score++;
      } else {
        selectedAnswer.classList.add("wrong");
        document.querySelectorAll(".answer").forEach(div => {
          if (div.textContent === correctAnswer) {
            div.classList.add("correct");
          }
        });
      }
      clearInterval(timer);
      answerSubmitted = true;
      submitBtn.textContent = "Suivant";
    }
  } else {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      loadQuestion();
    } else {
      endQuiz();
    }
  }
}

function showCorrectAnswer() {
  const correctAnswer = questions[currentQuestion].correct;
  document.querySelectorAll(".answer").forEach(div => {
    if (div.textContent === correctAnswer) {
      div.classList.add("correct");
    }
  });
}

function endQuiz() {
  quiz.classList.add("rotate-out-down-left");
  quiz.addEventListener("animationend", () => {
    quiz.classList.add("hide");
    endScreen.classList.remove("hide");
    finalScore.textContent = score;
  }, { once: true });
}

function restartQuiz() {
  endScreen.classList.add("hide");
  startScreen.classList.remove("hide");
  quiz.classList.remove("rotate-out-down-left"); 
  score = 0;
  currentQuestion = 0;
  questions = [];
}

startBtn.addEventListener("click", startQuiz);
submitBtn.addEventListener("click", submitAnswer);
restartBtn.addEventListener("click", restartQuiz);
