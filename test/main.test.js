// process.env.NODE_ENV = "test";

// const { getScores, updateTries, setVictoryUI } = require("../public/main");

// const localStorageMock = (() => {
//   let store = {};
//   return {
//     getItem: jest.fn((key) => store[key] || null),
//     setItem: jest.fn((key, value) => {
//       store[key] = value.toString();
//     }),
//     removeItem: jest.fn((key) => {
//       delete store[key];
//     }),
//     clear: jest.fn(() => {
//       store = {};
//     }),
//   };
// })();

// global.localStorage = localStorageMock;

// beforeEach(() => {
//   document.body.innerHTML = `
//     <div id="nbLeftTries"></div>
//     <div id="scoresList"></div>
//     <div id="cooldown"></div>
//     <div id="gameDescription"></div>
//     <input id="letterInput" />
//     <button id="submitGuess"></button>
//     <div id="gameEnd" class="hidden"></div>
//     <div id="usernameModal" class="hidden"></div>
//   `;

//   localStorage.clear();
//   jest.resetAllMocks();
//   fetch.resetMocks();
// });

// test("should fetch scores and update the DOM", async () => {
//   fetch.mockResponseOnce(
//     JSON.stringify([
//       { Username: "Alice", Score: 100 },
//       { Username: "Bob", Score: 200 },
//     ])
//   );

//   await getScores();

//   const scoresList = document.getElementById("scoresList");
//   expect(fetch).toHaveBeenCalledWith("/api/scores");
//   expect(scoresList.children).toHaveLength(2);
//   expect(scoresList.children[0].textContent).toBe("Alice : 100");
//   expect(scoresList.children[1].textContent).toBe("Bob : 200");
// });

// test("should decrement tries and update the DOM", () => {
//   localStorage.setItem("numberOfTries", "5");

//   updateTries();

//   const nbLeftTries = document.getElementById("nbLeftTries");
//   expect(localStorage.getItem("numberOfTries")).toBe("4");
//   expect(nbLeftTries.textContent).toBe("Nombre de tentatives restantes : 4");
// });

// test("should update UI for victory", () => {
//   setVictoryUI();

//   expect(document.getElementById("nbLeftTries").textContent).toBe(
//     "Et c'est gagné 🥳"
//   );
//   expect(document.getElementById("nbLeftTries").classList).toContain(
//     "text-green-500"
//   );
//   expect(document.getElementById("gameDescription").classList).toContain(
//     "hidden"
//   );
//   expect(document.getElementById("gameEnd").classList).not.toContain("hidden");
//   expect(document.getElementById("usernameModal").classList).not.toContain(
//     "hidden"
//   );
// });
