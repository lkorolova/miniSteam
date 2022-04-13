import express from "express";
import routes from "./src/routers/appRouter.js";
import bodyParser from "body-parser";

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

routes(app);

app.get("/", (req, res) => {
  res.send(`Server running on port ${port}`);
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
