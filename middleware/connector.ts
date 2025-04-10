#!/usr/bin/env node
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 3030;

app.get("/.identity", (req, res) => {
  res.json({
    name: "middleware-tektrio-dev",
    version: "1.0.0",
    status: "ok",
    tipo: "middleware de desenvolvimento",
    estrutura: ["parent-system", "child-systems", "plugins"]
  });
});

app.listen(PORT, () => {
  console.log(`Middleware TEKTRIO DEV ativo na porta ${PORT}`);
});
