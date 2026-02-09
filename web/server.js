const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/products", require("./routes/productRoutes"));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server on port ${PORT}`));
  })
  .catch(() => {
    console.log("⚠️ No DB - starting anyway");
    app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server on port ${PORT}`));
  });