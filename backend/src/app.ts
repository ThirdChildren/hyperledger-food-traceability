import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import batchRoutes from "./routes/batchRoutes";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api", batchRoutes);

export default app;
