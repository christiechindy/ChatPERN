import { Request, Response } from "express";

const express = require("express");
const cors = require("cors");
require("dotenv").config({path: __dirname + '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const db = require("./models");

app.get("/tes", (req: Request, res: Response) => {
    res.json("yeyys");
})
// const authRouter = require("")

// app.use("/api/auth");

db.sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
})