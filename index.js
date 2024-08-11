import express from "express";
import cors from "cors";
import "dotenv/config";
import tripinfoRoute from "./routes/tripinfoRoute.js";

const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/", tripinfoRoute);

app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}`);
});
