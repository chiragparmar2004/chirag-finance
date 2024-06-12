import express from "express";
import dbConnection from "./config/db.js";
import authRoute from "./routes/auth.route.js";
import "dotenv/config";

const app = express();
app.use(express.json());

dbConnection();

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("<h1>Hello There this is backend of chirag project</h1>");
});

app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});