const express = require("express");
const router = express.Router();

const products = [
  { id: 1, name: "Custom Bot", price: 50, category: "bot" },
  { id: 2, name: "Server Template", price: 20, category: "template" }
];

router.get("/", (req, res) => res.json(products));

module.exports = router;