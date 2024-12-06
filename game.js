const tools = require("./tools.js");
const csv = require("csv-parser");
const fs = require("fs");

class Game {
  constructor() {
    this.listOfWords = [];
    this.scores = [];
  }

  loadWords(filename) {
    return new Promise((resolve, reject) => {
      fs.createReadStream(filename)
        .pipe(csv())
        .on("data", (row) => {
          this.listOfWords.push(row.word.toLowerCase());
        })
        .on("end", () => {
          console.log("CSV file successfully processed");
          this.chooseWord();
          resolve();
        })
        .on("error", reject);
    });
  }

  chooseWord() {
    if (this.listOfWords.length > 0) {
      this.word = this.listOfWords[tools.getRandomInt(this.listOfWords.length)];
    } else {
      throw new Error("No words available to choose from.");
    }
  }

  returnWord() {
    return this.word;
  }

  guess(oneLetter, unknowWord) {
    if (!this.word) {
      throw new Error(
        "The word has not been set. Please ensure that the game has been initialized properly."
      );
    }

    if (this.word.includes(oneLetter)) {
      for (let i = 0; i < this.word.length; i++) {
        if (this.word[i] === oneLetter) {
          unknowWord = tools.replaceAt(unknowWord, i, oneLetter);
        }
      }
      console.log("unknowWord OK", unknowWord);
      return { word: this.word, unknowWord: unknowWord, guess: true };
    }
    console.log("unknowWord NOK", unknowWord);
    return { word: this.word, unknowWord: unknowWord, guess: false };
  }

  print() {
    return this.unknowWord;
  }

  reset() {
    this.numberOfTry = 5;
    this.chooseWord();
    return this.numberOfTry;
  }
}

module.exports = Game;
