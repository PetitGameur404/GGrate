import express from "express";
import path from "node:path";
import mysql from "mysql2";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
dotenv.config();




const app = express();
const port = process.env.PORT || 3000;
const frontendPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../frontend"
);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if(err){
    console.log("Error of connexion :" +err.stack)
    console.log('db_user:', process.env.db_user);
    return;
  }
  console.log("Succes connexion db !")
});

app.use(express.static(frontendPath));


app.get('/heal', (req, res) => {
  res.send('api is running')
})

const reviews = [];

app.use(express.urlencoded({ extended: false }));

app.post('/test', (req, res) => {
    console.log('BODY:', req.body);
  const {steamuser, game, stars, description} = req.body

  // const review = {
  //   id: reviews.length + 1,
  //   steamuser,
  //   stars: Number(stars),
  //   description,
  //   date: new Date()
  // };

  // reviews.push(review);
  // console.log(reviews);

  // res.status(201).json(review);


  connection.query(
    'INSERT INTO reviews (steamuser, game, stars, description) VALUES (?, ?, ?, ?)',
    [steamuser, game, Number(stars), description],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erreur DB' });
      }
      res.status(201).json({ id: result.insertId, steamuser, stars, description });
      console.log("Put on DB succes !")
    }
  );
});

app.get('/reviews', (req, res) => {
  const { game } = req.query;

  const sql = game
    ? 'SELECT * FROM reviews WHERE game = ?'
    : 'SELECT * FROM reviews';

  connection.query(sql, game ? [game] : [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erreur DB' });
    }
    res.json(rows);
  });
});




app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
