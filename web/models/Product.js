const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    required: true,
    enum: ['bot', 'template', 'graphics', 'gaming', 'digital']
  },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  features: [{ type: String }],
  stock: { type: Number, default: 999 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);