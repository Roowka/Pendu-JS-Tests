const malusScore = 50;

// LOCAL STORAGE
let numberOfTries = localStorage.getItem("numberOfTries") || 5;
let date = localStorage.getItem("date") || new Date().toISOString;

if (new Date(date).getTime() + 24 * 60 * 60 * 1000 < new Date().getTime()) {
  numberOfTries = 5;
  localStorage.setItem("numberOfTries", numberOfTries);
  localStorage.setItem("date", new Date().toISOString());
}

document.getElementById("nbLeftTries").innerHTML =
  "Nombre de tentatives restantes : " + numberOfTries;

let score = localStorage.getItem("score") || 1000;

// SCORES
fetch("/api/scores")
  .then((response) => response.json())
  .then((data) => {
    console.log("scores from api", data);
    for (let i = 0; i < data.length; i++) {
      let player = data[i];
      let username = player["Username"];
      let score = player["Score"];
      let playerElement = document.createElement("li");
      playerElement.innerHTML = username + " : " + score;
      document.getElementById("scoresList").appendChild(playerElement);
    }
  });

// EVENTS
document.getElementById("submitGuess").addEventListener("click", submitGuess);
let unknowWord = "";
fetch("/api/word")
  .then((response) => response.json())
  .then((data) => {
    console.log("data", data);
    unknowWord = data.word;
    unknowWord = unknowWord.replace(/./g, "#");
    document.getElementById("userWord").innerHTML =
      "Votre mot est : " + unknowWord;
  });

document
  .getElementById("submitUsername")
  .addEventListener("click", submitUsername);

document.getElementById("cooldown").innerHTML =
  "Il te reste : " + score + " secondes";
const cooldownInterval = setInterval(() => {
  score--;
  document.getElementById("cooldown").innerHTML =
    "Il te reste : " + score + " secondes";
  if (score <= 0) {
    clearInterval(cooldownInterval);
    document.getElementById("cooldown").innerHTML = "Temps écoulé !";

    document.getElementById("letterInput").disabled = true;
    document.getElementById("submitGuess").disabled = true;
  }
}, 1000);

function submitGuess(event) {
  if (numberOfTries <= 0) {
    return;
  }
  event.preventDefault();
  let letter = document.getElementById("letterInput").value;
  console.log(letter);

  fetch("/api/guess", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ word: letter, unknowWord: unknowWord }),
  })
    .then((response) => response.json())
    .then((data) => {
      unknowWord = data.guess.unknowWord;
      changeUI(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function changeUI(data) {
  console.log("guess", data.guess);
  if (!data.guess.guess) {
    updateTries();
    score -= malusScore;
  }
  document.getElementById("userWord").innerHTML =
    "Votre mot est : " + data.guess.unknowWord;
  document.getElementById("letterInput").value = "";

  console.log("unknowWord", data.guess.unknowWord);
  console.log("word", data.guess.word);
  if (data.guess.unknowWord === data.guess.word) {
    clearInterval(cooldownInterval);
    document.getElementById("nbLeftTries").innerHTML = "Et c'est gagné 🥳";
    document.getElementById("nbLeftTries").classList.add("text-green-500");
    document.getElementById("cooldown").classList.remove("text-red-500");

    // HIDDEN
    document.getElementById("gameDescription").classList.add("hidden");
    document.getElementById("letterInput").classList.add("hidden");
    document.getElementById("submitGuess").classList.add("hidden");
    document.getElementById("gameEnd").classList.remove("hidden");
    document.getElementById("usernameModal").classList.remove("hidden");
  }
}

function updateTries() {
  numberOfTries--;
  localStorage.setItem("numberOfTries", numberOfTries);
  document.getElementById("nbLeftTries").innerHTML =
    "Nombre de tentatives restantes : " + numberOfTries;
  if (numberOfTries <= 0) {
    clearInterval(cooldownInterval);
    document.getElementById("cooldown").innerHTML = "Perdu nullos 🫵😂";

    document.getElementById("letterInput").disabled = true;
    document.getElementById("submitGuess").disabled = true;
  }
}

async function submitUsername(event) {
  event.preventDefault();
  let username = document.getElementById("usernameInput").value;
  document.getElementById("cooldown").innerHTML =
    username + ", ton score est de : " + score;
  console.log("username", username);
  document.getElementById("usernameModal").classList.add("hidden");
  const res = await fetch("/api/scores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, score: score }),
  });
  const data = await res.json();
  window.location.reload();
}
