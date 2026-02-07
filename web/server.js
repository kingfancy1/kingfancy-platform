const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");

const app = express();
// Railway needs process.env.PORT to bind correctly
const PORT = process.env.PORT || 3001; 

/* ================= Middleware ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret_for_dev",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
    }
  })
);

/* ================= HEALTH CHECK ================= */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/* ================= ROUTES ================= */
app.use("/api/products", productRoutes);

/* ================= HOME ================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ================= Database & Server Start ================= */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    // Listening on 0.0.0.0 is best practice for cloud deployments like Railway
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });