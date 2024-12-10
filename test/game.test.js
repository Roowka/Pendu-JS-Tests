const Game = require("../game.js");
const tools = require("../tools.js");

jest.mock("../tools.js");

let game;

beforeEach(async () => {
  game = new Game();
  await game.loadWords("words_fr.txt");
  game.word = "damien"; // Setting a known word for tests
  game.unknowWord = "######";
});

describe("Game Tests", () => {
  test("should load words and select a word", async () => {
    tools.getRandomInt.mockReturnValue(0); // Simulate selection of the first word
    game.listOfWords = ["damien", "lucas"];
    game.chooseWord();

    expect(game.word).toBe("damien");
    expect(game.listOfWords).toContain("damien");
  });

  test("should throw an error if no words are available", () => {
    game.listOfWords = [];
    expect(() => game.chooseWord()).toThrow(
      "No words available to choose from."
    );
  });

  test("should return the current word", () => {
    expect(game.returnWord()).toBe("damien");
  });

  test("should correctly guess a letter in the word", () => {
    console.log("game.UNKNONNWNW", game.unknowWord);
    const result = game.guess("a", game.unknowWord);

    console.log("RESULTS: ", result);

    expect(result).toEqual({
      word: "damien",
      unknowWord: "#a####",
      guess: true,
    });
  });

  test("should not update unknowWord on incorrect guess", () => {
    const result = game.guess("z", game.unknowWord);

    expect(result).toEqual({
      word: "damien",
      unknowWord: "######",
      guess: false,
    });
  });

  test("should throw an error if the word has not been set", () => {
    game.word = null;
    expect(() => game.guess("a", game.unknowWord)).toThrow(
      "The word has not been set. Please ensure that the game has been initialized properly."
    );
  });

  test("should reset the game and set a new word with 5 tries", () => {
    tools.getRandomInt.mockReturnValue(1); // Simulate selection of the second word
    game.listOfWords = ["damien", "lucas"];

    game.reset();

    expect(game.word).toBe("lucas");
    expect(game.numberOfTries).toBe(5);
  });

  test("should print the current unknowWord", () => {
    game.unknowWord = "#a####";
    expect(game.print()).toBe("#a####");
  });

  test("should decrement tries on incorrect guess", () => {
    game.numberOfTry = 5;
    game.guess("z", game.unknowWord);

    expect(game.numberOfTries).toBe(4);
  });

  test("should not decrement tries on correct guess", () => {
    game.numberOfTries = 5;
    game.guess("a", game.unknowWord);

    expect(game.numberOfTries).toBe(5);
  });
});
