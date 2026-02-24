const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("CloudForge Day 6 Auto Deploy Successful 🚀");
});

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
