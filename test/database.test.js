const Sqlite = require("../sqlite.js");

beforeAll(async () => {
  await new Promise((resolve, reject) => {
    const db = require("sqlite3").verbose();
    const database = new db.Database("./hangman.db");

    database.run("DELETE FROM Players;", (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
});

describe("Database tests", () => {
  it("should insert a player into the database", async () => {
    const username = "toto";
    const score = 10;
    const date = new Date().toISOString();

    // Insertion d'un joueur
    await Sqlite.insertPlayer(username, score, date);

    // Récupération des joueurs pour vérification
    const players = await Sqlite.getPlayers();

    // Vérification
    expect(players).toHaveLength(1);
    expect(players[0]).toEqual(
      expect.objectContaining({
        Username: username,
        Score: score,
        Date: date,
      })
    );
  });

  it("should retrieve multiple players sorted by score in descending order", async () => {
    // Insertion de plusieurs joueurs
    const playersToInsert = [
      { username: "titi", score: 20, date: new Date().toISOString() },
      { username: "tata", score: 5, date: new Date().toISOString() },
    ];

    for (const player of playersToInsert) {
      await Sqlite.insertPlayer(player.username, player.score, player.date);
    }

    // Récupération des joueurs pour vérification
    const players = await Sqlite.getPlayers();

    // Vérification de l'ordre et des données
    expect(players).toHaveLength(3); // 1 joueur inséré avant + 2 nouveaux
    expect(players[0].Score).toBeGreaterThanOrEqual(players[1].Score);
    expect(players[1].Score).toBeGreaterThanOrEqual(players[2].Score);
    expect(players.map((p) => p.Username)).toEqual(
      expect.arrayContaining(["toto", "titi", "tata"])
    );
  });
});
