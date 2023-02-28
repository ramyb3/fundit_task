import express from "express";
import bodyParser = require("body-parser");
import fs from "fs";
import { tempData } from "./temp-data";

const app = express();
const PORT = 8888;
const PAGE_SIZE = tempData.length; // part B.1

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.get("/", (req, res) => {
  res.send("dev api status - up");
});

app.get("/api/match", (req, res) => {
  const page = req.query.page || 1;

  const paginatedData = tempData.slice(
    (Number(page) - 1) * PAGE_SIZE,
    Number(page) * PAGE_SIZE
  );

  res.send(paginatedData);
});

//part C.2
app.post("/api/data", (req, res) => {
  const decline = [];
  const approve = [];

  for (let i = 0; i < req.body[1].length; i++) {
    if (req.body[1][i] == "decline") {
      decline.push(tempData.find((data: any) => data.id == req.body[0][i]));
    }

    if (req.body[1][i] == "approve") {
      approve.push(tempData.find((data: any) => data.id == req.body[0][i]));
    }
  }

  const obj = { decline, approve };

  return new Promise((reject) => {
    fs.writeFile(
      "./dataFromUser.json",
      JSON.stringify(obj),
      function (err: any) {
        if (err) {
          reject(err);
        }
      }
    );
  });
});

app.listen(PORT);
console.log("server running", PORT);
