import express from "express";
import path from "node:path";
import mysql from "mysql2";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const frontendPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../frontend");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: false }));
app.use(express.static(frontendPath));

app.get("/heal", (req, res) => {
  res.send("api is running");
});

app.post("/test", (req, res) => {
  const { steamuser, game, stars, description } = req.body;

  if (!steamuser || !game || !description || !(Number(stars) >= 1 && Number(stars) <= 5)) {
    return res.status(400).json({ error: "Données invalides" });
  }

  db.query(
    "INSERT INTO reviews (steamuser, game, stars, description) VALUES (?, ?, ?, ?)",
    [steamuser, game, Number(stars), description],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur DB" });
      }
      res
        .status(201)
        .json({ id: result.insertId, steamuser, game, stars: Number(stars), description });
    },
  );
});

app.get("/reviews", (req, res) => {
  const { game } = req.query;

  const sql = game ? "SELECT * FROM reviews WHERE game = ?" : "SELECT * FROM reviews";

  db.query(sql, game ? [game] : [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erreur DB" });
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
