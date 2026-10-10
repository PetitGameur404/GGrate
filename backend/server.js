import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = process.env.PORT || 3000;
const frontendPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../frontend"
);

app.get('/heal', (req, res) => {
    res.send('api is running')
})

app.use(express.static(frontendPath));

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
