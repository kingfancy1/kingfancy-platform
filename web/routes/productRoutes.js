const express = require("express");
const router = express.Router();

const mockProducts = [
  {
    id: 1,
    name: "Custom Discord Bot",
    category: "bot",
    price: 50,
    description: "Professional Discord bot",
    features: ["Moderation", "Tickets", "Verification"]
  },
  {
    id: 2,
    name: "Server Template",
    category: "template",
    price: 20,
    description: "Pre-configured server",
    features: ["50+ Channels", "Custom Roles"]
  }
];

router.get("/", async (req, res) => {
  try {
    const Product = require("../models/Product");
    const products = await Product.find({ active: true });
    res.json(products.length > 0 ? products : mockProducts);
  } catch (err) {
    res.json(mockProducts);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const Product = require("../models/Product");
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(product);
  } catch (err) {
    const mock = mockProducts.find(p => p.id == req.params.id);
    if (mock) {
      res.json(mock);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  }
});

router.post("/", async (req, res) => {
  try {
    const Product = require("../models/Product");
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;