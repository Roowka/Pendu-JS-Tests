const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./hangman.db", (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connexion réussie à la base de données 'apptest.db'");
});

const sql_create = `CREATE TABLE IF NOT EXISTS Players (
  Player_id INTEGER PRIMARY KEY AUTOINCREMENT,
  Username VARCHAR(100) NOT NULL,
  Score INTEGER(100) NOT NULL,
  Date DATE
);`;

db.run(sql_create, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Création réussie de la table 'Players'");
});

function insertPlayer(username, score, date) {
  const sql_insert = `INSERT INTO Players (Username, Score, Date) VALUES (?, ?, ?);`;
  db.run(sql_insert, [username, score, date], (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Insertion réussie");
  });
}

function getPlayers() {
  return new Promise((resolve, reject) => {
    const sql_select = `SELECT * FROM Players ORDER BY Score DESC;`;
    db.all(sql_select, (err, rows) => {
      if (err) {
        console.error(err.message);
        return reject(err);
      }
      resolve(rows);
    });
  });
}

module.exports = {
  insertPlayer,
  getPlayers,
};
