require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  {
    name: "Netflix Premium - 1 Month",
    category: "streaming",
    price: 4.99,
    description: "Netflix Premium account with 4K Ultra HD streaming",
    features: ["4K", "4 Screens", "Downloads"],
    stock: 999,
  },
  {
    name: "Spotify Premium - 1 Month",
    category: "streaming",
    price: 2.99,
    description: "Spotify Premium ad-free music",
    features: ["Ad-free", "Offline"],
    stock: 999,
  },
];

async function seed() {
  try {
    console.log("🌱 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);

    await Product.deleteMany();
    await Product.insertMany(products);

    console.log("✅ Products seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
