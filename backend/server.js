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


connection.query('SELECT * FROM users', (err, rows, fields) => {
  if (err) throw err;

  console.log('Users liste: ', rows);
});

connection.end();

app.get('/heal', (req, res) => {
    res.send('api is running')
})

app.use(express.static(frontendPath));

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
